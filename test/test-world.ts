import { getEnv } from "./env"

export interface EthConfig {
    network: string
    // Ethereum
    stakingContractAddress: string
    liquidityContractAddress: string
    withdrawContractAddress: string
}

const MAINNET_CONFIG: EthConfig = {
    network: 'mainnet',
    // Ethereum
    stakingContractAddress: "0x0000000000000000000000000000000000000000",
    liquidityContractAddress: "0x0000000000000000000000000000000000000000",
    withdrawContractAddress: "0x0000000000000000000000000000000000000000",
}

const GOERLI_CONFIG: EthConfig = {
    network: 'goerli',
    // Ethereum
    stakingContractAddress: "0x748c905130CC15b92B97084Fd1eEBc2d2419146f",
    liquidityContractAddress: "0x37774000C885e9355eA7C6B025EbF1704141093C",
    withdrawContractAddress: "0x1A8c25ADc96Fb62183C4CB5B9F0c47746B847e05",
}

export function getConfig(network?: string): EthConfig {
    if(!network) network = getEnv().NETWORK
    switch(network) {
        case 'mainnet':
            return MAINNET_CONFIG
        case 'goerli':
        case 'testnet':
            return GOERLI_CONFIG
        default: 
            throw new Error(`${network} defined`)
    }
}