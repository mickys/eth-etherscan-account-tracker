
/*
 * source       https://github.com/mickys/eth-etherscan-account-tracker/
 * @name        Account Tracker
 * @package     eth-etherscan-account-tracker
 * @author      Micky Socaci <micky@nowlive.ro>
 * @license     MIT
 */

import Database from "sqlite-async";
import bignumber from "bignumber.js";
import configuration from '../../configuration.json';
import EthEtherscanAccountTracker from "./core";
import fs from "fs";

export interface IAppOptions {
    database?: string;
    api_url?: string;
    api_key?: string;
    api_rate_per_second?: number;
    monitoredAddress?: string;
    required_confirmations?: number; // how many blocks do we exclude transactions for, in order to prevent issues with block reorgs.
    database_file?: string;
    logToConsole?: boolean;
    start_block?: number;
    autoFirstRunImport?: boolean;
    outputFilename: string;
}

export default class EthEtherscanAccountTrackerApp {

    public apiUrl: string;
    public apiKey: string;
    public apiRate: number;
    public monitoredAddress: string;
    public requiredConfirmations: number;
    public databaseFile: string;
    public logToConsole: boolean = false;
    public startBlock: number;
    public autoFirstRunImport: boolean = true;

    public enableFirstRunImport: boolean = false;
    public internalLog: any = [];
    public initialised: boolean = false;
    public outputFilename: string = "OUTPUT.txt";

    private db: Database;
    private tracker: EthEtherscanAccountTracker;
    private cacheData: any = {};
    private outputFileDescriptor: any;

    constructor(configFile?: string, options?: IAppOptions) {

        // default config
        this.setConfigData(configuration);

        // override by config file
        if (configFile) {
            this.setConfigData(
                this.loadConfigFile(configFile),
            );
        }

        // override by options
        if (options) {
            if (options.api_url) {
                this.apiUrl = options.api_url;
            }
            if (options.api_key) {
                this.apiKey = options.api_key;
            }
            if (options.api_rate_per_second) {
                this.apiRate = options.api_rate_per_second;
            }
            if (options.monitoredAddress) {
                this.monitoredAddress = options.monitoredAddress;
            }
            if (options.required_confirmations) {
                this.requiredConfirmations = options.required_confirmations;
            }
            if (options.database_file) {
                this.databaseFile = options.database_file;
            }
            if (options.logToConsole !== undefined) {
                this.logToConsole = options.logToConsole;
            }
            if (options.start_block) {
                this.startBlock = options.start_block;
            }
            if (options.autoFirstRunImport !== undefined) {
                this.autoFirstRunImport = options.autoFirstRunImport;
            }
            if (options.outputFilename !== undefined) {
                this.outputFilename = options.outputFilename;
            }
        }

    }

    public loadConfigFile(path: string) {
        const data = fs.readFileSync(path);
        return JSON.parse(data.toString());
    }

    public setConfigData(customConfig: any) {
        this.apiUrl = customConfig.tracker.api_url;
        this.apiKey = customConfig.tracker.api_key;
        this.apiRate = customConfig.tracker.api_rate_per_second;
        this.monitoredAddress = customConfig.tracker.monitoredAddress;
        this.requiredConfirmations = customConfig.tracker.required_confirmations;
        this.databaseFile = customConfig.database_file;
        this.startBlock = customConfig.start_block;
        this.logToConsole = customConfig.logToConsole;
    }

    public async init() {
        this.log("init: " + this.databaseFile);
        this.db = await Database.open( this.databaseFile);

        this.log("init: api_url: " + this.apiUrl);
        this.tracker = new EthEtherscanAccountTracker({
            api_url: this.apiUrl,
            api_key: this.apiKey,
            api_rate_per_second: this.apiRate,
            monitoredAddress: this.monitoredAddress,
            requiredConfirmations: this.requiredConfirmations,
            start_block: 0,
        });

        this.log("init: requiredConfirmations " + this.requiredConfirmations);
        this.log("init: monitoredAddress " + this.monitoredAddress);

        await this.setup();
    }

    public async isStorageTableCreated() {
        return await this.db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`, 'processed_transactions').then((irow, err) => {
            return (irow !== undefined );
        });
    }

    public async setup() {
        if (await this.isStorageTableCreated() === false ) {
            // need to create table
            let statement = 'CREATE TABLE `processed_transactions` (';
            statement +=    '   `timestamp` int(11) DEFAULT NULL,';
            statement +=    '   `block` int(11) DEFAULT NULL,';
            statement +=    '   `hash` varchar(64) DEFAULT NULL';
            statement +=    ');';
            await this.db.prepare(statement).then(prepared => {
                return prepared.run().then(ran => {
                    return prepared.finalize();
                });
            });

            this.enableFirstRunImport = true;
            this.log("setup: created 'processed_transactions' table");

        } else {
            this.log("setup: 'processed_transactions' table already exists");
        }

        if (this.enableFirstRunImport) {
            this.log("setup: enableFirstRunImport");
            await this.runDataImport();
        } else {
            this.log("setup: skip import and resume from last transaction we have");
        }

        this.startBlock = await this.getLastRecordedTransactionBlock();
        this.log("setup: setting startBlock to LastRecordedTransactionBlock: " + this.startBlock);

        this.initialised = true;
    }

    public async cycle() {
        return await this.runDataImport(true);
    }

    public async setCachedData(data) {
        this.cacheData = data;
    }

    public async runDataImport(cycle?: boolean) {

        if (!this.autoFirstRunImport && cycle === undefined) {
            return;
        }

        let currentBlock: number;
        let normalTxns;
        let internalTxns;

        if (this.cacheData.block !== undefined) {
            currentBlock = this.cacheData.block;
            normalTxns = this.cacheData.normal;
            internalTxns = this.cacheData.internal;
        } else {
            currentBlock = await this.tracker.getBlockNumber();
            normalTxns = await this.tracker.getAccountNormalTransactions(currentBlock);
            internalTxns = await this.tracker.getAccountInternalTransactions(currentBlock);
        }

        this.log("runDataImport: currentBlock: " + currentBlock);

        const results = await this.tracker.prepareAccountTransactions(normalTxns, internalTxns, currentBlock);

        // we do for instead of promisifying results.forEach.. cleaner this way
        for (let i = 0; i < results.length; i++) {
            await this.saveTransactionIfNotRecorded(results[i]);
        }

    }

    public async isTransactionRecorded(hash: string) {
        const record = await this.getRecordedTransaction(hash);
        return (record !== undefined && record.hash === hash);
    }

    public async getRecordedTransaction(hash: string) {
        return await this.db.get(
            `SELECT * FROM processed_transactions WHERE hash = ?`,
            hash,
        );
    }

    public async getRecordedTransactionCount() {
        const record = await this.db.get(`SELECT COUNT(*) as count FROM processed_transactions`);
        return record.count;
    }

    public async saveTransactionIfNotRecorded(txn: any) {
        const isRecorded = await this.isTransactionRecorded(txn.hash);
        if (!isRecorded) {
            return this.db.run(
                `INSERT INTO processed_transactions (timestamp, block, hash)
                VALUES (?, ?, ?)`,
                [
                    parseInt(txn.timeStamp, NaN),
                    parseInt(txn.blockNumber, NaN),
                    txn.hash,
                ],
            ).then( async (result) => {
                this.log("saveTransaction: saved transaction( " + txn.hash + " ) at block " + txn.blockNumber);
                return await this.outputTransactionToFile(txn);
            });

        } else {
            this.log("saveTransaction: ignored existing transaction( " + txn.hash + " ) at block " + txn.blockNumber);
        }
        return;
    }

    public async outputTransactionToFile(txn) {

        if (this.outputFileDescriptor === undefined) {
            // initialise
            this.outputFileDescriptor = fs.createWriteStream(this.outputFilename, {flags: 'a'});
        }
        await this.outputFileDescriptor.write("MINT " + txn.value + " " + txn.from + "\n");
        return;
    }

    public async getLastRecordedTransactionBlock() {
        const record = await this.db.get(
            `SELECT * FROM processed_transactions ORDER BY block DESC LIMIT 0,1`,
        );
        if (record !== undefined ) {
            return record.block;
        }
        return 0;
    }

    public log(what: string) {
        what = "[" + new Date().toLocaleString() + "] " + what;
        if (this.logToConsole) {
            console.log(what);
        } else {
            this.internalLog.push(what);
        }
    }

    public getLog() {
        return this.internalLog;
    }

}
