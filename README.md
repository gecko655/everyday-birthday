# everyday-birthday

Launch balloons on the user page of Twitter by changing your birthday EVERYDAY.
Twitterの誕生日を毎日0時に変更して、毎日風船を飛ばすやつ

## System requirements
- Docker on Mac 18.09.2
  - Might work on other docker runtimes

Or

- node v11.13.0
  - Might work on other node versions

## Run on Docker
```bash
cp secrets.env.tpl secrets.env
vi secrets.env
./build.sh
./run.sh
```

## Run on node
```bash
cp secrets.env.tpl secrets.env
vi secrets.env
npm install
(export `cat secrets.env` && npm run index)
```
