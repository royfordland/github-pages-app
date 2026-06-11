import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SqliteService } from './sqlite.service';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: './app.html',
	styleUrls: ['./app.css'],
})
export class App implements OnInit {
	title = 'Landing Page';
	id = 1;
	result: string | null = null;
	loading = false;
	error: string | null = null;
	currentCount = 0;

	constructor(
		private sqlite: SqliteService,
		private cdr: ChangeDetectorRef
	) {}

	async ngOnInit(): Promise<void> {
		await this.loadCurrentCount();
	}

	async loadCurrentCount(): Promise<void> {
		try {
			const count = await this.sqlite.getCurrentRecordCount();
			this.currentCount = count;
			this.cdr.detectChanges();
		} catch (err: any) {
			console.error('Error loading current record count:', err);
		}
	}

	async loadText(): Promise<void> {
		this.loading = true;
		this.result = null;
		this.error = null;
		try {
			const text = await this.sqlite.getTextById(this.id);
			this.result = text ?? `No record for id ${this.id}`;
		} catch (err: any) {
			this.error = err?.message ?? String(err);
		} finally {
			this.loading = false;
		}
	}
}
