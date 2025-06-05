import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, Timestamp, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import {environment} from 'src/environments/environment';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {Observable} from 'rxjs'
const app= initializeApp(environment.firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
export interface News{
  id?: string;
  titulo: string;
  contenido: string;
  autor: string;
  avatarUrl: string;
  imagenUrl?: string;
  lat?: number;
  lng?: number;
  apiInfo?: string;
  fecha: Date;
}
@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor() { }
  async agregarNoticia(noticia: Omit<News, 'id'>) {
    const docRef = await addDoc(collection(db, 'noticias'), {
      ...noticia,
      fecha: Timestamp.fromDate(noticia.fecha)
    });
    return docRef.id;
  }
  async obtenerNoticias(): Promise<News[]> {
    const noticiasCol = collection(db, 'noticias');
    const q = query(noticiasCol, orderBy('fecha', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as News));
  }
  async subirImagen(file: File): Promise<string> {
    const filePath = `noticias/${Date.now()}_${file.name}`;
    const fileRef = ref(storage, filePath);
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
  }

  async editarNoticia(id: string, cambios: Partial<News>) {
    const noticiaRef = doc(db, 'noticias', id);
    await updateDoc(noticiaRef, cambios);
  }

  observarNoticias(): Observable<News[]> {
  return new Observable(observer => {
    const q = query(collection(db, 'noticias'), orderBy('fecha', 'desc'));
    const unsubscribe = onSnapshot(q, snapshot => {
      const noticias = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as News));
      observer.next(noticias);
    }, error => {
      observer.error(error);
    });

    return () => unsubscribe();
  });
}
}
