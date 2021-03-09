import { ProviderCatalogueComponent } from './../provider-catalogue/provider-catalogue.component';
import { OrdersService } from './../services/orders.service';
import { Component, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Provider } from 'src/app/order/models/provider';

@Component({
  selector: 'app-providers-list',
  templateUrl: './providers-list.component.html',
  styleUrls: ['./providers-list.component.scss']
})
export class ProvidersListComponent implements OnInit {
  public providers: Provider[] = [];

  constructor(private ordersSvc: OrdersService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.ordersSvc.getAllProviders().subscribe((data) => {
      this.providers = data;
    });
  }

  openDialog(providerId: number) {
    const dialogRef = this.dialog.open(ProviderCatalogueComponent, {
      data: {providerId},
      height: '280px',
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
