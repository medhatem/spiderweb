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
    console.log(urlData);
    this.httpClient.post<any>(this.uri + '/add_urls/', urlData).subscribe(res => {
      this.response = res;
    });
  }

}



