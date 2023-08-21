import sha256 from 'crypto-js/sha256';
import Validation from './validation';

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
   * @description Block constructor
   * @param index The block hash
   * @param previousHash The previous block hash
   * @param data The block data
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
   * @description Validates the block
   * @returns Returns if the block is valid
   */
  isValid(previousHash: string, previousIndex: number): Validation {
    if ((this.index - 1) !== previousIndex) return new Validation(false, "Invalid index.");
    if (this.hash !== this.getHash()) return new Validation(false, "Invalid hash.");
    if (!this.data) return new Validation(false, "Invalid data.");
    if (this.timestamp < 1) return new Validation(false, "Invalid timestamp.");
    if (this.previousHash !== previousHash) return new Validation(false, "Invalid previous hash.");
    return new Validation();
  }
}
