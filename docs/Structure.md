# Structure - docs

This file will try to explain the base structure of this application. It is also possible that I forget to include sometime here after changes. If you see some
inconsistances, please update this file.

Last update: 18.05.2025

TLDR:
1. [Base structure](#1-base-structure)

# 1. Base structure

This application is written in DI ( dependency injection ) system. Every logical module ( service, controller ) has its own place and whole application is started in bootstrap, which can be found in [Application code](../src/tools/bootstrap.ts). I am trying to keep it as TDD as possible.

In short, this is project's folder structure inside `src` folder:
```txt
├── connections
│   └── api
│       ├── builder
│       ├── enums.ts
│       ├── index.ts
│       ├── middleware.ts
│       ├── router.ts
│       ├── controllers
│       ├── types.d.ts
│       └── utils
├── services
│   └── health
│       ├── controller.ts
│       └── subModules
│           └── get
│               ├── index.ts
│               └── types.d.ts
├── enums
├── errors
│   ├── handler.ts
│   └── index.ts
├── tools
│   ├── abstractions
│   ├── bootstrap.ts
│   ├── configLoader
│   ├── logger
│   └── state.ts
└── types
```

- Connections 

Connections folder include all 'external' connections, like server's, databases and other types of connections. This does not include API calls, liked fetch:

-- Api includes express server, which starts REST API server.

Api includes multiple folders, for example:
Builder, which includes routes builder based on decorators. This is a small overkill for this project, but I just wanted to include it :D
Enums, which includes all enums, used by express
Index, which is a starting point of express. It starts all routes, middleware and other actions
Middleware includes middleware for REST API
Router includes routes
Controllers is folder, which includes all routes
Types are interfaces used by express
Utils are functions, used inside express

- Services

Services folder includes all logic, from this application. Flow of data is explained in documentation in [Dataflow diagram](./diagrams/Dataflow.md). This folder is divided by main modules and their submodules. Each "module", similarly like in nest.js, is controlling part of code related to itself. It can also "borrow" other services.

- Enums
Enums is small folder, which include enums, which are used widely within the application. They are not solely used by specific fields

- Errors
Errors folder includes custom errors, which include error codes and predefined statused. Throwing those errors makes debugging easier. 
This folder also includes errors handler, which is used exclusively by express.

- Tools

Tools folder includes tools, like state, abstractions and bootstrap, used to initialize the whole infrastructure.

- Types

Types folder includes all interfaces used widely in whole application.

