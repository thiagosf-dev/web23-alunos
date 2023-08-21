import sha256 from 'crypto-js/sha256';

/**
 * @class Block
 * @description Block class
 */
export default class Block {
  data: string;
  hash: string;
  index: number;
  previousHash: string;
  timestamp: number;

  /**
   * @constructor Block
   * @description Block constructor
   * @param data The block data
   * @param index The block hash
   * @param previousHash The previous block hash
   */
  constructor(index: number, previousHash: string, data: string) {
    this.index = index;
    this.timestamp = Date.now();
    this.previousHash = previousHash;
    this.data = data;
    this.hash = this.getHash();
  }

  getHash(): string {
    return sha256(this.index + this.data + this.timestamp + this.previousHash).toString();
  }

  /**
   * @function isValid
   * @description Validates the block
   * @returns Returns true if the index <= 0
   */
  isValid(previousHash: string, previousIndex: number): boolean {
    if ((this.index - 1) !== previousIndex) return false;

    if (this.hash !== this.getHash()) return false;

    if (!this.data) return false;

    if (this.timestamp < 1) return false;

    if (this.previousHash !== previousHash) return false;

    return true;
  }
}
