# everyday-birthday

Twitterの誕生日を毎日0時に変更して、毎日風船を飛ばすやつ

## 動作確認環境
- Docker 1.9.1
- Cent OS 7

たぶんDockerさえ動けばなんとかなる

## 使い方 (From docker hub)
```bash
$ cat secretenv
> TwitterID=gecko655
> Password=yourpasswordgoeshere
> Year=19xx
$ docker run -d --name selenium-standalone -p 4444:4444 -v /dev/shm:/dev/shm selenium/standalone-chrome:latest
$ docker run -d --name everyday-birthday --env-file secretenv -e Hostserver_Hostname=`hostname` gecko655/everyday-birthday
```

## 使い方（From source)
```bash
$ git clone git@github.com:gecko655/everyday-birthday.git
$ cp secretenv.template secretenv
$ vi secretenv
> TwitterID=gecko655
> Password=yourpasswordgoeshere
> Year=19xx
$ ./build.sh
$ ./run_selenium_webdriver.sh # seleniumのDockerイメージが立ち上がる
$ ./run.sh #毎日0時にスクリプトを動かすDockerイメージが立ち上がる
```

secretenvの例:
```
TwitterID=gecko655
Password=thisismypassword
Year=1991
```
