import { Wallet } from "ethers"
import liquidityAbi from "./abi/LiquidUnstakePool.json"
import { EthContract } from "./ethContracts"

export class LiquidityContract extends EthContract {

    constructor(wallet: Wallet, liquidityContractAddress: string) {
        super(liquidityContractAddress, liquidityAbi.abi, wallet)
    }

    totalSupply(): Promise<bigint> {
        return this.contract.totalSupply()
    }
    
    totalAssets(): Promise<bigint> {
        return this.contract.totalAssets()
    }
    
    getAvailableEthForValidator(): Promise<bigint> {
        return this.contract.getAvailableEthForValidator().catch(this.decodeError)
    }

    /**
     * 
     * @param mpWeiIn 
     * @returns An array containing the values minExpectedWei and the fee
     */
    getAmountOut(mpWeiIn: bigint): Promise<[bigint, bigint]> {
        return this.contract.getAmountOut(mpWeiIn.toString())
    }

    /**
     * 
     * @param wei
     * @param address of wallet
     * @returns 
     */
    depositETH(wei: string, address: string): Promise<any> {
        return this.contract.deposit(address, { value: wei })
    }

    /**
     * 
     * @param assets in wei
     * @param address of wallet
     * @returns 
     */
    redeem(assets: bigint, address: string): Promise<any> {
        return this.contract.withdraw(assets, address, address)
    }

    swapmpETHforETH(mpWei: bigint, minMpWeiOut: bigint): Promise<any> {
        return this.contract.swapmpETHforETH(mpWei.toString(), minMpWeiOut.toString())
    }
}