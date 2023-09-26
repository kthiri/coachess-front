import { Component, OnInit, ViewChild, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ProductDialogComponent } from '../../shared/products-carousel/product-dialog/product-dialog.component';
import { AppService } from '../../app.service';
import { Product, Category } from "../../app.models";
import { Settings, AppSettings } from 'src/app/app.settings';
import { isPlatformBrowser } from '@angular/common';
import { ProductService } from 'src/app/admin/services/product.service';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  @ViewChild('sidenav', { static: true }) sidenav: any;
  public sidenavOpen:boolean = true;
  private sub: any;
  public viewType: string = 'grid';
  public viewCol: number = 25;
  public counts = [12, 24, 36];
  public count:any;
  public sortings = ['Sort by Default', 'Name Descending', 'Name Ascending','Price descending' ,'Price ascending'];
  public brands=['Ray-Ban','Prada','Gucci','Versace','Carrera','Dior','Lacoste']
  public sort:any;
  public products: Array<any> = [];
  public categories:Category[];
  
  public priceFrom: number = 750;
  public priceTo: number = 1599;
  public colors = [
    { name: "#5C6BC0", selected: false },
    { name: "#66BB6A", selected: false },
    { name: "#EF5350", selected: false },
    { name: "#BA68C8", selected: false },
    { name: "#FF4081", selected: false },
    { name: "#9575CD", selected: false },
    { name: "#90CAF9", selected: false },
    { name: "#B2DFDB", selected: false },
    { name: "#DCE775", selected: false },
    { name: "#FFD740", selected: false },
    { name: "#00E676", selected: false },
    { name: "#FBC02D", selected: false },
    { name: "#FF7043", selected: false },
    { name: "#F5F5F5", selected: false },
    { name: "#696969", selected: false }
  ];
  public sizes = [
    { name: "S", selected: false },
    { name: "M", selected: false },
    { name: "L", selected: false },
    { name: "XL", selected: false },
    { name: "2XL", selected: false },
    { name: "32", selected: false },
    { name: "36", selected: false },
    { name: "38", selected: false },
    { name: "46", selected: false },
    { name: "52", selected: false },
    { name: "13.3\"", selected: false },
    { name: "15.4\"", selected: false },
    { name: "17\"", selected: false },
    { name: "21\"", selected: false },
    { name: "23.4\"", selected: false }
  ]; 
  public page:any;
  public settings: Settings;
  selectedColor: any;
  selectedBrand:any;
  currentRoute: any;
  hasSearchTerm: any;
  constructor(public appSettings:AppSettings, 
              private activatedRoute: ActivatedRoute, 
              public appService:AppService, 
              public dialog: MatDialog, 
              private router: Router,
              private productService:ProductService,
              @Inject(PLATFORM_ID) private platformId: Object) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.currentRoute = this.activatedRoute.snapshot.url.join('/');
    console.log(this.currentRoute)
    const routeTerms = ['men', 'kids', 'women', 'search'];
    const currentRoute = this.currentRoute;

    const hasRouteTerm = routeTerms.some(term => currentRoute.includes(term));

    if (hasRouteTerm) {
    this.sub = this.activatedRoute.params.subscribe(params => { 
      if(params['name']=='search')
      {
        this.productService.filterByName(params['name']).subscribe(res => {
          console.log(params['name'])
          this.products = res;
          console.log(res)
        })
      }
      else
      {
        this.filterByCategory(params['name']);
      }
    
    }); 
    } else {
    this.getProducts();
    }

   
    this.selectedBrand = [];
    this.count = this.counts[0];
    this.sort = this.sortings[0];
    this.sub = this.activatedRoute.params.subscribe(params => {
      //console.log(params['name']);
    });
    if(window.innerWidth < 960){
      this.sidenavOpen = false;
    };
    if(window.innerWidth < 1280){
      this.viewCol = 33.3;
    };

    this.getCategories();
    // this.getBrands();
    // this.getAllProducts();   
   
  }

  getProducts()
  {

    this.productService.getProducts().subscribe(res=>{
      this.products=res;
    })
  }

  public getAllProducts(){
    this.appService.getProducts("featured").subscribe(data=>{
      this.products = data; 
      //for show more product  
      for (var index = 0; index < 3; index++) {
        this.products = this.products.concat(this.products);        
      }
    });
  }

  public getCategories(){  
    if(this.appService.Data.categories.length == 0) { 
      this.appService.getCategories().subscribe(data => {
        this.categories = data;
        this.appService.Data.categories = data;
      });
    }
    else{
      this.categories = this.appService.Data.categories;
    }
  }

  // public getBrands(){
  //   this.brands = this.appService.getBrands();
  //   this.brands.forEach(brand => { brand.selected = false });
  // }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  @HostListener('window:resize')
  public onWindowResize():void {
    (window.innerWidth < 960) ? this.sidenavOpen = false : this.sidenavOpen = true;
    (window.innerWidth < 1280) ? this.viewCol = 33.3 : this.viewCol = 25;
  }

  public changeCount(count){
    this.count = count;
    this.getAllProducts(); 
  }

  public changeSorting(sort){  

    if(sort==='Name Descending')
    {
      this.sortByNameDesc();
    }
    if(sort==='Name Ascending')
    {

      this.sortByNameAsc();
    }

    if(sort==='Price descending')
    {
      this.sortByPriceDesc();

    }
    if(sort==='Price ascending')
    {
      this.sortByPriceAsc();

    }
    if(sort==='Sort by Default')
    {
      this.getProducts();
    }
    
  }

  

  public changeViewType(viewType, viewCol){
    this.viewType = viewType;
    this.viewCol = viewCol;
  }

  public openProductDialog(product){   
    let dialogRef = this.dialog.open(ProductDialogComponent, {
        data: product,
        panelClass: 'product-dialog',
        direction: (this.settings.rtl) ? 'rtl' : 'ltr'
    });
    dialogRef.afterClosed().subscribe(product => {
      if(product){
        this.router.navigate(['/list/products', product.id, product.name]); 
      }
    });
  }

  public onPageChanged(event){
    this.page = event;
    this.getAllProducts(); 
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0,0);
    } 
  }

  public onChangeCategory(event){
    if(event.target){
      this.router.navigate(['/products', event.target.innerText.toLowerCase()]); 
      this.filterByCategory(event.target.innerText.toLowerCase());
      
    }   
  }

  sortByNameAsc()
  {
   
    this.productService.sortByName("name","asc").subscribe(res=>{
      this.products=res;
    })
  }
  sortByNameDesc()
  {

    this.productService.sortByName("name","desc").subscribe(res=>{
      this.products=res;
    })
  }
  sortByPriceAsc()
  {
    this.productService.sortByPrice("newPrice","asc").subscribe(res=>{
      this.products=res;
    })
  }
  sortByPriceDesc()
  {
    this.productService.sortByPrice("newPrice","desc").subscribe(res=>{
      this.products=res;
    })
  }

  filterByName(name:any)
  {
    this.productService.filterByName(name).subscribe(res=>{
      this.products=res;
    })
  }

  onBrandSelectionChange(event: MatCheckboxChange, brand: string) {
    if (event.checked) {
      this.selectedBrand.push(brand);
    } else {
      const index = this.selectedBrand.indexOf(brand);
      if (index >= 0) {
        this.selectedBrand.splice(index, 1);
      }
    }
    console.log('Selected brands:', this.selectedBrand);
  }

  
  filterByBrands()
  {
    this.productService.filterByBrand(this.selectedBrand).subscribe(res=>{
      this.products=res;
    })
  }
  filterByCategory(name:any)
  {
    if(name==='all categories')
    {
      this.getProducts();
    }
    else
    {
      this.productService.filterByCategory(name).subscribe(res=>{
        this.products=res;
      })
    }
    
  }
  filterByColors()
  {
    const selectedColors = this.colors.filter(color => color.selected).map(color => color.name);

    this.productService.filterByColors(selectedColors).subscribe(res=>{
      this.products=res;
    })
  }

  
  getSelectedColors() {
    return 
  }
}
