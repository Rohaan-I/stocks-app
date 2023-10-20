import fs from 'fs/promises';
import path from 'path';

import { Stock, Transaction } from './types';

/**
 * 
 * @returns Promise<{sku: string, stock: number}> Promised array of stock
 */
export async function getStocksFromFile() {
    const stockFilePath = path.join(__dirname,`/data/stock.json`);
    const stocks: Array<Stock>  = JSON.parse(await fs.readFile(stockFilePath, 'utf-8'))

    return stocks;
}


/**
 * 
 * @returns Promise<{sku: string, type: string, qty: number}> Promised array of transactions
 */
export async function getTransactionsFromFile() {
    const transtnFilePath = path.join(__dirname, `/data/transactions.json`);
    const transactions: Array<Transaction>  = JSON.parse(await fs.readFile(transtnFilePath, 'utf-8'))

    return transactions;
}