import { Wallet } from "ethers"
import stakingAbi from "./abi/Staking.json"
import { EthContract } from "./ethContracts"

export class StakingContract extends EthContract {

    constructor(wallet: Wallet, stakingContractAddress: string) {
        super(stakingContractAddress, stakingAbi.abi, wallet)
    }

    increaseAllowance(spenderAddress: string, amountMpWei: bigint): Promise<any> {
        return this.contract.increaseAllowance(spenderAddress, amountMpWei)
    }

    balanceOf(address: string): Promise<bigint> {
        return this.contract.balanceOf(address)
    }
    
    totalSupply(): Promise<bigint> {
        return this.contract.totalSupply()
    }
    
    totalAssets(): Promise<bigint> {
        return this.contract.totalAssets()
    }

    estimatedRewardsPerSecond(): Promise<bigint> {
        return this.contract.estimatedRewardsPerSecond()
    }

    /**
     * Stakes depositing wETH
     * @param wei
     * @param address of wallet
     * @returns 
     */
    deposit(wei: bigint, address: string): Promise<any> {
        return this.contract.depositETH(wei.toString(), address)
    }

    /**
     * Stakes depositing ETH
     * @param wei
     * @param address of wallet
     * @returns 
     */
    depositETH(wei: bigint, address: string): Promise<any> {
        return this.contract.depositETH(address, { value: wei.toString() })
    }

    /**
     * Starts a delayed unstake
     * @param mpWei
     * @param address of wallet
     * @returns 
     */
    redeem(mpWei: bigint, address: string): Promise<any> {
        return this.contract.redeem(mpWei, address, address)
    }

    previewRedeem(mpWei: bigint): Promise<any> {
        return this.contract.previewRedeem(mpWei)
    }
}



