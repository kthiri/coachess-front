import { Component, OnInit } from '@angular/core';
import { ActuatorService } from '../../services/actuator.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  dbInfo:any;
  public isServerActive:boolean=false;
  public isDbActive:boolean=false;
  public isDiskActive:boolean=false;
  public isPingAtive:boolean=false;
  public info:any;
   
  constructor(private actuatorService:ActuatorService) { }

  
  ngOnInit(): void {

    this.actuatorService.getInfo().subscribe(res=>{
      this.info=res;
    })
   this.actuatorService.getHealth().subscribe(res=>{
    if(res.status==='UP')
    {
      this.isServerActive=true;
    }
    if(res.components.db.status==='UP')
    {
      this.isDbActive=true;
    }
    if(res.components.diskSpace.status==='UP')
    {
      this.isDiskActive=true;
    }
    if(res.components.ping.status==='UP')
    {
      this.isPingAtive=true;
    }
   })
  }

}
