import { describe, expect, jest, test } from '@jest/globals';

import Block from "../src/lib/block";
import Blockchain from "../src/lib/blockchain";
import Transaction from '../src/lib/transaction';

jest.mock("../src/lib/block");
jest.mock("../src/lib/transaction");

describe("Blockchain tests", () => {

  test("Should has genesis block", () => {
    const blockchain = new Blockchain();
    expect(blockchain.blocks.length).toEqual(1);
  });

  test("Should be valid (genesis)", () => {
    const blockchain = new Blockchain();
    expect(blockchain.isValid().success).toEqual(true);
  });

  test("Should be valid (two blocks)", () => {
    const blockchain = new Blockchain();
    blockchain.addBlock(new Block({
      index: 1,
      previousHash: blockchain.blocks[0].hash,
      transactions: [new Transaction({
        data: "block 2",
      } as Transaction)] as Transaction[],
    } as Block));
    expect(blockchain.isValid().success).toEqual(true);
  });

  test("Should NOT be valid", () => {
    const blockchain = new Blockchain();
    blockchain.addBlock(new Block({
      index: 1,
      previousHash: blockchain.blocks[0].hash,
      transactions: [new Transaction({
        data: "block 2",
      } as Transaction)] as Transaction[],
    } as Block));
    blockchain.blocks[1].index = -1;
    expect(blockchain.isValid().success).toEqual(false);
  });

  test("Should add block", () => {
    const blockchain = new Blockchain();
    const result = blockchain.addBlock(new Block({
      index: 1,
      previousHash: blockchain.blocks[0].hash,
      transactions: [new Transaction({
        data: "block 2",
      } as Transaction)] as Transaction[],
    } as Block));
    expect(result.success).toEqual(true);
  });

  test("Should get block", () => {
    const blockchain = new Blockchain();
    const block = blockchain.getBlock(blockchain.blocks[0].hash);
    expect(block).toBeTruthy();
  });

  test("Should NOT add block", () => {
    const blockchain = new Blockchain();
    const block = new Block({
      index: -1,
      previousHash: blockchain.blocks[0].hash,
      transactions: [new Transaction({
        data: "block 2",
      } as Transaction)] as Transaction[],
    } as Block);
    const result = blockchain.addBlock(block);
    expect(result.success).toEqual(false);
  });

  test("Should get next block info", () => {
    const blockchain = new Blockchain();
    const info = blockchain.getNextBlock();
    expect(info.index).toEqual(1);
  });

});
