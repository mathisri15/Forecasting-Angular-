import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auther:AuthService,private router:Router){

  }
  canActivate() {
    if(this.auther.isauthered()){
      return true
    }else{
      window.alert("Permission denied")
      this.router.navigateByUrl('/login')
      return false
    }
  }
  
}
