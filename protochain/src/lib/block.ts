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
  nonce: number;
  miner: string;

  /**
   * Creates a new block
   * @param block The block data
   */
  constructor(block?: Block) {
    this.index = block?.index || 0;
    this.timestamp = block?.timestamp || Date.now();
    this.previousHash = block?.previousHash || "";
    this.data = block?.data || "";
    this.nonce = block?.nonce || 0;
    this.miner = block?.miner || "";
    this.hash = block?.hash || this.getHash();
  }

  getHash(): string {
    return sha256(this.index + this.data + this.timestamp + this.previousHash + this.nonce + this.miner).toString();
  }

  /**
   * Generates a new valid hash for this block with the specified difficulty
   * @param difficulty The blockchain current difficulty
   * @param miner The miner wallet address
   */
  mine(difficulty: number, miner: string): void {
    this.miner = miner;
    const prefix = new Array(difficulty + 1).join("0");

    do {
      this.nonce++;
      this.hash = this.getHash();
    } while (!this.hash.startsWith(prefix));
  }

  /**
   * Validates the block
   * @param previousHash The previou block hash
   * @param previousIndex The previou block index
   * @param difficulty The blockchain current difficulty
   * @returns Returns if the block is valid
   */
  isValid(previousHash: string, previousIndex: number, difficulty: number): Validation {
    if (this.index - 1 !== previousIndex) return new Validation(false, "Invalid index.");
    if (!this.data) return new Validation(false, "Invalid data.");
    if (this.timestamp < 1) return new Validation(false, "Invalid timestamp.");
    if (this.previousHash !== previousHash) return new Validation(false, "Invalid previous hash.");
    if (!this.nonce || !this.miner) return new Validation(false, "No mined.");

    const prefix = new Array(difficulty + 1).join("0");
    if ((this.hash !== this.getHash()) || !this.hash.startsWith(prefix))
      return new Validation(false, "Invalid hash.");

    return new Validation();
  }
}
