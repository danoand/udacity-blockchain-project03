//Importing Express.js module
const express = require("express");
//Importing BodyParser.js module
const bodyParser = require("body-parser");
// Import the crypto-js sha256 module
const SHA256 = require('crypto-js/sha256');
const { db, addLevelDBData, getLevelDBData, echoDB, clearDB, numBlocks } = require('./levelSandbox');

/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class Block {
	constructor(data) {
		this.hash = "",
			this.height = 0,
			this.body = data,
			this.time = 0,
			this.previousBlockHash = ""
	}
}

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class Blockchain {
	constructor() {
		this.init();
	}

	async init() {
		var num = await numBlocks();

		// Any key/value pairs in the levelDB?
		if (num == 0) {
			// no: insert the 'genesis' block
			await this.addBlock(new Block("First block in the chain - Genesis block"));
		}
	}

	// Add new block
	async addBlock(newBlock) {
		// Get the current block height
		var curHeight = await this.getBlockHeight();

		// Set the new block's height
		newBlock.height = curHeight + 1;

		// Generate a UTC timestamp
		newBlock.time = new Date().getTime().toString().slice(0, -3);

		// Processing a non-genesis block?
		if (newBlock.height != 0) {
			// Generate the previous block's hash
			var lastBlock = await this.getBlock(curHeight);
			newBlock.previousBlockHash = lastBlock.hash;
		}

		// Block hash with SHA256 using newBlock and converting to a string
		newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();

		// Store the new block to the levelDB
		await addLevelDBData(newBlock.height, JSON.stringify(newBlock));
	}

	// Get block height
	async getBlockHeight() {
		var nBlocks = await numBlocks();

		// Return the height of the blockchain 
		return nBlocks - 1;
	}

	// get block
	async getBlock(blockHeight) {
		var tmpBlock = await getLevelDBData(blockHeight);
		return JSON.parse(tmpBlock);
	}

	// validate block
	async validateBlock(blockHeight) {
		// get block object
		var tmpBlock = await this.getBlock(blockHeight);
		// get block hash
		var tmpBlockHash = tmpBlock.hash;
		// remove block hash to test block integrity
		tmpBlock.hash = '';
		// generate block hash
		var validBlockHash = SHA256(JSON.stringify(tmpBlock)).toString();
		// Compare
		if (tmpBlockHash === validBlockHash) {
			return true;
		} else {
			console.log('Block #' + blockHeight + ' invalid hash:\n' + tmpBlockHash + '<>' + validBlockHash);
			return false;
		}
	}

	// Validate blockchain
	async validateChain() {
		var errorLog = [];

		// Determine the height of the blockchain
		var hgt = await this.getBlockHeight();

		// Iterate through the chain of blocks
		for (let i = 0; i < hgt; i++) {
			// Validate the block
			var isValid = await this.validateBlock(i);
			if (!isValid) errorLog.push(i);

			// Compare the blocks' hash links
			var curBlock = await this.getBlock(i);
			var nextBlock = await this.getBlock(i + 1);

			// Expected hash relationship between adjacent blocks?
			var blockHash = curBlock.hash;
			var previousHash = nextBlock.previousBlockHash;
			if (blockHash !== previousHash) {
				errorLog.push(i);
			}
		}

		// Validate the last block in the chain
		if (hgt > 0) {
			var flgVal = await this.validateBlock(hgt);
			if (!flgVal) {
				// invalid block
				errorLog.push(hgt);
			}
		}

		if (errorLog.length > 0) {
			console.log('Block errors = ' + errorLog.length);
			console.log('Blocks: ' + errorLog);
			return false;
		} else {
			console.log('No errors detected');
			return true;
		}
	}
}

/**
 * Class Definition for the REST API
 */
class BlockAPI {

    /**
     * Constructor that allows initialize the class 
     */
	constructor() {
		this.app = express();
		this.initExpress();
		this.initExpressMiddleWare();
		this.initControllers();
		this.start();
	}

    /**
     * Initilization of the Express framework
     */
	initExpress() {
		this.app.set("port", 8000);
	}

    /**
     * Initialization of the middleware modules
     */
	initExpressMiddleWare() {
		this.app.use(bodyParser.urlencoded({ extended: true }));
		this.app.use(bodyParser.json());
	}

    /**
     * Initilization of all the controllers
     */
	initControllers() {
		require("./BlockController.js")(this.app);
	}

    /**
     * Starting the REST Api application
     */
	start() {
		let self = this;
		this.app.listen(this.app.get("port"), () => {
			console.log(`Server Listening for port: ${self.app.get("port")}`);
		});
	}

}

new BlockAPI();

module.exports = {
	Block: Block,
	Blockchain: Blockchain,
	BlockAPI: BlockAPI
}