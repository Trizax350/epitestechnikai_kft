import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FreightService } from '../services/freight.service';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-delfreightdialog',
  templateUrl: './delfreightdialog.component.html',
  styleUrls: ['./delfreightdialog.component.scss']
})
export class DelFreightDialogComponent implements OnInit {
  freightForm !: FormGroup;
  FreightList: any;
  constructor(
    private http: HttpClient, 
    private FreightService: FreightService, 
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<DelFreightDialogComponent>
  ) { }

  public popoverTitle: string = '<b><u>Jóváhagyás szükséges</u></b>';
  public popoverMessage: string = '<b><u>Biztosan elvégzed a műveletet?</u><b>';
  public confirmClicked: boolean = true;
  public cancelClicked: boolean = true;
  public cancelText: string = "<b>Nem</b>";
  public placement: string ="right";
  public confirmText: string ="<b>Igen</b>";
  public appendToBody: boolean = false;

  ngOnInit(): void {
    this.FreightService.getFreight().subscribe((data: any) => {
      this.FreightList = data;
    })

    this.freightForm = this.formBuilder.group({
      ID: ['',Validators.required]
    })
  }

  delFreightItem(){
    this.FreightService.deleteFreightItem(this.freightForm.value['ID']).subscribe({
      next:() => {
        alert("Törlés sikeres.");
        this.ngOnInit();
        this.dialogRef.close();
      },
      error:(err)=>{
        alert(err.error.detail);
      }
    })
  }
}