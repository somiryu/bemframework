import fs from 'fs';
import path from 'path';
import { db } from './db';
import { supabase, isSupabaseConfigured } from '../supabase';

export interface Subscriber {
	id?: string;
	email: string;
	created_at: string;
	source: 'supabase' | 'local';
}

const LOCAL_DB_PATH = path.resolve('data/subscribers.json');

// Ensure local JSON file exists
function ensureLocalDb() {
	const dir = path.dirname(LOCAL_DB_PATH);
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}
	if (!fs.existsSync(LOCAL_DB_PATH)) {
		fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify([], null, 2), 'utf-8');
	}
}

// Read subscribers from local JSON
export function getLocalSubscribers(): Subscriber[] {
	ensureLocalDb();
	try {
		const data = fs.readFileSync(LOCAL_DB_PATH, 'utf-8');
		return JSON.parse(data) as Subscriber[];
	} catch (error) {
		console.error('Error reading local subscribers database:', error);
		return [];
	}
}

// Write subscribers to local JSON
export function saveLocalSubscribers(subscribers: Subscriber[]): boolean {
	ensureLocalDb();
	try {
		fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(subscribers, null, 2), 'utf-8');
		return true;
	} catch (error) {
		console.error('Error writing to local subscribers database:', error);
		return false;
	}
}

/**
 * Fetches all subscribers from both Supabase and local JSON fallback,
 * merges them by email to prevent duplicates, and sorts by registration date.
 */
export async function getSubscribers(): Promise<Subscriber[]> {
	const localSubs = getLocalSubscribers();
	let supabaseSubs: Subscriber[] = [];

	try {
		const { data, error } = await db
			.from('newsletter_subscribers')
			.select('*')
			.order('created_at', { ascending: false });

		if (!error && data && Array.isArray(data)) {
			supabaseSubs = data.map((sub: any) => ({
				id: sub.id,
				email: sub.email,
				created_at: sub.created_at,
				source: 'supabase' as const
			}));
		}
	} catch (err) {
		console.error('Subscribers fetch error:', err);
	}

	// Merge lists, prioritizing Supabase if duplicates exist
	const mergedMap = new Map<string, Subscriber>();
	
	// Add local first
	for (const sub of localSubs) {
		mergedMap.set(sub.email.toLowerCase(), sub);
	}
	
	// Add Supabase (will overwrite local duplicates)
	for (const sub of supabaseSubs) {
		mergedMap.set(sub.email.toLowerCase(), sub);
	}

	// Convert map back to list and sort by date descending
	return Array.from(mergedMap.values()).sort(
		(a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
	);
}

/**
 * Adds a new email address to the newsletter subscriber list.
 * Saves to Supabase if configured, and always backs up to local JSON database.
 */
export async function addSubscriber(email: string): Promise<{ success: boolean; message: string; subscriber?: Subscriber }> {
	const sanitizedEmail = email.trim().toLowerCase();
	
	if (!sanitizedEmail || !sanitizedEmail.includes('@')) {
		return { success: false, message: 'Invalid email address' };
	}

	const now = new Date().toISOString();
	let savedInSupabase = false;
	let newSubscriber: Subscriber = {
		email: sanitizedEmail,
		created_at: now,
		source: 'local'
	};

	// 1. Attempt to save to Supabase first
	// 1. Attempt to save to database first
	try {
		// Check if already exists
		const { data: existing } = await db
			.from('newsletter_subscribers')
			.select('email')
			.eq('email', sanitizedEmail)
			.maybeSingle();

		if (existing) {
			return { success: true, message: 'Already subscribed' };
		}

		// Insert new row
		const { data: inserted, error: insertError } = await db
			.from('newsletter_subscribers')
			.insert([{ email: sanitizedEmail }])
			.select()
			.single();

		if (!insertError && inserted) {
			savedInSupabase = true;
			newSubscriber = {
				id: inserted.id,
				email: inserted.email,
				created_at: inserted.created_at,
				source: 'supabase'
			};
		}
	} catch (err) {
		console.error('Subscriber saving exception:', err);
	}

	// 2. Always backup or fall back to local storage
	const localSubs = getLocalSubscribers();
	const existsLocally = localSubs.some(sub => sub.email.toLowerCase() === sanitizedEmail);

	if (existsLocally) {
		// If saved in Supabase but already in local list, or vice versa, return success
		return { success: true, message: 'Already subscribed' };
	}

	// Add to local database
	localSubs.push(newSubscriber);
	const successLocal = saveLocalSubscribers(localSubs);

	if (savedInSupabase) {
		return { 
			success: true, 
			message: 'Successfully subscribed (Supabase)', 
			subscriber: newSubscriber 
		};
	} else if (successLocal) {
		return { 
			success: true, 
			message: 'Successfully subscribed (Local backup)', 
			subscriber: newSubscriber 
		};
	} else {
		return { success: false, message: 'Could not save subscription to database' };
	}
}
