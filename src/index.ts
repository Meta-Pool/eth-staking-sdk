import { ethers } from "ethers"
import { getEnv } from "./env"
import { LiquidityContract } from "./ethereum/liquidityContract"
import { StakingContract } from "./ethereum/stakingContract"
import { WithdrawContract } from "./ethereum/withdrawContract"
import { etow } from "./utils/convert"

async function run() {
    const stakingContract = new StakingContract()
    const liqContract = new LiquidityContract()
    const withdrawContract = new WithdrawContract()

    const ethToStake = 4
    const myAddress = getEnv().WALLET_ADDRESS
    const depositTx = await stakingContract.depositETH(etow(ethToStake), myAddress)
    const txResult = await depositTx.wait()
    console.log(2, txResult)
}

run().catch((err) => console.error(err.message, err.stack))