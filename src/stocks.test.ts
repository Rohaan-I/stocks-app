import { getCurrentStockLevels } from "./stocks";
import { getStocksFromFile, getTransactionsFromFile } from "./lib";

// Mocking the external dependencies
jest.mock('./lib', () => ({
  getStocksFromFile: jest.fn(),
  getTransactionsFromFile: jest.fn()
}));

describe('getCurrentStockLevels', () => {
  it('should return the correct stock level for a given sku', async () => {
    (getStocksFromFile as jest.Mock).mockResolvedValue([
      { sku: 'product1', stock: 100 }
    ]);
    (getTransactionsFromFile as jest.Mock).mockResolvedValue([
      { sku: 'product1', qty: -10 },
      { sku: 'product1', qty: 5 },
      { sku: 'product2', qty: 15 }
    ]);

    const result = await getCurrentStockLevels('product1');
    expect(result).toEqual({ sku: 'product1', qty: -5 });
  });

  it('should throw an error when sku is not found in both stocks and transactions', async () => {
    (getStocksFromFile as jest.Mock).mockResolvedValue([]);
    (getTransactionsFromFile as jest.Mock).mockResolvedValue([]);

    await expect(getCurrentStockLevels('nonExistentSku')).rejects.toThrow(`the sku doesn't exist in stock and transactions.`);
  });
  
});
