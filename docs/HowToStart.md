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
{
  "port": 5003,
  "myAddress": "http://localhost",
  "corsOrigin": ["http://localhost"],
  "trustProxy": false
}
```

Port is port, that application will use

MyAddress is address, that will be used to host this application.

CorsOrigin is list of website that will use this application. If you do not care about it, set ["*"]

TrustProxy is a boolean, which will tell express to trust proxy and handle request differently

