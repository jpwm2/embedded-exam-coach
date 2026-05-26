import type { Env } from "./index";

export interface UserRow {
  id: number;
  password_hash: string;
  password_salt: string;
  iterations: number;
  created_at: number;
  exam_date: string;
  start_date: string;
}

export interface AuthedUser {
  id: number;
  exam_date: string;
  start_date: string;
}

export async function getOnlyUser(env: Env): Promise<UserRow | null> {
  return await env.DB.prepare("SELECT * FROM users ORDER BY id LIMIT 1").first<UserRow>();
}

export async function getUserById(env: Env, id: number): Promise<UserRow | null> {
  return await env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(id).first<UserRow>();
}

export function nowSec(): number {
  return Math.floor(Date.now() / 1000);
}

export function daysBetween(a: string, b: string): number {
  const da = new Date(a + "T00:00:00Z").getTime();
  const db = new Date(b + "T00:00:00Z").getTime();
  return Math.round((db - da) / 86400000);
}

export function todayISO(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}
