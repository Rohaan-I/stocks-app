import { getCurrentStockLevels } from './stocks';



async function main() {
    if(!process.argv[2]) throw Error(`sku is not provided.`)
    
    const result = await getCurrentStockLevels(process.argv[2])

    console.log(result);
}

main();