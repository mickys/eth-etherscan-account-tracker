/*
 * source       https://github.com/mickys/eth-etherscan-account-tracker/
 * @name        Account Tracker
 * @package     eth-etherscan-account-tracker
 * @author      Micky Socaci <micky@nowlive.ro>
 * @license     MIT
 */

import bignumber from "bignumber.js";
import utils from "web3-utils";
import axios from 'axios';

interface InitOptions {
    api_url: string;
    api_key: string;
    api_rate_per_second: number;
    monitoredAddress: string;
    requiredConfirmations: number; // how many blocks do we exclude transactions for, in order to prevent issues with block reorgs.
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

    public options: InitOptions = {
        api_url: "",
        api_key: "",
        api_rate_per_second: 5,
        monitoredAddress: "",
        requiredConfirmations: 12,
        start_block: 0,
    };

    public endblock: number = 99999999;

    /**
     *
     * @param {options} - InitOptions
     */
    constructor(options?: InitOptions) {
        if (typeof options !== "undefined") {
            this.options = Object.assign({}, options);
        }
    }

    public getApiParams(userMod: string, userAction: string, userStartBlock?: number): EtherscanCallOptions {
        return {
            module: userMod,
            action: userAction,
            address: this.options.monitoredAddress,
            startblock: userStartBlock || this.options.start_block,
            endblock: this.endblock,
            apikey: this.options.api_key,
        };
    }

    public resultDecoder(input: any, type?: string): any {
        if (type === "number") {
            return parseInt(input, NaN);
        } else {
            // raw
            return input;
        }
    }

    public async getBlockNumber(): Promise<any> {
        return axios.get(this.options.api_url, {
            params: {
                module: "proxy",
                action: "eth_blockNumber",
                apikey: this.options.api_key,
            },
        }).then( (response) => {
            if ( response.data.result !== undefined ) {
                return this.resultDecoder( response.data.result, "number" );
            } else {
                return Promise.reject( response.data.error.message );
            }
        }).catch( (error) => {
            return Promise.reject( new Error(error) );
        });
    }

    public async getAccountNormalTransactions(startBlock?: number): Promise<any> {
        return axios.get(this.options.api_url, {
            params: {
                module: "account",
                action: "txlist",
                address: this.options.monitoredAddress,
                startblock: startBlock || this.options.start_block,
                endblock: this.endblock,
                apikey: this.options.api_key,
            },
        }).then( (response) => {
            if ( response.data.result !== undefined ) {
                return response.data.result;
            } else {
                return Promise.reject( response.data.error.message );
            }
        }).catch( (error) => {
            return Promise.reject( new Error(error) );
        });
    }

    public async getAccountInternalTransactions(startBlock?: number): Promise<any> {
        return axios.get(this.options.api_url, {
            params: {
                module: "account",
                action: "txlistinternal",
                address: this.options.monitoredAddress,
                startblock: startBlock || this.options.start_block,
                endblock: this.endblock,
                apikey: this.options.api_key,
            },
        }).then( (response) => {
            if ( response.data.result !== undefined ) {
                return response.data.result;
            } else {
                return Promise.reject( response.data.error.message );
            }
        }).catch( (error) => {
            return Promise.reject( new Error(error) );
        });
    }

    public async getAccountTransactions(customStartBlock?: number): Promise<TransactionResponse> {

        const currentBlock = await this.getBlockNumber();
        const normalTxns = await this.getAccountNormalTransactions(customStartBlock);
        const internalTxns = await this.getAccountInternalTransactions(customStartBlock);
        return {
            startBlock: customStartBlock,
            block: currentBlock,
            list: this.prepareAccountTransactions(normalTxns, internalTxns, currentBlock),
        };
    }

    public async prepareAccountTransactions(normalTxns, internalTxns, block) {
        const list = [];

        if (normalTxns !== undefined) {
            normalTxns.forEach((data) => {
                if (this.validateAndUpdateIncommingTransactionData(data, block)) {
                    list.push(data);
                }
            });
        }

        if (internalTxns !== undefined) {
            internalTxns.forEach((data) => {
                if (this.validateAndUpdateIncommingTransactionData(data, block)) {
                    list.push(data);
                }
            });
        }
        list.sort((a, b) => a.blockNumber.localeCompare(b.blockNumber));
        return list;
    }

    public validateAndUpdateIncommingTransactionData(txn: any, blockNumber: number): boolean {
        // validate transaction
        // rules:
        // isError is 0
        // to is this.options.monitoredAddress
        // blockNumber is lower than currentBlockNumber minus requiredConfirmations
        // value is higher than BN(0)
        // txn.confirmations does not exist for internal transactions and thus needs to be calculated.
        //
        // we need to wait for at least 12 blocks for a transaction to be considered final
        // and not doing so could result in our txn being removed from the returned list
        //

        if (txn.isError !== "0") {
            return false;
        }

        if (txn.to !== this.options.monitoredAddress.toLowerCase()) {
            return false;
        }

        if (!txn.hasOwnProperty("confirmations")) {
            txn.confirmations = (blockNumber - txn.blockNumber).toString();
        }

        if (parseInt(txn.confirmations, NaN) < this.options.requiredConfirmations) {
            return false;
        }

        const value = new bignumber(txn.value);
        if (value.toString() === new bignumber("0").toString()) {
            return false;
        }

        return true;
    }
}
