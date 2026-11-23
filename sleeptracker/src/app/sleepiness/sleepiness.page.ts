import { Component } from '@angular/core';
import { IonButton, IonContent } from '@ionic/angular/standalone';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { SleepService } from '../services/sleep.service';

@Component({
  selector: 'app-sleepiness',
  templateUrl: 'sleepiness.page.html',
  styleUrls: ['sleepiness.page.scss'],
  imports: [IonButton, IonContent],
})
export class SleepinessPage {
  scale = StanfordSleepinessData.ScaleValues;
  levels = [7, 6, 5, 4, 3, 2, 1];
  rating: number | null = null;
  message = '';

  constructor(private sleepService: SleepService) {}

  async save() {
    if (this.rating === null) {
      return;
    }
    let entry = new StanfordSleepinessData(this.rating, new Date());
    await this.sleepService.logSleepinessData(entry);
    this.rating = null;
    this.message = 'Sleepiness saved';
  }
}