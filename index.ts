import puppeteer from 'puppeteer';
import moment from 'moment';
import { authenticator } from 'otplib';

function getISOFormat(year: string, month: string, day: string) {
  return `${year}-` +
      `${String(month).padStart(2, '0')}-` +
      `${String(day).padStart(2, '0')}`;
}

const twitterID = process.env.TWITTER_ID!;
const password = process.env.PASSWORD!;
const year = process.env.YEAR!;
const mail = process.env.MAIL!;
const totpSecret = process.env.TOTP_SECRET!;
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
  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36')
    page.setDefaultNavigationTimeout(60 * 1000);
    await page.goto(`https://twitter.com/login`,
        {waitUntil: ['load', 'networkidle0']});
    console.log(`Logging in to ${twitterID}`);
    await page.type('input[name=session\\[username_or_email\\]]', twitterID);
    await page.type('input[name=session\\[password\\]]', password);
    await page.click('div[data-testid=LoginForm_Login_Button]');

    let challenge_elem = await page.mainFrame().$('#challenge_response');
    let attempts = 0
    while(challenge_elem != null) {
      if(attempts>3) {
        throw new Error('2FA failed');
      }
      console.log('2FA challenge')
      const totpToken = authenticator.generate(totpSecret);
      await page.type('#challenge_response', totpToken);
      await page.click('#email_challenge_submit');
      challenge_elem = await page.mainFrame().$('#challenge_response');
      attempts++;
    }
    console.log(`Go to user page`);
    await page.goto(`https://twitter.com/${twitterID}`)
    console.log(`Open profile setting page`);

    await page.goto(`https://twitter.com/settings/profile`),
    await page.waitFor('div[data-testid=ProfileBirthdate_Edit_Button]');
    await page.click('div[data-testid=ProfileBirthdate_Edit_Button]');
    await page.waitFor('div[data-testid=confirmationSheetConfirm]');
    await page.click('div[data-testid=confirmationSheetConfirm]');

    console.log(`Setting ${twitterID}'s birthday to ` + getISOFormat(year, month, day));

    await page.waitFor('select[data-testid=ProfileBirthdate_Year_Selector]');
    await page.select('select[data-testid=ProfileBirthdate_Year_Selector]', year);
    await page.select('select[data-testid=ProfileBirthdate_Month_Selector]', month);
    await page.select('select[data-testid=ProfileBirthdate_Day_Selector]', day);

    console.log(`Save birthday`);

    await page.click('div[data-testid=Profile_Save_Button]');
    await page.waitFor('div[data-testid=confirmationSheetConfirm]');
    await page.click('div[data-testid=confirmationSheetConfirm]');
    await page.waitFor(4000); //適当に待つ

    console.log('done!');
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.log(e);
  process.exitCode = 1;
});
