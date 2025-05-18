# Real-time Crawlers - Readme

TLDR:
1. [Description](#1-description)
2. [How to start](#2-how-to-start)
3. [How to build](#3-how-to-build)
4. [Tests](#4-tests)
5. [Useful information](#5-useful-information)
6. [Docs](#6-docs)
7. [Style](#7-style)
8. [Issues](#8-issues)
9. [Addons](#9-addons)

## 1. Description

This application is a crawler, used get information about sport events. Description is WIP for now. 

I do understand, that for a basic task like api crawler, this infrastructure based on DI is a overkill ( original readme point Guidelines.2. ), but it was easier for me to work with it that way. Working with others on a code will differ from working solo on this app.

## 2. How to start

- Install dependencies

```bash
npm install / yarn
```

- Start application in development mode

```bash
npm run start:dev / yarn start:dev
```

- Start application in production mode

```bash
npm run start / yarn start
```

Above scripts will let you start this application. You can find more detailed guide in [/docs/HowToStart.md](./docs/HowToStart.md)

## 3. How to build

```bash
npm run build / yarn build
```

> [!IMPORTANT]
> If you even encounter strange build behavior, tsconfig is set to create build with cache. Set option `incremental` in tsConfig to false or remove dist folder and try again

## 4. Tests

## 5. Useful information

### 5.1 Hooks

Instead of adding additional packages like husky, its easier to add hooks manually. If you want your code to check its quality and test itself before committing code, you can add this code to `.git/hooks/pre-commit`
```bash
#!/bin/sh

set -e

echo "Running lint-staged"
npm run lintStaged

echo "Running tsc"
npm run listErrors

echo "Running unit tests"
npm run test:unit

echo "Running db tests"
npm run test:db

echo "Running e2e tests"
npm run test:e2e

echo "Auditing"
npm audit
```

Above code will:
- Lint your staged code
- Validate if it can be built
- Test it
- Audit it

Most of people that I've meet, do not care about auditing their code. If you do not care if packages includes in your app have known vulnerabilities, you can remove last 2 lines from this code. Keep in mind, that github pipelines also run the same commands.

### 5.2 Configs

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

Port is port, that application will use.

MyAddress is address, that will be used to host this application.

CorsOrigin is list of website that will use this application. If you do not care about it, set ["*"].

Trust proxy is an option for express-rate-limiter to use. If set to true, if will disable security settings, meant to validate headers.

## 6. Docs

### 6.1 Environments

This application utilizes `NODE_ENV` env, which is set in package.json. `start` command does not include NODE_ENV. This is prepared for docker or any external tools, to manipulate environment.

- Production - prod env. This is the env you want, if you are planning on running production env. This mode disables debug logs.
- Development - development settings. If you are working on this application, thats the mode you want 
- Test - test env, set while running tests. This env will prevent express router from starting

### 6.2 Logging

This project utilizes custom logger. It provides:

- Log - default logs that you can create.
- Warn - warnings
- Error - errors
- Debug - debug logs, which are disabled if production env is set. More in #6.1
- Time - start counting time for action
- EndTime - finish counting time for action

### 6.3 Connections and access

When I write my apps, I prefer to have some kind of global state, which allows my app to have access to every external connection from any point in code. You can find this "state" in `/src/tools/state`. This state is used to keep external connections and to manage them. For example, instead of dependency injecting each connection to each route, I prefer to just access them from that global state 

### 6.4 Sigterm, Sigint

This application uses handlers for sigint and sigterm. What are those ? Application is listening for "kill process" system received by operating system or user. In short term, its listning for `ctr + c` and makes sure to close all connections after it dies.

### 6.5 Additional docs

[Dataflow in application](./docs/diagrams/dataflow.md)
[Pipelines](./docs/Pipelines.md)

Additional docs can be found in `docs` folder 

## 7. Style

This application uses my personal eslint settings. They are EXTREMELY strict and will force you to write specific type of code with unified style across whole project. This is `MY` config. You may not like it so please, modify it to your heart desire.

In addition to having super stupid strict eslint, tsconfig is also super strict. I love how c/c++ requires user to have strict code. I tried to make similarly strict tsconfig, but because typescript is dynamically types, it is not possible. I did my best :D . In case that this config is too strict, simply modify it however you want.

## 8. Issues 

> [!TIP]
> This category will try to explain basic issues, that you might encounter with this app. This will not include every possible issues, that was created on github, rather basic problems, that you might not expect

- `Start:dev` throws `Cannot find module`

There are 2 reason, why this might happen.

> [!NOTE]
> You started this app for the first time

1. Due to limitations with libraries, this command will throw an error, if you run it first time. Simply return it again. This is happening a lot on windows.

> [!NOTE]
> You've been working on this app for a while

2. Something got cached in the background, after you've been working on this app for a while. This can happen, but its rare. There is a note related to it in tip under point #3. All you need to do is to remove cache. If your terminal supports make ( linux, macos, windows bash terminal and others ), simply run:

```bash
make clean
```

If you are unable to run make command, remove dist folder

- I keep getting errors that npm eslint packages are not compatible:

Due to amount of eslint modules, some of them might not be compatible with each other. At one day they might be and after npm install, they might throw errors. Simply update them to latest versions. This is safe, because eslint does not make many breaking changes.

## 7. Addons

In package.json, engine is locked to version +=19. This was done, because eslint wasn't compatible with version below 19. Running this app should still be possible in version below 19. This was done, only for eslint.

Original tsconfig was also slightly modified by me. I did not see any reason to have declarations included, since this application wasn't meant to be a external package, rather a API. In addition to removing declarations, I've decided to addon my personal "base" setup. This was done, because original tsconfig wasn't super strict and this project is my project. Modifications of config files like this should always be resolved in a team.

