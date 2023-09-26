import { User } from "./user";

export class Order {
    private id!:number;
    private orderTrackingNumber!:string;
    private totalQuantity!:number;
    private totalPrice!:number;
    private status!:string;
    private paymentMethod!:string;
    private dateCreated!:Date;
    private lastUpdated!:Date;
    private orderItems!:OrderItem[];
    private customer!:User;
    private shippingAddress:any;
    private billingAddress:any;

}
export class OrderItem {
    private id!:number;
    private image!:string;
    private unitPrice!:number;
    private quantity!:number;
    private name!:string;

}
