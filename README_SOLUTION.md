# Real-time Crawlers - Readme

TLDR:
1. [Description](#1-description)
2. [How to start](#2-how-to-start)
3. [How to build](#3-how-to-build)
7. [Addons](#7-addons)

## 1. Description

This application is a crawler, used get information about sport events. Description is WIP for now.

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

## 3. How to build

```bash
npm run build / yarn build
```

> [!IMPORTANT]
> If you even encounter strange build behavior, tsconfig is set to create build with cache. Set option `incremental` in tsConfig to false or remove dist folder and try again

## 7. Addons

In package.json, engine is locked to version +=19. This was done, because eslint wasn't compatible with version below 19. Running this app should still be possible in version below 19. This was done, only for eslint.

Original tsconfig was also slightly modified by me. I did not see any reason to have declarations included, since this application wasn't meant to be a external package, rather a API. In addition to removing declarations, I've decided to addon my personal "base" setup. This was done, because original tsconfig wasn't super strict and this project is my project. Modifications of config files like this should always be resolved in a team.

