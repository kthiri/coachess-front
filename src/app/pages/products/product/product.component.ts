import { Component, OnInit, SecurityContext, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SwiperConfigInterface, SwiperDirective } from 'ngx-swiper-wrapper';
import { Data, AppService } from '../../../app.service';
import { Product } from "../../../app.models";
import { emailValidator } from '../../../theme/utils/app-validators';
import { ProductZoomComponent } from './product-zoom/product-zoom.component';
import { ProductService } from 'src/app/admin/services/product.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  @ViewChild('zoomViewer', { static: true }) zoomViewer;
  @ViewChild(SwiperDirective, { static: true }) directiveRef: SwiperDirective;
  public config: SwiperConfigInterface={};
  public product: any;
  public image: any;
  public zoomImage: any;
  private sub: any;
  public form: UntypedFormGroup;
  public relatedProducts: Array<Product>;
  selectedRating: number;
  reviews:any[];
  constructor(public appService:AppService, 
    private activatedRoute: ActivatedRoute, 
    public dialog: MatDialog, 
    public formBuilder: UntypedFormBuilder,
    public productService:ProductService,
    private sanitizer:DomSanitizer) {  }

  ngOnInit() {      
    this.sub = this.activatedRoute.params.subscribe(params => { 
      this.getProdById(params['id']); 
      this.getReviews(params['id']);
    }); 
    this.form = this.formBuilder.group({ 
      'review': [null, Validators.required],            
      'name': [null, Validators.compose([Validators.required, Validators.minLength(4)])],
      'email': [null, Validators.compose([Validators.required, emailValidator])],
      "productId":null,
      "ratingsValue":null
    }); 
    this.getRelatedProducts();    
  }

  ngAfterViewInit(){
    this.config = {
      observer: false,
      slidesPerView: 4,
      spaceBetween: 10,      
      keyboard: true,
      navigation: true,
      pagination: false,       
      loop: false, 
      preloadImages: false,
      lazy: true, 
      breakpoints: {
        480: {
          slidesPerView: 2
        },
        600: {
          slidesPerView: 3,
        }
      }
    }
  }

  public getReviews(id)
  {
    this.productService.getReviews(id).subscribe(res=>{
      this.reviews=res;
    })
  }

  public getProdById(id)
  {
    this.productService.getById(id).subscribe(res=>{
      this.product=res;
      this.image =res.imageUrl
      this.zoomImage = res.image;
      setTimeout(() => { 
        this.config.observer = true;
       // this.directiveRef.setIndex(0);
      });
    });
    
  }
  public getProductById(id){
    this.appService.getProductById(id).subscribe(data=>{
      this.product = data;
      this.image = data.image;
      this.zoomImage = data.image;
      setTimeout(() => { 
        this.config.observer = true;
       // this.directiveRef.setIndex(0);
      });
    });
  }

  public getRelatedProducts(){
    this.appService.getProducts('related').subscribe(data => {
      this.relatedProducts = data;
    })
  }

  public selectImage(image){
    this.image = image.medium;
    this.zoomImage = image.big;
  }

  public onMouseMove(e){
    if(window.innerWidth >= 1280){
      var image, offsetX, offsetY, x, y, zoomer;
      image = e.currentTarget; 
      offsetX = e.offsetX;
      offsetY = e.offsetY;
      x = offsetX/image.offsetWidth*100;
      y = offsetY/image.offsetHeight*100;
      zoomer = this.zoomViewer.nativeElement.children[0];
      if(zoomer){
        zoomer.style.backgroundPosition = x + '% ' + y + '%';
        zoomer.style.display = "block";
        zoomer.style.height = image.height + 'px';
        zoomer.style.width = image.width + 'px';
      }
    }
  }

  public onMouseLeave(event){
    this.zoomViewer.nativeElement.children[0].style.display = "none";
  }

  public openZoomViewer(){
    this.dialog.open(ProductZoomComponent, {
      data: this.zoomImage,
      panelClass: 'zoom-dialog'
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  } 

  public onSubmit():void {
    if (this.form.valid) {
      this.sub = this.activatedRoute.params.subscribe(params => { 
        let value = 0;
        switch(this.selectedRating) {
          case 1:
            value = 20;
            break;
          case 2:
            value = 40;
            break;
          case 3:
            value = 60;
            break;
          case 4:
            value = 80;
            break;
          case 5:
            value = 100;
            break;
          default:
            break;
        }

        this.form.controls['ratingsValue'].patchValue(value);
        this.form.controls['productId'].patchValue(params['id']);
        this.form.controls['name'].patchValue(this.sanitizer.sanitize(SecurityContext.HTML, this.form.controls['name'].value)),
        this.form.controls['email'].patchValue(this.sanitizer.sanitize(SecurityContext.HTML, this.form.controls['email'].value)),
        this.form.controls['review'].patchValue(this.sanitizer.sanitize(SecurityContext.HTML, this.form.controls['review'].value))

        this.productService.addReview(this.form.value).subscribe(res=>{
          this.ngOnInit();
          console.log("success")
        }); 
      }); 
      //email sent
    }
  }

  setRating(rating: number) {
    this.selectedRating = rating;
    console.log(rating)
  }
  
}