import Block from "./block";

/**
 * @description Blockchain class
 */
export default class Blockchain {
  blocks: Block[];

  /**
   * @description Creates a new blockchain
   */
  constructor() {
    this.blocks = [new Block("genesis", 0)];
  }
}
