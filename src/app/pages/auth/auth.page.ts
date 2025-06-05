import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController} from '@ionic/angular';
import {Router} from '@angular/router';
import {supabase} from 'src/app/supabase.cliente';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AuthPage{
  email='';
  password='';
  username='';
  imageUrl='';
  error='';
  isLogin=true;
  isLoading=false;
  constructor(private router: Router, private toastController: ToastController, private authService: AuthService) { }
  async login(){
    if (!this.validateCredentials()) return;
    
    this.isLoading = true;
    const loading = await this.toastController.create({
      message: 'Iniciando sesión...',
      duration: 3000,
      color: 'primary',
      position: 'top'
    });
    await loading.present();
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: this.email,
        password: this.password
      });

      if (error) throw error;
      
      await this.showToast('¡Bienvenido!', 'success');
      this.router.navigate(['/news'], { replaceUrl: true });

      localStorage.setItem('usuario', JSON.stringify({
        username: 'nombre',
        avatar_url: 'url_avatar',
      }));




    } catch (error: any) {
      this.error = this.parseAuthError(error.message);
      await this.showToast(this.error, 'danger');
    } finally {
      this.isLoading = false;
      loading.dismiss();
    }
  }
  async register(avatarUrl: string){
    if (!this.validateCredentials() || !this.username || !avatarUrl) {
      this.error = 'Por favor completa todos los campos';
      await this.showToast(this.error, 'danger');
      return;
    }

    this.isLoading = true;
    try {
      const {error } = await supabase.auth.signUp({
        email: this.email,
        password: this.password,
        options: {
          data: {
            username: this.username,
            imageUrl: this.imageUrl
          }
        }
      });

      if (error) throw error;
      
      await this.showToast('Registro exitoso. Verifica tu email!', 'success');
      this.resetForm();
      this.isLogin = true; // Cambiar a modo login
    } catch (error: any) {
      this.error = this.parseAuthError(error.message);
      await this.showToast(this.error, 'danger');
    } finally {
      this.isLoading = false;
    }
  }
  private validateCredentials(): boolean {
    if (!this.email || !this.password) {
      this.error = 'Email y contraseña son requeridos';
      return false;
    }
    return true;
  }
  private resetForm() {
    this.email = '';
    this.password = '';
    this.username = '';
    this.error = '';
  }
  private async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top'
    });
    await toast.present();
  }
  private parseAuthError(error: string): string {
    const errorMap: Record<string, string> = {
      'Invalid login credentials': 'Credenciales incorrectas',
      'Email not confirmed': 'Confirma tu email primero',
      'User already registered': 'Usuario ya registrado',
      'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres'
    };
    return errorMap[error] || error;
  }
  async getUser(){
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }
    return data.user;
  }
  async logOut(){
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      return;
    }
    this.resetForm();
    this.router.navigate(['/auth']);
  }
  ngOnInit() {
  }
}
