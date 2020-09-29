import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  uri = 'http://localhost:8080';
  constructor(private httpClient: HttpClient) { }
  response;



  /* Requetes */
  AddUrl(urlData) {
    console.log("AddUrl(urlData)" + urlData);
    //this.httpClient.post<any>(this.uri + '/users/add_user', userData).subscribe(res => {
      //this.response = res;
    //});
  }

}



