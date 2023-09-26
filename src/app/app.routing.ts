import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules  } from '@angular/router'; 

import { PagesComponent } from './pages/pages.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AppLayoutComponent } from './admin/layout/app.layout.component';
import { AuthenticationGuard } from './config/authentication.guard';
import { AdminGuard } from './config/admin.guard';

export const routes: Routes = [
    { 
        path: '', 
        component: PagesComponent, children: [
            { path: '', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) },
            { path: 'account', loadChildren: () => import('./pages/account/account.module').then(m => m.AccountModule), data: { breadcrumb: 'Account Settings' } ,canActivate: [AuthenticationGuard]},
            { path: 'compare', loadChildren: () => import('./pages/compare/compare.module').then(m => m.CompareModule), data: { breadcrumb: 'Compare' } },
            { path: 'wishlist', loadChildren: () => import('./pages/wishlist/wishlist.module').then(m => m.WishlistModule), data: { breadcrumb: 'Wishlist' } },
            { path: 'cart', loadChildren: () => import('./pages/cart/cart.module').then(m => m.CartModule), data: { breadcrumb: 'Cart' } },
            { path: 'checkout', loadChildren: () => import('./pages/checkout/checkout.module').then(m => m.CheckoutModule), data: { breadcrumb: 'Checkout' } },
            { path: 'contact', loadChildren: () => import('./pages/contact/contact.module').then(m => m.ContactModule), data: { breadcrumb: 'Contact' } },
            { path: 'sign-in', loadChildren: () => import('./pages/sign-in/sign-in.module').then(m => m.SignInModule), data: { breadcrumb: 'Sign In ' } },
            { path: 'brands', loadChildren: () => import('./pages/brands/brands.module').then(m => m.BrandsModule), data: { breadcrumb: 'Brands' } },
            { path: 'list', loadChildren: () => import('./pages/products/products.module').then(m => m.ProductsModule), data: { breadcrumb: 'All Products' } }
        ]
    },
   
    { path: 'admin',component:AppLayoutComponent, loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
    { path: '**', component: NotFoundComponent }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules,
    initialNavigation: 'enabledBlocking'
})
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }