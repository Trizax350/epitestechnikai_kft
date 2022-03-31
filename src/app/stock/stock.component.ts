import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { InventoryService } from '../services/inventory.service';
import { inventory } from '../inventory/inventory.model';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})

export class StockComponent implements OnInit {
  displayedColumns: string[] = ['ID', 'Type', 'Capacity', 'Part1', 'Part2', 'Part3', 'Part4', 'Stock', 'Monetary_value', 'Monetary_value_all', 'Last_updated'];
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
    this.getStock();
  }

  getStock(){
    this.InventoryService.getStock().subscribe({
        next:(data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error:(err)=>{
        alert("Hiba lépett fel az adatok lekérdezése közben.");
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