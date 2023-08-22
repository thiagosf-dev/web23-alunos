import { beforeAll, describe, expect, test } from '@jest/globals';

import Block from '../src/lib/block';

describe("Block tests", () => {

  const exampleDifficulty: number = 0;
  const exampleMiner: string = "test";
  let genesis: Block;

  beforeAll(() => {
    genesis = new Block({
      data: "Genesis Block"
    } as Block);
  });

  test("Should be valid", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      data: "Block 2",
    } as Block);
    block.mine(exampleDifficulty, exampleMiner);

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.success).toBeTruthy();
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
      data: "Block 2",
    } as Block);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.success).toBeFalsy();
  });

  test("Should NOT be valid (timestamp)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      data: "Block 2",
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
      data: "Block 2",
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
      data: "Block 2",
    } as Block);

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.success).toBeFalsy();

  });

  test("Should NOT be valid (data)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      data: "",
    } as Block);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.success).toBeFalsy();
  });

  test("Should NOT be valid (index)", () => {
    const block = new Block({
      index: -1,
      previousHash: genesis.hash,
      data: "Block 2",
    } as Block);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.success).toBeFalsy();
  });

});
