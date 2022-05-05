import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DeliveryService } from '../services/delivery.service';
import { delivery } from './delivery.model';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditDeliveryDialogComponent } from '../editdeliverydialog/editdeliverydialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss']
})

export class DeliveryComponent implements OnInit {
  displayedColumns: string[] = ['ID', 'Customer', 'Address', 'Order_date', 'Delivery_date', 'Container_type', 'Count', 'Supplier', 'Selling_price', 'Freight_cost', 'Comment', 'Edit', 'Delete'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public popoverTitle: string = '<b><u>Jóváhagyás szükséges</u></b>';
  public popoverMessage: string = '<b><u>Biztosan elvégzed a műveletet?</u><b>';
  public confirmClicked: boolean = true;
  public cancelClicked: boolean = true;
  public cancelText: string = "<b>Nem</b>";
  public placement: string ="right";
  public confirmText: string ="<b>Igen</b>";
  public appendToBody: boolean = false;

  model: Array<delivery> = [];
  constructor(private http: HttpClient, private DeliveryService: DeliveryService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getDelivery();
  }

  openDialog() {
    this.dialog.open(EditDeliveryDialogComponent, {
      width:'30%'
    }).afterClosed().subscribe(val=>{
      if(val==='save'){
        this.getDelivery();
      }
    })
  }

  editDeliveryItem(row: any){
    this.dialog.open(EditDeliveryDialogComponent, {
      width: '30%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val==='update'){
        this.getDelivery();
      }
    })
  }

  getDelivery(){
    this.DeliveryService.getDelivery().subscribe({
        next:(data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.filterPredicate = (data: any, filter) => {
          const dataStr =JSON.stringify(data).toLowerCase();
          return dataStr.indexOf(filter) != -1; 
        }
        
        this.dataSource.sortingDataAccessor = (data, property) => {
          switch(property){
            case 'ID': return data['Delivery']['ID'];
            case 'Customer': return data['Customer']['Name'];
            case 'Address': return data['Customer']['Address'];
            case 'Order_date': return data['Delivery']['Order_date'];
            case 'Container_type': return data['Delivery']['Container_type'];
            case 'Count': return data['Delivery']['Count'];
            case 'Supplier': return data['Delivery']['Supplier'];
            case 'Selling_price': return data['Delivery']['Selling_price'];
            case 'Freight_cost': return data['Delivery']['Freight_cost'];
            case 'Comment': return data['Delivery']['Comment'];
            case 'Delivery_date': return data['Delivery']['Delivery_date'];
            default: return data[property];
          }
        };
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error:()=>{
        alert("Hiba lépett fel az adatok lekérdezése közben.");
      }
    })
  }

  deleteDeliveryItem(delivery: delivery){
    this.DeliveryService.deleteDeliveryItem(delivery.ID).subscribe({
      next:() => {
        this.ngOnInit();
        alert("Törlés sikeres.");
      },
      error:(err)=>{
        alert(err.error.detail);
      }
    })
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if(this.dataSource.paginator){
      this.dataSource.paginator.firstPage();
    }
  }
}