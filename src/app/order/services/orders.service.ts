import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Provider } from 'src/app/order/models/provider';
import { CatalogueItem } from '../models/catalogue-item';

@Injectable()
export class OrdersService {
  constructor(private http: HttpClient) {}

  getAllProviders(): Observable<Array<Provider>> {
    return this.http.get<Array<Provider>>(
      'http://localhost:5000/api/providers'
    );
  }

  getProviderMenu(providerId: number): Observable<Array<CatalogueItem>> {
    return this.http.get<Array<CatalogueItem>>(
      `http://localhost:5000/api/providers/${providerId}/menu`
    );
  }
}
