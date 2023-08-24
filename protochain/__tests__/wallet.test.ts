import { describe, test, expect, beforeAll } from '@jest/globals';
import Wallet from '../src/lib/wallet';

describe("Wallet tests", () => {

    const exampleWIF = "5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ";
    let alice: Wallet;

    beforeAll(() => {
        alice = new Wallet();
    })

    test('Should generate wallet', () => {
        const wallet = new Wallet();
        expect(wallet.privateKey).toBeTruthy();
        expect(wallet.publicKey).toBeTruthy();
    })

    test('Should recover wallet (PK)', () => {
        const wallet = new Wallet(alice.privateKey);
        expect(wallet.publicKey).toEqual(alice.publicKey);
    })

    test('Should recover wallet (WIF)', () => {
        const wallet = new Wallet(exampleWIF);
        expect(wallet.publicKey).toBeTruthy();
        expect(wallet.privateKey).toBeTruthy();
    })

})