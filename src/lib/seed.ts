import { upsertGuide, upsertProduct, upsertArticle } from "./repo";
import { guides } from "./seed-data/guides";
import { products } from "./seed-data/products";
import { articles } from "./seed-data/articles";

export function runSeed() {
  for (const g of guides) upsertGuide(g);
  for (const p of products) upsertProduct(p);
  for (const a of articles) upsertArticle(a);
  return { guides: guides.length, products: products.length, articles: articles.length };
}
