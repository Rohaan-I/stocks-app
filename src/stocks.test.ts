import { getCurrentStockLevels } from "./stocks";
import { getStocksFromFile, getTransactionsFromFile } from "./lib";

// Mocking external dependencies
jest.mock("./lib", () => ({
  getStocksFromFile: jest.fn(),
  getTransactionsFromFile: jest.fn(),
}));

describe("getCurrentStockLevels", () => {
  it("should throw an error if SKU does not exist", async () => {
    (getStocksFromFile as jest.Mock).mockResolvedValue([]);
    (getTransactionsFromFile as jest.Mock).mockResolvedValue([]);

    await expect(getCurrentStockLevels("nonExistentSku")).rejects.toThrow(
      `the sku doesn't exist in stock and transactions.`
    );
  });

  it("should return correct stock after looking into transactions", async () => {
    (getStocksFromFile as jest.Mock).mockResolvedValue([
      { sku: "LTV719449/39/39", stock: 8525 },
      { sku: "CLQ274846/07/46", stock: 8414 },
      { sku: "SXB930757/87/87", stock: 3552 },
    ]);
    (getTransactionsFromFile as jest.Mock).mockResolvedValue([
        { "sku": "LTV719449/39/39", "type": "refund", "qty": 10 },
        { "sku": "LTV719449/39/39", "type": "order", "qty": 7 },
        { "sku": "LTV719449/39/39", "type": "order", "qty": 7 },
        { "sku": "LTV719449/39/39", "type": "order", "qty": 1 },
        { "sku": "LTV719449/39/39", "type": "order", "qty": 9 },
        { "sku": "LTV719449/39/39", "type": "order", "qty": 7 },
        { "sku": "LTV719449/39/39", "type": "order", "qty": 5 },
        { "sku": "LTV719449/39/39", "type": "order", "qty": 0 },
        { "sku": "LTV719449/39/39", "type": "refund", "qty": 9 },

    ]);

    const result = await getCurrentStockLevels("LTV719449/39/39");
    expect(result).toEqual({ sku: "LTV719449/39/39", qty: 8534 });
  });
});
