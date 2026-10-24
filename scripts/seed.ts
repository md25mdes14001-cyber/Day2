import { runSeed } from "../src/lib/seed";

const counts = runSeed();
console.log(
  `Seeded ${counts.guides} guides, ${counts.products} products, ${counts.articles} articles.`
);
