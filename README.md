[![CodeFactor](https://www.codefactor.io/repository/github/scriptaria/quick-express/badge)](https://www.codefactor.io/repository/github/scriptaria/quick-express)

# Quick Express

A rest API structure made with Express.js ready to use.

# Getting started

## Configure and understand your project

The `src` folder is the place where your project stays.

 * Set your settings in `src/settings.ts`
   * Put any random in string `auth.secret`, it will serve to generate authentication tokens
     *  The larger and more variety of characters (including special characters), the safer it will be.
 * Set your routes and point them to his component in `src/settings.ts`
 * Place your modules in `src/modules/` and describe them in `src/modules.ts`
 * Your models stay at `src/models/`. Quick Express comes with TypeORM as its default ORM
 * Place your middlewares in `src/middlewares.ts`

------

The project already have the ability to provide secure authentication

    POST /users - Create a new user
    POST /users/login - Login with email and password`
    POST /users/refresh - Get new access and refresh tokens

------

The project come with a component called `tasks`, it show you the appropiate way to make a good restful api.

    GET /tasks - Retrieves all logged user tasks
    GET /tasks/1 - Retrieves a specific task
    POST /tasks - Creates a new task (only works with an authenticated user)
    PUT /tasks/1 - Fully Updates task #1 (only works with an authenticated user)
    PATCH /tasks/1 - Partially updates task #1 (only works with an authenticated user)
    DELETE /tasks/1 - Deletes task #1 (only works with an authenticated user)

## CLI Tool

Quick Express comes with a simple CLI tool to generate components such as Models and Modules, take a try:

    npm run quick generate module exampleModule
    npm run quick generate model exampleModel

## Install your node dependencies

    npm install

## Running

    npm start

## Use docker if you prefer

    docker-compose up






