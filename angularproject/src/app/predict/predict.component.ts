import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart,registerables } from 'chart.js';

@Component({
  selector: 'app-predict',
  templateUrl: './predict.component.html', 
  styleUrls: ['./predict.component.css',]
})
export class PredictComponent implements OnInit {


  constructor(private http:HttpClient) {Chart.register(...registerables)}

  pred_duration=''
  select_value=''
  graph_value:any;
  days=0
  statsbool=true
  stats_contnt_bool=true
  mode=false
  //*chart

  chart:any;
  chartbool=true
  getcbool=false
  actual_sales:any
  predicted_sales:any
  dates:any
  //*user ip vars
  user_chart:any
  future_user_date:any
  future_sales:any

  //*custom_date
  custom_date:any;
  predicted_value:any;

  


  //* stat variables
  accuracy:any;
  rmse:any;
  mape:any;
  
  

  ngOnInit(): void {
  }


  containsAnyLetters(str:string) {
    return /[a-zA-Z]/.test(str);
  }

  

  onSelect(value:string){ 
    this.select_value=value;
  }

  onSelectgraph(value:string){
    this.graph_value=value
  }

  getstatus(){
    this.stats_contnt_bool=false
  }


  // changemode(elem: HTMLElement,elem1:HTMLElement){
  //   this.mode=!this.mode
  //   if(this.mode==false){
  //     elem.className='container'
  //     elem1.className='button-mode'
  //   }else{
  //     elem.className='container-dark'
  //     elem1.className='button-mode-dark'

  //   }
  // }

  calc(){
    if(this.select_value==''){
      alert("select duration")
    }else if(this.graph_value==null){
      alert("Select chart type") 
    }
    else if(this.pred_duration=='' || this.containsAnyLetters(this.pred_duration)==true){
      alert("Type a number")
    }else if(this.pred_duration=='0'){
      alert("Cannot predict for zero "+this.select_value)
    }else{
      if(this.select_value=='Months'){
        this.days=+this.pred_duration
        this.days=this.days*30
      }else if(this.select_value=='Days'){
        this.days=+this.pred_duration
      }else if(this.select_value=='Weeks'){
        this.days=+this.pred_duration
        this.days=this.days*7
      }
    } 
    if(this.days>=1){
      this.chartbool=false
      this.getcbool=true
      this.http.post("http://localhost:5000/pred_days",{'days':this.days}).subscribe((response:any)=>{
      this.dates=JSON.parse(response.dates);
      this.actual_sales=JSON.parse(response.actual)
      this.predicted_sales=JSON.parse(response.predicted)
      this.future_user_date=JSON.parse(response.future_user_date)
      this.future_sales=JSON.parse(response.future_sales)
      this.mape=JSON.parse(response.mape)
      this.rmse=JSON.parse(response.rmse)
      this.accuracy=JSON.parse(response.accuracy)
      console.log(this.dates[0],this.actual_sales[0],this.predicted_sales, this.future_user_date[0],this.future_sales[0])
      

      this.chart=new Chart('canvas',{
        type:this.graph_value,
        data:{
          labels:this.dates,
          datasets:[
            {
              label:'Actual Sales',
              data:this.actual_sales,
              borderColor:'#D864A9',
              backgroundColor:'#D864A9'
            },
            {
              label:'Predicted Sales',
              data:this.predicted_sales,
              borderColor:'#FFACAC',
              backgroundColor:'#FFACAC'
            }
          ]
        }
      })
      this.statsbool=false

      this.user_chart=new Chart('canvas1',{
        type:this.graph_value,
        data:{
          labels:this.future_user_date,
          datasets:[
            {
              label:'User Prediction',
              data:this.future_sales,
              borderColor:'#FFACAC',
              backgroundColor:'#FFACAC',
            }
          ]
        }
      })
      })
    }
  }

}
