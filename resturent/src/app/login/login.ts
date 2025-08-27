import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AppStartRequests } from '../app-start-requests';
import { TablesAndItmes } from '../tables_and_items_holder';


@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule, NgIf],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  message_error = signal<string|null>(null)
  constructor(private rout:Router,private request:AppStartRequests,private data_holder:TablesAndItmes){}
  log_in_form = new FormGroup({
    user_email: new FormControl("",[Validators.required,Validators.email]),
    user_password: new FormControl("",[Validators.required]),
    action: new FormControl("log_in"),
  })
  handle_submit(){
    if(this.log_in_form.valid){
      this.request.log_in(this.log_in_form.value).subscribe({
        next:(value) => {
          if(value.status == false){
            this.message_error.set(value.message);
          }else{
            this.data_holder.user_id.set(value.admin_id);
            this.rout.navigate(["/admin_page"]);
            console.log("its working")
          }
            console.log(value)
        },
        error(err) {
          console.log(err)
        },
      })
    }
  }

}
