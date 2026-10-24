import { db, newId } from "./db";
import bcrypt from "bcryptjs";
import { guides as seedGuides } from "./seed-data/guides";
import { products as seedProducts } from "./seed-data/products";
import { articles as seedArticles } from "./seed-data/articles";

export type Tier = "newbie" | "beginner" | "intermediate" | "expert";

export type Guide = {
  id: string;
  slug: string;
  title: string;
  method: string;
  tierLevel: Tier;
  summary: string;
  heroImage: string;
  processSteps: string[];
  reasons: string[];
  canCompost: string[];
  cannotCompost: string[];
  limitations: string[];
  sortOrder: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: "composters" | "accessories" | "diy-kits";
  priceInr: number;
  image: string;
  description: string;
  features: string[];
  benefits: string[];
  sortOrder: number;
};

export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  coverImage: string;
  publishedAt: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  experienceTier: Tier;
  createdAt: string;
};

type Row = Record<string, unknown>;
const str = (v: unknown): string => String(v);
const num = (v: unknown): number => Number(v);
const json = <T>(v: unknown): T => JSON.parse(str(v)) as T;

function rowToGuide(r: Row): Guide {
  return {
    id: str(r.id),
    slug: str(r.slug),
    title: str(r.title),
    method: str(r.method),
    tierLevel: str(r.tier_level) as Tier,
    summary: str(r.summary),
    heroImage: str(r.hero_image),
    processSteps: json<string[]>(r.process_steps),
    reasons: json<string[]>(r.reasons),
    canCompost: json<string[]>(r.can_compost),
    cannotCompost: json<string[]>(r.cannot_compost),
    limitations: json<string[]>(r.limitations),
    sortOrder: num(r.sort_order),
  };
}

function rowToProduct(r: Row): Product {
  return {
    id: str(r.id),
    slug: str(r.slug),
    name: str(r.name),
    category: str(r.category) as Product["category"],
    priceInr: num(r.price_inr),
    image: str(r.image),
    description: str(r.description),
    features: json<string[]>(r.features),
    benefits: json<string[]>(r.benefits),
    sortOrder: num(r.sort_order),
  };
}

function rowToArticle(r: Row): Article {
  return {
    id: str(r.id),
    slug: str(r.slug),
    title: str(r.title),
    excerpt: str(r.excerpt),
    body: str(r.body),
    coverImage: str(r.cover_image),
    publishedAt: str(r.published_at),
  };
}

function rowToUser(r: Row): User {
  return {
    id: str(r.id),
    email: str(r.email),
    name: str(r.name),
    passwordHash: str(r.password_hash),
    experienceTier: str(r.experience_tier) as Tier,
    createdAt: str(r.created_at),
  };
}

// ---------- Guides ----------
export function listGuides(): Guide[] {
  const rows = db.prepare("SELECT * FROM guides ORDER BY sort_order ASC").all();
  return rows.map(rowToGuide);
}
export function getGuide(slug: string): Guide | undefined {
  const row = db.prepare("SELECT * FROM guides WHERE slug = ?").get(slug);
  return row ? rowToGuide(row) : undefined;
}
export function upsertGuide(g: Omit<Guide, "id">) {
  const existing = db.prepare("SELECT id FROM guides WHERE slug = ?").get(g.slug) as { id: string } | undefined;
  const id = existing?.id ?? newId("guide");
  db.prepare(
    `INSERT INTO guides (id, slug, title, method, tier_level, summary, hero_image, process_steps, reasons, can_compost, cannot_compost, limitations, sort_order)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
     ON CONFLICT(slug) DO UPDATE SET title=excluded.title, method=excluded.method, tier_level=excluded.tier_level,
       summary=excluded.summary, hero_image=excluded.hero_image, process_steps=excluded.process_steps,
       reasons=excluded.reasons, can_compost=excluded.can_compost, cannot_compost=excluded.cannot_compost,
       limitations=excluded.limitations, sort_order=excluded.sort_order`
  ).run(
    id,
    g.slug,
    g.title,
    g.method,
    g.tierLevel,
    g.summary,
    g.heroImage,
    JSON.stringify(g.processSteps),
    JSON.stringify(g.reasons),
    JSON.stringify(g.canCompost),
    JSON.stringify(g.cannotCompost),
    JSON.stringify(g.limitations),
    g.sortOrder
  );
}

// ---------- Products ----------
export function listProducts(category?: Product["category"]): Product[] {
  const rows = category
    ? db.prepare("SELECT * FROM products WHERE category = ? ORDER BY sort_order ASC").all(category)
    : db.prepare("SELECT * FROM products ORDER BY sort_order ASC").all();
  return rows.map(rowToProduct);
}
export function getProduct(slug: string): Product | undefined {
  const row = db.prepare("SELECT * FROM products WHERE slug = ?").get(slug);
  return row ? rowToProduct(row) : undefined;
}
export function upsertProduct(p: Omit<Product, "id">) {
  const existing = db.prepare("SELECT id FROM products WHERE slug = ?").get(p.slug) as { id: string } | undefined;
  const id = existing?.id ?? newId("prod");
  db.prepare(
    `INSERT INTO products (id, slug, name, category, price_inr, image, description, features, benefits, sort_order)
     VALUES (?,?,?,?,?,?,?,?,?,?)
     ON CONFLICT(slug) DO UPDATE SET name=excluded.name, category=excluded.category, price_inr=excluded.price_inr,
       image=excluded.image, description=excluded.description, features=excluded.features, benefits=excluded.benefits,
       sort_order=excluded.sort_order`
  ).run(id, p.slug, p.name, p.category, p.priceInr, p.image, p.description, JSON.stringify(p.features), JSON.stringify(p.benefits), p.sortOrder);
}

// ---------- Articles ----------
export function listArticles(): Article[] {
  return (db.prepare("SELECT * FROM articles ORDER BY published_at DESC").all() as Record<string, unknown>[]).map(rowToArticle);
}
export function getArticle(slug: string): Article | undefined {
  const row = db.prepare("SELECT * FROM articles WHERE slug = ?").get(slug);
  return row ? rowToArticle(row) : undefined;
}
export function upsertArticle(a: Omit<Article, "id">) {
  const existing = db.prepare("SELECT id FROM articles WHERE slug = ?").get(a.slug) as { id: string } | undefined;
  const id = existing?.id ?? newId("art");
  db.prepare(
    `INSERT INTO articles (id, slug, title, excerpt, body, cover_image, published_at)
     VALUES (?,?,?,?,?,?,?)
     ON CONFLICT(slug) DO UPDATE SET title=excluded.title, excerpt=excluded.excerpt, body=excluded.body,
       cover_image=excluded.cover_image, published_at=excluded.published_at`
  ).run(id, a.slug, a.title, a.excerpt, a.body, a.coverImage, a.publishedAt);
}

// ---------- Users / auth ----------
export async function createUser(email: string, name: string, password: string, tier: Tier): Promise<User> {
  const passwordHash = await bcrypt.hash(password, 10);
  const id = newId("user");
  db.prepare(
    "INSERT INTO users (id, email, name, password_hash, experience_tier) VALUES (?,?,?,?,?)"
  ).run(id, email.toLowerCase().trim(), name, passwordHash, tier);
  return getUserByEmail(email)!;
}
export function getUserByEmail(email: string): User | undefined {
  const row = db.prepare("SELECT * FROM users WHERE email = ?").get(email.toLowerCase().trim());
  return row ? rowToUser(row) : undefined;
}
export function getUserById(id: string): User | undefined {
  const row = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
  return row ? rowToUser(row) : undefined;
}
export function setUserTier(id: string, tier: Tier) {
  db.prepare("UPDATE users SET experience_tier = ? WHERE id = ?").run(tier, id);
}
export async function verifyPassword(email: string, password: string): Promise<User | null> {
  const user = getUserByEmail(email);
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  return ok ? user : null;
}

// ---------- Submissions / newsletter / enquiries ----------
export function createSubmission(input: { name: string; email: string; method: string; tips: string; photoPath?: string }) {
  const id = newId("sub");
  db.prepare(
    "INSERT INTO submissions (id, name, email, method, tips, photo_path) VALUES (?,?,?,?,?,?)"
  ).run(id, input.name, input.email, input.method, input.tips, input.photoPath ?? null);
  return id;
}
export function listSubmissions() {
  return db.prepare("SELECT * FROM submissions ORDER BY created_at DESC").all();
}
export function subscribeNewsletter(email: string) {
  const id = newId("sub-nl");
  db.prepare("INSERT OR IGNORE INTO newsletter_subscribers (id, email) VALUES (?, ?)").run(id, email.toLowerCase().trim());
}
export function createEnquiry(input: { productId: string; name: string; email: string; message: string }) {
  const id = newId("enq");
  db.prepare("INSERT INTO enquiries (id, product_id, name, email, message) VALUES (?,?,?,?,?)").run(
    id,
    input.productId,
    input.name,
    input.email,
    input.message
  );
  return id;
}

// ---------- Search ----------
export type SearchResult = { type: "guide" | "product" | "article"; title: string; slug: string; snippet: string };
export function search(query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const results: SearchResult[] = [];
  for (const g of listGuides()) {
    if (g.title.toLowerCase().includes(q) || g.summary.toLowerCase().includes(q) || g.method.toLowerCase().includes(q)) {
      results.push({ type: "guide", title: g.title, slug: `/guides/${g.slug}`, snippet: g.summary });
    }
  }
  for (const p of listProducts()) {
    if (p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)) {
      results.push({ type: "product", title: p.name, slug: `/products/${p.slug}`, snippet: p.description });
    }
  }
  for (const a of listArticles()) {
    if (a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q)) {
      results.push({ type: "article", title: a.title, slug: `/blog/${a.slug}`, snippet: a.excerpt });
    }
  }
  return results;
}

// ---------- Auto-seed ----------
// On a fresh database (first request against a cold serverless instance, or
// a first local run before `npm run seed`), make sure content exists so the
// site is never empty. Upserts are idempotent, so this is always safe to run.
const { c: existingGuideCount } = db.prepare("SELECT COUNT(*) as c FROM guides").get() as { c: number };
if (existingGuideCount === 0) {
  for (const g of seedGuides) upsertGuide(g);
  for (const p of seedProducts) upsertProduct(p);
  for (const a of seedArticles) upsertArticle(a);
}
