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
  displayedColumns: string[] = ['ID', 'Customer', 'Address', 'Release_date', 'Container_type', 'Seal', 'Serial_number', 'Document_number', 'Production_date', 'Valid', 'Comment', 'Edit', 'Delete'];
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
            case 'Release_date': return data['Delivery']['Release_date'];
            case 'Container_type': return data['Delivery']['Container_type'];
            case 'Seal': return data['Delivery']['Seal'];
            case 'Serial_number': return data['Delivery']['Serial_number'];
            case 'Document_number': return data['Delivery']['Document_number'];
            case 'Production_date': return data['Delivery']['Production_date'];
            case 'Valid': return data['Delivery']['Valid'];
            case 'Comment': return data['Delivery']['Comment'];
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