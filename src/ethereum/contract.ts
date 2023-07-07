import { Contract, Provider, ethers } from "ethers";
import stakingAbi from "./abi/Staking.json"
import liquidityAbi from "./abi/LiquidUnstakePool.json"
import withdrawAbi from "./abi/Withdraw.json"
import { getEnv } from "../env";

const abis = [
    stakingAbi.abi,
    liquidityAbi.abi,
    withdrawAbi.abi
]

export abstract class GenericContract {

    address: string
    abi: ethers.InterfaceAbi
    network: string
    contract: Contract

    constructor(address: string, abi: ethers.InterfaceAbi, pk: string, network: string = "goerli") {
        this.address = address
        this.abi = abi
        this.network = network
        const wallet = this.getWallet(pk)
        this.contract = new Contract(this.address, this.abi, wallet)
    }

    abstract getProvider(network: string, apiKey: string): Provider;
    
    getWalletBalance(address: string) {
        return this.getProvider(this.network, getEnv().PROVIDER_API_KEY).getBalance(address)
    }
    
    getWallet(privateKey: string) {
        const provider = this.getProvider(this.network, getEnv().PROVIDER_API_KEY)
        return new ethers.Wallet(privateKey, provider)
    }

    decodeError(err: any): any {
        const data = err.data
        for(let i = 0; i < abis.length; i++) {
            const inter = new ethers.Interface(abis[i])
            const parsedError = inter.parseError(data)
            if(parsedError !== null) {
                console.error(parsedError)
                throw new Error(`
                    Abi with index ${i}. 
                    Name: ${parsedError.name}. 
                    Args: ${parsedError.args}
                `)
            }
        }
        err.message = "Unknown error"
        throw err
    }
    
}




