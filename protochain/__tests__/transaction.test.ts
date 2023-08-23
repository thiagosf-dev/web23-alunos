import { describe, expect, test } from '@jest/globals';
import Transaction from '../src/lib/transaction';
import TransactionType from '../src/lib/transactionType';

describe("Transaction tests", () => {

  test("Should be valid (REGULAR DEFAULT)", () => {
    const tx = new Transaction({
      data: "tx",
    } as Transaction);

    const valid = tx.isValid();
    expect(valid.success).toBeTruthy();
  });

  test("Should NOT be valid (INVALID HASH)", () => {
    const tx = new Transaction({
      data: "tx",
      type: TransactionType.REGULAR,
      timestamp: Date.now(),
      hash: "abc",
    } as Transaction);

    const valid = tx.isValid();
    expect(valid.success).toBeFalsy();
  });

  test("Should be valid (FEE)", () => {
    const tx = new Transaction({
      data: "tx",
      type: TransactionType.FEE,
    } as Transaction);

    const valid = tx.isValid();
    expect(valid.success).toBeTruthy();
  });

  test("Should NOT be valid (INVALID DATA)", () => {
    const tx = new Transaction();
    const valid = tx.isValid();
    expect(valid.success).toBeFalsy();
  });

});
