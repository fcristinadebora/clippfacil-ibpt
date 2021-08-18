# ClippFacil IBPT
> Microservice that fetch IBPT from De Olho No Imposto's official API and stores it into self database, so it doesn't have to fetch it again, every time

### Built with
- [NodeJs v15.9.0](https://nodejs.org/)
- [Docker](https://www.docker.com/)

## Running development server

### Install dependenciesd

```
npm install
```

### Set up .env file for application
```sh
cp .env.example .env
```

And configure your variables

### Set up database container

```
docker-compose up -d
```

### Start development server

```
npm start
```

## Usage


### Build docker image
```
docker-compose build app
```

### Start the environment
```
docker-compose up -d
```

### Install dependencies

There's a script, `exec-app-container.sh` that simplifies the `docker-compose exec app` command, you can use it for several purposes. See steps below:

```sh
./exec-app-container.sh composer install
```

### Set up .env file for docker

Copy/rename the .env.example file for docker-compose database configs

```sh
cp .env.example .env
```

And set up your variables/credentials in the file content.

### Set up .env file for application
```sh
cp .env.example .env
cp .env.example .env.testing
```

And set up your variables/credentials in the files content.

Note: `.env.testing` variables should be equivallent to `DB_TEST_*` variables in `.env` for docker. And so on for `.env` and `DB_*`

### Run application setup command
Run the script below to run all steps
```sh
make app-setup
```

Or:

#### Generate application key

```sh
make key
```

#### Run migrations

```sh
make migrate
```

#### Run seeders

```sh
make seed
```

#### Generate passport keys

```sh
make passport
```

## Running tests

Tests were built with PHPUnit, to execute tests just run the comand below:
```sh
make test
```

## Todo

There are some tasks to finish. See [./docs/todo.md](./docs/todo.md) to see project's task tracking.

Some improvements in this project may be:
1. Generate automatic documentation for API's endpoints (using swagger or [mpociot/laravel-apidoc-generator](https://github.com/mpociot/laravel-apidoc-generator));
2. Improve unit and feature tests (current tests are just basic tests);
3. Improve validation's callbacks making it easier to identify errors;
4. Search for duplicate code and create abstractions;
5. Remove redundances in unit tests;
6. Improve `.env` files (remove redundances, set variables in just one file)
