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

    let home = {
      'crawler1': '' + postUrl.crawler1 + '',
      'crawler2': '' + postUrl.crawler2 + '',
      'crawler3': '' + postUrl.crawler3 + '',
    }


    if (postUrl.crawler1 == '' || postUrl.crawler2 == '' || postUrl.crawler3 == '') {
      //Afficher erreur
      document.getElementById("erreur").style.display = "block";
    }
    else {
      console.log(home);
      //Requete post http
      this.apiService.AddUrl(home);

      //Navigation
      //this.router.navigate(['/']);
    }
  }
}
