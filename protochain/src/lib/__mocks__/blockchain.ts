import BlockInfo from "../blockInfo";
import TransactionSearch from "../transactionSearch";
import TransactionType from "../transactionType";
import Validation from "../validation";
import Block from "./block";
import Transaction from "./transaction";

/**
 * Mocked Blockchain class
 */
export default class Blockchain {
  blocks: Block[];
  mempool: Transaction[];
  nextIndex: number = 0;

  /**
   * Creates a new mock blockchain
   */
  constructor() {
    this.mempool = [] as Transaction[];
    this.blocks = [new Block({
      index: 0,
      hash: "abc",
      previousHash: "",
      transactions: [new Transaction({
        data: "tx1",
        type: TransactionType.FEE,
      } as Transaction)] as Transaction[],
      timestamp: Date.now(),
    } as Block)];
    this.nextIndex++;
  }

  getLastBlock(): Block {
    return this.blocks[this.blocks.length - 1];
  }

  addBlock(block: Block): Validation {
    if (block.index < 0) return new Validation(false, "Invalid mock block");

    this.blocks.push(block);
    this.nextIndex++;

    return new Validation();
  }

  addTransaction(transaction: Transaction): Validation {
    const validation = transaction.isValid();
    if (!validation.success) return validation;

    this.mempool.push(transaction);
    return new Validation();
  }

  getTransaction(hash: String): TransactionSearch {
    return {
      mempoolIndex: 0,
      transaction: {
        hash,
      },
    } as TransactionSearch;
  }

  getBlock(hash: string): Block | undefined {
    return this.blocks.find(b => b.hash === hash);
  }

  isValid(): Validation {
    return new Validation();
  }

  getFeePerTx(): number {
    return 1;
  }

  getNextBlock(): BlockInfo {
    return {
      transactions: [new Transaction({
        data: new Date().toString(),
      } as Transaction)] as Transaction[],
      difficulty: 0,
      feePerTx: this.getFeePerTx(),
      index: 1,
      maxDifficulty: 63,
      previousHash: this.getLastBlock().hash,
    } as BlockInfo;
  }
}
