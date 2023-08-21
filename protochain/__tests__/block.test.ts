import { beforeAll, describe, expect, test } from '@jest/globals';

import Block from '../src/lib/block';

describe("Block tests", () => {

  let genesis: Block;

  beforeAll(() => {
    genesis = new Block(0, "", "Genesis Block");
  });

  test("Should be valid", () => {
    const block = new Block(1, genesis.hash, "block2");
    const valid = block.isValid(genesis.hash, genesis.index);
    expect(valid.success).toBeTruthy();
  });

  test("Should NOT be valid (previous hash)", () => {
    const block = new Block(1, "", "block 2");
    const valid = block.isValid(genesis.hash, genesis.index);
    expect(valid.success).toBeFalsy();
  });

  test("Should NOT be valid (timestamp)", () => {
    const block = new Block(1, genesis.hash, "block 2");
    block.timestamp = -1;
    block.hash = block.getHash();
    const valid = block.isValid(genesis.hash, genesis.index);
    expect(valid.success).toBeFalsy();
  });

  test("Should NOT be valid (hash)", () => {
    const block = new Block(1, genesis.hash, "block 2");
    block.hash = "";
    const valid = block.isValid(genesis.hash, genesis.index);
    expect(valid.success).toBeFalsy();

  });

  test("Should NOT be valid (data)", () => {
    const block = new Block(1, genesis.hash, "");
    const valid = block.isValid(genesis.hash, genesis.index);
    expect(valid.success).toBeFalsy();
  });

  test("Should NOT be valid (index)", () => {
    const block = new Block(-1, genesis.hash, "block 2");
    const valid = block.isValid(genesis.hash, genesis.index);
    expect(valid.success).toBeFalsy();
  });

});
