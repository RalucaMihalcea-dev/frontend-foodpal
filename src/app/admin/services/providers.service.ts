import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { Provider } from '../models/provider';
import { ItemStatus } from '../models/provider-catalogue';

@Injectable()
export class ProvidersService {
  providerUrl = 'http://localhost:5000/api/providers';

  constructor(private http: HttpClient) {}

  getAllProviders(): Observable<Array<Provider>> {
    return this.http.get<Array<Provider>>(`${this.providerUrl}`);
  }

  getProvider(id: number): Observable<Provider> {
    return this.http.get<Provider>(
      `${this.providerUrl}/${id}?includeCatalogueItems=true`
    );
  }

  updateProvider(id: number, data: Provider): Observable<object> {
    const menuItemRequests = [];

    const menuUrl = this.getMenuUrl(id);

    data.catalogue.items
      .filter((f) => f.status === ItemStatus.Added)
      ?.forEach((menuItem) => {
        menuItem.category = { id: 1, name: 'Desserts' };
        menuItemRequests.push(this.http.post(menuUrl, menuItem));
      });
    data.catalogue.items
      .filter((f) => f.status === ItemStatus.Updated)
      ?.forEach((menuItem) => {
        menuItemRequests.push(
          this.http.put(`${menuUrl}/${menuItem.id}`, menuItem)
        );
      });
    data.catalogue.items
      .filter((f) => f.status === ItemStatus.Deleted)
      ?.forEach((menuItem) => {
        menuItemRequests.push(this.http.delete(`${menuUrl}/${menuItem.id}`));
      });
      data.customerId = 1;

    return this.http
      .put(`${this.providerUrl}/${id}`, data)
      .pipe(switchMap(() => forkJoin(menuItemRequests)));
  }

  getMenuUrl = (id: number) => `http://localhost:5000/api/providers/${id}/menu`;
}
