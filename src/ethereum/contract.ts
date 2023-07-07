import { Contract, Provider, Wallet, ethers } from "ethers"
import stakingAbi from "./abi/Staking.json"
import liquidityAbi from "./abi/LiquidUnstakePool.json"
import withdrawAbi from "./abi/Withdraw.json"

const abis = [
    stakingAbi.abi,
    liquidityAbi.abi,
    withdrawAbi.abi,
]

export abstract class GenericContract {

    address: string
    abi: ethers.InterfaceAbi
    wallet: Wallet
    contract: Contract

    constructor(address: string, abi: ethers.InterfaceAbi, wallet: Wallet) {
        this.address = address
        this.abi = abi
        this.wallet = wallet
        this.contract = new Contract(this.address, this.abi, wallet)
    }

    abstract getProvider(network: string, apiKey: string): Provider;
    
    getWalletBalance(address: string): Promise<bigint> {
        if(!this.wallet.provider) throw new Error("No provider in wallet")
        return this.wallet.provider.getBalance(address)
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




