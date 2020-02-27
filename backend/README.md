# template-backend
Template to create a new nodejs/express backend;

This template is a basecode to development backend's using NodeJS, Express, Body-Parser, Typeorm, PostgresSQL, TypeScript, Jest, and more.

## Scripts to use

### Create a dev database
To create a dev database:

```sh
yarn typeorm migration:run
```

This command run migrations script's on a dev database (default: Postgresql at localhost:5433/vuttr), see '.env' to change it;

### Clean dev database

To revert all migrations:
```sh
yarn typeorm schema:drop
```

### Running in dev 
Execute in develpment mode using nodemon:

```sh
yarn dev
```

This script won't execute migrations, if necessary check [Create a dev database](#create-a-dev-database)


### Running tests 
Execute tests using JEST:

```sh
yarn test
```

If you want to execute dev tests we provide two files 'postman-environment.json' to configure enviroments variables and 'postman-vuttr.json' with a collection of tests;


### Generate a build
Execute tsc to create a build:

```sh
yarn build
```
