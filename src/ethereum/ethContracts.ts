import { Wallet, ethers } from "ethers"
import { GenericContract } from "./contract"

export class EthContract extends GenericContract {

    constructor(address: string, abi: ethers.InterfaceAbi, wallet: Wallet) {
        super(address, abi, wallet)
    }

    getProvider(network: string, apiKey: string) {
        return new ethers.AlchemyProvider(
            network,
            apiKey
        )
    }
    
}




