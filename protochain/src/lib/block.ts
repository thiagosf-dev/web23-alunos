export default class Block {
  hash: string;
  index: number;

  constructor(hash: string, index: number) {
    this.hash = hash;
    this.index = index;
  }

  isValid(): boolean {
    return this.index <= 0;
  }
}
