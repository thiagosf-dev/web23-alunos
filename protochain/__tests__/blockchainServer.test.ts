import { describe, expect, jest, test } from '@jest/globals';
import request from 'supertest';
import Block from '../src/lib/block';
import { app } from '../src/server/blockchainServer';

jest.mock("../src/lib/block");
jest.mock("../src/lib/blockchain");

describe("BlockchainServer Tests", () => {
  test("GET /status - Should return status", async () => {
    const response = await request(app)
      .get("/status");

    expect(response.status).toEqual(200);
    expect(response.body.isValid.success).toEqual(true);
  });

  test("GET /blocks/:index - Should get genesis", async () => {
    const response = await request(app)
      .get("/blocks/0");

    expect(response.status).toEqual(200);
    expect(response.body.index).toEqual(0);
  });

  test("GET /blocks/:hash - Should get block", async () => {
    const response = await request(app)
      .get("/blocks/abc");

    expect(response.status).toEqual(200);
    expect(response.body.hash).toEqual("abc");
  });

  test("GET /blocks/:index - Should NOT get block", async () => {
    const response = await request(app)
      .get("/blocks/-1");

    expect(response.status).toEqual(404);
  });

  test("POST /blocks - Should add block", async () => {
    const block = new Block({
      index: 1,
    } as Block);
    const response = await request(app)
      .post("/blocks")
      .send(block);

    expect(response.status).toEqual(201);
    expect(response.body.index).toEqual(1);
  });

  test("POST /blocks - Should NOT add block (empty)", async () => {
    const response = await request(app)
      .post("/blocks")
      .send({});

    expect(response.status).toEqual(422);
  });

  test("POST /blocks - Should NOT add block (invalid)", async () => {
    const block = new Block({
      index: -1,
    } as Block);
    const response = await request(app)
      .post("/blocks")
      .send(block);

    expect(response.status).toEqual(400);
  });
});
