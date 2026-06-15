import { Injectable } from '@angular/core';
import initSqlJs, { Database } from 'sql.js';

@Injectable({ providedIn: 'root' })
export class SqliteService {
	private dbPromise: Promise<Database>;

	constructor() {
		this.dbPromise = this.init();
	}

	private async init(): Promise<Database> {
		let db: any;
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

	// private async init(): Promise<Database> {
	// 	let db: any;

	// 	const SQL = await initSqlJs({
	// 		locateFile: (file) => `/assets/sql.js/${file}`,
	// 	})
	// 		.then((SQL) => {
	// 			// Database initialization logic
	// 			console.log('SQL.js loaded, initializing database...');
	// 			db = new SQL.Database();
	// 			return SQL;
	// 		})
	// 		.catch((err) => {
	// 			console.error('Failed to load SQL.js:', err);
	// 			throw err;
	// 		});
	// 	//const db = new SQL.Database();

	// 	// Fetch your existing SQLite database file from a server
	// 	const response = await fetch('../db/testdb.sqlite');
	// 	const buf = await response.arrayBuffer();

	// 	// Configure sql.js to use this specific database data
	// 	db = new SQL.Database(new Uint8Array(buf));

	// 	db.run(`SELECT text FROM test_table WHERE id = 1;`); // Test query to trigger WASM loading
	// 	// db.run(`CREATE TABLE IF NOT EXISTS testtable (id INTEGER PRIMARY KEY, text TEXT);`);
	// 	// db.run('INSERT OR REPLACE INTO testtable (id, text) VALUES (?, ?), (?, ?);', [
	// 	// 	1,
	// 	// 	'Hello from sql.js (Angular)!',
	// 	// 	2,
	// 	// 	'Another example row.',
	// 	// ]);
	// 	return db;
	// }

	// 2. Fetch and load the existing .db file
	//   loadExistingDatabase() {
	//     this.http.get('assets/my-database.sqlite', { responseType: 'arraybuffer' }).subscribe(
	//       (data: ArrayBuffer) => {
	//         const uInt8Array = new Uint8Array(data);
	//         this.db = new this.SQL.Database(uInt8Array);

	//         // Test query to ensure it loaded correctly
	//         this.executeQuery("SELECT * FROM my_table");
	//       },
	//       error => console.error('Error loading database', error)
	//     );
	//   }

	//   // 3. Query the opened database
	//   executeQuery(query: string) {
	//     const result = this.db.exec(query);
	//     console.log(result);
	//   }

	async getTextById(id: number): Promise<string | null> {
		const db = await this.dbPromise;
		const stmt = db.prepare('SELECT text FROM test_table WHERE id = :id');
		try {
			stmt.bind({ ':id': id });
			if (stmt.step()) {
				const row = stmt.getAsObject() as { text?: string };
				return row.text ?? null;
			}
			return null;
		} finally {
			stmt.free();
		}
	}

	async getCurrentRecordCount(): Promise<number> {
		const db = await this.dbPromise;
		const stmt = db.prepare('SELECT COUNT(*) AS count FROM test_table');
		try {
			if (stmt.step()) {
				const row = stmt.getAsObject() as { count?: number };
				return row.count ?? 0;
			}
			return 0;
		} finally {
			stmt.free();
		}
	}
}
