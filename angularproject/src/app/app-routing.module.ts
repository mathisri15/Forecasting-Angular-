import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileuploadComponent } from './fileupload/fileupload.component';
import { LoginComponent } from './login/login.component';
// import { OnedateComponent } from './onedate/onedate.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { PredictComponent } from './predict/predict.component';
//import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './shared/auth.guard';
// import { SpecificComponent } from './specific/specific.component';
// import { UserinputComponent } from './userinput/userinput.component';

const routes: Routes = [
 // {path:'',component:RegisterComponent},
  {path:'',component:LoginComponent},
  {path:'fileupload',component:FileuploadComponent,canActivate:[AuthGuard]},
  // {path:'onedate',component:OnedateComponent,canActivate:[AuthGuard]},
  // {path:'user_input',component:UserinputComponent},
  // {path:'specific_date',component:SpecificComponent,canActivate:[AuthGuard]},
  {path:'predict',component:PredictComponent,canActivate:[AuthGuard]},
  {path:"**",component:PagenotfoundComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
