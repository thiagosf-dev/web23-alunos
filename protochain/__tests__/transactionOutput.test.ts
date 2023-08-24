import { describe, test, expect, beforeAll } from '@jest/globals';
import TransactionOutput from '../src/lib/transactionOutput';
import Wallet from '../src/lib/wallet';

describe("TransactionOutput tests", () => {

    let alice: Wallet, bob: Wallet;

    beforeAll(() => {
        alice = new Wallet();
        bob = new Wallet();
    })

    test('Should be valid', () => {
        const txOutput = new TransactionOutput({
            amount: 10,
            toAddress: alice.publicKey,
            tx: "abc"
        } as TransactionOutput)

        const valid = txOutput.isValid();
        expect(valid.success).toBeTruthy();
    })

    test('Should NOT be valid (default)', () => {
        const txOutput = new TransactionOutput();
        const valid = txOutput.isValid();
        expect(valid.success).toBeFalsy();
    })

    test('Should NOT be valid', () => {
        const txOutput = new TransactionOutput({
            amount: -10,
            toAddress: alice.publicKey,
            tx: "abc"
        } as TransactionOutput)

        const valid = txOutput.isValid();
        expect(valid.success).toBeFalsy();
    })

    test('Should get hash', () => {
        const txOutput = new TransactionOutput({
            amount: 10,
            toAddress: alice.publicKey,
            tx: "abc"
        } as TransactionOutput)

        const hash = txOutput.getHash();
        expect(hash).toBeTruthy();
    })
})