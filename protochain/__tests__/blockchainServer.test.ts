import request from 'supertest';
import { describe, test, expect, jest } from '@jest/globals';
import { app } from '../src/server/blockchainServer';
import Block from '../src/lib/block';
import Transaction from '../src/lib/transaction';
import TransactionInput from '../src/lib/transactionInput';
import TransactionOutput from '../src/lib/transactionOutput';

jest.mock('../src/lib/block');
jest.mock('../src/lib/blockchain');
jest.mock('../src/lib/transaction');
jest.mock('../src/lib/transactionInput');
jest.mock('../src/lib/transactionOutput');

describe('BlockchainServer Tests', () => {
    test('GET /status - Should return status', async () => {
        const response = await request(app)
            .get('/status/');

        expect(response.status).toEqual(200);
        expect(response.body.isValid.success).toEqual(true);
    })

    test('GET /blocks/:index - Should get genesis', async () => {
        const response = await request(app)
            .get('/blocks/0');

        expect(response.status).toEqual(200);
        expect(response.body.index).toEqual(0);
    })

    test('GET /blocks/next - Should get next block info', async () => {
        const response = await request(app)
            .get('/blocks/next');

        expect(response.status).toEqual(200);
        expect(response.body.index).toEqual(1);
    })

    test('GET /blocks/:hash - Should get block', async () => {
        const response = await request(app)
            .get('/blocks/abc');

        expect(response.status).toEqual(200);
        expect(response.body.hash).toEqual("abc");
    })

    test('GET /blocks/:index - Should NOT get block', async () => {
        const response = await request(app)
            .get('/blocks/-1');

        expect(response.status).toEqual(404);
    })

    test('POST /blocks/ - Should add block', async () => {
        const block = new Block({
            index: 1
        } as Block);
        const response = await request(app)
            .post('/blocks/')
            .send(block);

        expect(response.status).toEqual(201);
        expect(response.body.index).toEqual(1);
    })

    test('POST /blocks/ - Should NOT add block (empty)', async () => {
        const response = await request(app)
            .post('/blocks/')
            .send({});

        expect(response.status).toEqual(422);
    })

    test('POST /blocks/ - Should NOT add block (invalid)', async () => {
        const block = new Block({
            index: -1
        } as Block);
        const response = await request(app)
            .post('/blocks/')
            .send(block);

        expect(response.status).toEqual(400);
    })

    test('GET /transactions/:hash - Should get transaction', async () => {
        const response = await request(app)
            .get('/transactions/abc');

        expect(response.status).toEqual(200);
        expect(response.body.mempoolIndex).toEqual(0);
    })

    test('GET /wallets/:wallet - Should get balance', async () => {
        const response = await request(app)
            .get('/wallets/abc');

        expect(response.status).toEqual(200);
        expect(response.body.balance).toEqual(10);
    })

    test('POST /transactions/ - Should add tx', async () => {
        const tx = new Transaction({
            txInputs: [new TransactionInput()],
            txOutputs: [new TransactionOutput()],
        } as Transaction);

        const response = await request(app)
            .post('/transactions/')
            .send(tx);
        
        expect(response.status).toEqual(201);
    })
})