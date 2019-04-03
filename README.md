# Typescript API Starter Kit [WIP]

[![CircleCI](https://circleci.com/gh/davidfloegel/node-typescript-starter/tree/master.svg?style=svg&circle-token=68cb6b4b7ded89a2e2d85777933cdfd4d63d98f2)](https://circleci.com/gh/davidfloegel/node-typescript-starter/tree/master)

This typescript starter is a collection of things I find myself doing over and over again
when setting up a new project. To be able to prototype something new as quickly as possible
I'm building this starter kit which includes things like 

* Sign Up with email confirmation
* Login
* Reset password
* Email services

## What does it include?

* 🔥 Typescript
* 💾 MongoDB
* 🔒 Unit Tests
* 📖 BDD Tests
* 💡 Context based setup
* 🔑 Authentication Service
* ✉️  Sendgrid Email Service

## To Dos

- [ ] Run linting, tests & bdd on CI

## Getting started

To get started, clone or fork the repository.

Copy the `.env.example` file to `.env` and set a session secret. If you do not want to use docker
you can set a new mongodb url.

To start the project simply run
```
docker-compose up
```

Available commands
```
// Run linting
docker-compose exec tsapi yarn tslint

// Run tests
docker-compose exec tsapi yarn test

// Run tests in watch mode
docker-compose exec tsapi yarn watch-test

// Run BDD
docker-compose exec tsapi yarn bdd
```

## Building

To build the api and ready it for deployment, run:
```
docker-compose exec tsapi yarn build
```
