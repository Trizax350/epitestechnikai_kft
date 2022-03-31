import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CustomerService } from '../services/customer.service';
import { customer } from './customer.model';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditCustomerDialogComponent } from '../editcustomerdialog/editcustomerdialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})

export class CustomerComponent implements OnInit {
  displayedColumns: string[] = ['ID', 'Name', 'Address', 'Edit', 'Delete'];
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

  model: Array<customer> = [];
  constructor(private http: HttpClient, private CustomerService: CustomerService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getCustomer();
  }

  openDialog() {
    this.dialog.open(EditCustomerDialogComponent, {
      width:'30%'
    }).afterClosed().subscribe(val=>{
      if(val==='save'){
        this.getCustomer();
      }
    })
  }

  editCustomerItem(row: any){
    this.dialog.open(EditCustomerDialogComponent, {
      width: '30%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val==='update'){
        this.getCustomer();
      }
    })
  }

  getCustomer(){
    this.CustomerService.getCustomer().subscribe({
        next:(data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error:()=>{
        alert("Hiba lépett fel az adatok lekérdezése közben.");
      }
    })
  }

  deleteCustomerItem(customer: customer){
    this.CustomerService.deleteCustomerItem(customer.ID).subscribe({
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