import '@angular/compiler';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './app';
import { SqliteService } from './sqlite.service';

describe('App', () => {
	let component: App;
	let sqliteService: { getCurrentRecordCount: ReturnType<typeof vi.fn>; getTextById: ReturnType<typeof vi.fn> };
	let changeDetectorRef: { detectChanges: ReturnType<typeof vi.fn> };

	beforeEach(() => {
		sqliteService = {
			getCurrentRecordCount: vi.fn(),
			getTextById: vi.fn(),
		};
		changeDetectorRef = {
			detectChanges: vi.fn(),
		};
		component = new App(sqliteService as unknown as SqliteService, changeDetectorRef as any);
	});

	it('loads the current database count during initialization', async () => {
		sqliteService.getCurrentRecordCount.mockResolvedValue(7);

		await component.ngOnInit();

		expect(sqliteService.getCurrentRecordCount).toHaveBeenCalledTimes(1);
		expect(component.currentCount).toBe(7);
		expect(changeDetectorRef.detectChanges).toHaveBeenCalledTimes(1);
	});

	it('shows the returned text when loading succeeds', async () => {
		sqliteService.getTextById.mockResolvedValue('Hello from SQLite');
		component.id = 2;

		await component.loadText();

		expect(component.loading).toBe(false);
		expect(component.result).toBe('Hello from SQLite');
		expect(component.error).toBeNull();
	});

	it('records an error message when loading fails', async () => {
		sqliteService.getTextById.mockRejectedValue(new Error('Lookup failed'));

		await component.loadText();

		expect(component.loading).toBe(false);
		expect(component.result).toBeNull();
		expect(component.error).toBe('Lookup failed');
	});
});
