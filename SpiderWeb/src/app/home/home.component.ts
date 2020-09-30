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
  title = 'SpiderWeb';
  postUrl: FormGroup;

  constructor(private router: Router,
    private fb: FormBuilder,
    private apiService: ApiService,
  ) {

    this.postUrl = this.fb.group({
      'crawler1': '',
      'crawler2': '',
      'crawler3': '',
    })
  }

  post = function (postUrl) {
    console.log(postUrl);
    document.getElementById("erreurVide").style.display = "none";
    document.getElementById("erreurUrl1").style.display = "none";
    document.getElementById("erreurUrl2").style.display = "none";
    document.getElementById("erreurUrl3").style.display = "none";

    let home = {
      'crawler1': '' + postUrl.crawler1 + '',
      'crawler2': '' + postUrl.crawler2 + '',
      'crawler3': '' + postUrl.crawler3 + '',
    }


    if (postUrl.crawler1 == '' || postUrl.crawler2 == '' || postUrl.crawler3 == '') {
      //Afficher erreur
      document.getElementById("erreurVide").style.display = "block";
    }
    else {
      function urlExists(url) {
        return fetch(url, {mode: "no-cors"})
          .then(res => true)
          .catch(err => false)
      }

      let count = 0; 
      
      console.log("count0 " + count);

      urlExists(postUrl.crawler1).then(result => {
        this.resultat1 = result;
        //console.log(this.resultat1);
        if (this.resultat1 == false) {
          //Afficher erreur
          console.log("ErreurUrl1");
          document.getElementById("erreurUrl1").style.display = "block";
        }
      });

      urlExists(postUrl.crawler2).then(result => {
        this.resultat2 = result;
        //console.log(this.resultat1);
        if (this.resultat2 == false) {
          //Afficher erreur
          console.log("ErreurUrl2");
          document.getElementById("erreurUrl2").style.display = "block";
        }
      });

      urlExists(postUrl.crawler3).then(result => {
        this.resultat3 = result;
        //console.log(this.resultat1);
        if (this.resultat3 == false) {
          //Afficher erreur
          console.log("ErreurUrl3");
          document.getElementById("erreurUrl3").style.display = "block";
        }
      });

        //Afficher réussite
        console.log("Tout va bien");
    }
  }
}
