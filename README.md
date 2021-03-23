# everyday-birthday

![Docker Automated build](https://img.shields.io/docker/automated/gecko655/everyday-birthday.svg)
![everyday-birthday](https://github.com/gecko655/everyday-birthday/workflows/everyday-birthday/badge.svg?event=schedule)

Launch balloons on the user page of Twitter by changing your birthday EVERYDAY.

Twitterの誕生日を毎日0時に変更して、毎日風船を飛ばすやつ

## System requirements
- Docker on Mac 18.09.2
  - Might work on other docker runtimes

Or

- node v12.2
  - Might work on other node versions

## Run on Docker (by cron)
```bash
curl https://raw.githubusercontent.com/gecko655/everyday-birthday/master/secrets.env.tpl -o secrets.env
docker pull gecko655/everyday-birthday
docker run --name everyday-birthday -d --env-file secrets.env gecko655/everyday-birthday
```

or

```bash
# clone this repository
cp secrets.env.tpl secrets.env
vi secrets.env
./build.sh
./run.sh
```

## Run on node (for one time)
```bash
cp secrets.env.tpl secrets.env
vi secrets.env
npm install
(export `cat secrets.env` && npm run index)
```

## demo
https://twitter.com/gecko655

![](./images/everyday-birthday-demo.gif)

### [gecko655's birthdays](https://pixe.la/v1/users/gecko655/graphs/birthdays.html) (since 2020-01-19)
![](https://pixe.la/v1/users/gecko655/graphs/birthdays)
Powered by [Pixela](https://pixe.la)
