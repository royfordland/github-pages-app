import { Injectable } from '@angular/core';
import initSqlJs, { BindParams, Database } from 'sql.js';

@Injectable({ providedIn: 'root' })
export class SqliteService {
	private dbPromise: Promise<Database>;

	constructor() {
		this.dbPromise = this.init();
	}

	private async init(): Promise<Database> {
		let db: any;

		// need baseHref, without this the path on GitHub Pages will be wrong and the fetch will fail
		const baseHref = document.baseURI;

		const SQL = await initSqlJs({
			locateFile: (file) => `${baseHref}assets/sql.js/${file}`,
		});

		// fetch the existing SQLite database file from the assets folder
		const response = await fetch(`${baseHref}assets/database/testdb.sqlite`);
		const buf = await response.arrayBuffer();

		// configure sql.js to use this specific database data
		db = new SQL.Database(new Uint8Array(buf));

		return db;
	}

	private async querySingleRow<T extends object = object>(query: string, params: BindParams = {}): Promise<T | null> {
		const db = await this.dbPromise;
		const stmt = db.prepare(query);
		try {
			stmt.bind(params);
			if (!stmt.step()) {
				return null;
			}
			return stmt.getAsObject() as T;
		} finally {
			stmt.free();
		}
	}

	async getTextById(id: number): Promise<string | null> {
		const row = await this.querySingleRow<{ text?: string }>('SELECT text FROM test_table WHERE id = :id', { ':id': id });
		return row?.text ?? null;
	}

	async getCurrentRecordCount(): Promise<number> {
		const row = await this.querySingleRow<{ count?: number }>('SELECT COUNT(*) AS count FROM test_table');
		return row?.count ?? 0;
	}
}
