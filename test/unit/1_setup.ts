import { assert } from "chai";
import mocha from "mocha";
import fs from 'fs';

import { EthEtherscanAccountTrackerApp } from "../../src/index";
import * as testData from './assets/test_transactions';

const globallogToConsole: boolean = false;

const testDbFile = "./test/unit/temp/testdb_" + Date.now() + ".db";
const testOutputFilename: string = "./test/unit/temp/OUTPUT_" + Date.now() + ".txt";

const countLines = (filePath, callback) => {
    let i: number;
    let count: number = 0;
    fs.createReadStream(filePath)
        .on('error', e => callback(e))
        .on('data', chunk => {
            for (i = 0; i < chunk.length; ++i) {
                if (chunk[i] === 10) {
                    count++;
                }
            }
        })
        .on('end', () => callback(null, count));
};

describe("Application", async () => {

    describe("Helpers", async () => {

        const dummyTransaction = {
            timeStamp: 2, blockNumber: 2, hash: "TEST",
        };

        let app;
        before(async () => {
            app = new EthEtherscanAccountTrackerApp(null, {database_file: testDbFile, logToConsole: globallogToConsole, autoFirstRunImport: false, outputFilename: testOutputFilename});
            await app.init();
        });
        after(async () => {
            // cleanup
            fs.unlinkSync(testDbFile);
            fs.unlinkSync(testOutputFilename);
        });

        describe("getRecordedTransactionCount()", async () => {

            it("returns 0 if no transactions have been saved", async () => {
                assert.equal( await app.getRecordedTransactionCount(), 0, "getRecordedTransactionCount should return 0" );
            });

            it("returns 1 if 1 transaction has been saved", async () => {
                await app.saveTransactionIfNotRecorded({
                    timeStamp: 2,
                    blockNumber: 2,
                    value: 2,
                    hash: "test",
                });
                assert.equal( await app.getRecordedTransactionCount(), 1, "getRecordedTransactionCount should return 1" );
            });

        });

        describe("saveTransactionIfNotRecorded()", async () => {

            before(async () => {
                await app.saveTransactionIfNotRecorded({
                    timeStamp: dummyTransaction.timeStamp,
                    blockNumber: dummyTransaction.blockNumber,
                    value: 2,
                    hash: dummyTransaction.hash,
                });
            });

            it("transaction count increases by 1", async () => {
                assert.equal( await app.getRecordedTransactionCount(), 2, "getRecordedTransactionCount should return 2" );
            });

        });

        describe("isTransactionRecorded()", async () => {

            it("returns true on the previous dummy data transaction", async () => {
                assert.equal( await app.isTransactionRecorded(dummyTransaction.hash), true, "isTransactionRecorded should return true" );
            });

            it("returns false on a non existing hash", async () => {
                assert.equal( await app.isTransactionRecorded("NOT_FOUND"), false, "isTransactionRecorded should return false" );
            });

        });

        describe("getRecordedTransaction()", async () => {

            let recordedTransaction;
            before(async () => {
                recordedTransaction = await app.getRecordedTransaction(
                    dummyTransaction.hash,
                );
            });

            it("recordedTransaction.timestamp matches dummyTransaction.timeStamp", async () => {
                assert.equal( recordedTransaction.timestamp, dummyTransaction.timeStamp, "timestamp does not match" );
            });

            it("recordedTransaction.block matches dummyTransaction.blockNumber", async () => {
                assert.equal( recordedTransaction.block, dummyTransaction.blockNumber, "block does not match" );
            });

            it("recordedTransaction.hash matches dummyTransaction.hash", async () => {
                assert.equal( recordedTransaction.hash, dummyTransaction.hash, "hash does not match" );
            });

        });

        describe("getLastRecordedTransactionBlock()", async () => {

            it("returns dummyTransaction.block", async () => {
                assert.equal( await app.getLastRecordedTransactionBlock(), dummyTransaction.blockNumber, "getLastRecordedTransactionBlock should return dummyTransaction.block" );
            });

            it("returns proper block after a new record is inserted", async () => {

                await app.saveTransactionIfNotRecorded({
                    timeStamp: dummyTransaction.timeStamp,
                    blockNumber: 5555,
                    value: 5,
                    hash: "TEST_555",
                });

                assert.equal( await app.getLastRecordedTransactionBlock(), 5555, "getLastRecordedTransactionBlock should return 5555" );
            });

        });

    });

    describe("First run - autoFirstRunImport false", async () => {

        let app;
        before(async () => {
            app = new EthEtherscanAccountTrackerApp(null, {database_file: testDbFile, logToConsole: globallogToConsole, autoFirstRunImport: false, outputFilename: testOutputFilename});
            await app.init();
        });

        after(async () => {
            // cleanup
            fs.unlinkSync(testDbFile);
            fs.unlinkSync(testOutputFilename);
        });

        describe("Setup", async () => {

            it("creates the test database file", async () => {
                assert.equal( fs.existsSync(testDbFile), true, "database file does not exist" );
            });

            it("creates the processed_transactions table in the database", async () => {
                assert.equal( await app.isStorageTableCreated(), true, "processed_transactions table does not exist in the database" );
            });

            it("getRecordedTransactionCount() returns 0", async () => {
                assert.equal( await app.getRecordedTransactionCount(), 0, "getRecordedTransactionCount should return 0" );
            });

            it("enables the initial import of transactions for the monitored address", async () => {
                assert.equal( app.enableFirstRunImport, true, "enableFirstRunImport should be true" );
            });

            it("getLastRecordedTransactionBlock() returns 0", async () => {
                assert.equal( await app.getLastRecordedTransactionBlock(), 0, "getLastRecordedTransactionBlock should return 0" );
            });

            it("autoFirstRunImport is false", async () => {
                assert.equal( app.autoFirstRunImport, false, "autoFirstRunImport should be false" );
            });

            it("initialised is true", async () => {
                assert.equal( app.initialised, true, "initialised should be true" );
            });
        });

        describe("Initial import - with cached dummy data", async () => {

            before(async () => {

                // enable importing
                app.autoFirstRunImport = true;

                // set cache data
                app.setCachedData({
                    block: testData.currentBlock,
                    normal: testData.testRealData1.normal,
                    internal: testData.testRealData1.internal,
                });

                // run import
                await app.runDataImport();
            });

            it("autoFirstRunImport is true", async () => {
                assert.equal( app.autoFirstRunImport, true, "autoFirstRunImport should be true" );
            });

            it("initialised is true", async () => {
                assert.equal( app.initialised, true, "initialised should be true" );
            });

            it("transaction count increases to 3", async () => {
                assert.equal( await app.getRecordedTransactionCount(), 3, "getRecordedTransactionCount should return 3" );
            });

            it("OUTPUT.txt file contains 3 lines", async () => {
                countLines(testOutputFilename, ( (err, lines) => {
                    assert.equal( err, null, "OUTPUT.txt should exist" );
                    assert.equal( lines, 3, "OUTPUT.txt should contain 3 lines" );
                }));
            });

            describe("Initial import - loop cycle - received new data", async () => {

                before(async () => {

                    // set cache data
                    app.setCachedData({
                        block: testData.currentBlock,
                        normal: testData.testRealDataIncludingNew.normal,
                        internal: testData.testRealDataIncludingNew.internal,
                    });

                    // run import
                    await app.cycle();
                });

                it("transaction count increases to 4", async () => {
                    assert.equal( await app.getRecordedTransactionCount(), 4, "getRecordedTransactionCount should return 4" );
                });

                it("OUTPUT.txt file contains 4 lines", async () => {
                    countLines(testOutputFilename, ( (err, lines) => {
                        assert.equal( err, null, "OUTPUT.txt should exist" );
                        assert.equal( lines, 4, "OUTPUT.txt should contain 4 lines" );
                    }));
                });
            });
        });

    });

});
