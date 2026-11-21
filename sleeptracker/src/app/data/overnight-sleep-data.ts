import { SleepData } from './sleep-data';

export class OvernightSleepData extends SleepData {
	readonly sleepStart:Date;
	readonly sleepEnd:Date;

	constructor(sleepStart:Date, sleepEnd:Date) {
		super();
		this.sleepStart = sleepStart;
		this.sleepEnd = sleepEnd;
	}

	override summaryString():string {
		return OvernightSleepData.formatDuration(this.sleepStart, this.sleepEnd);
	}

	static formatDuration(start:Date, end:Date):string {
		const totalMinutes = Math.floor((end.getTime() - start.getTime()) / 60_000);
		const hours = Math.floor(totalMinutes / 60);
		const minutes = totalMinutes % 60;
		const hourLabel = hours === 1 ? 'hour' : 'hours';
		const minuteLabel = minutes === 1 ? 'minute' : 'minutes';

		return `${hours} ${hourLabel}, ${minutes} ${minuteLabel}`;
	}

	override dateString():string {
		return "Night of " + this.sleepStart.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
	}
}
