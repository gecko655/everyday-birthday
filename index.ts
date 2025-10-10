import puppeteer from "puppeteer";
import { DateTime } from "luxon";

function getISOFormat(year: string, month: string, day: string) {
  return (
    `${year}-` +
    `${String(month).padStart(2, "0")}-` +
    `${String(day).padStart(2, "0")}`
  );
}

const twitterID = process.env.TWITTER_ID!;
let year = process.env.YEAR!;
const AUTH_TOKEN = process.env.AUTH_TOKEN!;
const utcOffset = process.env.UTC_OFFSET || "UTC+9"; // default to 'JST'
// Check all variables are set.
if (
  typeof twitterID == undefined ||
  typeof year == undefined ||
  typeof AUTH_TOKEN == undefined
) {
  throw new Error(
    "Some required ENV is not set (TWITTER_ID, YEAR, AUTH_TOKEN)",
  );
}

const date = DateTime.now().setZone(utcOffset);
const month = String(date.month);
const day = String(date.day);

// Check date is valid.
if (!DateTime.fromISO(getISOFormat(year, month, day)).isValid) {
  // Recover if today is leap year day
  if (month !== "2" || day !== "29") {
    throw new Error("Invalid date");
  }
  // In this case, today is leap year day(Feb 29th) but your birth year does not have that day.
  // Find other year that fits leap year day as your birthday.
  while (!DateTime.fromISO(getISOFormat(year, month, day)).isValid) {
    year = String(+year - 1);
  }
}

(async () => {
  const browser = await puppeteer.launch({
    // headless: false,
  });
  try {
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(60 * 1000);

    await browser.setCookie({
      name: "auth_token",
      value: AUTH_TOKEN,
      domain: ".x.com",
    });
    console.log(`Go to user page`);
    await page.goto(`https://twitter.com/${twitterID}`);
    console.log(`Open profile setting page`);

    await page.goto(`https://twitter.com/settings/profile`);
    await page.waitForSelector("button[data-testid=pivot]");
    await page.click("button[data-testid=pivot]");
    await page.waitForSelector("button[data-testid=confirmationSheetConfirm]");
    await page.click("button[data-testid=confirmationSheetConfirm]");

    console.log(
      `Setting ${twitterID}'s birthday to ` + getISOFormat(year, month, day),
    );

    await page.waitForSelector(
      "select[data-testid=ProfileBirthdate_Year_Selector]",
    );
    await page.select("select[data-testid=ProfileBirthdate_Day_Selector]", day);
    await page.select(
      "select[data-testid=ProfileBirthdate_Month_Selector]",
      month,
    );
    await page.select(
      "select[data-testid=ProfileBirthdate_Year_Selector]",
      year,
    );

    console.log(`Save birthday`);

    await page.click("button[data-testid=Profile_Save_Button]");
    await page.waitForSelector("button[data-testid=confirmationSheetConfirm]");
    await page.click("button[data-testid=confirmationSheetConfirm]");
    await new Promise((r) => setTimeout(r, 4000)); // 適当に待つ

    console.log("done!");
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.log(e);
  process.exitCode = 1;
});
