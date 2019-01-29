# Quick Express

A rest API structure made with Express.js ready to use.

# Getting started

## Install your node dependencies

    npm install

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

    GET /check/AuthTokenHere - Checks if the token is valid
    POST /register - Creates a new user account
    POST /login - Login in a user account with email and password
    POST /refresh - Used to get a fresh new token

------

The project come with a component called `example`, it show you the appropiate way to make a good restful api.

    GET /examples - Retrieves all examples
    GET /examples/1 - Retrieves a specific example
    POST /examples - Creates a new example (only works with an authenticated user)
    PUT /examples/1 - Fully Updates example #1 (only works with an authenticated user)
    PATCH /examples/1 - Partially updates example #1 (only works with an authenticated user)
    DELETE /examples/1 - Deletes example #1 (only works with an authenticated user)

 ## Running

    npm start





