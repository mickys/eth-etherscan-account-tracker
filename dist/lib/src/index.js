"use strict";
/*
 * source       https://github.com/mickys/eth-etherscan-account-tracker/
 * @name        Account Tracker
 * @package     eth-etherscan-account-tracker
 * @author      Micky Socaci <micky@nowlive.ro>
 * @license     MIT
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EthEtherscanAccountTracker = exports.EthEtherscanAccountTrackerApp = void 0;
var core_1 = __importDefault(require("./eth-etherscan-account-tracker/core"));
exports.EthEtherscanAccountTracker = core_1.default;
var app_1 = __importDefault(require("./eth-etherscan-account-tracker/app"));
exports.EthEtherscanAccountTrackerApp = app_1.default;
if (typeof window !== 'undefined') {
    window.EthEtherscanAccountTracker = window.EthEtherscanAccountTracker || {};
}
//# sourceMappingURL=index.js.map