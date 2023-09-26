import { Component, OnInit, SecurityContext } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { emailValidator, matchingPasswords } from '../../theme/utils/app-validators';
import { AuthService } from 'src/app/admin/services/auth.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { AppService } from 'src/app/app.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  loginForm: UntypedFormGroup;
  registerForm: UntypedFormGroup;
  private isFirstVisit = true;

  constructor(public formBuilder: UntypedFormBuilder,
    public appService:AppService,
    public router:Router,
    public snackBar: MatSnackBar,
    private loginService:AuthService,
    private sanitizer:DomSanitizer) { }

  ngOnInit() {
    this.appService.Data.isLoggedIn=false;
    this.loginService.logOut();
    // this.refreshPage();
    this.loginForm = this.formBuilder.group({
      'username': ['', Validators.compose([Validators.required])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(8)])]
    });



    this.registerForm = this.formBuilder.group({
      'firstName': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      'lastName': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      'email': ['', Validators.compose([Validators.required, emailValidator])],
      'dateDeNaissance':[],
      'password': ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])/),
        this.passwordValidator

      ]],
      'confirmPassword': ['', Validators.required]
    },{validator: matchingPasswords('password', 'confirmPassword')});

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

  refreshPage(): void {
    location.reload();
  }
  public onLoginFormSubmit(values:Object):void {
    if (this.loginForm.valid) {
      this.loginService.login(this.loginForm.value).subscribe(
        (response: any) => {
          console.log(response)
          console.log(response)
          this.snackBar.open('Login Successful ', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
        this.loginService.addUserToLocalCache(response.user);
        this.loginService.saveToken(response.token);
        this.appService.Data.isLoggedIn=true;
        this.appService.isAdmin();
        this.appService.getUser();
        this.router.navigate(['/']);
      }
      ,
      (errorResponse: HttpErrorResponse) => {
        this.snackBar.open('Login Failed !', '×', { panelClass: 'error', verticalPosition: 'top', duration: 3000 });
        this.router.navigate(['/sign-in']);
      }
      )

    }
  }


  public onRegisterFormSubmit(values:Object):void {
    if (this.registerForm.valid) {
      const firstName=this.registerForm.controls['firstName'].value
      const lastName=this.registerForm.controls['lastName'].value
      const password=this.registerForm.controls['password'].value
      if(password.includes(firstName) || password.includes(lastName))
      {
        this.snackBar.open('Password Must not Contains your Name!', '×', { panelClass: 'error', verticalPosition: 'top', duration: 3000 });

      }else
      {
        var sanitizedForm={
          firstName:this.sanitizer.sanitize(SecurityContext.HTML, this.registerForm.controls['firstName'].value),
          lastName:this.sanitizer.sanitize(SecurityContext.HTML, this.registerForm.controls['LastName'].value),
          email:this.sanitizer.sanitize(SecurityContext.HTML, this.registerForm.controls['email'].value),
          password:this.registerForm.controls['password'].value
        }
        this.loginService.register(sanitizedForm).subscribe(
          (response: HttpResponse<any>) => {
            this.snackBar.open('Sign Up  Successful You can Sign In Now!', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });

          this.router.navigate(['/sign-in']);
        }
        ,
        (errorResponse: HttpErrorResponse) => {
          this.snackBar.open('Sign Up Failed Please Try Again!', '×', { panelClass: 'error', verticalPosition: 'top', duration: 3000 });
          this.router.navigate(['/sign-in']);
        }
        )
      }


    }
  }

}
