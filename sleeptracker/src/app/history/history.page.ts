import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  IonButton, IonContent, IonIcon, IonItem, IonLabel, IonList,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, chevronDown, chevronUp } from 'ionicons/icons';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { SleepService } from '../services/sleep.service';

@Component({
  selector: 'app-history',
  templateUrl: 'history.page.html',
  styleUrls: ['history.page.scss'],
  imports: [DatePipe, IonButton, IonContent, IonIcon, IonItem, IonLabel, IonList],
})
export class HistoryPage {
  overnight: OvernightSleepData[] = [];
  sleepiness: StanfordSleepinessData[] = [];
  scale = StanfordSleepinessData.ScaleValues;
  levels = [7, 6, 5, 4, 3, 2, 1];

  listOpen = false;
  listTab = 'sleep';

  sleepBars: { label: string; value: string; height: number }[] = [];
  sleepinessBars: { label: string; value: string; height: number }[] = [];
  sleepAverage = '--';
  sleepinessAverage = '--';
  sleepTicks: { label: string; pos: number }[] = [];
  sleepinessTicks: { label: string; pos: number }[] = [];
  sleepinessNote = '';

  editMode = 'edit';
  editType = '';
  editId = '';
  editStart = '';
  editEnd = '';
  editTime = '';
  editRating = 1;
  editError = '';
  confirmingDelete = false;
  editOpen = false;

  constructor(private sleepService: SleepService) {
    addIcons({ add, chevronUp, chevronDown });
  }

  ionViewWillEnter() {
    this.loadLogs();
  }

  ionViewWillLeave() {
    this.listOpen = false;
    this.editType = '';
    this.confirmingDelete = false;
  }

  async loadLogs() {
    let logs = await this.sleepService.getLogs();
    this.overnight = logs.overnight;
    this.sleepiness = logs.sleepiness;
    this.buildCharts();
  }

  buildCharts() {
    let names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let days: { label: string; hours: number; rating: number }[] = [];
    let totalHours = 0;
    let daysWithSleep = 0;
    let totalRating = 0;
    let ratingCount = 0;
    let biggest = 0;

    for (let i = 6; i >= 0; i--) {
      let dayStart = new Date();
      dayStart.setHours(0, 0, 0, 0);
      dayStart.setDate(dayStart.getDate() - i);
      let dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);

      let hours = 0;
      for (let entry of this.overnight) {
        let wake = entry.sleepEnd.getTime();
        if (wake >= dayStart.getTime() && wake < dayEnd.getTime()) {
          hours += (wake - entry.sleepStart.getTime()) / 3600000;
        }
      }

      let ratingSum = 0;
      let ratingNumber = 0;
      for (let entry of this.sleepiness) {
        let time = entry.loggedAt.getTime();
        if (time >= dayStart.getTime() && time < dayEnd.getTime()) {
          ratingSum += entry.loggedValue;
          ratingNumber += 1;
        }
      }

      let average = ratingNumber > 0 ? ratingSum / ratingNumber : 0;
      days.push({ label: names[dayStart.getDay()], hours: hours, rating: average });

      if (hours > biggest) {
        biggest = hours;
      }
      if (hours > 0) {
        totalHours += hours;
        daysWithSleep += 1;
      }
      totalRating += ratingSum;
      ratingCount += ratingNumber;
    }

    let step = biggest > 8 ? 4 : 2;
    let axisMax = Math.max(8, Math.ceil(biggest / step) * step);

    this.sleepTicks = [];
    for (let h = 0; h <= axisMax; h += step) {
      this.sleepTicks.push({ label: String(h), pos: (h / axisMax) * 100 });
    }
    this.sleepinessTicks = [];
    for (let r = 1; r <= 7; r += 2) {
      this.sleepinessTicks.push({ label: String(r), pos: (r / 7) * 100 });
    }

    this.sleepBars = [];
    this.sleepinessBars = [];
    for (let day of days) {
      this.sleepBars.push({
        label: day.label,
        value: day.hours > 0 ? String(Math.round(day.hours * 10) / 10) : '',
        height: (day.hours / axisMax) * 100,
      });
      this.sleepinessBars.push({
        label: day.label,
        value: day.rating > 0 ? String(Math.round(day.rating * 10) / 10) : '',
        height: (day.rating / 7) * 100,
      });
    }

    if (daysWithSleep > 0) {
      let averageHours = totalHours / daysWithSleep;
      let h = Math.floor(averageHours);
      let m = Math.round((averageHours - h) * 60);
      this.sleepAverage = h + 'h ' + m + 'm';
    } else {
      this.sleepAverage = '--';
    }

    if (ratingCount > 0) {
      let avg = totalRating / ratingCount;
      let tier = Math.min(7, Math.max(1, Math.round(avg)));
      this.sleepinessAverage = String(Math.round(avg * 10) / 10);
      this.sleepinessNote = this.scale[tier] || '';
    } else {
      this.sleepinessAverage = '--';
      this.sleepinessNote = 'log how sleepy you feel';
    }
  }

  openList() {
    this.listOpen = true;
  }

  closeList() {
    this.listOpen = false;
  }

  showTab(tab: string) {
    this.listTab = tab;
  }

  toInputText(date: Date): string {
    let shifted = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return shifted.toISOString().slice(0, 16);
  }

  openOvernight(entry: OvernightSleepData) {
    this.editMode = 'edit';
    this.editId = entry.id;
    this.editStart = this.toInputText(entry.sleepStart);
    this.editEnd = this.toInputText(entry.sleepEnd);
    this.editError = '';
    this.editType = 'overnight';
  }

  openSleepiness(entry: StanfordSleepinessData) {
    this.editMode = 'edit';
    this.editId = entry.id;
    this.editRating = entry.loggedValue;
    this.editTime = this.toInputText(entry.loggedAt);
    this.editError = '';
    this.editType = 'sleepiness';
  }

  openAdd() {
    this.editMode = 'add';
    this.editError = '';
    if (this.listTab === 'sleep') {
      let end = new Date();
      let start = new Date(end.getTime() - 8 * 3600000);
      this.editStart = this.toInputText(start);
      this.editEnd = this.toInputText(end);
      this.editType = 'overnight';
    } else {
      this.editRating = 4;
      this.editTime = this.toInputText(new Date());
      this.editType = 'sleepiness';
    }
  }

  closeEditor() {
    this.editType = '';
    this.confirmingDelete = false;
  }

  async save() {
    if (this.editType === 'overnight') {
      let start = new Date(this.editStart);
      let end = new Date(this.editEnd);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        this.editError = 'Pick both times.';
        return;
      }
      if (end.getTime() <= start.getTime()) {
        this.editError = 'Wake-up must be after bedtime.';
        return;
      }
      if (end.getTime() > Date.now()) {
        this.editError = 'Choose times that have already passed.';
        return;
      }
      if (this.editMode === 'add') {
        await this.sleepService.logOvernightData(new OvernightSleepData(start, end));
      } else {
        await this.sleepService.updateOvernight(this.editId, start, end);
      }
    } else {
      let time = new Date(this.editTime);
      if (isNaN(time.getTime())) {
        this.editError = 'Pick a time.';
        return;
      }
      if (time.getTime() > Date.now()) {
        this.editError = 'Choose a time that has already passed.';
        return;
      }
      if (this.editMode === 'add') {
        await this.sleepService.logSleepinessData(new StanfordSleepinessData(this.editRating, time));
      } else {
        await this.sleepService.updateSleepiness(this.editId, this.editRating, time);
      }
    }
    this.closeEditor();
    await this.loadLogs();
  }

  askDelete() {
    this.confirmingDelete = true;
  }

  cancelDelete() {
    this.confirmingDelete = false;
  }

  async deleteEntry() {
    if (this.editType === 'overnight') {
      await this.sleepService.deleteOvernight(this.editId);
    } else {
      await this.sleepService.deleteSleepiness(this.editId);
    }
    this.closeEditor();
    await this.loadLogs();
  }
}