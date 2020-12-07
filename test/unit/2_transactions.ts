import { assert } from "chai";
import mocha from "mocha";
import fs from 'fs';

import { EthEtherscanAccountTracker, EthEtherscanAccountTrackerApp } from "../../src/index";
import configuration from '../../configuration.json';
import * as testData from './assets/test_transactions';

const testDbFile = "./test/unit/temp/testdb_" + Date.now() + ".db";

describe("Application", async () => {

    describe("Tracker", async () => {
        let tracker: EthEtherscanAccountTracker;
        before(async () => {
            tracker = new EthEtherscanAccountTracker({
                api_url: "https://api-ropsten.etherscan.io/api",
                api_key: "X16X7PJSGQKCQMBUJCR7MGWJK7R9XBZ6TX",
                api_rate_per_second: 5,
                monitoredAddress: "0xe422711D8714b643f18E0c000FC24FD230f06dBB",
                requiredConfirmations: 12,
                start_block: 0,
            });
        });

        describe("validateAndUpdateIncommingTransactionData()", async () => {

            it("returns true for a valid incomming transaction", async () => {
                const result: boolean = await tracker.validateAndUpdateIncommingTransactionData(testData.processedTransaction, testData.currentBlock);
                assert.equal(result, true, "result should be false" );
            });

            it("returns false for a valid incomming transaction that does not have enough required confirmations", async () => {
                const result: boolean = await tracker.validateAndUpdateIncommingTransactionData(testData.toSoonTransaction, testData.currentBlock);
                assert.equal(result, false, "result should be false" );
            });

            it("returns false for a valid incomming transaction that has ZERO value", async () => {
                const result: boolean = await tracker.validateAndUpdateIncommingTransactionData(testData.zeroValueTransaction, testData.currentBlock);
                assert.equal(result, false, "result should be false" );
            });

            it("returns false for a transaction with isError = 1", async () => {
                const result: boolean = await tracker.validateAndUpdateIncommingTransactionData(testData.isErrorTransaction, testData.currentBlock);
                assert.equal(result, false, "result should be false" );
            });

            it("returns false for a valid outgoing transaction", async () => {
                const result: boolean = await tracker.validateAndUpdateIncommingTransactionData(testData.outgoingTransaction, testData.currentBlock);
                assert.equal(result, false, "result should be false" );
            });

        });

        describe("prepareAccountTransactions()", async () => {

            it("processes both normal and internal transactions, and excludes invalid, too-young and outgoing", async () => {
                const results = await tracker.prepareAccountTransactions(testData.testRealData1.normal, testData.testRealData1.internal, 9213616);
                assert.equal(results.length, 3, "transaction.length does not match" );
            });

        });

    });

});
