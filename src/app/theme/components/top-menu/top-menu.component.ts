import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from '../../../app.service';
import { Settings, AppSettings } from '../../../app.settings';
import { AuthService } from 'src/app/admin/services/auth.service';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html'
})
export class TopMenuComponent implements OnInit {
  public currencies = ['CAD', 'USD'];
  public currency:any; 
  public loggedIn:boolean=false;
  public user:any;

  public settings: Settings;


  constructor(public appSettings:AppSettings, 
    public appService:AppService, 
    public translateService: TranslateService,
    private authService:AuthService) { 
    this.settings = this.appSettings.settings; 
  } 

  ngOnInit() {
    this.user=this.authService.getUserFromLocalCache();

    this.loggedIn=this.authService.isUserLoggedIn()
    this.currency = this.currencies[0];  
  }

  public changeCurrency(currency){
    this.currency = currency;
  } 

  public changeLang(lang:string){ 
    this.translateService.use(lang);   
  } 

  public getLangText(lang){
    if(lang == 'de'){
      return 'German';
    }
    else if(lang == 'fr'){
      return 'French';
    }
    else if(lang == 'ru'){
      return 'Russian';
    }
    else if(lang == 'tr'){
      return 'Turkish';
    }
    else{
      return 'English';
    }
  } 

  logout()
  {
    console.log("logout")
    this.authService.logOut();
  }
}
