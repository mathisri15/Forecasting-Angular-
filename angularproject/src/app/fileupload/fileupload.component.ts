import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.css']
})
export class FileuploadComponent implements OnInit {

  file:any;
  filename:any;
  fileform:any;
  message:any
  linebool=true
  bool=true
  clearbool=true
  csvbool=true
  topbool=true
  mode=false

  constructor(private http:HttpClient,private router:Router,private auth:AuthService) { } 

  ngOnInit(): void {
  }

  onFileSubmit(event:any){
    //this.catcher=event;
    
    try{
      this.bool = false
      this.clearbool=false
      this.file=event.target.files[0];
      console.log(event);
      if(this.file){
        this.csvbool=false
        this.filename=this.file.name;
        this.fileform=new FormData();
        this.fileform.append('file',this.file);
        if(this.filename.split('.')[1]!='csv'){
          this.message="Cannot read other than csv file"
          this.linebool=false
          setTimeout(()=>{
            this.del()
            this.csvbool=true
            this.message=""
            this.linebool=true
          },1000)
        }
      }
      
    }
    catch(error){
      console.log('upload a file')
    }

  }
  
  onUpload(){
    if(this.file){
      let url='http://localhost:5000/file_upload';
      this.http.post(url,this.fileform).subscribe((response:any)=>{
      
      console.log(response.response);
      this.linebool=false
      this.topbool=false 
      this.message=response.response
      
      
    }
    );
    
    }
    
  }


  

  del(){
    this.file=null
    this.bool=true
    this.clearbool=true
    this.csvbool=true
  }

  specificgo(){
    if(this.topbool==true){
      alert('Upload a csv file to access this')
    }else{
    this.router.navigateByUrl('/specific_date')
    }
  }

  predictgo(){
    if(this.topbool==true){
      alert('Upload a csv file to access this')
    }else{
    this.router.navigateByUrl('/predict')
    }  
  }

  particulargo(){
    if(this.topbool==true){
      alert('Upload a csv file to access this')
    }else{
    this.router.navigateByUrl('/onedate')
    }  
  }

}
