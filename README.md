[![CodeFactor](https://www.codefactor.io/repository/github/scriptaria/quick-express/badge)](https://www.codefactor.io/repository/github/scriptaria/quick-express)

# Quick Express

A ready to use rest API structure made with Express.js and Typescript.

# Getting started

## Configure and understand your project

Make a copy of `.env.example` to `.env` and put your environment settings there. Is recommended to not commit the `.env` file.

The `src` is where your source code stays.
 * Set your routes/modules in `src/modules.ts`
 * Place your middlewares in `src/middlewares.ts`
 * Your models are at `src/models/`. Quick Express comes with TypeORM as its default ORM.

------

The project already have the ability to provide secure authentication

    POST /users - Create a new user
    POST /users/login - Login with email and password
    POST /users/refresh - Get new access and refresh tokens

------

The project come with a module called `tasks`, it shows you the appropriate way to make a good restful API. These endpoints only work with authenticated users.

    GET /tasks - Retrieves all logged user tasks
    GET /tasks/1 - Retrieves a specific task by id
    POST /tasks - Creates a new task
    PATCH /tasks/1 - Updates task #1
    DELETE /tasks/1 - Deletes task #1

## CLI Tool

Quick Express comes with a simple CLI tool to generate components such as Models and Modules, take a try:

    npm run quick generate module exampleModule
    npm run quick generate model exampleModel

## Install your node dependencies

    npm install

## Running

    npm start




