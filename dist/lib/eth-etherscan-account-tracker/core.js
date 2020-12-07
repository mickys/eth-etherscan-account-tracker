"use strict";
/*
 * source       https://github.com/mickys/eth-etherscan-account-tracker/
 * @name        Account Tracker
 * @package     eth-etherscan-account-tracker
 * @author      Micky Socaci <micky@nowlive.ro>
 * @license     MIT
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bignumber_js_1 = __importDefault(require("bignumber.js"));
var axios_1 = __importDefault(require("axios"));
var EthEtherscanAccountTracker = /** @class */ (function () {
    /**
     *
     * @param {options} - InitOptions
     */
    function EthEtherscanAccountTracker(options) {
        this.options = {
            api_url: "",
            api_key: "",
            api_rate_per_second: 5,
            monitoredAddress: "",
            requiredConfirmations: 12,
        };
        this.cache = {};
        this.startblock = 9000000;
        this.endblock = 99999999;
        this.initialised = false;
        if (typeof options !== "undefined") {
            this.options = Object.assign({}, options);
        }
    }
    EthEtherscanAccountTracker.prototype.getApiParams = function (userMod, userAction, userStartBlock) {
        return {
            module: userMod,
            action: userAction,
            address: this.options.monitoredAddress,
            startblock: userStartBlock || this.startblock,
            endblock: this.endblock,
            apikey: this.options.api_key,
        };
    };
    // public init(): Promise<any> {
    //     if (!this.initialised) {
    //     }
    //     return true;
    // }
    EthEtherscanAccountTracker.prototype.resultDecoder = function (input, type) {
        if (type === "number") {
            return parseInt(input, NaN);
        }
        else {
            // raw
            return input;
        }
    };
    EthEtherscanAccountTracker.prototype.getBlockNumber = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, axios_1.default.get(this.options.api_url, {
                        params: {
                            module: "proxy",
                            action: "eth_blockNumber",
                            apikey: this.options.api_key,
                        },
                    }).then(function (response) {
                        if (response.data.result !== undefined) {
                            return _this.resultDecoder(response.data.result, "number");
                        }
                        else {
                            return Promise.reject(response.data.error.message);
                        }
                    }).catch(function (error) {
                        return Promise.reject(new Error(error));
                    })];
            });
        });
    };
    EthEtherscanAccountTracker.prototype.getAccountNormalTransactions = function (startBlock) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, axios_1.default.get(this.options.api_url, {
                        params: {
                            module: "account",
                            action: "txlist",
                            address: this.options.monitoredAddress,
                            startblock: startBlock || this.startblock,
                            endblock: this.endblock,
                            apikey: this.options.api_key,
                        },
                    })];
            });
        });
    };
    EthEtherscanAccountTracker.prototype.getAccountInternalTransactions = function (startBlock) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, axios_1.default.get(this.options.api_url, {
                        params: {
                            module: "account",
                            action: "txlistinternal",
                            address: this.options.monitoredAddress,
                            startblock: startBlock || this.startblock,
                            endblock: this.endblock,
                            apikey: this.options.api_key,
                        },
                    })];
            });
        });
    };
    EthEtherscanAccountTracker.prototype.getAccountTransactions = function (startBlock) {
        return __awaiter(this, void 0, void 0, function () {
            var transactionResponse, normalTxns, internalTxns;
            var _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = {};
                        return [4 /*yield*/, this.getBlockNumber()];
                    case 1:
                        transactionResponse = (_a.block = _b.sent(),
                            _a.list = [],
                            _a);
                        return [4 /*yield*/, this.getAccountNormalTransactions(startBlock)];
                    case 2:
                        normalTxns = _b.sent();
                        return [4 /*yield*/, this.getAccountInternalTransactions(startBlock)];
                    case 3:
                        internalTxns = _b.sent();
                        normalTxns.data.result.forEach(function (data) {
                            if (_this.validateAndUpdateIncommingTransactionData(data, transactionResponse.block)) {
                                transactionResponse.list.push(data);
                            }
                        });
                        internalTxns.data.result.forEach(function (data) {
                            if (_this.validateAndUpdateIncommingTransactionData(data, transactionResponse.block)) {
                                transactionResponse.list.push(data);
                            }
                        });
                        transactionResponse.list.sort(function (a, b) { return a.blockNumber.localeCompare(b.blockNumber); });
                        return [2 /*return*/, transactionResponse];
                }
            });
        });
    };
    EthEtherscanAccountTracker.prototype.validateAndUpdateIncommingTransactionData = function (txn, blockNumber) {
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
        if (txn.confirmations < this.options.requiredConfirmations) {
            return false;
        }
        var value = new bignumber_js_1.default(txn.value);
        if (value.toString() === new bignumber_js_1.default("0").toString()) {
            return false;
        }
        return true;
    };
    return EthEtherscanAccountTracker;
}());
exports.default = EthEtherscanAccountTracker;
//# sourceMappingURL=core.js.map