import { Component, OnDestroy, OnInit, SecurityContext, ViewChild } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { AbstractControl, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { filter, map, Subscription } from 'rxjs';
import { AppService } from '../../app.service';
import { CheckoutService } from 'src/app/admin/services/checkout.service';
import { DomSanitizer } from '@angular/platform-browser';
import { emailValidator } from 'src/app/theme/utils/app-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  @ViewChild('horizontalStepper') horizontalStepper: MatStepper;
  stepperOrientation: 'horizontal' | 'vertical' = "horizontal";
  billingForm: UntypedFormGroup;
  deliveryForm: UntypedFormGroup;
  paymentForm: UntypedFormGroup;
  countries = [];
  months = [];
  years = [];
  deliveryMethods = [];
  grandTotal = 0;
  watcher: Subscription;

  constructor(public appService:AppService, 
    public formBuilder: UntypedFormBuilder, 
    public mediaObserver: MediaObserver,
    private checkoutService:CheckoutService,
    public sanitizer: DomSanitizer) {
    this.watcher = mediaObserver.asObservable()
    .pipe(filter((changes: MediaChange[]) => changes.length > 0), map((changes: MediaChange[]) => changes[0]))
    .subscribe((change: MediaChange) => {
      if (change.mqAlias == 'xs') {
        this.stepperOrientation = 'vertical';
      }
      else if(change.mqAlias == 'sm'){
        this.stepperOrientation = 'vertical';
      }
      else if(change.mqAlias == 'md'){
        this.stepperOrientation = 'horizontal';
      }
      else{
        this.stepperOrientation = 'horizontal';
      }
    });
  }

  ngOnInit() {    
    this.appService.Data.cartList.forEach(product=>{
      this.grandTotal += product.cartCount*product.prix;
    });
    this.countries = this.appService.getCountries();
    this.months = this.appService.getMonths();
    this.years = this.appService.getYears();
    this.deliveryMethods = this.appService.getDeliveryMethods();
    this.billingForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      middleName: '',
      company: '',
      email: ['', Validators.compose([Validators.required, emailValidator])],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      country: ['', Validators.required],
      city: ['', Validators.required],
      state: '',
      zip: ['', Validators.required],
      address: ['', Validators.required]
    });
    this.deliveryForm = this.formBuilder.group({
      deliveryMethod: [this.deliveryMethods[0], Validators.required]
    });


    
    
    this.paymentForm = this.formBuilder.group({
      cardHolderName: ['', Validators.required],
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      expiredMonth: ['', [Validators.required]],
      expiredYear: ['', [Validators.required]],
      cvv: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{3,4}$') // 3-4 digits CVV pattern
      ]]
    }, { validator: this.checkExpiry });
    
 
  }

   expiryDate() {
    const today = new Date();
    const expiryDate = new Date(this.paymentForm.controls.expiredYear.value, this.paymentForm.controls.expiredMonth.value - 1, 1);
  
    if (expiryDate < today) {
      this.paymentForm.controls.cvv.setErrors({ expiryDate: true });
    } else {
      this.paymentForm.controls.cvv.setErrors(null);
    }
  
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
  
      const [month, year] = value.split('/');
      const inputDate = new Date(Number(`20${year}`), Number(month) - 1, 1);
      const isValid = inputDate > today && inputDate < expiryDate;
      return isValid ? null : { expiryDate: true };
    };
  }

  checkExpiry(group: FormGroup) {
    const expirationYear = group.get('expiredYear').value;
    const expirationMonth = group.get('expiredMonth').value;
    const expirationDate = new Date(expirationYear, expirationMonth, 0);
    const currentDate = new Date();
    if (expirationDate < currentDate) {
      return { checkExpiry: true };
    }
    return null;
  }
  

  ngOnDestroy() { 
    this.watcher.unsubscribe();
  } 

  public placeOrder(){

    const cardHolderNameControl = this.paymentForm.get('cardHolderName');
    const sanitizedCardHolderName = this.sanitizer.sanitize(SecurityContext.HTML, cardHolderNameControl.value);
cardHolderNameControl.setValue(sanitizedCardHolderName);

    //order
    const quantity=this.appService.Data.totalCartCount;
    const totalPrice=this.appService.Data.totalPrice;
    const status="Pending";
    const paymentMethod="MasterCard";
    
    var order={
      totalQuantity:quantity,
      totalPrice:totalPrice,
      status:status,
      paymentMethod:paymentMethod
    }

    //billingAddress
    const addressLine=this.sanitizer.sanitize(SecurityContext.HTML, this.billingForm.controls['address'].value);
    // const addressLine=this.billingForm.controls['address'].value;
    // const place=this.billingForm.controls['address'].value
    const city=this.sanitizer.sanitize(SecurityContext.HTML, this.billingForm.controls['city'].value)
    const country=this.billingForm.controls['country'].value
    const postalCode=this.sanitizer.sanitize(SecurityContext.HTML, this.billingForm.controls['zip'].value)

    var billingAddress={
      addressLine:addressLine,
      place:addressLine,
      city:city,
      country:country.name,
      postalCode:postalCode,
    }

    //orderItems
    var items=[]
    for(let i=0;i<this.appService.Data.cartList.length;i++)
    {
      var item =this.appService.Data.cartList[i]
      var orderItem={
        productId:item.id,
        quantity:item.cartCount,
        name:item.name,
        unitPrice:item.newPrice,
        image:item.image
      }
      items.push(orderItem);
    }

    //customer
    var customer={
      firstName:this.sanitizer.sanitize(SecurityContext.HTML, this.billingForm.controls['firstName'].value),
      lastName:this.sanitizer.sanitize(SecurityContext.HTML, this.billingForm.controls['lastName'].value),
      email:this.sanitizer.sanitize(SecurityContext.HTML, this.billingForm.controls['email'].value),
      phone:this.sanitizer.sanitize(SecurityContext.HTML, this.billingForm.controls['phone'].value)
    }

    var request={order:order,billingAddress:billingAddress,shippingAddress:billingAddress,orderItems:items,customer:customer}

    this.checkoutService.placeOrder(request).subscribe(res=>{
      console.log("checkout Success")

       this.horizontalStepper._steps.forEach(step => step.editable = false);
    this.appService.Data.cartList.length = 0;    
    this.appService.Data.totalPrice = 0;
    this.appService.Data.totalCartCount = 0;

    })

   
  }

  getLastDigits():string
  {
    const cardNumber = this.paymentForm.controls['cardNumber'].value;
    const lastFourDigits = cardNumber.substr(-4);
    return lastFourDigits;
  }
}
