import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { supabase } from 'src/app/supabase.cliente';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) {}
  async login(email: string, password: string) {
    return supabase.auth.signInWithPassword({ email, password });
  }

  async register(email: string, password: string, username: string, avatarUrl: string = '') {
    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          email,
          avatar_url: avatarUrl
        }
      }
    });
  }

  async getUser() {
    const { data, error } = await supabase.auth.getUser();
    return error ? null : data.user;
  }

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      this.router.navigate(['/auth']);
    }
    return error;
  }
}
