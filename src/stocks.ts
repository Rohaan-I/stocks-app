import { getStocksFromFile, getTransactionsFromFile } from "./lib";
import { Stock, Transaction } from "./types";


/**
 * 
 * @param stocks Array of stocks
 * @param sku A product's sku
 * @returns {sku: string, stock: number} | undefined
 */
function getStockBySku(stocks: Array<Stock>, sku: string) {
    return stocks.find(stock => stock.sku.includes(sku));
}

/**
 * 
 * @param transactions Array of transactions
 * @param sku A product's sku
 * @returns {[sku: string]: number} | {}
 */
function getAccumulatedTransactionBySku(transactions: Array<Transaction>, sku: string) {
    return transactions.reduce((acc, obj) => {
        if(obj.sku === sku) {
            acc = {
                ...acc,
                [obj.sku]: acc && acc[obj.sku] ? acc[obj.sku] + obj.qty : obj.qty
            }
            return acc;
        }
        
        return acc;
        
    }, {} as {[sku: string]: number} | undefined)
}


/**
 * 
 * @param sku A product sku which is used to return the current stock levels
 * @returns Promise<{sku: string, qty: number}>
 * 
 */
export async function getCurrentStockLevels(sku: string) {

    const stocks = await getStocksFromFile();
    const transactions = await getTransactionsFromFile();
    
    const stock = getStockBySku(stocks, sku)
    const transaction = getAccumulatedTransactionBySku(transactions, sku);

    if(!stock && transaction && Object.keys(transaction).length === 0) {
        throw Error(`the sku doesn't exist in stock and transactions.`);
    }

    const stockSku = stock?.sku || '';

    return { sku: stockSku, qty: transaction && transaction[stockSku]};

}