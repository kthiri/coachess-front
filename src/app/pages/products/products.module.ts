import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../shared/shared.module';
import { PipesModule } from '../../theme/pipes/pipes.module';
import { ProductsComponent } from './products.component';
import { ProductComponent } from './product/product.component';
import { ProductZoomComponent } from './product/product-zoom/product-zoom.component';
import { CoursesComponent } from './courses/courses.component';
import { CourseComponent } from './course/course.component';

export const routes: Routes = [
  { path: 'products', component: ProductsComponent, pathMatch: 'full' },
  { path: 'courses', component: CoursesComponent, pathMatch: 'full' },

  { path: ':name', component: ProductsComponent },
  { path: 'search/:name', component: ProductsComponent },
  { path: 'products/:id', component: ProductComponent },
  { path: 'courses/:id', component: CourseComponent }

];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        ReactiveFormsModule,
        SwiperModule,
        NgxPaginationModule,
        SharedModule,
        PipesModule
    ],
    declarations: [
        ProductsComponent,
        ProductComponent,
        ProductZoomComponent,
        CoursesComponent,
        CourseComponent
    ]
})
export class ProductsModule { }
