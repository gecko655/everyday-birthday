# everyday-birthday

[![everyday-birthday](https://github.com/gecko655/everyday-birthday/actions/workflows/main.yml/badge.svg)](https://github.com/gecko655/everyday-birthday/actions/workflows/main.yml)
![](https://pixe.la/v1/users/gecko655/graphs/birthdays?mode=badge)

Launch balloons on the user page of Twitter by changing your birthday EVERYDAY.

Twitterの誕生日を毎日0時に変更して、毎日風船を飛ばすやつ

## System requirements
- node v20
  - Might work on other node versions

## How it works
This project runs automatically on GitHub Actions using a scheduled workflow (cron).
The workflow runs daily at 00:01 JST (15:01 UTC) to update the Twitter birthday.

## Run locally (for one time)
```bash
cp secrets.env.tpl secrets.env
vi secrets.env
yarn install
(export $(cat secrets.env) && yarn index)
```

## Development
### Format code
```bash
npm run format        # Format all files
npm run format:check  # Check formatting without making changes
npm run lint          # Run linter
npm run check         # Run all checks (format + lint)
```

## demo
https://twitter.com/gecko655

![](./images/everyday-birthday-demo.gif)

### [gecko655's birthdays](https://pixe.la/v1/users/gecko655/graphs/birthdays.html) (since 2020-01-19)
![](https://pixe.la/v1/users/gecko655/graphs/birthdays)
Powered by [Pixela](https://pixe.la)
