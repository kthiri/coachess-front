import { Component, OnInit, Input} from '@angular/core';
import { AuthService } from 'src/app/admin/services/auth.service';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  
  constructor(private authService:AuthService,
    public appService:AppService) { }
  public isAdminRole:boolean=false;

  ngOnInit() { 
   
    var user=JSON.parse(localStorage.getItem("user"));
    console.log(user);
    if(user===null || user===undefined)
    {
      this.isAdminRole=false;
    }
    else
    {
      if(user.roles.includes("ROLE_ADMIN"))
      {
        this.isAdminRole=true;
      }
    }
    

  }

  openMegaMenu(){
    let pane = document.getElementsByClassName('cdk-overlay-pane');
    [].forEach.call(pane, function (el) {
        if(el.children.length > 0){
          if(el.children[0].classList.contains('mega-menu')){
            el.classList.add('mega-menu-pane');
          }
        }        
    });
  }


  private getUserRole(): string {
    return this.authService.getUserFromLocalCache().role;
  }
  public isAdmin() {
    this.isAdminRole= this.getUserRole() === 'ROLE_ADMIN' ;
  }
  

}
