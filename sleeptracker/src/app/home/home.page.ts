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
  lastDuration = '';
  lastWakeText = '';
  timer = '';
  sinceText = '';

  constructor(private sleepService: SleepService) {
    let savedStart = localStorage.getItem('sleepStart');
    if (savedStart) {
      this.sleepStart = new Date(savedStart);
    }
    let savedWake = localStorage.getItem('lastWake');
    if (savedWake) {
      this.lastDuration = localStorage.getItem('lastDuration') || '';
      this.lastWakeText = localStorage.getItem('lastWakeText') || '';
    }
    this.updateTime();
    setInterval(() => {
      this.updateTime();
    }, 200);
  }

  updateTime() {
    let asleep = this.sleepStart !== null;
    document.body.classList.toggle('asleep', asleep);
    document.body.classList.toggle('awake', !asleep);

    if (this.sleepStart === null) {
    if (this.lastDuration === '') {
      this.timer = '--';
      this.sinceText = 'No sleep logged yet';
    } else {
      this.timer = this.lastDuration;
      this.sinceText = this.lastWakeText;
    }
    return;
  }

  let ms = new Date().getTime() - this.sleepStart.getTime();
  let hours = Math.floor(ms / 3600000);
  let minutes = Math.floor((ms % 3600000) / 60000);
  let seconds = Math.floor((ms % 60000) / 1000);
  this.timer = hours + 'h ' + minutes + 'm ' + seconds + 's';
  this.sinceText = 'Since ' + this.sleepStart.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
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

    let ms = now.getTime() - this.sleepStart.getTime();
    let hours = Math.floor(ms / 3600000);
    let minutes = Math.floor((ms % 3600000) / 60000);
    this.lastDuration = hours + 'h ' + minutes + 'm';
    this.lastWakeText = 'Woke up at ' + now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    localStorage.setItem('lastDuration', this.lastDuration);
    localStorage.setItem('lastWakeText', this.lastWakeText);

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