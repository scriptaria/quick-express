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
 * Place your components in `src/components/`
 * Place your middlerates in `src/middlewares.ts`

------

The project already have the ability to provide secure authentication

    GET /auth/check/AuthTokenHere - Checks if the token is valid
    POST /auth/register - Creates a new user account
    POST /auth/login - Login in a user account with email and password
    POST /auth/refresh - Used to get a fresh new token

------

The project come with a component called `post`, it show you the appropiate way to make a good restful api.

    GET /posts - Retrieves all posts
    GET /posts/1 - Retrieves a specific post
    POST /posts - Creates a new post (only works with an authenticated user)
    PUT /posts/1 - Fully Updates post #1 (only works with an authenticated user)
    PATCH /posts/1 - Partially updates post #1 (only works with an authenticated user)
    DELETE /posts/1 - Deletes post #1 (only works with an authenticated user)

## Install your node dependencies

    npm install

## Running

    npm start

## Use docker if you prefer

    docker-compose up






