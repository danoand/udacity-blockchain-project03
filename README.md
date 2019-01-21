# Project 03 - RESTful Web API with Node.js Framework

This archive includes a Node.js application that exposes a REST API service to fetch and save blocks of a blockchain.

The blockchain is persisted to disk using a local LevelDB data store.

## Application Requirements

The application requires these underlying technologies and packages.

* The application is a Node.js program requiring Node.js (https://nodejs.org) and npm (https://www.npmjs.com/) in order to install required Javascript packages

Use npm to install these required packages

* `express`: a fast, unopinionated, minimalist web framework used to enable REST HTTP calls
* `level`: Fast & simple storage - a Node.js-style LevelDB wrapper used to persist the blockchain to local storage
* `body-parser`: Node.js body parsing middleware to parse data sent via HTTP request bodies
* `crypto-js`: JavaScript library of crypto standards used to "hash" blockchain data

## Steps to Install & Execute the Web Service

1. If not already installed, install Node.js and npm on your machine
2. Clone the repository to your local computer.
3. Open the terminal and install the packages: `npm install`.
4. Start the application: `node app.js`. The web service will run on port `8000` or `http://localhost:8000`

## API Endpoints

The web service support two basic endpoints to fetch a block from the blockchain and append a block to the blockchain.

### 1. Fetch a Block from the Blockchain: Method: `GET` Route: `/block/<id>`

##### Example Request: **GET** `http://localhost:8000/block/1`

##### Example Response

```
{
  "hash": "85f4c5359d8c1ac37461c61270abc6de94df081b5ea040019cbdedb08549eeae",
  "height": 1,
  "body": "Test Block #1",
  "time": "1548051136",
  "previousBlockHash": "70817a1d7c4099d5dcd9967b689b4a56b4de42518c62cba11258408faf31f5ab"
}
```

### 2. Append a Block to the Blockchain: Method: `POST` Route: `/block`

##### Example Request: **POST** `http://localhost:8000/block`

##### Example Request Body:

```
{
    "body": "Test Block #2"
}
```

##### Example Response

```
{
  "hash": "4665a57e5348435bf450311ed6c43d2b34c4e77b7f713f20db05f7a160dac42d",
  "height": 3,
  "body": "Test Block #2",
  "time": "1548053033",
  "previousBlockHash": "c095c787e5e84430d916d79a2784d96bdf900a04984e10b319f343c4ec60e0a4"
}
```