import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(public router: Router, private toastr: ToastrService) {}

  ngOnInit(): void {
  }

  toast(){
    this.toastr.warning("La recherche d'URLs vient de prendre fin ", 'Information');
  }

}
