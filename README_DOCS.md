# Readme - Notes 

## Introduction

Hi. if you are here to validate my code, these notes are for you. 

This application was created based on one of my templates for dependency injection system. It is a overkill for that kind of usecase and I do understand it. That's why I also included another branch called `properCode`, which is written in simpler, but still reusable code. 

I also modified preexisting tsconfig and added eslint. I did those 2 things, because for me its easier to work with more "strict" code, similar to what c++ has. Sadly, forcing similar way of "strictness" in ts code is not possible, but I tried my best. Ofc, rules applied by whole team, or preexisting rules in work projects will be "the only source of truth". I only modified tsconfig here, because I am ( and most likely will be ) the only person working on this repo.

I wrote this app in `Git flow` schema, trying to keep main branch ( dev in my example, with regular pushed to main and tagging every proper version ) as "straight" as possible, properly rebasing all commits as I do usually at work.

I wrote this app, compiling it to es22. I am used to having getters and setter, but because they take too much space I used accessors. Why, since they are not required ? Old habits die hard I guess ? Having schematic code is good, because its more readable even for people, who do not work daily on the same languages. Getters and setters in state are used for interface manipulation. By the time any data from state will be used, every field on state will be properly initialized.

## How to start

I assume that you don't want to read a wall of text on how to start this app, Simply make sure that you have node.js with version bigger than 19 ( because I use native fetch ) and do:
```bash
npm install
cp config/exampleConfig.json config/devConfig.json
cp config/exampleConfig.json config/prodConfig.json
```

And now you are ready to start application. You can start it in production mode:

```bash
npm run start
```

Or in development mode:

```bash
npm run start:dev
```

Keep in mind, that my package.json does not set NODE_ENV=production for `npm run start`. Env should be set by either engine used to run this, or some other source. `npm run start` is left without env for this reason.

## Other notes

I did not include any docker files or k8s or probes for k8s or anything else, because I believe that this is outside scope of this app. If required, please send me an email.
