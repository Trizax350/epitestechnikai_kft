import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

interface StatusValues {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-edituserdialog',
  templateUrl: './edituserdialog.component.html',
  styleUrls: ['./edituserdialog.component.scss']
})
export class EditUserDialogComponent implements OnInit {
  userForm !: FormGroup;
  actionBtn: string = "Mentés";
  constructor(
    private http: HttpClient, 
    @Inject(MAT_DIALOG_DATA) public editData: any, 
    private UserService: UserService, 
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<EditUserDialogComponent>
  ) { }

  StatusValues: StatusValues[] = [
    {value: 'Aktív', viewValue: 'Aktív'},
    {value: 'Inaktív', viewValue: 'Inaktív'},
  ];

  ngOnInit(): void {
   this.userForm = this.formBuilder.group({
      Name: ['',Validators.required],
      Email: ['',Validators.required],
      Password: ['',Validators.required],
      Status: ['',Validators.required]
   })

   if(this.editData){
      this.actionBtn = "Frissítés";
      this.userForm.controls['Name'].setValue(this.editData.Name);
      this.userForm.controls['Email'].setValue(this.editData.Email);
      this.userForm.controls['Password'].setValue(this.editData.Password);
      this.userForm.controls['Status'].setValue(this.editData.Status);
   }
  }

  addUserItem(){
    if(!this.editData){
      if(this.userForm.valid){
        this.UserService.postUser(this.userForm.value).subscribe({
          next:() => {
            alert("Felhasználó hozzáadva.");
            this.userForm.reset();
            this.dialogRef.close('save');
          },
          error:(err)=>{
            alert(err.error.detail);
          }
        })
      }
    } else {
      this.updateUserItem()
    }
  }

  updateUserItem(){
    this.UserService.putUser(this.userForm.value, this.editData.ID).subscribe({
      next:()=>{
        alert('Adatok frissítve.');
        this.userForm.reset();
        this.dialogRef.close('update');
      },
      error:(err)=>{
        alert(err.error.detail);
      }
    })
  }
}
