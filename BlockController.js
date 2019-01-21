const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./Block.js');

/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class BlockController {

    /**
     * Constructor to create a new BlockController, you need to initialize here all your endpoints
     * @param {*} app 
     */
    constructor(app) {
        this.app = app;
        this.blocks = [];
        this.initializeMockData();
        this.getBlockByIndex();
        this.postNewBlock();
    }

    /**
     * Implement a GET Endpoint to retrieve a block by index, url: "/api/block/:index"
     */
    getBlockByIndex() {
        this.app.get("/api/block/:index", (req, res) => {
            console.log('Index value is:', parseInt(req.params.index, 10));

            var idx = parseInt(req.params.index, 10);

            // Validate the index parameter
            if (isNaN(idx)) {
                console.log('ERROR: index value is not a number:', idx);
                res.sendStatus(400);
                return;
            }

            // Is the index out of range?
            if (idx >= this.blocks.length) {
                // Referring to a block that does not exist
                res.sendStatus(404);
                return;
            }

            // Return the found block as json
            res.json(this.blocks[idx]);
        });
    }

    /**
     * Implement a POST Endpoint to add a new Block, url: "/api/block"
     */
    postNewBlock() {
        this.app.post("/api/block", (req, res) => {
            // Read the request body data
            var rBody = req.body.data;

            // Determine the number of blocks in the current chain and the height of the new 
            var hgt = this.blocks.length;

            // Create a new Block
            var tBlock = new BlockClass.Block;
            tBlock.height = hgt; // Set the Block's height
            tBlock.body = rBody; // Set the Block data
            tBlock.hash = SHA256(JSON.stringify(tBlock)).toString(); // Save the Block's hash value

            // Save the new block to the chain
            this.blocks.push(tBlock);

            // Informational console messages
            console.log('INFO: just created a new block with data:', tBlock.body);
            console.log('INFO: the blockchain is now:\n', JSON.stringify(this.blocks));

            // Return to the caller
            res.sendStatus(200);
        });
    }

    /**
     * Help method to inizialized Mock dataset, adds 10 test blocks to the blocks array
     */
    initializeMockData() {
        if (this.blocks.length === 0) {
            for (let index = 0; index < 10; index++) {
                let blockAux = new BlockClass.Block(`Test Data #${index}`);
                blockAux.height = index;
                blockAux.hash = SHA256(JSON.stringify(blockAux)).toString();
                this.blocks.push(blockAux);
            }
        }
    }

}

/**
 * Exporting the BlockController class
 * @param {*} app 
 */
module.exports = (app) => { return new BlockController(app); }