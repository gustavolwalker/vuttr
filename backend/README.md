# VUTTR-BACKEND
This is a sample backend code to control some tools to remember writing in NodeJS, Express, Body-Parser, Typeorm, PostgresSQL, TypeScript, Jest, and more.

## Scripts to use

### Init 
To inicialize repository you need to run first:

```sh
yarn install
```

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

### Check API Documentation
The API documentation is written using the [API Blueprint](https://apiblueprint.org/). I'm using [Aglio](https://github.com/danielgtaylor/aglio#readme) to read in a pretty format, we recommend to install it:

```sh
npm install -g aglio
```

To run server using this command:

```sh
yarn api-doc
```

It's start a web server on port localhost:3003 


### Generate a build
Execute tsc to create a build:

```sh
yarn build
```
