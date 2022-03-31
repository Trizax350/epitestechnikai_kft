import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { CustomerService } from '../services/customer.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-editcustomerdialog',
  templateUrl: './editcustomerdialog.component.html',
  styleUrls: ['./editcustomerdialog.component.scss']
})
export class EditCustomerDialogComponent implements OnInit {
  customerForm !: FormGroup;
  actionBtn: string = "Mentés";
  constructor(
    private http: HttpClient, 
    @Inject(MAT_DIALOG_DATA) public editData: any, 
    private CustomerService: CustomerService, 
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<EditCustomerDialogComponent>
  ) { }

  ngOnInit(): void {
   this.customerForm = this.formBuilder.group({
      Name: ['',Validators.required],
      Address: ['',Validators.required]
   })

   if(this.editData){
      this.actionBtn = "Frissítés";
      this.customerForm.controls['Name'].setValue(this.editData.Name);
      this.customerForm.controls['Address'].setValue(this.editData.Address);
   }
  }

  addCustomerItem(){
    if(!this.editData){
      if(this.customerForm.valid){
        this.CustomerService.postCustomer(this.customerForm.value).subscribe({
          next:() => {
            alert("Ügyfél hozzáadva.");
            this.customerForm.reset();
            this.dialogRef.close('save');
          },
          error:(err)=>{
            alert(err.error.detail);
          }
        })
      }
    } else {
      this.updateCustomerItem()
    }
  }

  updateCustomerItem(){
    this.CustomerService.putCustomer(this.customerForm.value, this.editData.ID).subscribe({
      next:()=>{
        alert('Adatok frissítve.');
        this.customerForm.reset();
        this.dialogRef.close('update');
      },
      error:(err)=>{
        alert(err.error.detail);
      }
    })
  }
}
