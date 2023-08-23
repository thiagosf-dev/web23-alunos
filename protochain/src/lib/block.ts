import sha256 from 'crypto-js/sha256';
import BlockInfo from './blockInfo';
import Transaction from './transaction';
import TransactionType from './transactionType';
import Validation from './validation';

/**
 * Block class
 */
export default class Block {
  index: number;
  timestamp: number;
  hash: string;
  previousHash: string;
  transactions: Transaction[];
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

    this.transactions = block?.transactions
      ? block.transactions.map(tx => new Transaction(tx))
      : [] as Transaction[];

    this.nonce = block?.nonce || 0;
    this.miner = block?.miner || "";
    this.hash = block?.hash || this.getHash();
  }

  getHash(): string {
    const txs = this.transactions && this.transactions.length
      ? this.transactions.map(tx => tx.hash).reduce((a, b) => a + b)
      : "";
    return sha256(this.index + txs + this.timestamp + this.previousHash + this.nonce + this.miner).toString();
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
    if (this.transactions && this.transactions.length) {
      if (this.transactions.filter(tx => tx.type === TransactionType.FEE).length > 1)
        return new Validation(false, "Too many fees.");

      const validations = this.transactions.map(tx => tx.isValid());
      const errors = validations.filter(v => !v.success).map(e => e.message);
      if (errors.length > 0)
        return new Validation(false, "Invalid block due to invalid tx: " + errors.reduce((a, b) => a + b));
    }

    if (previousIndex !== this.index - 1) return new Validation(false, "Invalid index.");
    if (this.timestamp < 1) return new Validation(false, "Invalid timestamp.");
    if (this.previousHash !== previousHash) return new Validation(false, "Invalid previous hash.");
    if (!this.nonce || !this.miner) return new Validation(false, "No mined.");

    const prefix = new Array(difficulty + 1).join("0");
    if ((this.hash !== this.getHash()) || !this.hash.startsWith(prefix))
      return new Validation(false, "Invalid hash.");

    return new Validation();
  }

  static fromBlockInfo(blockInfo: BlockInfo): Block {
    const block: Block = new Block();
    block.index = blockInfo.index;
    block.previousHash = blockInfo.previousHash;
    block.transactions = blockInfo.transactions;
    return block;
  }
}
