import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { OrderService } from '../services/order.service';
import { order } from './order.model';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditOrderDialogComponent } from '../editorderdialog/editorderdialog.component';
import { EditFreightDialogComponent } from '../editfreightdialog/editfreightdialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SaveFreightDialogComponent } from '../savefreightdialog/savefreightdialog.component';
import { DelFreightDialogComponent } from '../delfreightdialog/delfreightdialog.component';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})

export class OrderComponent implements OnInit {
  displayedColumns: string[] = ['Freight_ID', 'ID', 'Containers_ID', 'Order_date', 'Transport_date', 'Ordered_quantity', 'Revenue_quantity', 'Monetary_value', 'Counted_value', 'Status', 'Edit', 'Delete'];
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

  model: Array<order> = [];
  constructor(private http: HttpClient, private OrderService: OrderService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getOrder();
  }

  openDialog() {
    this.dialog.open(EditOrderDialogComponent, {
      width:'30%'
    }).afterClosed().subscribe(val=>{
      if(val==='save'){
        this.getOrder();
      }
    })
  }

  openOrdModDialog() {
    this.dialog.open(EditFreightDialogComponent, {
      width:'30%'
    }).afterClosed().subscribe(val=>{
      if(val){
        this.getOrder();
      }
    })
  }

  openOrdDelDialog() {
    this.dialog.open(DelFreightDialogComponent, {
      width:'30%'
    }).afterClosed().subscribe(val=>{
      if(val){
        this.getOrder();
      }
    })
  }

  openOrdSaveDialog() {
    this.dialog.open(SaveFreightDialogComponent, {
      width:'30%'
    }).afterClosed().subscribe(val=>{
      if(val){
        this.getOrder();
      }
    })
  }

  editOrderItem(row: any){
    this.dialog.open(EditOrderDialogComponent, {
      width: '30%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val==='update'){
        this.getOrder();
      }
    })
  }

  getOrder(){
    this.OrderService.getOrder().subscribe({
        next:(data) => {
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.filterPredicate = (data: any, filter) => {
            const dataStr =JSON.stringify(data).toLowerCase();
            return dataStr.indexOf(filter) != -1; 
          }
          
          this.dataSource.sortingDataAccessor = (data, property) => {
            switch(property){
              case 'ID': return data['Order']['ID'];
              case 'Containers_ID': return data['Order']['Containers_ID'];
              case 'Freight_ID': return data['Order']['Freight_ID'];
              case 'Order_date': return data['Freight']['Order_date'];
              case 'Transport_date': return data['Freight']['Transport_date'];
              case 'Ordered_quantity': return data['Order']['Ordered_quantity'];
              case 'Revenue_quantity': return data['Order']['Revenue_quantity'];
              case 'Monetary_value': return data['Order']['Monetary_value'];
              case 'Counted_value': return data['Order']['Monetary_value']*data['Order']['Revenue_quantity'];
              case 'Status': return data['Order']['Status'];
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

  deleteOrderItem(order: order){
    this.OrderService.deleteOrderItem(order.ID).subscribe({
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