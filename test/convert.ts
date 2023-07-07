import { ethers } from "ethers"

export function wtoe(wei: bigint|string): number {
    return Number(ethers.formatEther(wei))
}

export function etow(eth: number|string): bigint {
    return ethers.parseEther(eth.toString())
}