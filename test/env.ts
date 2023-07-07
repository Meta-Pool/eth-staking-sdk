import dotenv from "dotenv"
import path from "path"

export interface ENV {
    NETWORK: string
    WALLET_PRIVATE_KEY: string
    PROVIDER_API_KEY: string
    WALLET_ADDRESS: string
}

dotenv.config({ path: path.resolve(__dirname, "../.env") })

export function getEnv(): ENV {
    if(!process.env.WALLET_PRIVATE_KEY) throw new Error("WALLET_PRIVATE_KEY is not defined")
    if(!process.env.PROVIDER_API_KEY) throw new Error("PROVIDER_API_KEY is not defined")
    if(!process.env.WALLET_ADDRESS) throw new Error("WALLET_ADDRESS is not defined")
    return {
        NETWORK: process.env.NETWORK ?? "goerli",
        WALLET_PRIVATE_KEY: process.env.WALLET_PRIVATE_KEY,
        PROVIDER_API_KEY: process.env.PROVIDER_API_KEY,
        WALLET_ADDRESS: process.env.WALLET_ADDRESS,
    }
}