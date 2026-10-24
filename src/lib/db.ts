import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";

// A tiny, dependency-free data layer on top of Node's built-in SQLite driver.
// This keeps the whole stack runnable with zero external services for local
// development and review. For production, swap this file for a Postgres
// client (e.g. Supabase) pointed at DATABASE_URL — every call site in the
// app only talks to the typed functions exported below, so the swap is
// contained to this one file. See README.md "Going to production".

// On Vercel (and most serverless hosts) only /tmp is writable at runtime —
// the project directory itself is read-only. /tmp there is ephemeral and
// not shared across instances, which is fine for a live click-through demo
// but not for real production data; see README "Going to production".
const DATA_DIR = process.env.VERCEL ? "/tmp/ascend-data" : path.join(process.cwd(), ".data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
const DB_PATH = path.join(DATA_DIR, "app.db");

declare global {
  var __ascendDb: DatabaseSync | undefined;
}

export const db: DatabaseSync = globalThis.__ascendDb ?? new DatabaseSync(DB_PATH);
if (process.env.NODE_ENV !== "production") globalThis.__ascendDb = db;

db.exec(`
  PRAGMA journal_mode = WAL;

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    experience_tier TEXT NOT NULL DEFAULT 'newbie',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS guides (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    method TEXT NOT NULL,
    tier_level TEXT NOT NULL,
    summary TEXT NOT NULL,
    hero_image TEXT NOT NULL,
    process_steps TEXT NOT NULL,
    reasons TEXT NOT NULL,
    can_compost TEXT NOT NULL,
    cannot_compost TEXT NOT NULL,
    limitations TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price_inr INTEGER NOT NULL,
    image TEXT NOT NULL,
    description TEXT NOT NULL,
    features TEXT NOT NULL,
    benefits TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS articles (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    body TEXT NOT NULL,
    cover_image TEXT NOT NULL,
    published_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS submissions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    method TEXT NOT NULL,
    tips TEXT NOT NULL,
    photo_path TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS enquiries (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

export function newId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}
