import Validation from '../validation';
import Transaction from './transaction';

/**
 * Mocked block class
 */
export default class Block {
    index: number;
    timestamp: number;
    hash: string;
    previousHash: string;
    transactions: Transaction[];
    miner: string;

    /**
     * Creates a new mock block
     * @param block The mock block data
     */
    constructor(block?: Block) {
        this.index = block?.index || 0;
        this.timestamp = block?.timestamp || Date.now();
        this.previousHash = block?.previousHash || "";
        this.transactions = block?.transactions || [] as Transaction[];
        this.miner = block?.miner || "abc";
        this.hash = block?.hash || this.getHash();
    }

    mine(difficulty: number, miner: string){
        this.miner = miner;
    }

    getHash(): string {
        return this.hash || "abc";
    }

    /**
     * Validates the mock block
     * @returns Returns if the mock block is valid
     */
    isValid(previousHash: string, previousIndex: number, feePerTx: number): Validation {
        if (!previousHash || previousIndex < 0 || this.index < 0 || feePerTx < 1)
            return new Validation(false, "Invalid mock block.");

        return new Validation();
    }
}