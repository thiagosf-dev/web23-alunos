import { beforeAll, describe, expect, jest, test } from '@jest/globals';

import Block from '../src/lib/block';
import BlockInfo from '../src/lib/blockInfo';
import Transaction from '../src/lib/transaction';
import TransactionType from '../src/lib/transactionType';

jest.mock("../src/lib/transaction");

describe("Block tests", () => {

  const exampleDifficulty: number = 0;
  const exampleMiner: string = "test";
  let genesis: Block;

  beforeAll(() => {
    genesis = new Block({
      transactions: [new Transaction({
        data: "Genesis block",
      } as Transaction)] as Transaction[],
    } as Block);
  });

  test("Should be valid", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [new Transaction({
        data: "block 2",
      } as Transaction)] as Transaction[],
    } as Block);
    block.mine(exampleDifficulty, exampleMiner);

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.success).toBeTruthy();
  });

  test("Should create from block info", () => {
    const block: Block = Block.fromBlockInfo({
      transactions: [new Transaction({
        data: "block 2",
      } as Transaction)] as Transaction[],
      difficulty: exampleDifficulty,
      feePerTx: 1,
      index: 1,
      maxDifficulty: 62,
      previousHash: genesis.hash,
    } as BlockInfo) as Block;
    block.mine(exampleDifficulty, exampleMiner);

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.success).toBeTruthy();
  });

  test("Should NOT be valid (2 FEE)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [
        new Transaction({
          type: TransactionType.FEE,
          data: "fee1",
        } as Transaction),
        new Transaction({
          type: TransactionType.FEE,
          data: "fee2",
        } as Transaction)
      ] as Transaction[],
    } as Block);
    block.mine(exampleDifficulty, exampleMiner);

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.success).toBeFalsy();
  });

  test("Should NOT be valid (INVALID TX)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [new Transaction()],
    } as Block);
    block.mine(exampleDifficulty, exampleMiner);

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.success).toBeFalsy();
  });

  test("Should NOT be valid (fallbacks)", () => {
    const block = new Block();
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.success).toBeFalsy();
  });

  test("Should NOT be valid (previous hash)", () => {
    const block = new Block({
      index: 1,
      previousHash: "abc",
      transactions: [new Transaction({
        data: "block 2",
      } as Transaction)] as Transaction[],
    } as Block);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.success).toBeFalsy();
  });

  test("Should NOT be valid (timestamp)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [new Transaction({
        data: "block 2",
      } as Transaction)] as Transaction[],
    } as Block);
    block.timestamp = -1;
    block.hash = block.getHash();
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.success).toBeFalsy();
  });

  test("Should NOT be valid (empty hash)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [new Transaction({
        data: "block 2",
      } as Transaction)] as Transaction[],
    } as Block);
    block.mine(exampleDifficulty, exampleMiner);

    block.hash = "";

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.success).toBeFalsy();

  });

  test("Should NOT be valid (no mined)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [new Transaction({
        data: "block 2",
      } as Transaction)] as Transaction[],
    } as Block);

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.success).toBeFalsy();

  });

  test("Should NOT be valid (data)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [new Transaction({
        data: "",
      } as Transaction)] as Transaction[],
    } as Block);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.success).toBeFalsy();
  });

  test("Should NOT be valid (index)", () => {
    const block = new Block({
      index: -1,
      previousHash: genesis.hash,
      transactions: [new Transaction({
        data: "block 2",
      } as Transaction)] as Transaction[],
    } as Block);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.success).toBeFalsy();
  });

});
