import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = "http://localhost:3000";
const results = [];

function log(name, ok, detail = "") {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"} - ${name}${detail ? " :: " + detail : ""}`);
}

const run = async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const rand = Math.random().toString(36).slice(2, 8);

  // 1. Signup
  await page.goto(`${BASE}/signup`);
  await page.fill('input[name="name"]', "Test User");
  const email = `test-${rand}@example.com`;
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', "password123");
  await page.selectOption('select[name="tier"]', "beginner");
  await Promise.all([page.waitForURL(`${BASE}/`, { timeout: 8000 }).catch(() => {}), page.click('button[type="submit"]')]);
  await page.waitForLoadState("networkidle");
  const navHtml = await page.content();
  log("Signup creates account and logs in", navHtml.includes("Sign out"), page.url());

  // 2. Logout, then login with same credentials
  await page.goto(`${BASE}/api/auth/signout`);
  const signoutBtn = page.locator('button:has-text("Sign out")');
  if (await signoutBtn.count()) await signoutBtn.click();
  await page.waitForLoadState("networkidle");

  await page.goto(`${BASE}/login`);
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', "password123");
  await page.click('button[type="submit"]');
  await page.waitForLoadState("networkidle");
  const loggedInHtml = await page.content();
  log("Login with same credentials works", loggedInHtml.includes("Sign out"));

  // 2b. Wrong password is rejected
  await page.goto(`${BASE}/api/auth/signout`);
  const signoutBtn2 = page.locator('button:has-text("Sign out")');
  if (await signoutBtn2.count()) await signoutBtn2.click();
  await page.waitForLoadState("networkidle");
  await page.goto(`${BASE}/login`);
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', "wrong-password");
  await page.click('button[type="submit"]');
  await page.waitForTimeout(500);
  const failHtml = await page.content();
  log("Wrong password is rejected", failHtml.includes("don&#x27;t match") || failHtml.includes("don't match"));

  // 3. Persona quiz redirects with tier filter applied
  await page.goto(BASE);
  const personaBtn = page.locator('button:has-text("Composting like a pro?")');
  await personaBtn.click();
  await page.waitForLoadState("networkidle");
  log("Persona card redirects to filtered guides", page.url().includes("/guides?tier=expert"));
  const guidesHtml = await page.content();
  log("Expert-tier guide (Bokashi) shown after persona pick", guidesHtml.includes("Bokashi Composting"));

  // 4. Guide detail content renders
  await page.goto(`${BASE}/guides/bokashi-composting`);
  const guideDetailHtml = await page.content();
  log(
    "Guide detail shows process steps + can/cannot lists",
    guideDetailHtml.includes("fermented waste in soil") && guideDetailHtml.includes("Meat and fish scraps")
  );

  // 5. Product enquiry form submission
  await page.goto(`${BASE}/products/home-composting-kit`);
  await page.fill('input[name="name"]', "Enquirer");
  await page.fill('input[name="email"]', `enquirer-${rand}@example.com`);
  await page.fill('textarea[name="message"]', "Do you deliver to Hyderabad?");
  await page.click('button:has-text("Send enquiry")');
  await page.waitForTimeout(600);
  const enquiryHtml = await page.content();
  log("Product enquiry submits and shows confirmation", enquiryHtml.includes("we&#x27;ll get back to you") || enquiryHtml.includes("we'll get back to you"));

  // 6. Community submission form with photo upload
  await page.goto(`${BASE}/community#submit`);
  await page.fill('input[name="name"]', "Composter Jane");
  await page.fill('input[name="email"]', `jane-${rand}@example.com`);
  await page.fill('input[name="method"]', "Home composting");
  await page.fill('textarea[name="tips"]', "Chop everything small and keep a 2:1 dry-to-wet ratio.");
  const tmpImg = path.join(process.cwd(), ".data", "test-upload.png");
  fs.mkdirSync(path.dirname(tmpImg), { recursive: true });
  // 1x1 transparent PNG
  fs.writeFileSync(
    tmpImg,
    Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
      "base64"
    )
  );
  await page.setInputFiles('input[name="photo"]', tmpImg);
  await page.click('button:has-text("Share your setup")');
  await page.waitForTimeout(600);
  const submissionHtml = await page.content();
  log("Community submission with photo upload succeeds", submissionHtml.includes("Thank you"));

  // 7. Newsletter signup (triggering the modal immediately for test speed is not wired in app;
  // instead we POST directly through the visible form once shown by waiting)
  await page.goto(BASE);
  await page.waitForTimeout(7300);
  const newsletterVisible = await page.locator('text=Join the compost community').count();
  if (newsletterVisible) {
    await page.fill('input[name="email"]', `newsletter-${rand}@example.com`);
    await page.click('button:has-text("Subscribe")');
    await page.waitForTimeout(500);
    const nlHtml = await page.content();
    log("Newsletter modal appears and subscribes", nlHtml.includes("subscribed"));
  } else {
    log("Newsletter modal appears and subscribes", false, "modal never appeared");
  }

  // 8. Search returns real results
  await page.goto(`${BASE}/search?q=bokashi`);
  const searchHtml = await page.content();
  log("Search finds guide + product for 'bokashi'", searchHtml.includes("Bokashi Composting") && searchHtml.includes("Bokashi Bin"));

  await browser.close();

  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed.`);
  if (failed.length) process.exit(1);
};

run();
