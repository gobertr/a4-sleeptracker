import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  IonButton, IonContent, IonDatetime, IonHeader, IonItem, IonLabel, IonList,
  IonModal, IonTitle, IonToolbar,
} from '@ionic/angular/standalone';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { SleepService } from '../services/sleep.service';

type SleepField = 'bedtime' | 'wakeUp';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    DatePipe, IonButton, IonContent, IonDatetime, IonHeader, IonItem, IonLabel,
    IonList, IonModal, IonTitle, IonToolbar,
  ],
})
export class HomePage {
  bedtime: Date | null = null;
  wakeUp: Date | null = null;
  lastSaved: OvernightSleepData | null = null;

  pickerField: SleepField | null = null;
  pickerValue = '';
  pickerMax = '';
  pickerError = '';

  constructor(private sleepService: SleepService) {}

  get pickerTitle(): string {
    return this.pickerField === 'bedtime' ? 'Choose bedtime' : 'Choose wake-up time';
  }

  get timeError(): string {
    const now = Date.now();

    if (this.pickerError) {
      return this.pickerError;
    }
    if ((this.bedtime && this.bedtime.getTime() > now) ||
        (this.wakeUp && this.wakeUp.getTime() > now)) {
      return 'Choose times that have already passed.';
    }
    if (this.bedtime && this.wakeUp && this.wakeUp <= this.bedtime) {
      return 'Wake-up time must be after bedtime.';
    }
    return '';
  }

  get duration(): string | null {
    if (!this.bedtime || !this.wakeUp || this.timeError) {
      return null;
    }
    return OvernightSleepData.formatDuration(this.bedtime, this.wakeUp);
  }

  openPicker(field: SleepField) {
    const now = new Date();
    const defaultTime = new Date(now);
    if (field === 'bedtime') {
      defaultTime.setDate(defaultTime.getDate() - 1);
      defaultTime.setHours(23, 0, 0, 0);
    }

    this.pickerMax = this.localDateTime(now).slice(0, 10);
    this.pickerValue = this.localDateTime(this[field] ?? defaultTime);
    this.pickerField = field;
  }

  setPickedTime(value: string | string[] | null | undefined) {
    const field = this.pickerField;
    if (!field || typeof value !== 'string') {
      return;
    }

    const time = new Date(value);
    // A skipped hour during daylight saving time can make Date roll the time forward.
    if (Number.isNaN(time.getTime()) || this.localDateTime(time) !== value.slice(0, 16)) {
      this[field] = null;
      this.pickerError = 'That time is unavailable. Choose another time.';
      return;
    }

    this[field] = time;
    this.pickerError = '';
  }

  saveSleep() {
    if (!this.bedtime || !this.wakeUp || this.timeError) {
      return;
    }

    const entry = new OvernightSleepData(this.bedtime, this.wakeUp);
    this.sleepService.logOvernightData(entry);
    this.lastSaved = entry;
    this.bedtime = null;
    this.wakeUp = null;
  }

  private localDateTime(date: Date): string {
    // Ionic's picker expects the date and time as they appear on the user's clock.
    const localTime = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
    return localTime.toISOString().slice(0, 16);
  }
}
