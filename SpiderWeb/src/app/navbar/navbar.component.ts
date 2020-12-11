import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from './../api.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(public router: Router, private toastr: ToastrService, private apiService: ApiService) {}

  ngOnInit(): void {
  }

  resetAll(){
    this.toastr.warning("La recherche d'URLs vient de prendre fin ", 'Information');
    this.apiService.reset("");
    console.log("reset done")
    //this.apiService.reset_Crawlers("");
    //console.log("reset-crawlers done")
  }

}
