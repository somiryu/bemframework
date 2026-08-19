import pg from 'pg';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/private';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

const { Pool } = pg;

// Determine active DB Mode: 'local' (default in development) or 'supabase' (in dev:supabase or Netlify production)
const rawMode = (process.env.DB_MODE || env.DB_MODE || '').toLowerCase();
const isProduction = process.env.NODE_ENV === 'production';
export const DB_MODE: 'local' | 'supabase' = rawMode === 'supabase' || (isProduction && rawMode !== 'local') ? 'supabase' : 'local';

console.log(`🔌 [BEM Database] Active DB_MODE: ${DB_MODE} (Environment: ${isProduction ? 'production' : 'development'})`);

// --------------------------------------------------------------------------
// 1. SUPABASE CLIENT (FOR SUPABASE MODE & PRODUCTION)
// --------------------------------------------------------------------------
const supabaseUrl = PUBLIC_SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL || env.SUPABASE_URL || '';
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || PUBLIC_SUPABASE_ANON_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY || '';

const cloudSupabase: SupabaseClient | null = (supabaseUrl && supabaseKey)
	? createClient(supabaseUrl, supabaseKey, {
			auth: { autoRefreshToken: false, persistSession: false }
		})
	: null;

// --------------------------------------------------------------------------
// 2. LOCAL POSTGRESQL POOL (FOR LOCAL MODE)
// --------------------------------------------------------------------------
const localDatabaseUrl = process.env.DATABASE_URL || env.DATABASE_URL || 'postgresql://freetoplay@localhost:5432/bem_dev';

let localPool: pg.Pool | null = null;

if (DB_MODE === 'local') {
	localPool = new Pool({
		connectionString: localDatabaseUrl,
		max: 10,
		idleTimeoutMillis: 30000,
		connectionTimeoutMillis: 5000
	});

	localPool.on('error', (err) => {
		console.error('⚠️ [BEM Database] Unexpected error on idle local PostgreSQL client:', err);
	});
}

// --------------------------------------------------------------------------
// 3. POSTGREST / SUPABASE COMPATIBLE QUERY BUILDER FOR LOCAL POSTGRES
// --------------------------------------------------------------------------
class LocalQueryBuilder {
	private tableName: string;
	private selectCols: string = '*';
	private whereClauses: { col: string; op: string; val: any }[] = [];
	private inClauses: { col: string; vals: any[] }[] = [];
	private orderCol: string | null = null;
	private orderAsc: boolean = true;
	private limitCount: number | null = null;
	private isSingleMode: boolean = false;
	private isMaybeSingleMode: boolean = false;

	// Operation type
	private opType: 'select' | 'insert' | 'update' | 'delete' = 'select';
	private insertValues: any = null;
	private updateValues: any = null;

	constructor(tableName: string) {
		this.tableName = tableName;
	}

	select(cols: string = '*') {
		this.selectCols = cols;
		return this;
	}

	insert(values: any) {
		this.opType = 'insert';
		this.insertValues = values;
		return this;
	}

	update(values: any) {
		this.opType = 'update';
		this.updateValues = values;
		return this;
	}

	delete() {
		this.opType = 'delete';
		return this;
	}

	eq(col: string, val: any) {
		this.whereClauses.push({ col, op: '=', val });
		return this;
	}

	neq(col: string, val: any) {
		this.whereClauses.push({ col, op: '!=', val });
		return this;
	}

	in(col: string, vals: any[]) {
		this.inClauses.push({ col, vals });
		return this;
	}

	order(col: string, options?: { ascending?: boolean }) {
		this.orderCol = col;
		this.orderAsc = options?.ascending !== false;
		return this;
	}

	limit(count: number) {
		this.limitCount = count;
		return this;
	}

	single() {
		this.isSingleMode = true;
		return this;
	}

	maybeSingle() {
		this.isMaybeSingleMode = true;
		return this;
	}

	async then<TResult1 = any, TResult2 = never>(
		onfulfilled?: ((value: { data: any; error: any }) => TResult1 | PromiseLike<TResult1>) | null,
		onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
	): Promise<TResult1 | TResult2> {
		const result = await this.execute();
		if (onfulfilled) {
			return onfulfilled(result);
		}
		return result as any;
	}

	private async execute(): Promise<{ data: any; error: any }> {
		if (!localPool) {
			return { data: null, error: new Error('Local PostgreSQL pool is not initialized.') };
		}

		try {
			let queryText = '';
			const queryParams: any[] = [];
			let paramIdx = 1;

			if (this.opType === 'select') {
				queryText = `SELECT ${this.selectCols} FROM public."${this.tableName}"`;
				
				const conditions: string[] = [];
				for (const w of this.whereClauses) {
					conditions.push(`"${w.col}" ${w.op} $${paramIdx++}`);
					queryParams.push(w.val);
				}
				for (const ic of this.inClauses) {
					conditions.push(`"${ic.col}" = ANY($${paramIdx++})`);
					queryParams.push(ic.vals);
				}

				if (conditions.length > 0) {
					queryText += ` WHERE ${conditions.join(' AND ')}`;
				}

				if (this.orderCol) {
					queryText += ` ORDER BY "${this.orderCol}" ${this.orderAsc ? 'ASC' : 'DESC'}`;
				}

				if (this.limitCount !== null) {
					queryText += ` LIMIT ${this.limitCount}`;
				} else if (this.isSingleMode || this.isMaybeSingleMode) {
					queryText += ` LIMIT 1`;
				}
			} else if (this.opType === 'insert') {
				const isArray = Array.isArray(this.insertValues);
				const rows = isArray ? this.insertValues : [this.insertValues];
				if (rows.length === 0) return { data: [], error: null };

				const keys = Object.keys(rows[0]);
				const colsStr = keys.map(k => `"${k}"`).join(', ');
				
				const valuePlaceholders: string[] = [];
				for (const row of rows) {
					const rowPlaceholders: string[] = [];
					for (const k of keys) {
						let v = row[k];
						if (typeof v === 'object' && v !== null && !(v instanceof Date)) {
							v = JSON.stringify(v);
						}
						rowPlaceholders.push(`$${paramIdx++}`);
						queryParams.push(v);
					}
					valuePlaceholders.push(`(${rowPlaceholders.join(', ')})`);
				}

				queryText = `INSERT INTO public."${this.tableName}" (${colsStr}) VALUES ${valuePlaceholders.join(', ')} RETURNING *`;
			} else if (this.opType === 'update') {
				const keys = Object.keys(this.updateValues);
				if (keys.length === 0) return { data: [], error: null };

				const setClauses = keys.map(k => {
					let v = this.updateValues[k];
					if (typeof v === 'object' && v !== null && !(v instanceof Date)) {
						v = JSON.stringify(v);
					}
					queryParams.push(v);
					return `"${k}" = $${paramIdx++}`;
				});

				queryText = `UPDATE public."${this.tableName}" SET ${setClauses.join(', ')}`;

				const conditions: string[] = [];
				for (const w of this.whereClauses) {
					conditions.push(`"${w.col}" ${w.op} $${paramIdx++}`);
					queryParams.push(w.val);
				}
				for (const ic of this.inClauses) {
					conditions.push(`"${ic.col}" = ANY($${paramIdx++})`);
					queryParams.push(ic.vals);
				}

				if (conditions.length > 0) {
					queryText += ` WHERE ${conditions.join(' AND ')}`;
				}

				queryText += ` RETURNING *`;
			} else if (this.opType === 'delete') {
				queryText = `DELETE FROM public."${this.tableName}"`;
				const conditions: string[] = [];
				for (const w of this.whereClauses) {
					conditions.push(`"${w.col}" ${w.op} $${paramIdx++}`);
					queryParams.push(w.val);
				}
				if (conditions.length > 0) {
					queryText += ` WHERE ${conditions.join(' AND ')}`;
				}
				queryText += ` RETURNING *`;
			}

			const res = await localPool.query(queryText, queryParams);

			if (this.isSingleMode) {
				if (res.rowCount === 0) {
					return { data: null, error: new Error(`No rows returned for query on ${this.tableName}`) };
				}
				return { data: res.rows[0], error: null };
			}

			if (this.isMaybeSingleMode) {
				return { data: res.rowCount && res.rowCount > 0 ? res.rows[0] : null, error: null };
			}

			if (this.opType === 'insert' && !Array.isArray(this.insertValues)) {
				return { data: res.rows[0] ?? null, error: null };
			}

			return { data: res.rows, error: null };
		} catch (err: any) {
			console.error(`❌ [Local Postgres] Error in ${this.opType} on ${this.tableName}:`, err);
			return { data: null, error: err };
		}
	}
}

// --------------------------------------------------------------------------
// 4. UNIFIED DB INTERFACE
// --------------------------------------------------------------------------
export const db = {
	from(table: string) {
		if (DB_MODE === 'supabase' && cloudSupabase) {
			return cloudSupabase.from(table);
		}
		return new LocalQueryBuilder(table);
	},

	async rpc(fnName: string, args: Record<string, any> = {}) {
		if (DB_MODE === 'supabase' && cloudSupabase) {
			return cloudSupabase.rpc(fnName, args);
		}

		if (!localPool) {
			return { data: null, error: new Error('Local pool is not initialized.') };
		}

		try {
			if (fnName === 'is_super_user') {
				const email = args.email_to_check || '';
				const res = await localPool.query(`SELECT public.is_super_user($1) as is_super`, [email]);
				return { data: !!res.rows[0]?.is_super, error: null };
			}

			if (fnName === 'verify_super_user_password') {
				const res = await localPool.query(
					`SELECT public.verify_super_user_password($1, $2) as ok`,
					[args.email_to_check || '', args.password_to_check || '']
				);
				return { data: !!res.rows[0]?.ok, error: null };
			}

			// Generic function call
			const paramKeys = Object.keys(args);
			const placeholders = paramKeys.map((_, i) => `$${i + 1}`).join(', ');
			const params = paramKeys.map(k => args[k]);
			const res = await localPool.query(`SELECT * FROM public.${fnName}(${placeholders})`, params);
			return { data: res.rows, error: null };
		} catch (err: any) {
			console.error(`❌ [Local Postgres RPC] Error calling ${fnName}:`, err);
			return { data: null, error: err };
		}
	},

	removeChannel(channel: any) {
		if (DB_MODE === 'supabase' && cloudSupabase) {
			return cloudSupabase.removeChannel(channel);
		}
		return Promise.resolve();
	},

	channel(name: string) {
		if (DB_MODE === 'supabase' && cloudSupabase) {
			return cloudSupabase.channel(name);
		}
		// In local mode without Supabase Realtime running, return no-op channel mock
		return {
			on() { return this; },
			subscribe() { return this; },
			track() { return Promise.resolve('ok'); },
			send() { return Promise.resolve('ok'); },
			unsubscribe() { return Promise.resolve('ok'); }
		};
	}
};
