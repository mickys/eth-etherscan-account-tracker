import { assert } from "chai";
import mocha from "mocha";

import { EthEtherscanAccountTracker, EthEtherscanAccountTrackerApp } from "../../src/index";
import configuration from '../../configuration.json';
import customConfig from './assets/customConfig.json';

const testOutputFilename: string = "./test/unit/temp/OUTPUT_" + Date.now() + ".txt";

describe("Application", async () => {

    describe("Configuration", async () => {

        describe("Should load default configuration if available and no custom file or options are specified", async () => {
            let app;
            before(async () => {
                app = new EthEtherscanAccountTrackerApp();
            });

            it("apiUrl matches", async () => {
                assert.equal( app.apiUrl, configuration.tracker.api_url, "apiUrl does not match" );
            });

            it("apiKey matches", async () => {
                assert.equal( app.apiKey, configuration.tracker.api_key, "apiKey does not match" );
            });

            it("apiRate matches", async () => {
                assert.equal( app.apiRate, configuration.tracker.api_rate_per_second, "apiRate does not match" );
            });

            it("monitoredAddress matches", async () => {
                assert.equal( app.monitoredAddress, configuration.tracker.monitoredAddress, "monitoredAddress does not match" );
            });

            it("requiredConfirmations matches", async () => {
                assert.equal( app.requiredConfirmations, configuration.tracker.required_confirmations, "requiredConfirmations does not match" );
            });

            it("databaseFile matches", async () => {
                assert.equal( app.databaseFile, configuration.database_file, "databaseFile does not match" );
            });

            it("logToConsole matches", async () => {
                assert.equal( app.logToConsole, configuration.logToConsole, "logToConsole does not match" );
            });

        });

        describe("Should load custom configuration if provided (./customConfig.json) and no custom options are specified", async () => {
            let app;
            before(async () => {
                app = new EthEtherscanAccountTrackerApp("./test/unit/assets/customConfig.json");
            });

            it("apiUrl matches", async () => {
                assert.equal( app.apiUrl, customConfig.tracker.api_url, "apiUrl does not match" );
            });

            it("apiKey matches", async () => {
                assert.equal( app.apiKey, customConfig.tracker.api_key, "apiKey does not match" );
            });

            it("apiRate matches", async () => {
                assert.equal( app.apiRate, customConfig.tracker.api_rate_per_second, "apiRate does not match" );
            });

            it("monitoredAddress matches", async () => {
                assert.equal( app.monitoredAddress, customConfig.tracker.monitoredAddress, "monitoredAddress does not match" );
            });

            it("requiredConfirmations matches", async () => {
                assert.equal( app.requiredConfirmations, customConfig.tracker.required_confirmations, "requiredConfirmations does not match" );
            });

            it("databaseFile matches", async () => {
                assert.equal( app.databaseFile, customConfig.database_file, "databaseFile does not match" );
            });

            it("logToConsole matches", async () => {
                assert.equal( app.logToConsole, customConfig.logToConsole, "logToConsole does not match" );
            });
        });

        describe("Can override each property provided it is set as an option", async () => {

            it("apiUrl matches test value", async () => {
                const testValue = "TEST";
                const app = new EthEtherscanAccountTrackerApp(null, {api_url: testValue, outputFilename: testOutputFilename});
                assert.equal( app.apiUrl, testValue, "apiUrl does not match" );
            });

            it("apiKey matches test value", async () => {
                const testValue = "TESTKEY";
                const app = new EthEtherscanAccountTrackerApp(null, {api_key: testValue, outputFilename: testOutputFilename});
                assert.equal( app.apiKey, testValue, "apiKey does not match" );
            });

            it("apiRate matches test value", async () => {
                const testValue = 50;
                const app = new EthEtherscanAccountTrackerApp(null, {api_rate_per_second: testValue, outputFilename: testOutputFilename});
                assert.equal( app.apiRate, testValue, "apiRate does not match" );
            });

            it("monitoredAddress matches test value", async () => {
                const testValue = "TESTADDRESS";
                const app = new EthEtherscanAccountTrackerApp(null, {monitoredAddress: testValue, outputFilename: testOutputFilename});
                assert.equal( app.monitoredAddress, testValue, "monitoredAddress does not match" );
            });

            it("requiredConfirmations matches test value", async () => {
                const testValue = 10;
                const app = new EthEtherscanAccountTrackerApp(null, {required_confirmations: testValue, outputFilename: testOutputFilename});
                assert.equal( app.requiredConfirmations, testValue, "requiredConfirmations does not match" );
            });

            it("databaseFile matches test value", async () => {
                const testValue = "TESTDBFILE";
                const app = new EthEtherscanAccountTrackerApp(null, {database_file: testValue, outputFilename: testOutputFilename});
                assert.equal( app.databaseFile, testValue, "databaseFile does not match" );
            });

            it("logToConsole matches test value", async () => {
                const testValue = true;
                const app = new EthEtherscanAccountTrackerApp(null, {logToConsole: testValue, outputFilename: testOutputFilename});
                assert.equal( app.logToConsole, testValue, "logToConsole does not match" );
            });

            it("autoFirstRunImport is set to true and matches", async () => {
                const testValue = true;
                const app = new EthEtherscanAccountTrackerApp(null, {autoFirstRunImport: testValue, outputFilename: testOutputFilename});
                assert.equal( app.autoFirstRunImport, testValue, "autoFirstRunImport does not match" );
            });

            it("autoFirstRunImport is set to false and matches", async () => {
                const testValue = false;
                const app = new EthEtherscanAccountTrackerApp(null, {autoFirstRunImport: testValue, outputFilename: testOutputFilename});
                assert.equal( app.autoFirstRunImport, testValue, "autoFirstRunImport does not match" );
            });

            it("outputFilename matches test value", async () => {
                const testValue = true;
                const app = new EthEtherscanAccountTrackerApp(null, {logToConsole: testValue, outputFilename: testOutputFilename});
                assert.equal( app.outputFilename, testOutputFilename, "outputFilename does not match" );
            });

        });
    });

});
