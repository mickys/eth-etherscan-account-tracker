import EthEtherscanAccountTracker from "./eth-etherscan-account-tracker/core";
import EthEtherscanAccountTrackerApp from "./eth-etherscan-account-tracker/app";
declare global {
    interface Window {
        EthEtherscanAccountTracker: any;
    }
}
export { EthEtherscanAccountTrackerApp, EthEtherscanAccountTracker, };
