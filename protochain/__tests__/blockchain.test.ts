import { describe, expect, test } from '@jest/globals';

import Blockchain from '../src/lib/blockchain';

describe("Blockchain tests", () => {

  test("🧪 Should has genesis block", () => {
    const blockchain = new Blockchain();
    expect(blockchain.blocks.length).toBeTruthy();
    expect(blockchain.blocks.length).toBeGreaterThanOrEqual(1);
  });

});
