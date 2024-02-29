## Description

- Author - Santiago Arango Varon
- Task - Code challenge
- Company - Seen

The code challenge consist in create and API that resolve two real exercises using a list of transactions, as a (data)[https://cdn.seen.com/challenge/transactions-v2.json] source.

The solution of the first exercise is based on the transactionDate because the transactions have a lifecycle definition and they are subsequent one on the other. For the second solution, I decided to split the logic into different pieces so it's more testable and reusable, to easily update the rules if the fraud team needs to modify or add more.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Stay in touch

## License

Nest is [MIT licensed](LICENSE).
