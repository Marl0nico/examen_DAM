import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadComponent: () => import('./pages/auth/auth.page').then( m => m.AuthPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'news',
    loadComponent: () => import('./pages/news/news.page').then( m => m.NewsPage)
  },
  {
    path: 'new-news',
    loadComponent: () => import('./pages/new-news/new-news.page').then( m => m.NewNewsPage)
  },
  
  
];
