import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, ToastController} from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NewsService } from 'src/app/services/news.service';
import { supabase } from 'src/app/supabase.cliente';

@Component({
  selector: 'app-new-news',
  templateUrl: './new-news.page.html',
  styleUrls: ['./new-news.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule]
})
export class NewNewsPage implements OnInit {
  titulo = '';
  contenido = '';
  imagenFile?: File;
  imagenUrl = '';
  lat?: number;
  lng?: number;
  apiInfo = '';
  username = '';
  avatarUrl = 'https://i.pravatar.cc/150?u=default';
  loading = false;
  constructor(
    private newsService: NewsService,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private http: HttpClient
  ) { }


  async ionViewWillEnter() {
    const { data } = await supabase.auth.getUser();
    const user = data.user;
    this.username = user?.user_metadata?.['username'] || 'Anónimo';
    this.avatarUrl = user?.user_metadata?.['avatar_url'] || this.avatarUrl;
  }

  seleccionarImagen(event: any) {
    this.imagenFile = event.target.files[0];
  }

  async capturarUbicacion() {
    const position = await Geolocation.getCurrentPosition();
    this.lat = position.coords.latitude;
    this.lng = position.coords.longitude;
  }

  async consultarApiPublica() {
    const res = await this.http.get<any>('https://api.chucknorris.io/jokes/random').toPromise();
    this.apiInfo = res.value;
  }

  async publicar() {
    this.loading = true;
    let imagenUrl = '';

    if (this.imagenFile) {
      imagenUrl = await this.newsService.subirImagen(this.imagenFile);
    }

    await this.newsService.agregarNoticia({
      titulo: this.titulo,
      contenido: this.contenido,
      autor: this.username,
      avatarUrl: this.avatarUrl,
      imagenUrl,
      lat: this.lat,
      lng: this.lng,
      apiInfo: this.apiInfo,
      fecha: new Date()
    });

    const toast = await this.toastCtrl.create({
      message: 'Noticia publicada con éxito',
      duration: 2000,
      color: 'success'
    }).then(toast => toast.present());
  
    this.modalCtrl.dismiss(true); // cerrar modal y devolver respuesta
  }

  cerrarModal() {
    this.modalCtrl.dismiss(false);
  }
  ngOnInit() {
  }

}
