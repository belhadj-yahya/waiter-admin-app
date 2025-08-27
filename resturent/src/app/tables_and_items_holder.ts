import { Injectable,signal,computed } from '@angular/core';
interface item{
  item_id:number,
  item_name:string,
  descrption:string,
  item_price:number
}

interface table{
  table_id:number,
  table_name:string,
  table_status:string
}

@Injectable({
  providedIn: 'root'
})
export class TablesAndItmes {
  //user id in case we add stuff to this app
  user_id = signal<number|null>(null)
  //order holder
  order = signal<any>([]);
  //case we change the order
  new_items_for_order = signal<{table_id:number,order_id:number,order_data?:object} | null>(null)
  items = signal<item[]>([]);
  tables = signal<table[]>([]);
  tables_free = computed(() =>
    (this.tables() ?? []).filter(t => t.table_status === 'free').length
  );

  not_free_tables = computed(() =>
    (this.tables() ?? []).filter(t => t.table_status !== 'free').length
  );

  
}
