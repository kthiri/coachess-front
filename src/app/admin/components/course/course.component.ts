import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { FileUpload } from 'primeng/fileupload';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss'],
  providers: [MessageService,ConfirmationService,DatePipe],

})
export class CourseComponent {
  @ViewChild('fileUpload') fileUpload: FileUpload;
  
  uploadedFiles: any[] = [];
  imageBase64:any;
  videoBase64:any;

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

  categories:any[]=[];

  newRecord:boolean=false;
  public colors = ["#5C6BC0","#66BB6A","#EF5350","#BA68C8","#FF4081","#9575CD","#90CAF9","#B2DFDB","#DCE775","#FFD740","#00E676","#FBC02D","#FF7043","#F5F5F5","#696969"];

  public brands=['Ray-Ban','Prada','Gucci','Versace','Carrera','Dior','Lacoste']


  constructor(private productService:ProductService,
    private categoryService:CategoryService,
    private formBuilder:FormBuilder,
    private messageService:MessageService,
    private confirmationService: ConfirmationService,
    private datePipe:DatePipe) { }




  ngOnInit(): void {


    this.productService.getCourses().subscribe(res=>this.records=res);
    // this.categoryService.getCategories().subscribe(res=>this.categories=res);
    this.form=this.formBuilder.group(
      {
        id: [null],
      imageUrl:  [null, Validators.required],
      video:  [null],
      nom: [null, Validators.required],
      prix: [null, Validators.required],
      description: [null, Validators.maxLength(500)],
      duree: [null, Validators.required],
         
      }
    )
  }


  
  editProduct(product: any) {
    this.form.patchValue(product);
    console.log(product);
      // this.customer = { ...product };
      this.createDialog = true;
  }

  
  deleteProduct(product: any,event:any) {
    
    this.confirmationService.confirm({
      target: event.target,
      message: 'Are you sure that you want to proceed?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        
        this.productService.deleteCours(product.id).subscribe(res=>{

          this.messageService.add({severity:'info', summary:'Confirmed', detail:'You have Deleted '+product.nom });

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
    "id":null,
        "imageUrl":null,
        "video":null,
        "nom":null,
        "prix":null,
        "description":null,
        "duree":null,
       

        
   
}
   this.form.patchValue(clietNew)
  //  this.customer.id =null!;
   this.submitted = false;
   this.createDialog = true;
}

onSubmit()
{
 
  this.form.controls['imageUrl'].patchValue(this.imageBase64);
  this.form.controls['video'].patchValue(this.videoBase64);

  var items =[];
  // items.push(this.form.controls['color'].value);
  // this.form.controls['color'].patchValue(items);
  this.productService.addCours(this.form.value).subscribe(res=>{
    console.log("Cours created");
    this.createDialog=false;
    this.ngOnInit();
    // this.messageService.add(:
  })
}

update()
{
  if(this.imageBase64!==undefined)
  {
    this.form.controls['imageUrl'].patchValue(this.imageBase64);
  }
  
  var items =[];
  // items.push(this.form.controls['color'].value);
  // this.form.controls['color'].patchValue(items);
  this.productService.updateCours(this.form.value).subscribe(res=>{
    console.log("Product updated");
    this.createDialog=false;
    this.ngOnInit();
    // this.messageService.add(:
  })
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


onUpload(event) {
  console.log("normal uplado")
  for(let file of event.files) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String: string = reader.result as string;
      this.imageBase64=base64String;
      console.log(this.imageBase64)
      // Do something with the base64String, such as sending it to a server
    };
      // this.uploadedFiles.push(file);
  }

  this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
}

onFileSelected(event: any) {
  console.log("uplading file")
  const file: File = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String: string = reader.result as string;
      this.imageBase64=base64String;
      
      console.log(this.imageBase64)
      // Do something with the base64String, such as sending it to a server
    };
  }
}
onFileSelectedVideo(event: any) {
  console.log("uplading file")
  const file: File = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String: string = reader.result as string;
      this.videoBase64=base64String;
      
      console.log(this.videoBase64)
      // Do something with the base64String, such as sending it to a server
    };
  }
}

}