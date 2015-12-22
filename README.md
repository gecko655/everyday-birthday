# everyday-birthday

Twitterの誕生日を毎日0時に変更して、毎日風船を飛ばすやつ

## 動作確認環境
- Docker 1.9.1
- Cent OS 7

たぶんDockerさえ動けばなんとかなる
## 使い方
1. clone
1. ``$ cp secretenv.template secretenv``
1. secretenvの中身を埋める
1. ``$ ./build.sh``
1. ``$ ./run_selenium_webdriver.sh`` # seleniumのDockerイメージが立ち上がる
1. ``$ ./run.sh`` #毎日0時にスクリプトを動かすDockerイメージが立ち上がる

secretenvの例:
```
TwitterID=gecko655
Password=thisismypassword
Year=1991
```
