import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel,
  IonList, IonTitle, IonToolbar,
} from '@ionic/angular/standalone';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { SleepService } from '../services/sleep.service';

@Component({
  selector: 'app-history',
  templateUrl: 'history.page.html',
  styleUrls: ['history.page.scss'],
  imports: [
    DatePipe, IonBackButton, IonButton, IonButtons, IonContent, IonHeader,
    IonItem, IonLabel, IonList, IonTitle, IonToolbar,
  ],
})
export class HistoryPage {
  overnight: OvernightSleepData[] = [];
  sleepiness: StanfordSleepinessData[] = [];
  loading = true;
  loadFailed = false;

  constructor(private sleepService: SleepService) {}

  ionViewWillEnter() {
    this.loadLogs();
  }

  async loadLogs() {
    this.loading = true;
    this.loadFailed = false;
    try {
      const logs = await this.sleepService.getLogs();
      this.overnight = logs.overnight;
      this.sleepiness = logs.sleepiness;
    } catch {
      this.loadFailed = true;
    } finally {
      this.loading = false;
    }
  }
}
