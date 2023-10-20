import { getStocksFromFile, getTransactionsFromFile } from "./lib";
import { Stock, Transaction } from "./types";


/**
 * 
 * @param stocks Array of stocks
 * @param sku A product's sku
 * @returns {sku: string, stock: number} | undefined
 */
function getStockBySku(stocks: Array<Stock>, sku: string) {
    return stocks.find(stock => stock.sku === sku);
}

/**
 * 
 * @param stocks Array of transactions
 * @param sku A product's sku
 * @returns {sku: string, stock: number} | undefined
 */
function getTransactionBySku(transactions: Array<Transaction>, sku: string) {
    return transactions.find(transaction => transaction.sku === sku);
}

/**
 * 
 * @param stocks Array of stocks
 * @param transactions  Array of transactions
 * @param sku A product's sku
 * @returns {sku: string, qty: number}
 */
function getCombinedDataBySku(stocks: Array<Stock>, transactions: Array<Transaction>, sku: string) {

    let stockObj: {sku: string, qty: number} | {} = {};

    for(const stock of stocks) {
        
        if(stock.sku === sku) {

            for(const transaction of transactions) {
                if(transaction.sku === stock.sku) {
                    if(transaction.type === "order") {
                        stockObj = {
                            ...stockObj,
                            sku: stock.sku,
                            qty: stock.stock - transaction.qty
                        }
                    }
                    else if(transaction.type === "refund") {  
                        stockObj = {
                            ...stockObj,
                            sku: stock.sku,
                            qty: stock.stock + transaction.qty
                        }
                    
                    } 
                }    
            }
        }
    }

    return stockObj;
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

    console.log('stocks: ', stocks);
    console.log('transactions: ', transactions);
    
    const stock = getStockBySku(stocks, sku)
    const transaction = getTransactionBySku(transactions, sku);

    if(!stock && !transaction) {
        throw Error(`the sku doesn't exist in stock and transactions.`);
    }

    return getCombinedDataBySku(stocks, transactions, sku);
}