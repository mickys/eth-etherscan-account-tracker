interface InitOptions {
    api_url: string;
    api_key: string;
    api_rate_per_second: number;
    monitoredAddress: string;
    requiredConfirmations?: number;
}
export interface EtherscanCallOptions {
    module: string;
    action: string;
    apikey: string;
    address?: string;
    startblock?: number;
    endblock?: number;
}
export default class EthEtherscanAccountTracker {
    options: InitOptions;
    cache: {};
    startblock: number;
    endblock: number;
    initialised: boolean;
    /**
     *
     * @param {options} - InitOptions
     */
    constructor(options?: InitOptions);
    getApiParams(userMod: string, userAction: string, userStartBlock?: number): EtherscanCallOptions;
    resultDecoder(input: any, type?: string): any;
    getBlockNumber(): Promise<any>;
    getAccountNormalTransactions(startBlock?: number): Promise<any>;
    getAccountInternalTransactions(startBlock?: number): Promise<any>;
    getAccountTransactions(startBlock?: number): Promise<any>;
    validateAndUpdateIncommingTransactionData(txn: any, blockNumber: number): boolean;
}
export {};
