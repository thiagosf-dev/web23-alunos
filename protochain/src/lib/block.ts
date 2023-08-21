import sha256 from 'crypto-js/sha256';
import Validation from './validation';

/**
 * Block class
 */
export default class Block {
  data: string;
  hash: string;
  index: number;
  previousHash: string;
  timestamp: number;

  /**
   * Creates a new block
   * @param block The block data
   */
  constructor(block?: Block) {
    this.index = block?.index || 0;
    this.timestamp = block?.timestamp || Date.now();
    this.previousHash = block?.previousHash || "";
    this.data = block?.data || "";
    this.hash = block?.hash || this.getHash();
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
