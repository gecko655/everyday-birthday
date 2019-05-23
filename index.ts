const puppeteer = require('puppeteer');
const moment = require('moment');

function getISOFormat(year: string, month: string, day: string) {
  return `${year}-` +
      `${String(month).padStart(2, '0')}-` +
      `${String(day).padStart(2, '0')}`;
}

const twitterID = process.env.TWITTER_ID;
const password = process.env.PASSWORD;
const year = process.env.YEAR;
const utcOffset = process.env.UTC_OFFSET || '+0900'; // default to 'JST'
// Check all variables are set.
if (typeof twitterID == undefined || typeof password == undefined || typeof year == undefined) {
  throw new Error('Some required ENV is not set (TWITTER_ID, PASSWORD, YEAR)')
}

const date = moment().utcOffset(utcOffset);
const month = String(date.month() + 1); //1-indexed month
let day = String(date.date());

// Check date is valid.
if(!moment(getISOFormat(year, month, day)).isValid()) {
  //Today is leap year day(Feb 29th) but your birth year does not have that day.

  //Check today is surely Feb 29th
  day = String(date.date() - 1);
  if(moment(getISOFormat(year, month, day)).isValid() || month === '2') {
    throw new Error('Invalid date');
  }
}

(async () => {
  //めんどいからroot cronでpuppeteerを起動するようにしたら謎のoptionが必要になった
  //https://qiita.com/HeRo/items/9be64b559692e12cc109
  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(60 * 1000);
  await page.goto(`https://twitter.com/${twitterID}`,
      {waitUntil: ['load', 'networkidle0']});
  console.log(`Logging in to ${twitterID}`);
  await page.type('form.LoginForm input[name=session\\[username_or_email\\]]', twitterID);
  await page.type('form.LoginForm input[name=session\\[password\\]]', password);
  await page.click('form.LoginForm input[type=submit]');
  console.log(`Opening birthday setting page`);
  await page.waitFor('.UserActions-editButton');
  await page.click('.UserActions-editButton');
  await page.waitForSelector('.BirthdateSelect-button', {visible: true});
  await page.click('.BirthdateSelect-button');

  console.log(`Setting ${twitterID}'s birthday to ` + getISOFormat(year, month, day));

  await page.select('.BirthdateSelect-year', year);
  await page.select('.BirthdateSelect-month', month);
  await page.select('.BirthdateSelect-day', day);
  await page.click('.ProfilePage-saveButton');
  await page.click('#confirm_dialog_submit_button');

  console.log('done!');

  await browser.close();
})();
