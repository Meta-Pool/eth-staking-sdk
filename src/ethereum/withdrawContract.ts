import { Wallet } from "ethers"
import withdrawAbi from "./abi/Withdraw.json"
import { EthContract } from "./ethContracts"

export interface WithdrawRequest {
    amount: bigint
    unlockEpoch: bigint
}

export class WithdrawContract extends EthContract {

    constructor(wallet: Wallet, withdrawContractAddress: string) {
        super(withdrawContractAddress, withdrawAbi.abi, wallet)
    }

    getEpoch(): Promise<number> {
        return this.contract.getEpoch().then(e => Number(e))
    }

    /**
     * Epochs lasts 7 days.
     * @returns seconds remaining to finish epoch
     */
    getEpochTimeLeft(): Promise<bigint> {
        return this.contract.getEpochTimeLeft()
    }

    /**
     * If you called staking.withdraw on epoch n, and you call this method on the same epoch or before the 3rd day of epoch n+1 this should fail
     * If you call after withdraw.getEpochTimeLeft returns 5 days or less on epoch n+1 this should succeed. 
     * @returns 
     */
    completeWithdraw(): Promise<any> {
        return this.contract.completeWithdraw()
    }

}



