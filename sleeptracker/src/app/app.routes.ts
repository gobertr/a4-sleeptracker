import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tabs',
    loadComponent: () => import('./tabs/tabs.page').then((m) => m.TabsPage),
    children: [
      {
        path: 'history',
        loadComponent: () => import('./history/history.page').then((m) => m.HistoryPage),
      },
      {
        path: 'sleep',
        loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'sleepiness',
        loadComponent: () => import('./sleepiness/sleepiness.page').then((m) => m.SleepinessPage),
      },
      {
        path: '',
        redirectTo: 'sleep',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'tabs/sleep',
    pathMatch: 'full',
  },
];