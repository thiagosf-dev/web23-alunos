import Block from "./block";
import BlockInfo from "./blockInfo";
import Validation from "./validation";

/**
 * Blockchain class
 */
export default class Blockchain {
  blocks: Block[];
  nextIndex: number = 0;
  static readonly DIFFICULTY_FACTOR = 5;
  static readonly MAX_DIFFICULTY_FACTOR = 62;

  /**
   * Creates a new blockchain
   */
  constructor() {
    this.blocks = [new Block({
      index: this.nextIndex,
      hash: "",
      data: "Genesis Block",
    } as Block)];
    this.nextIndex++;
  }

  getLastBlock(): Block {
    return this.blocks[this.blocks.length - 1];
  }

  getDifficulty(): number {
    return Math.ceil(this.blocks.length / Blockchain.DIFFICULTY_FACTOR);
  }

  addBlock(block: Block): Validation {
    const lastBlock = this.getLastBlock();

    const validation = block.isValid(lastBlock.hash, lastBlock.index, this.getDifficulty());
    if (!validation.success)
      return new Validation(false, `Invalid block: ${validation.message}`);

    this.blocks.push(block);
    this.nextIndex++;

    return new Validation();
  }

  getBlock(hash: string): Block | undefined {
    return this.blocks.find(b => b.hash === hash);
  }

  isValid(): Validation {
    for (let i = this.blocks.length - 1; i > 0; i--) {
      const currentBlock = this.blocks[i];
      const previousBlock = this.blocks[i - 1];
      const validation = currentBlock.isValid(previousBlock.hash, previousBlock.index, this.getDifficulty());
      if (!validation.success)
        return new Validation(false, `Invalid block [#${currentBlock.index}]: ${validation.message}`);
    }
    return new Validation();
  }

  getFeePerTx(): number {
    return 1;
  }

  getNextBlock(): BlockInfo {
    const data = new Date().toString();
    const difficulty = this.getDifficulty();
    const previousHash = this.getLastBlock().hash;
    const index = this.blocks.length;
    const feePerTx = this.getFeePerTx();
    const maxDifficulty = Blockchain.MAX_DIFFICULTY_FACTOR;
    return {
      data,
      difficulty,
      feePerTx,
      index,
      maxDifficulty,
      previousHash,
    } as BlockInfo;
  }
}
