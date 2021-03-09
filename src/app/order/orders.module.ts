import { MatButtonModule } from '@angular/material/button';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderComponent } from './order/order.component';
import { ProvidersListComponent } from './providers-list/providers-list.component';
import { ProviderCatalogueComponent } from './provider-catalogue/provider-catalogue.component';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { OrdersService } from './services/orders.service';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';


const routes: Routes = [
  {
    path: '',
    component: OrderComponent
  }
];

@NgModule({
  declarations: [OrderComponent, ProvidersListComponent, ProviderCatalogueComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    MatCardModule,
    MatDialogModule,
    MatButtonModule,
    RouterModule.forChild(routes)
  ],
  providers: [OrdersService],
})
export class OrdersModule { }
