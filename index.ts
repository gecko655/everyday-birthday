import puppeteer from 'puppeteer';
import moment from 'moment';
import { authenticator } from 'otplib';
import fs from 'fs';

function getISOFormat(year: string, month: string, day: string) {
  return `${year}-` +
      `${String(month).padStart(2, '0')}-` +
      `${String(day).padStart(2, '0')}`;
}

const twitterID = process.env.TWITTER_ID!;
const password = process.env.PASSWORD!;
let year = process.env.YEAR!;
const totpSecret = process.env.TOTP_SECRET!;
const mail = process.env.MAIL!;
const utcOffset = process.env.UTC_OFFSET || '+0900'; // default to 'JST'
// Check all variables are set.
if (typeof twitterID == undefined || typeof password == undefined || typeof year == undefined || typeof totpSecret == undefined) {
  throw new Error('Some required ENV is not set (TWITTER_ID, PASSWORD, YEAR)')
}

const date = moment().utcOffset(utcOffset);
const month = String(date.month() + 1); //1-indexed month
const day = String(date.date());

// Check date is valid.
if(!moment(getISOFormat(year, month, day)).isValid()) {
  // Recover if today is leap year day
  if(month !== '2' || day !== '29') {
    throw new Error('Invalid date');
  }
  // In this case, today is leap year day(Feb 29th) but your birth year does not have that day.
  // Find other year that fits leap year day as your birthday.
  while(!moment(getISOFormat(year, month, day)).isValid()) {
    year = String(+year - 1);
  }
}

fs.mkdirSync('output', {recursive: true});

(async () => {
  const browser = await puppeteer.launch();
  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36')
    page.setDefaultNavigationTimeout(60 * 1000);
    await page.goto(`https://twitter.com/i/flow/login`,
        {waitUntil: ['load', 'networkidle0']});

    console.log(`Logging in to ${twitterID}`);
    await page.waitForSelector('input[name=username]');
    await page.type('input[name=username]', twitterID);
    await page.click('#layers [aria-modal=true][role=dialog] [role=dialog] > :nth-child(2) > :nth-child(2) [role=button]')
    await page.waitForSelector('input[name=text], input[name=password]');
    let mail_address_input = await page.$('input[name=text]');
    if (mail_address_input != null) {
      console.log('twitter is suspecting me!');
      await page.type('input[name=text]', mail);
      await page.click('#layers [aria-modal=true][role=dialog] [role=dialog] > :nth-child(2) > :nth-child(2) [role=button]')
    }
    await page.waitForSelector('input[name=password]');
    await page.type('input[name=password]', password);
    await page.click('#layers [aria-modal=true][role=dialog] [role=dialog] > :nth-child(2) > :nth-child(2) [role=button]')
    await page.waitForTimeout(5000);
    fs.writeFileSync('output/t1.html', await page.content());
    await page.screenshot({ path: 'output/screenshot1.png' });//スクリーンショットを撮る
    await page.waitForTimeout(4000); //適当に待つ

    console.log('done!');
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.log(e);
  process.exitCode = 1;
});
