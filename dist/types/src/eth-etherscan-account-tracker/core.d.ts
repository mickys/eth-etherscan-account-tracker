interface InitOptions {
    api_url: string;
    api_key: string;
    api_rate_per_second: number;
    monitoredAddress: string;
    requiredConfirmations: number;
    start_block: 0;
}
export interface EtherscanCallOptions {
    module: string;
    action: string;
    apikey: string;
    address?: string;
    startblock?: number;
    endblock?: number;
}
export interface TransactionResponse {
    startBlock: number;
    block: number;
    list: any;
}
export default class EthEtherscanAccountTracker {
    options: InitOptions;
    endblock: number;
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
    getAccountTransactions(customStartBlock?: number): Promise<TransactionResponse>;
    prepareAccountTransactions(normalTxns: any, internalTxns: any, block: any): Promise<any[]>;
    validateAndUpdateIncommingTransactionData(txn: any, blockNumber: number): boolean;
}
export {};
