import { Component } from '@angular/core';
import { IonButton, IonContent } from '@ionic/angular/standalone';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { SleepService } from '../services/sleep.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonButton, IonContent],
})
export class HomePage {
  sleepStart: Date | null = null;
  lastWake: Date | null = null;
  timer = '--';
  sinceText = '';

  constructor(private sleepService: SleepService) {
    let savedStart = localStorage.getItem('sleepStart');
    if (savedStart) {
      this.sleepStart = new Date(savedStart);
    }
    let savedWake = localStorage.getItem('lastWake');
    if (savedWake) {
      this.lastWake = new Date(savedWake);
    }
    this.updateTime();
    setInterval(() => {
      this.updateTime();
    }, 1000);
  }

  updateTime() {
    let since = this.sleepStart;
    if (since === null) {
      since = this.lastWake;
    }
    if (since === null) {
      this.timer = '--';
      this.sinceText = 'No sleep logged yet';
      return;
    }
    let ms = new Date().getTime() - since.getTime();
    let hours = Math.floor(ms / 3600000);
    let minutes = Math.floor((ms % 3600000) / 60000);
    let seconds = Math.floor((ms % 60000) / 1000);
    this.timer = hours + 'h ' + minutes + 'm ' + seconds + 's';
    this.sinceText = 'Since ' + since.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }

  toggleSleep() {
    if (this.sleepStart === null) {
      this.goToSleep();
    } else {
      this.wakeUp();
    }
  }

  goToSleep() {
    this.sleepStart = new Date();
    localStorage.setItem('sleepStart', this.sleepStart.toISOString());
    this.updateTime();
  }

  async wakeUp() {
    if (this.sleepStart === null) {
      return;
    }
    let now = new Date();
    let entry = new OvernightSleepData(this.sleepStart, now);
    await this.sleepService.logOvernightData(entry);
    this.lastWake = now;
    localStorage.setItem('lastWake', now.toISOString());
    this.sleepStart = null;
    localStorage.removeItem('sleepStart');
    this.updateTime();
  }

  cancelSleep() {
    this.sleepStart = null;
    localStorage.removeItem('sleepStart');
    this.updateTime();
  }
}