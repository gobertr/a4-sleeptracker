import { Injectable } from '@angular/core';
import { Drivers, Storage } from '@ionic/storage';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';

type SavedOvernight = {
  id: string;
  sleepStart: string;
  sleepEnd: string;
  loggedAt: string;
};

type SavedSleepiness = {
  id: string;
  rating: number;
  loggedAt: string;
};

@Injectable({
  providedIn: 'root',
})
export class SleepService {
  private storage = new Storage({
    name: 'sleeptracker',
    driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
  });
  private openingStorage?: Promise<Storage>;

  private openStorage() {
    if (!this.openingStorage) {
      this.openingStorage = this.storage.create().catch(error => {
        this.openingStorage = undefined;
        throw error;
      });
    }
    return this.openingStorage;
  }

  async logOvernightData(entry: OvernightSleepData) {
    const storage = await this.openStorage();
    // Each log gets its own key, so a new save leaves the earlier entries in place.
    const saved: SavedOvernight = {
      id: entry.id,
      sleepStart: entry.sleepStart.toISOString(),
      sleepEnd: entry.sleepEnd.toISOString(),
      loggedAt: entry.loggedAt.toISOString(),
    };
    await storage.set('overnight-' + entry.id, saved);
  }

  async logSleepinessData(entry: StanfordSleepinessData) {
    const storage = await this.openStorage();
    const saved: SavedSleepiness = {
      id: entry.id,
      rating: entry.loggedValue,
      loggedAt: entry.loggedAt.toISOString(),
    };
    await storage.set('sleepiness-' + entry.id, saved);
  }

  async getLogs() {
    const storage = await this.openStorage();
    const overnight: OvernightSleepData[] = [];
    const sleepiness: StanfordSleepinessData[] = [];

    // Turn the saved date strings back into Dates for the model methods and the history page.
    await storage.forEach((value, key) => {
      if (key.startsWith('overnight-')) {
        const saved: SavedOvernight = value;
        const entry = new OvernightSleepData(new Date(saved.sleepStart), new Date(saved.sleepEnd));
        entry.id = saved.id;
        entry.loggedAt = new Date(saved.loggedAt);
        overnight.push(entry);
      } else if (key.startsWith('sleepiness-')) {
        const saved: SavedSleepiness = value;
        const entry = new StanfordSleepinessData(saved.rating, new Date(saved.loggedAt));
        entry.id = saved.id;
        sleepiness.push(entry);
      }
    });

    overnight.sort((a, b) => b.sleepStart.getTime() - a.sleepStart.getTime());
    sleepiness.sort((a, b) => b.loggedAt.getTime() - a.loggedAt.getTime());
    return { overnight, sleepiness };
  }
}
