import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import morgan from 'morgan';
import Block from '../lib/block';
import Blockchain from './../lib/blockchain';

/* c8 ignore next */
const PORT: number = parseInt(`${process.env.BLOCKCHAIN_PORT || 3000}`);

const app = express();

/* c8 ignore start */
app.use(morgan("tiny"));
/* c8 ignore end */

app.use(express.json());

const blockchain = new Blockchain();

app.get("/status", (_req: Request, res: Response) => {
  return res.json({
    numberOfblocks: blockchain.blocks.length,
    isValid: blockchain.isValid(),
    lastBlock: blockchain.getLastBlock(),
  });
});

app.get("/blocks/next", (req: Request, res: Response) => {
  return res.json(blockchain.getNextBlock());
});

app.get("/blocks/:indexOrHash", (req: Request, res: Response) => {
  let block: Block[] | Block | undefined;
  if (/^[0-9]+$/.test(req.params.indexOrHash))
    block = blockchain.blocks[parseInt(req.params.indexOrHash)];
  else
    block = blockchain.getBlock(req.params.indexOrHash);

  if (!block)
    return res.sendStatus(404);
  else
    return res.json(block);
});

app.post("/blocks", (req: Request, res: Response) => {
  if (req.body.hash === undefined) return res.sendStatus(422);

  const block = new Block(req.body as Block);
  const validation = blockchain.addBlock(block)

  if (validation.success)
    return res.status(201).json(block);
  else
    return res.status(400).json(validation);
});

/* c8 ignore start */
if (process.argv.includes("--run"))
  app.listen(PORT, () => console.log(`Blockchain server is running at ${PORT}`));
/* c8 ignore end */

export {
  app,
};
