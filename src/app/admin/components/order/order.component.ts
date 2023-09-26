import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { OrderService } from '../../services/order.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  providers: [MessageService,ConfirmationService,DatePipe],

})
export class OrderComponent implements OnInit {

  displayCustomer:boolean=false;
  displayAddress:boolean=false;
  displayOrderItems:boolean=false;
  createDialog: boolean = false;
  selectedProduct:any;
  product:any;

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
 
  orderStatus=['Pending','Processing','In Delivery','Delivered','Completed','Rejected']

  selectedStatus:any;
  selectedOrder:any;
  
  newRecord:boolean=true;

  constructor(private orderService:OrderService,
    private formBuilder:FormBuilder,
    private messageService:MessageService,
    private confirmationService: ConfirmationService,
    private datePipe:DatePipe) { }




  ngOnInit(): void {
  
    this.orderService.getOrders().subscribe(res=>this.records=res);

  }

  editProduct(product: any) {
    this.form.patchValue(product);
    console.log(product);
      // this.customer = { ...product };
      this.selectedOrder=product.id;
      this.createDialog = true;
  }

  deleteProduct(product: any,event:any) {
    this.confirmationService.confirm({
      target: event.target,
      message: 'Are you sure that you want to proceed?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        
        this.orderService.deleteOrder(product.id).subscribe(res=>{

          this.messageService.add({severity:'info', summary:'Confirmed', detail:'You have Deleted '+product.id });

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


onSubmit()
{
  console.log("update yes")
  // if(this.selectedOrder!=null && this.selectedStatus!=null)
  
    this.orderService.updateOrderStatus(this.selectedOrder,this.selectedStatus).subscribe(res=>{
      
      this.messageService.add({severity:'success', summary:'Confirmed', detail:'Order Status Updated' });
      console.log("updated yess");
      this.hideDialog();
    });
  
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
showItems(product:any)
{
  this.selectedProduct=product.id
  this.displayOrderItems=true;
}

showCustomer(product:any)
{
  this.selectedProduct=product.id
  this.displayCustomer=true;
}
}
