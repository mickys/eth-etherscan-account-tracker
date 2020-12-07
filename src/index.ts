/*
 * source       https://github.com/mickys/eth-etherscan-account-tracker/
 * @name        Account Tracker
 * @package     eth-etherscan-account-tracker
 * @author      Micky Socaci <micky@nowlive.ro>
 * @license     MIT
 */

import EthEtherscanAccountTracker from "./eth-etherscan-account-tracker/core";
import EthEtherscanAccountTrackerApp from "./eth-etherscan-account-tracker/app";

declare global {
    interface Window { EthEtherscanAccountTracker: any; }
}

if (typeof window !== 'undefined') {
    window.EthEtherscanAccountTracker = window.EthEtherscanAccountTracker || {};
}

export {
    EthEtherscanAccountTrackerApp,
    EthEtherscanAccountTracker,
};
