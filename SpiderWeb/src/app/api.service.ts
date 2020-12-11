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
    console.log('getAllGraph() Api Services');
    return this.httpClient.get<any>(this.uri + '/graph/').pipe();
  }

  /* Requete d'affichage des enfants de niveau 3 d'un noeud */
  getNodeChildren(nodeId) {
    console.log('getNodeChildren(nodeId) ', nodeId);
    return this.httpClient.get<any>(this.uri + '/graph?urlparent=' + nodeId).pipe();
  }

  /* Requete d'initialisation des URLs pour les crawlers */
  reset(vide) {
    console.log("reset");
    this.httpClient.post<any>(this.uri + '/dev/reset', vide).subscribe(res => {
      this.response = res;
    });
  }

  /* Requete d'initialisation des URLs pour les crawlers */
  reset_Crawlers(vide) {
    console.log("reset crawlers");
    this.httpClient.post<any>(this.uri + '/dev/reset-crawlers-session', vide).subscribe(res => {
      this.response = res;
    });
  }

}