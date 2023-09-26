import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  providers: [MessageService,ConfirmationService],

})
export class CategoryComponent implements OnInit {

 
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


  newRecord:boolean=false;

  constructor(private categoryService:CategoryService,
    private formBuilder:FormBuilder,
    private messageService:MessageService,
    private confirmationService: ConfirmationService,
    private router:Router) { }




  ngOnInit(): void {

    this.categoryService.getCategories().subscribe(res=>this.records=res);


    this.form=this.formBuilder.group(
      {
        "id":null,
        "name":[null, Validators.required],
        "description":null
         
      }
    )
  }

  editProduct(product: any) {
    this.form.patchValue(product);
    console.log(product);
    this.newRecord=false;
      // this.customer = { ...product };
      this.createDialog = true;
  }

  deleteProduct(product: any,event:any) {
    
    this.confirmationService.confirm({
      target: event.target,
      message: 'Are you sure that you want to proceed?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        
        this.categoryService.deleteCategory(product.id).subscribe(res=>{

          this.messageService.add({severity:'info', summary:'Confirmed', detail:'You have Deleted '+product.name });

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
  this.newRecord=true;
  const clietNew= 
  {
    "name":null,
    "description":null  
   
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
    this.categoryService.addCategory(this.form.value).subscribe(res=>{
      console.log("Category created");
      this.createDialog=false;
      this.ngOnInit();
      // this.messageService.add(:
    })
  }
  
}

update()
{
  if(this.form.valid)
  {
    this.categoryService.updateCategory(this.form.controls['id'].value,this.form.value).subscribe(res=>{
      console.log("Category updated");
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






}
