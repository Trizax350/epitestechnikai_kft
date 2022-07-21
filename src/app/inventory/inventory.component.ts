import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { InventoryService } from '../services/inventory.service';
import { inventory } from './inventory.model';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditInventoryDialogComponent } from '../editinventorydialog/editinventorydialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CheckPriceLogDialogComponent } from '../checkpricelogdialog/checkpricelogdialog.component';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})

export class InventoryComponent implements OnInit {
  displayedColumns: string[] = ['ID', 'Type', 'Capacity', 'Part1', 'Part2', 'Part3', 'Part4', 'Stock', 'Monetary_value', 'Counted_value', 'Last_updated', 'Pricelog', 'Edit', 'Delete'];
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

  model: Array<inventory> = [];
  constructor(private http: HttpClient, private InventoryService: InventoryService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getInventory();
  }

  openDialog() {
    this.dialog.open(EditInventoryDialogComponent, {
      width:'30%'
    }).afterClosed().subscribe(val=>{
      if(val==='save'){
        this.getInventory();
      }
    })
  }

  editInventoryItem(row: any){
    this.dialog.open(EditInventoryDialogComponent, {
      width: '30%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val==='update'){
        this.getInventory();
      }
    })
  }

  checkPriceLog(row: any){
    this.dialog.open(CheckPriceLogDialogComponent, {
      width: '50%',
      data:row
    }).afterClosed().subscribe(val=>{
      this.getInventory();
    })
  }

  getInventory(){
    this.InventoryService.getInventory().subscribe({
        next:(data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sortingDataAccessor = (data, property) => {
          switch(property){
            case 'Counted_value': return data['Monetary_value']*data['Stock'];
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

  deleteInventoryItem(inventory: inventory){
    this.InventoryService.deleteInventoryItem(inventory.ID).subscribe({
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