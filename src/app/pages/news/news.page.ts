import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController, ModalController } from '@ionic/angular';
import { NewsService, News } from 'src/app/services/news.service';
import { supabase } from 'src/app/supabase.cliente';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NewNewsPage } from '../new-news/new-news.page';
import { HttpClientModule, HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class NewsPage implements OnInit, OnDestroy {
  noticias: News[] = [];
  noticiasSub?: Subscription;
  username = '';
  avatarUrl = 'https://i.pravatar.cc/150?u=usuario';

  constructor(
    private newsService: NewsService,
    private router: Router,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController
  ) {}

  async ngOnInit() {
    await this.checkUser();
    await this.loadUsername();

    this.noticiasSub = this.newsService.observarNoticias().subscribe(noticias => {
      this.noticias = noticias;
    });
  }

  ngOnDestroy() {
    this.noticiasSub?.unsubscribe();
  }

  async checkUser() {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      this.router.navigate(['/auth']);
    }
  }

  async loadUsername() {
    const { data } = await supabase.auth.getUser();
    this.username = data.user?.user_metadata?.['username'] || 'Anónimo';
    this.avatarUrl = data.user?.user_metadata?.['avatar_url'] || '';
  }

  async logOut() {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      this.router.navigate(['/auth']);
    } else {
      console.error('Error cerrando sesión', error);
    }
  }

  async abrirFormularioNoticia() {
    // const modal = await this.modalCtrl.create({
    //   component: NewNewsPage
    // });
    this.router.navigate(['/new-news']);
    //await modal.present();
  }
}
