import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppStartRequests {
  api_url_get = "http://localhost/resturent/apis/start_data.php?action="
  api_url_post_start_data = "http://localhost/resturent/apis/start_data.php"
  api_url_post = "http://localhost/resturent/apis/place_order.php"
  api_url_post_login = "http://localhost/resturent/apis/log_in.php"

  constructor(public http:HttpClient){}

  get_tables():Observable<any>{
    return this.http.get<any>(this.api_url_get+"get_data")
  }
  place_order(data:any):Observable<any>{
    return this.http.post(this.api_url_post,data)
  }
  get_order(id:number):Observable<any>{
    return this.http.get(this.api_url_get+"get_order"+"&order_id="+id)
  }
  change_order_Status(data:object):Observable<any>{
    return this.http.put("http://localhost/resturent/apis/start_data.php",data);
  }
  edit_order(data:object):Observable<any>{
    return this.http.post(this.api_url_post_start_data,data);
  }
  log_in(data:object):Observable<any>{
    return this.http.post(this.api_url_post_login,data);
  }
  get_and_change_orders(date:object|null):Observable<any>{
    return this.http.post(this.api_url_post_login,date)
  }
  change_item(data:object):Observable<any>{
    return this.http.post(this.api_url_post_login,data)
  }
}
