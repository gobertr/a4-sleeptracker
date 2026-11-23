import { Component } from '@angular/core';
import {
  IonButton, IonContent, IonHeader, IonTitle, IonToolbar, ToastController,
} from '@ionic/angular/standalone';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { SleepService } from '../services/sleep.service';

@Component({
  selector: 'app-sleepiness',
  templateUrl: 'sleepiness.page.html',
  styleUrls: ['sleepiness.page.scss'],
  imports: [IonButton, IonContent, IonHeader, IonTitle, IonToolbar],
})
export class SleepinessPage {
  scale = StanfordSleepinessData.ScaleValues; // indexed 1-7 (index 0 is empty)
  levels = [7, 6, 5, 4, 3, 2, 1];             // your design shows 7 at the top
  rating: number | null = null;
  saving = false;
  failed = false;

  constructor(private sleepService: SleepService, private toast: ToastController) {}

  async save() {
    if (this.saving || this.rating === null) return;

    this.saving = true;
    this.failed = false;
    try {
      // "When they felt this way" is required by the assignment, so we log the current time.
      await this.sleepService.logSleepinessData(new StanfordSleepinessData(this.rating, new Date()));
      this.rating = null;
      const t = await this.toast.create({
        message: 'Sleepiness saved',
        duration: 1800,
        position: 'top',
      });
      await t.present();
    } catch {
      this.failed = true;
    } finally {
      this.saving = false;
    }
  }
}