import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { AlertController, LoadingController } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule
  ]
})
export class LoginPage {

  private fb = inject(FormBuilder);
  private loadingController = inject(LoadingController);
  private alertController = inject(AlertController);
  private authService = inject(AuthService);
  private router = inject(Router);

  credentials = this.fb.nonNullable.group({
    email: ['g00438454@atu.ie', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor() { }

  get email() {
    return this.credentials.controls.email;
  }

  get password() {
    return this.credentials.controls.password;
  }

  async register(){
    const loading = await this.loadingController.create();
    await loading.present();

    const user = await this.authService.register(
      this.credentials.getRawValue()
    );

    console.log(
      '🚀 ~ file: login.page.ts:50 ~ LoginPage ~ register ~ user',
      user
    );

    await loading.dismiss();

    if (user){
      this.router.navigateByUrl('/home', { replaceUrl: true });
    }else {
      this.showAlert('Registration failed', 'Please try again');
    }
  }

  async showAlert(header: string, message: string){
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

}
