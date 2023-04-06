import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
// import { WeatherService } from '../weather.service';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-pagenotfound',
  templateUrl: './pagenotfound.component.html',
  styleUrls: ['./pagenotfound.component.css']
})
export class PagenotfoundComponent implements OnInit {

  // fudata:any;
  // joy=true
  constructor( public router:Router,public aouth:AuthService, http:HttpClient) { }

  ngOnInit(): void {
  }
  // getme(){ 
  //   this.joy=false

  //   this.user.getdata().subscribe(data=>this.fudata=data);
  // }
  onBack(){
    this.router.navigateByUrl('')


}
}
