import dotenv from "dotenv"
import path from "path"

export interface ENV {
    NETWORK: string
    WALLET_PRIVATE_KEY: string
    PROVIDER_API_KEY: string
    WALLET_ADDRESS: string
}

dotenv.config({ path: path.resolve(__dirname, "../.env") });

export function getEnv(): ENV {
    return {
        NETWORK: process.env.NETWORK!,
        WALLET_PRIVATE_KEY: process.env.WALLET_PRIVATE_KEY!,
        PROVIDER_API_KEY: process.env.PROVIDER_API_KEY!,
        WALLET_ADDRESS: process.env.WALLET_ADDRESS!,
    };
  };