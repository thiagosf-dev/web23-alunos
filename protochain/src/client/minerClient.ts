import dotenv from 'dotenv';
dotenv.config();

import axios from "axios";
import Block from "../lib/block";
import BlockInfo from "../lib/blockInfo";

// const BLOCKCHAIN_SERVER = `${process.env.BLOCKCHAIN_SERVER}`;
const BLOCKCHAIN_SERVER = `http://localhost:3000`;

const minerWallet = {
  privateKey: "123456",
  publicKey: `${process.env.MINER_WALLET}`,
};
console.info("Logged as " + minerWallet.publicKey);

let totalMined = 0;

async function mine() {
  const { data } = await axios.get<BlockInfo>(`${BLOCKCHAIN_SERVER}/blocks/next`);
  if (!data) {
    console.info("No tx found. Waiting...");
    return setTimeout(() => {
      mine();
    }, 5000);
  }

  const blockInfo = data as BlockInfo;

  const newBlock = Block.fromBlockInfo(blockInfo);

  //TODO: adicionar tx de recompensa

  console.info("Start mining block #" + blockInfo.index);
  newBlock.mine(blockInfo.difficulty, minerWallet.publicKey);

  console.info("Block mined! Sending to blockchain...");

  try {
    await axios.post(`${BLOCKCHAIN_SERVER}/blocks`, newBlock);
    console.info("Block sent and accepted!");
    totalMined++;
    console.info(`Total mined blocks: ${totalMined}`);
  } catch (err: any) {
    console.error(err.response ? err.response.data : err.message);
  }

  setTimeout(() => {
    mine();
  }, 1000);
}

mine();
