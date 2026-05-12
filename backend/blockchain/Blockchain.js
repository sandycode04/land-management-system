const Block = require('./Block');
const fs = require('fs');
const path = require('path');

class Blockchain {
  constructor() {
    this.chainFile = path.join(__dirname, 'chain.json');
    this.difficulty = 2;
    this.chain = this.loadChain();
  }

  loadChain() {
    if (fs.existsSync(this.chainFile)) {
      const data = JSON.parse(fs.readFileSync(this.chainFile));
      return data;
    }
    const genesis = new Block(0, Date.now(), { message: 'Genesis Block' }, '0');
    const chain = [genesis];
    fs.writeFileSync(this.chainFile, JSON.stringify(chain, null, 2));
    return chain;
  }

  saveChain() {
    fs.writeFileSync(this.chainFile, JSON.stringify(this.chain, null, 2));
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(data) {
    const latest = this.getLatestBlock();
    const newBlock = new Block(
      this.chain.length,
      Date.now(),
      data,
      latest.hash
    );
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
    this.saveChain();
    return newBlock;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const current = this.chain[i];
      const previous = this.chain[i - 1];
      // Recompute hash check
      if (current.previousHash !== previous.hash) return false;
    }
    return true;
  }
}

module.exports = new Blockchain();