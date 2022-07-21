import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { InventoryService } from '../services/inventory.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

interface ContainerTypeValues {
  value: string;
  viewValue: string;
}

interface Part1TypeValues {
  value: string;
  viewValue: string;
}

interface Part2TypeValues {
  value: string;
  viewValue: string;
}

interface Part3TypeValues {
  value: string;
  viewValue: string;
}

interface Part4TypeValues {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-editinventorydialog',
  templateUrl: './editinventorydialog.component.html',
  styleUrls: ['./editinventorydialog.component.scss']
})
export class EditInventoryDialogComponent implements OnInit {
  containerForm !: FormGroup;
  actionBtn: string = "Mentés";
  constructor(
    private http: HttpClient, 
    @Inject(MAT_DIALOG_DATA) public editData: any, 
    private InventoryService: InventoryService, 
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<EditInventoryDialogComponent>
  ) { }

  ContainerTypeValues: ContainerTypeValues[] = [
    {value: 'S', viewValue: 'Standard IBC tartály'},
    {value: 'UN', viewValue: 'UN IBC tartály'},
    {value: 'UN EX', viewValue: 'PolyEX IBC tartály'},
  ];

  Part1TypeValues: Part1TypeValues[] = [
    {value: 'PE', viewValue: 'PE'},
    {value: 'N/A', viewValue: 'N/A'},
  ];

  Part2TypeValues: Part2TypeValues[] = [
    {value: 'DAE', viewValue: 'DAE'},
    {value: 'N/A', viewValue: 'N/A'},
  ];

  Part3TypeValues: Part3TypeValues[] = [
    {value: '150', viewValue: '150'},
    {value: '225', viewValue: '225'},
    {value: '400', viewValue: '400'},
  ];

  Part4TypeValues: Part4TypeValues[] = [
    {value: 'F50', viewValue: 'F50'},
    {value: 'A50', viewValue: 'A50'},
  ];

  ngOnInit(): void {
   this.containerForm = this.formBuilder.group({ 
      Type: ['',Validators.required],
      Capacity: ['',Validators.required],
      Part1: ['',Validators.required],
      Part2: ['',Validators.required],
      Part3: ['',Validators.required],
      Part4: ['',Validators.required],
      Stock: ['',Validators.required],
      Monetary_value:  ['',Validators.required]
   })

   if(this.editData){
     this.actionBtn = "Frissítés";
      this.containerForm.controls['Type'].setValue(this.editData.Type);
      this.containerForm.controls['Capacity'].setValue(this.editData.Capacity);
      this.containerForm.controls['Part1'].setValue(this.editData.Part1);
      this.containerForm.controls['Part2'].setValue(this.editData.Part2);
      this.containerForm.controls['Part3'].setValue(this.editData.Part3);
      this.containerForm.controls['Part4'].setValue(this.editData.Part4);
      this.containerForm.controls['Stock'].setValue(this.editData.Stock);
      this.containerForm.controls['Monetary_value'].setValue(this.editData.Monetary_value);
   }
  }

  addInventoryItem(){
    if(!this.editData){
      if(this.containerForm.valid){
        this.InventoryService.postInventory(this.containerForm.value).subscribe({
          next:() => {
            alert("Tartály hozzáadva.");
            this.containerForm.reset();
            this.dialogRef.close('save');
          },
          error:(err)=>{
            alert(err.error.detail);
          }
        })
      }
    } else {
      this.updateInventoryItem()
    }
  }

  updateInventoryItem(){
    this.InventoryService.putInventory(this.containerForm.value, this.editData.ID).subscribe({
      next:()=>{
        alert('Adatok frissítve.');
        this.containerForm.reset();
        this.dialogRef.close('update');
      },
      error:(err)=>{
        alert(err.error.detail);
      }
    })
  }
}