import { Component, OnInit, Inject } from '@angular/core';
import { OrdersService } from '../services/orders.service';
import { CatalogueItem } from '../models/catalogue-item';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-provider-catalogue',
  templateUrl: './provider-catalogue.component.html',
  styleUrls: ['./provider-catalogue.component.scss']
})
export class ProviderCatalogueComponent implements OnInit {
  catalogueItems: CatalogueItem[];


  constructor(private ordersSvc: OrdersService, @Inject(MAT_DIALOG_DATA) public data: {providerId: number}) { }

  ngOnInit(): void {
    this.ordersSvc.getProviderMenu(this.data.providerId).subscribe((data) => {
      this.catalogueItems = data;
    });
  }

}
