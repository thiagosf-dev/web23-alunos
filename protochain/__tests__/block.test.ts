import { describe, expect, test } from '@jest/globals';

import Block from '../src/lib/block';

describe("Block tests", () => {

  test("Should be valid", () => {
    const block1 = new Block("abc", 0);
    const valid = block1.isValid();
    expect(valid).toEqual(true);
    expect(valid).toBeTruthy();
  });

});
