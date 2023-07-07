import { LiquidityContract, StakingContract } from '../src'
import { ENV, getEnv } from './env'
import { etow, wtoe } from './convert'
import { ethers } from 'ethers'
import { getConfig } from './test-world'

let walletAddress: string
let stakingContract: StakingContract
let liquidStakeContract: LiquidityContract
// let withdrawContract: WithdrawContract

async function prepareTestGlobals() {

    // It will run in the network set by .env
    const env: ENV = getEnv()
    const config = getConfig("goerli")

    walletAddress = env.WALLET_ADDRESS
    const provider = new ethers.AlchemyProvider(env.NETWORK, env.PROVIDER_API_KEY)
    const wallet = new ethers.Wallet(env.WALLET_PRIVATE_KEY, provider)
    
    stakingContract = new StakingContract(wallet, config.stakingContractAddress)
    liquidStakeContract = new LiquidityContract(wallet, config.liquidityContractAddress)
}

describe('Metapool', () => {

    beforeAll(async() => {
        await prepareTestGlobals()
    })

    describe('stake', () => {

        it('stakes NEAR', async() => {

            const weiPreBalance = await stakingContract.getWalletBalance(walletAddress)
            const mpWeiPreBalance = await stakingContract.balanceOf(walletAddress)
            console.log("ethPreBalance", wtoe(weiPreBalance))
            console.log("mpEthPreBalance", wtoe(mpWeiPreBalance))

            const amountWei = etow(0.01)
            const tx = await stakingContract.depositETH(amountWei, walletAddress)

            const totalAssets = await stakingContract.totalAssets()
            const totalSupply = await stakingContract.totalSupply()
            const mpEthPrice = wtoe(totalAssets) / wtoe(totalSupply)

            const result = await tx.wait()

            const weiPostBalance = await stakingContract.getWalletBalance(walletAddress)
            const mpWeiPostBalance = await stakingContract.balanceOf(walletAddress)

            const gasUsedInWei: bigint = BigInt(result.gasUsed) * result.gasPrice
            const expectedNewWeiBalance = weiPreBalance - amountWei - gasUsedInWei
            const expectedNewMpEthBalance = wtoe(mpWeiPreBalance) + wtoe(amountWei) / mpEthPrice

            expect(weiPostBalance).toBe(expectedNewWeiBalance)
            expect(wtoe(mpWeiPostBalance)).toBeCloseTo(expectedNewMpEthBalance)
        })
    })

    describe('liquidUnstake', () => {

        it('liquid-unstakes', async() => {

            const amountMpWei = etow(0.01)
            const txAllowance = await stakingContract.increaseAllowance(liquidStakeContract.address, amountMpWei)
            await txAllowance.wait()

            const weiPreBalance = await stakingContract.getWalletBalance(walletAddress)
            const mpWeiPreBalance = await stakingContract.balanceOf(walletAddress)
            console.log("ethPreBalance", wtoe(weiPreBalance))
            console.log("mpEthPreBalance", wtoe(mpWeiPreBalance))

            const [expectedWeiToReceive] = await liquidStakeContract.getAmountOut(amountMpWei)
            console.log(expectedWeiToReceive)
            const tx = await liquidStakeContract.swapmpETHforETH(amountMpWei, expectedWeiToReceive)

            const result = await tx.wait()

            const weiPostBalance = await stakingContract.getWalletBalance(walletAddress)
            const mpWeiPostBalance = await stakingContract.balanceOf(walletAddress)

            const gasUsedInWei: bigint = BigInt(result.gasUsed) * result.gasPrice
            const expectedNewWeiBalance = weiPreBalance + expectedWeiToReceive - gasUsedInWei
            const expectedNewMpWeiBalance = mpWeiPreBalance - amountMpWei
            console.log(wtoe(weiPostBalance), wtoe(expectedNewWeiBalance))
            expect(wtoe(weiPostBalance)).toBeCloseTo(wtoe(expectedNewWeiBalance))
            expect(mpWeiPostBalance).toBe(expectedNewMpWeiBalance)

        })
    })

    describe('delayedUnstake', () => {

        it('delayed-unstakes', async() => {
            const weiPreBalance = await stakingContract.getWalletBalance(walletAddress)
            const mpWeiPreBalance = await stakingContract.balanceOf(walletAddress)
            console.log("ethPreBalance", wtoe(weiPreBalance))
            console.log("mpEthPreBalance", wtoe(mpWeiPreBalance))

            const amountMpWei = etow(0.01)
            const tx = await stakingContract.redeem(amountMpWei, walletAddress)
            const result = await tx.wait()

            const weiPostBalance = await stakingContract.getWalletBalance(walletAddress)
            const mpWeiPostBalance = await stakingContract.balanceOf(walletAddress)

            const gasUsedInWei: bigint = BigInt(result.gasUsed) * result.gasPrice
            const expectedNewWeiBalance = weiPreBalance - gasUsedInWei
            const expectedNewMpEthBalance = mpWeiPreBalance - amountMpWei

            expect(weiPostBalance).toBe(expectedNewWeiBalance)
            expect(mpWeiPostBalance).toBe(expectedNewMpEthBalance)
        })
    })


})
