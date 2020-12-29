# Task app

Task web application taken from Udemy course [The Complete Node.js Developer Course (3rd Edition)](https://www.udemy.com/course/the-complete-nodejs-developer-course-2/) (Section 10-13). Covers REST API development basics with [Mongo DB][mongoId], [Mongoose ODM](https://mongoosejs.com/) and [Node.js][nodeId].

## Prerequisites

- JavaScript runtime — [Node.js][nodeId]
- NoSQL database — [MongoDB][mongoId]
- MongoDB GUI — [MongoDB Compass](https://www.mongodb.com/products/compass)
- Platform for API development — [Postman][postmanId] (Recommended for manual REST API testing)

## Environment setup

Create `test.env`, `dev.env`, `prod.env` files inside config folder. Each file should contain list of Node environment variables accordingly to the environment. Check out an examples in `config/example.env`.

## Installation

Use npm to install required dependencies
```
npm i
```

## Usage

Run npm script in order to launch application in production environment
```
npm start
```
or other one for launching in development environment
```
npm run dev
```
And for running tests in test environment
```
npm test
```

## Recommendations
For improving application usage experience use [Postman][postmanId]. Import `task_app.postman_collection.json` collection file inside [Postman][postmanId] desktop client and get access to REST API endpoints setup.

[mongoId]: https://www.mongodb.com/
[nodeId]: https://nodejs.org/en/
[postmanId]: https://www.postman.com/
