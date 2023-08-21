import express from 'express';
import morgan from 'morgan';
import Blockchain from './../lib/blockchain';
import Block from '../lib/block';

const PORT: number = 3000;

const app = express();
app.use(morgan("tiny"));
app.use(express.json());

const blockchain = new Blockchain();

app.get("/status", (_req, res) => {
  return res.json({
    numberOfblocks: blockchain.blocks.length,
    isValid: blockchain.isValid(),
    lastBlock: blockchain.getLastBlock(),
  });
});

app.get("/blocks/:indexOrHash", (req, res) => {
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

app.listen(PORT, () => console.log(`Blockchain server is running at ${PORT}`));
