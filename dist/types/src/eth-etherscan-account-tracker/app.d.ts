export interface IAppOptions {
    database?: string;
    api_url?: string;
    api_key?: string;
    api_rate_per_second?: number;
    monitoredAddress?: string;
    required_confirmations?: number;
    database_file?: string;
    logToConsole?: boolean;
    start_block?: number;
    autoFirstRunImport?: boolean;
    outputFilename: string;
}
export default class EthEtherscanAccountTrackerApp {
    apiUrl: string;
    apiKey: string;
    apiRate: number;
    monitoredAddress: string;
    requiredConfirmations: number;
    databaseFile: string;
    logToConsole: boolean;
    startBlock: number;
    autoFirstRunImport: boolean;
    enableFirstRunImport: boolean;
    internalLog: any;
    initialised: boolean;
    outputFilename: string;
    private db;
    private tracker;
    private cacheData;
    private outputFileDescriptor;
    constructor(configFile?: string, options?: IAppOptions);
    loadConfigFile(path: string): any;
    setConfigData(customConfig: any): void;
    init(): Promise<void>;
    isStorageTableCreated(): Promise<any>;
    setup(): Promise<void>;
    cycle(): Promise<void>;
    setCachedData(data: any): Promise<void>;
    runDataImport(cycle?: boolean): Promise<void>;
    isTransactionRecorded(hash: string): Promise<boolean>;
    getRecordedTransaction(hash: string): Promise<any>;
    getRecordedTransactionCount(): Promise<any>;
    saveTransactionIfNotRecorded(txn: any): Promise<any>;
    outputTransactionToFile(txn: any): Promise<void>;
    getLastRecordedTransactionBlock(): Promise<any>;
    log(what: string): void;
    getLog(): any;
}
