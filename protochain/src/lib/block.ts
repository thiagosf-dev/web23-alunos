/**
 * @class Block
 * @description Block class
 */
export default class Block {
  hash: string;
  index: number;

  /**
   * @constructor Block
   * @description Block constructor
   * @param hash The block index in blockchain
   * @param index The block hash
   */
  constructor(hash: string, index: number) {
    this.hash = hash;
    this.index = index;
  }

  /**
   * @function isValid
   * @description Validates the block
   * @returns Returns true if the index <= 0
   */
  isValid(): boolean {
    return this.index <= 0;
  }
}
