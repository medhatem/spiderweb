import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiService } from './../api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  postUrl: FormGroup;

  constructor(private router: Router, private fb: FormBuilder, private apiService: ApiService,) {
    this.postUrl = this.fb.group({
      'url1': '',
      'url2': '',
      'url3': '',
      'url4': '',
    })
  }

  post = function (postUrl) {
    console.log(postUrl);

    //Réinitialiser les messages d'erreur lors du submit
    document.getElementById("erreurVide").style.display = "none";
    document.getElementById("erreurUrl1").style.display = "none";
    document.getElementById("erreurUrl2").style.display = "none";
    document.getElementById("erreurUrl3").style.display = "none";
    document.getElementById("erreurUrl4").style.display = "none";

    let home = {
      'data': '' + postUrl.url1 + '' + ', ' + '' + postUrl.url2 + '' + ', ' + '' + postUrl.url3 + '' + ', ' + '' + postUrl.url4 + '',
    }

    //Valider qu'aucun champ n'est vide
    if (postUrl.url1 == '' || postUrl.url2 == '' || postUrl.url3 == '' || postUrl.url4 == '') {

      //Sinon afficher erreur
      document.getElementById("erreurVide").style.display = "block";
    }
    else {

      //Fonction urlExists permettant de valider qu'un URL existe
      function urlExists(url) {
        return fetch(url, {mode: "no-cors"})
          .then(res => true)
          .catch(err => false)
      }

      //Initialiser le count
      let count = 0; 
      
      //Fonction de délai
      function delay(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
      }

      (async () => { 
        // Do something before delay
        console.log('before delay')

        //Valider que l'url1 existe
        urlExists(postUrl.url1).then(result => {
          this.resultat1 = result;
          //console.log(this.resultat1);
          if (this.resultat1 == false) {

            //Count
            count = count + 1;

            //Afficher erreur
            console.log("ErreurUrl1 " + count);
            document.getElementById("erreurUrl1").style.display = "block";
          }
        });
  
        //Valider que l'url2 existe
        urlExists(postUrl.url2).then(result => {
          this.resultat2 = result;
          //console.log(this.resultat1);
          if (this.resultat2 == false) {

            //Count
            count = count + 1;

            //Afficher erreur
            console.log("ErreurUrl2 " + count);
            document.getElementById("erreurUrl2").style.display = "block";
          }
        });
  
        //Valider que l'url3 existe
        urlExists(postUrl.url3).then(result => {
          this.resultat3 = result;
          //console.log(this.resultat1);
          if (this.resultat3 == false) {

            //Count
            count = count + 1;

            //Afficher erreur
            console.log("ErreurUrl3 " + count);
            document.getElementById("erreurUrl3").style.display = "block";
          }
        });

        //Valider que l'url4 existe
        urlExists(postUrl.url4).then(result => {
          this.resultat4 = result;
          //console.log(this.resultat1);
          if (this.resultat4 == false) {

            //Count
            count = count + 1;

            //Afficher erreur
            console.log("ErreurUrl4 " + count);
            document.getElementById("erreurUrl4").style.display = "block";
          }
        });

        //Délai pour que URLExists ait le temps de valider
        await delay(1000);

        // Do something after
        console.log('after delay')

        //Si pas d'erreur, naviguer et lance la requête
        if (count == 0) {

          //Afficher réussite
          console.log("Tout va bien");

          //Requete post http
          this.apiService.AddUrl(home);
          console.log('Post')
          
          //Navigation
          this.router.navigate(['/graph']);
        }
      })();
    }
  }
}
