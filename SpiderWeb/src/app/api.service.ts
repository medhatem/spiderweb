import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  uri = 'http://localhost:3000';
  constructor(private httpClient: HttpClient) { }
  response;


  /* Requete d'initialisation des URLs pour les crawlers */
  AddUrl(urlData) {
    console.log(urlData);
    this.httpClient.post<any>(this.uri + '/init/', urlData).subscribe(res => {
      this.response = res;
    });
  }

  /* Requete du premier affichage du graph */
  getAllGraph() {
    console.log('getAllGraph()');
    return this.httpClient.get<any>(this.uri + '/graph/').pipe();
  }

  /* Requete d'affichage des enfants de niveau 3 d'un noeud */
  getNodeChildren(nodeId) {
    console.log('getNodeChildren(nodeId) ' + nodeId);
    return this.httpClient.get<any>(this.uri + '/graph?urlparent=' + nodeId).pipe();
  }
}