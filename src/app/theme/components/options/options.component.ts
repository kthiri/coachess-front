import { Component, ViewChild } from '@angular/core';
import { Settings, AppSettings } from '../../../app.settings';
import { TerminalService } from 'primeng/terminal';
import { Router } from '@angular/router';
import { OverlayPanel } from 'primeng/overlaypanel';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss'],
  providers:[TerminalService]
})
export class OptionsComponent {
  @ViewChild('opp') overlayPanel: OverlayPanel;
  public showOptions:boolean = false;
  public settings: Settings;
  waitingForConfirmation: boolean=false;
  constructor(public appSettings:AppSettings,
    private router:Router,
    private terminalService: TerminalService) { 
    this.settings = this.appSettings.settings; 
    this.terminalService.commandHandler.subscribe(command => {
      let response = '';
    
      if (command === 'date') {
        response = new Date().toDateString();
      } else if (command === 'help') {
        response = 'Please select one of the following options:\r' +
                   '1) Help with a product\r' +
                   '2) Help with user creation\r' +
                   '3) Contact us\r' +
                   '4) Other\n';
      } else if (command === '1') {
        response = 'ARE YOU LOOKING FOR MEN/WOMEN/KIDS '
                  
      } else if (command === 'kids') {
        this.router.navigateByUrl('/products/kids')
        response = 'Now you are on Kids Products';
        // Set a flag to indicate that we are waiting for a "yes" command
      } else if (command === 'men') {
        this.router.navigateByUrl('/products/men')
        response = 'Now you are on Men Products';
      } else if (command === 'women') {
        this.router.navigateByUrl('/products/women')
        response = 'Now you are on Women Products';
      } else if (command === '2') {
        this.router.navigateByUrl('/sign-in')
        response = 'Now you are on Sign Up Page';
     
      }  else if (command === '3') {
        response = 'EMAIL : contact@sunglassBangalow.com \n'+
        'PHONE : +1 (416) 262-0884 \n'+
        'ADDRESS : 29, Suncity Road, Toronto M9V 7V6';
      } else if (command === '4') {
        this.router.navigateByUrl('/contact')
        response = 'If you Have any question please ask us here';
      } else if (command === 'exit') {
        this.hideOverlayPanel();
    return;
  } 
      else {
        response = 'Sorry failed to find your request . Please type "help" for a list of available Options.\n';
      }
    
      this.terminalService.sendResponse(response);
    });
    
  }

  hideOverlayPanel() {
    this.overlayPanel.hide();
  }

  public changeTheme(theme){
    this.settings.theme = theme;       
  } 
}