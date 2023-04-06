import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  
  constructor(private router:Router,private http:HttpClient,private aouth:AuthService) { }

  ngOnInit(): void {
  }
  name=""
  pwd=""
  message:string=""
  imgSrc='assets/shar.png'
  mode=false

  onlogin(){
    
    
        this.aouth.boolauthlogin=true
        this.router.navigateByUrl('/fileupload')

  
  }

//   user = {
//     email: '',
//     password: ''
//   };
// USERINFO: {[key: string]: string} = {
//     "John": '12345a',
//     "Jane": '12345b',
//     "Bob": '12345c'
//   };

// check()
//   { 
//     const username=this.user.email;
//     const password=this.user.password;

//     if(username in this.USERINFO)
//     {
//       if(password == this.USERINFO[username])
//       {
//         return true;
        
//       }
//     } 
//     return false;
//   }

// console.log(this.user);  
//        if(this.check()==true)
//        {
//         alert('APPROVE');
//         //this.router.navigate{["uploadpage"]};
//         //this.router.navigate{[/uploadpage.html]};
//         this.auth.canAuthenticate();
        
//        }
//        else{
//         alert('NOT VALID0');
//         this.errorMessage = "Invalid Credentials!";
//        }





 
  

}
