import { Component, OnInit, SecurityContext } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { emailValidator, matchingPasswords } from '../../../theme/utils/app-validators';
import { AppService } from 'src/app/app.service';
import { CustomerService } from '../services/customer.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss']
})
export class InformationComponent implements OnInit {
  infoForm: UntypedFormGroup;
  passwordForm: UntypedFormGroup;
  constructor(public formBuilder: UntypedFormBuilder, 
    public snackBar: MatSnackBar,
    public appService:AppService,
    private customerService:CustomerService,
    private sanitizer:DomSanitizer) { }

  ngOnInit() {

    var userInfo={
      firstName:this.appService.user.firstName,
      lastName:this.appService.user.lastName,
      email:this.appService.user.email
    }
    this.infoForm = this.formBuilder.group({
      'firstName': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      'lastName': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      'email': ['', Validators.compose([Validators.required, emailValidator])]
    });

    this.infoForm.patchValue(userInfo);

    this.passwordForm = this.formBuilder.group({
      'currentPassword': ['', Validators.required],
      'password': ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])/),
        this.passwordValidator
       
      ]],
      'confirmNewPassword': ['', Validators.required]
    },{validator: matchingPasswords('password', 'confirmNewPassword')});
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
  
  public onInfoFormSubmit(values:Object):void {
    if (this.infoForm.valid) {

      var sanitizedForm={
        firstName:this.sanitizer.sanitize(SecurityContext.HTML, this.infoForm.controls['firstName'].value),
        lastName:this.sanitizer.sanitize(SecurityContext.HTML, this.infoForm.controls['lastName'].value),
        email:this.sanitizer.sanitize(SecurityContext.HTML, this.infoForm.controls['email'].value),
      }
      this.customerService.updateInfo(sanitizedForm).subscribe(res=>{
        console.log("infos updated");
        localStorage.setItem("user",JSON.stringify(res));
        this.snackBar.open('Your account information updated successfully!', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
        this.appService.getUser();
        this.ngOnInit();
      })
    }
  }

  public onPasswordFormSubmit(values:Object):void {
    if (this.passwordForm.valid) {
      
      // this.passwordForm.removeControl('confirmNewPassword');
      var request={
        email:this.infoForm.controls['email'].value,
        currentPassword:this.passwordForm.controls['currentPassword'].value,
        password:this.passwordForm.controls['password'].value,
      }
      this.customerService.updatePassword(request).subscribe(res=>{
        console.log("password updated");
        this.snackBar.open('Your password changed successfully!', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
        this.ngOnInit();
      })
    }
  }

}
