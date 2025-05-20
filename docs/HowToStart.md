# How to start - docs

Last update: 18.05.2025

This file will try to explain, how to start this project and setup configs.

TLDR;
1. [Configs](#1-configs)

## 1. Configs

This application uses 2 config files:
- devConfig.json
- prodConfig.json

DevConfig will be used, if you run your application with NODE_ENV=development. This config should be used while working on this application

ProdConfig will be used, if you run your application with NODE_ENV=production. This should be used in production env

Each config includes few elements:
```json
```json
{
  "port": 5003,
  "corsOrigin": ["http://localhost"],
  "apiTarget": "http://localhost:3000",
  "apiReqTimeout": 5000,
  "iterationsTimeout": 1000,
  "repository": "memory"
}
```

Port is port, that application will use.

CorsOrigin is list of website that will use this application. If you do not care about it, set ["*"].

Api target is api target, that this app should aim for.

Api req timeout is timeout, which after fetch should throw an error

Ttterations timeout defines how often request will be send to fetch new data

Repository is config, what kind of repo should be chosen while saving the data. Currently, only supported repo is `memory`

> [!TIP]
> You can find exampleConfig in `/configs` folder. Place your new configs next to it

## 2. Startup

This application will start on port, you provided in configs. In addition to that, this application will also expose swagger docs on /api/docs.