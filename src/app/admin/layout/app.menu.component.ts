import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/admin'] }
                ]
            },
            {
                label: 'Managment',
                items: [
                    { label: 'Courses Management', icon: 'pi pi-fw pi-id-card', routerLink: ['/admin/courses'] },
                    { label: 'Product Management', icon: 'pi pi-fw pi-check-square', routerLink: ['/admin/products'] },
                    { label: 'Order Management', icon: 'pi pi-fw pi-bookmark', routerLink: ['/admin/orders'] },
                    { label: 'Client Management', icon: 'pi pi-fw pi-exclamation-circle', routerLink: ['/admin/customers'] },
                    { label: 'Trainer Management', icon: 'pi pi-fw pi-box', routerLink: ['/admin/trainers'] },
                    // { label: 'Admin Management', icon: 'pi pi-fw pi-box', routerLink: ['/admin/users'] },
                  
                ]
            }
        ];
    }
}
