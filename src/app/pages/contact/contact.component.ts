import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { emailValidator } from '../../theme/utils/app-validators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  contactForm: UntypedFormGroup;

  constructor(public formBuilder: UntypedFormBuilder,public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.contactForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, emailValidator])],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      message: ['', Validators.required]
    });
  }

  public onContactFormSubmit(values:Object):void {
    if (this.contactForm.valid) {
      this.snackBar.open('Thank you for you submission !', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
       this.ngOnInit();
      console.log(values);
    }
  }

}
