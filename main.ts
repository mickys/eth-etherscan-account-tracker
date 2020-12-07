import { EthEtherscanAccountTrackerApp } from "./src/index";
const EthereumUtil = require('ethereumjs-util');

const INTERVAL = 5000;
let cyclestop = false;
let timer;

let argvMonitoredAddress: string;

if (process.argv[2] !== undefined) {
    argvMonitoredAddress = process.argv[2];

    if (!EthereumUtil.isValidAddress(argvMonitoredAddress)) {
        throw Error( argvMonitoredAddress + " is not a valid ethereum address.");
    }
}

const app = new EthEtherscanAccountTrackerApp(null, {
    outputFilename: "OUTPUT.txt",
    monitoredAddress: argvMonitoredAddress,
});

process.on('SIGTERM', async () => {
    console.log('Got SIGTERM signal.');
    stop();
    process.exit(1);
});

async function cycle() {
    timer = setTimeout( async () => {
        await runTask();
        if (!cyclestop) { await cycle(); }
    }, INTERVAL);
}

async function runTask() {
    await app.cycle();
}

function stop() {
    cyclestop = true;
    clearTimeout(timer);
}

(async () => {
    try {
        await app.init();
        await cycle();
    } catch (e) {
        console.log("error:", e);
    }
})();
