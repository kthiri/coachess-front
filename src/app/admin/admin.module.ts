import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { HomeComponent } from './components/home/home.component';
import { ProductComponent } from './components/product/product.component';
import { CategoryComponent } from './components/category/category.component';
import { CustomerComponent } from './components/customer/customer.component';
import { OrderComponent } from './components/order/order.component';
import { UserComponent } from './components/user/user.component';

import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabViewModule } from 'primeng/tabview';
import {TreeTableModule} from 'primeng/treetable';
import { FileUploadModule } from 'primeng/fileupload';
import { ToolbarModule } from 'primeng/toolbar';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import {DynamicDialogModule} from 'primeng/dynamicdialog';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { CourseComponent } from './components/course/course.component';
import { TrainerComponent } from './components/trainer/trainer.component';


@NgModule({
  declarations: [
    HomeComponent,
    ProductComponent,
    CategoryComponent,
    CustomerComponent,
    OrderComponent,
    UserComponent,
    CourseComponent,
    TrainerComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    TableModule,
    DialogModule,
    DropdownModule,
    ButtonModule,
    ToastModule,
    InputTextModule,
    ProgressBarModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    TabViewModule,
    ToastModule,
    TreeTableModule,
    FileUploadModule,
    ToolbarModule,
    InputNumberModule,
    ConfirmPopupModule,
    ConfirmDialogModule,
    DynamicDialogModule,
    SharedModule

  ]
})
export class AdminModule { }
