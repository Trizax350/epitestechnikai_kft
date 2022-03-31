import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../services/user.service';
import { user } from './user.model';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditUserDialogComponent } from '../edituserdialog/edituserdialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})

export class UserComponent implements OnInit {
  displayedColumns: string[] = ['ID', 'Name', 'Email', 'Status', 'Edit', 'Delete'];
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

  model: Array<user> = [];
  constructor(private http: HttpClient, private UserService: UserService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getUser();
  }

  openDialog() {
    this.dialog.open(EditUserDialogComponent, {
      width:'30%'
    }).afterClosed().subscribe(val=>{
      if(val==='save'){
        this.getUser();
      }
    })
  }

  editUserItem(row: any){
    this.dialog.open(EditUserDialogComponent, {
      width: '30%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val==='update'){
        this.getUser();
      }
    })
  }

  getUser(){
    this.UserService.getUser().subscribe({
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

  deleteUserItem(user: user){
    this.UserService.deleteUserItem(user.ID).subscribe({
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