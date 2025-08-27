import { Component,signal } from '@angular/core';
import { TablesAndItmes } from '../tables_and_items_holder';
import { Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { AppStartRequests } from '../app-start-requests';
import { DecimalPipe,NgIf,NgFor } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';

interface Item {
  item_id: number;
  item_name: string;
  descrption: string;
  item_price: number;
}

@Component({
  selector: 'app-admin-simple-page',
  imports: [DecimalPipe, NgIf, NgFor, ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './admin-simple-page.html',
  styleUrl: './admin-simple-page.css'
})
export class AdminSimplePage implements OnInit {
  editing_item_id: number | null = null;
  order = signal<any>(null);
  date_of_order = signal<any>("today");
  constructor(private rout:Router,protected data_holder:TablesAndItmes,private request:AppStartRequests){}

  date_form = new FormGroup({
    date: new FormControl("",[Validators.required])
  })
    editForm: FormGroup = new FormGroup({
    item_name: new FormControl('', Validators.required),
    descrption: new FormControl('', Validators.required),
    item_price: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
    action: new FormControl("change_item")
  });

  ngOnInit(): void {
    if(this.data_holder.user_id() == null){
      this.rout.navigate(["/"]);
      return
    }
    this.get_date_request(null);
    
  }
  editItem(item: Item) {
    this.editing_item_id = item.item_id;
    console.log(item)
    this.editForm.patchValue({
      item_name: item.item_name,
      descrption: item.descrption,
      item_price: item.item_price
    });
  }
  cancelEdit() {
    this.editing_item_id = null;
  }
  saveEdit(item: Item) {
    if (this.editForm.invalid) return;
    const updatedItem: Item = {
      ...item,
      ...this.editForm.value,
      item_price: parseFloat(this.editForm.value.item_price)
    };
    this.request.change_item(updatedItem).subscribe({
      next: (res) => {
        console.log('Item updated successfully', res);
        this.data_holder.items.update(arr =>
          arr.map(i => (i.item_id === item.item_id ? updatedItem : i))
        );

        this.editing_item_id = null;
      },
      error: (err) => {
        console.error('Failed to update item', err);

      }
    });
  }
  log_out(){
    this.data_holder.user_id.set(null)
    this.rout.navigate(["/"])
  }

  
  search_for_orders(){
    if(this.date_form.valid){
      this.date_of_order.set(this.date_form.get("date")?.value)
      this.get_date_request(this.date_form.value)
    }
  }

  get_date_request(date_if_there:object|null){
    this.request.get_and_change_orders(date_if_there).subscribe({
      next:(value) => {
        this.order.set(value)
        console.log(value)
      },
      error(err) {
        console.log(err)
      },
    })
    
  }
}
