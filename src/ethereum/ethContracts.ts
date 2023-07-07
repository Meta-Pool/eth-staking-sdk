import { ethers } from "ethers";
import { GenericContract } from "./contract";
import { getEnv } from "../env";

export class EthContract extends GenericContract {

    constructor(address: string, abi: ethers.InterfaceAbi) {
        super(address, abi, getEnv().WALLET_PRIVATE_KEY, getEnv().NETWORK ?? "goerli")
    }

    getProvider(network: string, apiKey: string) {
        return new ethers.AlchemyProvider(
            network,
            apiKey
          );
    }
    
}




