[![CodeFactor](https://www.codefactor.io/repository/github/scriptaria/quick-express/badge)](https://www.codefactor.io/repository/github/scriptaria/quick-express)
[![Github Actions - Test CI](https://github.com/scriptaria/quick-express/workflows/tests/badge.svg)](https://github.com/scriptaria/quick-express/actions?query=workflow:tests)

# Quick Express

A ready to use rest API structure made with Express.js and Typescript.

Quick Express counts with:

- ORM ([TypeORM](https://github.com/typeorm))
- Tests ([Jest](https://github.com/facebook/jest) and [Super Test](https://github.com/visionmedia/supertest))
- API Documentation ([apidoc](https://apidocjs.com))
- JWT Authentication
- A request parameters (request.body, request.query, request.params) validation system (that uses [validate.js](https://github.com/ansman/validate.js))
- A great and organized project structure.

# Getting started

## Configure and understand your project

### Environment settings
You will need a `.env` file. In this file, you put all your sensitive and environment info.

Running the command `npm run generate env sqlite`, a `.env` file will be generated using the requested template (_sqlite_, _mysql_ or _postgres_).

Note¹: _sqlite_, _mysql_ and _postgres_ are just the supported templates by the CLI for now, but you can use any database that is supported by [TypeORM](https://github.com/typeorm)

Note²: if you prefer, you can just make a copy of `.env.example` and name it as `.env`

**Is recommended to not commit the `.env` file.**

### The `src` directory is where your source code stays.

- Your modules (routes and endpoints) in `src/modules/`
- Your middleware in `src/middleware/`
- Your db models in `src/models/`

---

The project already comes with a module called `users`. It provides secure authentication for your project using JWT.

    POST /users - Create a new user
    POST /users/login - Login with email and password
    POST /users/refresh - Get new access and refresh tokens

And the project also comes with a module called 'tasks', that shows you the appropriate way to make a good REST API. These endpoints only work with authenticated users.

    GET /tasks - Retrieves all logged user tasks
    GET /tasks/1 - Retrieves a specific task by id
    POST /tasks - Creates a new task
    PATCH /tasks/1 - Updates task #1
    DELETE /tasks/1 - Deletes task #1

**You can see all the default endpoints that comes with Quick Express in the `requests.http` file, and you can use [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) to test it all in VSCode.**

## CLI Tool

The project also comes with a simple CLI tool to generate components such as Models and Modules, take a try:

    npm run generate module nameOfMyModule
    npm run generate model nameOfMyModel
    npm run generate middleware nameOfMyMiddleware
    npm run generate env sqlite
    npm run generate env mysql
    npm run generate env postgres

## Documentation

Quick Express comes with [apidoc](https://apidocjs.com). Run `npm run doc` to generate de doc on `/doc` folder.

Consider consulting the [apidoc documentation](https://apidocjs.com/#getting-started) to learn more.

## Install your node dependencies

    npm install

## Running

    npm start
