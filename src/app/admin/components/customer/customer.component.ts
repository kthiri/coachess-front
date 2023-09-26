import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CustomerService } from '../../services/customer.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
  providers: [MessageService,ConfirmationService],

})
export class CustomerComponent implements OnInit {
  displayAddress:boolean=false;
  selectedProduct:any;
  createDialog: boolean = false;

  deleteDialog: boolean = false;

  deleteMultiDialog: boolean = false;

  records: any[] = [];
  selectedItems:any;

  record!:any;
  selectedrecord: any[] = [];

  submitted: boolean = false;

  cols: any[] = [];

  statuses: any[] = [];

  rowsPerPageOptions = [5, 10, 20];

  countries: any[] = [];

  public form!:FormGroup;

  qualified:string='qualified';
  unqualified:string='unqualified';


  newRecord:boolean=true;

  constructor(private customerService:UserService,
    private formBuilder:FormBuilder,
    private messageService:MessageService,
    private confirmationService: ConfirmationService,
    private router:Router) { }




  ngOnInit(): void {


    this.customerService.getClients().subscribe(res => this.records=res)
   
    this.form=this.formBuilder.group(
      {
       
        "id":null,
        "username":[null, Validators.required],
        "nom":[null, Validators.required],
        "prenom":[null, Validators.required],
        "email":[null, [Validators.required, Validators.email]],
        "dateDeNaissance":[null],
        'password': ['', [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Z])/),
          this.passwordValidator
         
        ]],
        // "phone": [null, [Validators.required, Validators.pattern('^[0-9]{10}$')]]
       
         
      }
    )
  }


  passwordValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.value;
    const uppercaseRegex = /^(?=.*[A-Z])/;
    const lowercaseRegex = /^(?=.*[a-z])/;
    const numberRegex = /^(?=.*\d)/;
    const specialCharacterRegex = /^(?=.*[!@#$%^&*])/;
  
    let errors = {};
  
    if (!uppercaseRegex.test(password)) {
      errors['uppercase'] = true;
    }
  
    if (!lowercaseRegex.test(password)) {
      errors['lowercase'] = true;
    }
  
    if (!numberRegex.test(password)) {
      errors['number'] = true;
    }
  
    if (!specialCharacterRegex.test(password)) {
      errors['specialCharacter'] = true;
    }
  
    return Object.keys(errors).length ? { 'pattern': true, ...errors } : null;
  }
  
  editProduct(product: any) {
    this.form.patchValue(product);
    console.log(product);
    this.newRecord=false;
      this.createDialog = true;
  }

  deleteProduct(product: any,event:any) {
    this.confirmationService.confirm({
      target: event.target,
      message: 'Are you sure that you want to proceed?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        
        this.customerService.deleteUser(product.id).subscribe(res=>{

          this.messageService.add({severity:'info', summary:'Confirmed', detail:'You have Deleted '+product.username });

          this.ngOnInit();
        })
          // this.messageService.add({severity:'info', summary:'Confirmed', detail:'You have Deleted '+this.selectedItems.length+' Items' });

      },
      reject: () => {
          this.messageService.add({severity:'error', summary:'Rejected', detail:'You have rejected'});
      }
  });
}

hideDialog() {
   
  this.createDialog = false;
  this.submitted = false;
}

openNew() { 
  const clietNew= 
  {
     "id":null,

    "firstName":null,
        "lastName":null,
        "email":null,
        "password":null,
        // "phone":null
       
    
   
}
   this.form.patchValue(clietNew)
  //  this.customer.id =null!;
   this.submitted = false;
   this.createDialog = true;
}

onSubmit()
{
  if(this.form.valid)
  {
      const firstName=this.form.controls['nom'].value
      const lastName=this.form.controls['prenom'].value
      const password=this.form.controls['password'].value
    if(password.includes(firstName) || password.includes(lastName))
      {
        this.messageService.add({severity:'error', summary:'Password Must not Contains your Name!', detail:''});
      }else 
      {
        this.customerService.register(this.form.value).subscribe(res=>{
          console.log("Customer created");
          this.messageService.add({severity:'success', summary:'Customer Created', detail:''});
    
          this.createDialog=false;
          this.ngOnInit();
          // this.messageService.add(:
        },error=>{
          console.log(error)
          this.messageService.add({severity:'error', summary:error.error.message, detail:''});
        })
      }
      }
  
}
update()
{
  if(this.form.valid)
  {
    this.customerService.updateUser(this.form.controls['id'].value,this.form.value).subscribe(res=>{
      console.log("Customer Updated");
      this.messageService.add({severity:'success', summary:'Customer Updated', detail:''});

      this.createDialog=false;
      this.ngOnInit();
      // this.messageService.add(:
    })
  }
}
confirmDelete(event: any) {
  var items: any[]=[];
  
  this.confirmationService.confirm({
      target: event.target,
      message: 'Are you sure that you want to proceed?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        for(let i=0 ;i<this.selectedItems.length;i++)
        {
          var id=this.selectedItems[i].id;
          items.push(id);
          
        }
        var request={ids:items}
        console.log(request)
        // this.customerService.DeleteCustomer(request).subscribe(res=>{

        //   this.messageService.add({severity:'info', summary:'Confirmed', detail:'You have Deleted '+this.selectedItems.length+' Items' });

        //   this.ngOnInit();
        // })
          // this.messageService.add({severity:'info', summary:'Confirmed', detail:'You have Deleted '+this.selectedItems.length+' Items' });

      },
      reject: () => {
          this.messageService.add({severity:'error', summary:'Rejected', detail:'You have rejected'});
      }
  });
}

showAdress(product:any)
{
  this.selectedProduct=product.id
  this.displayAddress=true;
}




}
