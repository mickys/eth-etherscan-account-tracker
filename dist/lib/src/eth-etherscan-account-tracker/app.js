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
var sqlite_async_1 = __importDefault(require("sqlite-async"));
var configuration_json_1 = __importDefault(require("../../configuration.json"));
var core_1 = __importDefault(require("./core"));
var fs_1 = __importDefault(require("fs"));
var EthEtherscanAccountTrackerApp = /** @class */ (function () {
    function EthEtherscanAccountTrackerApp(configFile, options) {
        this.logToConsole = false;
        this.autoFirstRunImport = true;
        this.enableFirstRunImport = false;
        this.internalLog = [];
        this.initialised = false;
        this.outputFilename = "OUTPUT.txt";
        this.cacheData = {};
        // default config
        this.setConfigData(configuration_json_1.default);
        // override by config file
        if (configFile) {
            this.setConfigData(this.loadConfigFile(configFile));
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
    EthEtherscanAccountTrackerApp.prototype.loadConfigFile = function (path) {
        var data = fs_1.default.readFileSync(path);
        return JSON.parse(data.toString());
    };
    EthEtherscanAccountTrackerApp.prototype.setConfigData = function (customConfig) {
        this.apiUrl = customConfig.tracker.api_url;
        this.apiKey = customConfig.tracker.api_key;
        this.apiRate = customConfig.tracker.api_rate_per_second;
        this.monitoredAddress = customConfig.tracker.monitoredAddress;
        this.requiredConfirmations = customConfig.tracker.required_confirmations;
        this.databaseFile = customConfig.database_file;
        this.startBlock = customConfig.start_block;
        this.logToConsole = customConfig.logToConsole;
    };
    EthEtherscanAccountTrackerApp.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.log("init: " + this.databaseFile);
                        _a = this;
                        return [4 /*yield*/, sqlite_async_1.default.open(this.databaseFile)];
                    case 1:
                        _a.db = _b.sent();
                        this.log("init: api_url: " + this.apiUrl);
                        this.tracker = new core_1.default({
                            api_url: this.apiUrl,
                            api_key: this.apiKey,
                            api_rate_per_second: this.apiRate,
                            monitoredAddress: this.monitoredAddress,
                            requiredConfirmations: this.requiredConfirmations,
                            start_block: 0,
                        });
                        this.log("init: requiredConfirmations " + this.requiredConfirmations);
                        this.log("init: monitoredAddress " + this.monitoredAddress);
                        return [4 /*yield*/, this.setup()];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EthEtherscanAccountTrackerApp.prototype.isStorageTableCreated = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.get("SELECT name FROM sqlite_master WHERE type='table' AND name=?", 'processed_transactions').then(function (irow, err) {
                            return (irow !== undefined);
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    EthEtherscanAccountTrackerApp.prototype.setup = function () {
        return __awaiter(this, void 0, void 0, function () {
            var statement, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.isStorageTableCreated()];
                    case 1:
                        if (!((_b.sent()) === false)) return [3 /*break*/, 3];
                        statement = 'CREATE TABLE `processed_transactions` (';
                        statement += '   `timestamp` int(11) DEFAULT NULL,';
                        statement += '   `block` int(11) DEFAULT NULL,';
                        statement += '   `hash` varchar(64) DEFAULT NULL';
                        statement += ');';
                        return [4 /*yield*/, this.db.prepare(statement).then(function (prepared) {
                                return prepared.run().then(function (ran) {
                                    return prepared.finalize();
                                });
                            })];
                    case 2:
                        _b.sent();
                        this.enableFirstRunImport = true;
                        this.log("setup: created 'processed_transactions' table");
                        return [3 /*break*/, 4];
                    case 3:
                        this.log("setup: 'processed_transactions' table already exists");
                        _b.label = 4;
                    case 4:
                        if (!this.enableFirstRunImport) return [3 /*break*/, 6];
                        this.log("setup: enableFirstRunImport");
                        return [4 /*yield*/, this.runDataImport()];
                    case 5:
                        _b.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        this.log("setup: skip import and resume from last transaction we have");
                        _b.label = 7;
                    case 7:
                        _a = this;
                        return [4 /*yield*/, this.getLastRecordedTransactionBlock()];
                    case 8:
                        _a.startBlock = _b.sent();
                        this.log("setup: setting startBlock to LastRecordedTransactionBlock: " + this.startBlock);
                        this.initialised = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    EthEtherscanAccountTrackerApp.prototype.cycle = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.runDataImport(true)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    EthEtherscanAccountTrackerApp.prototype.setCachedData = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.cacheData = data;
                return [2 /*return*/];
            });
        });
    };
    EthEtherscanAccountTrackerApp.prototype.runDataImport = function (cycle) {
        return __awaiter(this, void 0, void 0, function () {
            var currentBlock, normalTxns, internalTxns, results, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.autoFirstRunImport && cycle === undefined) {
                            return [2 /*return*/];
                        }
                        if (!(this.cacheData.block !== undefined)) return [3 /*break*/, 1];
                        currentBlock = this.cacheData.block;
                        normalTxns = this.cacheData.normal;
                        internalTxns = this.cacheData.internal;
                        return [3 /*break*/, 5];
                    case 1: return [4 /*yield*/, this.tracker.getBlockNumber()];
                    case 2:
                        currentBlock = _a.sent();
                        return [4 /*yield*/, this.tracker.getAccountNormalTransactions(currentBlock)];
                    case 3:
                        normalTxns = _a.sent();
                        return [4 /*yield*/, this.tracker.getAccountInternalTransactions(currentBlock)];
                    case 4:
                        internalTxns = _a.sent();
                        _a.label = 5;
                    case 5:
                        this.log("runDataImport: currentBlock: " + currentBlock);
                        return [4 /*yield*/, this.tracker.prepareAccountTransactions(normalTxns, internalTxns, currentBlock)];
                    case 6:
                        results = _a.sent();
                        i = 0;
                        _a.label = 7;
                    case 7:
                        if (!(i < results.length)) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.saveTransactionIfNotRecorded(results[i])];
                    case 8:
                        _a.sent();
                        _a.label = 9;
                    case 9:
                        i++;
                        return [3 /*break*/, 7];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    EthEtherscanAccountTrackerApp.prototype.isTransactionRecorded = function (hash) {
        return __awaiter(this, void 0, void 0, function () {
            var record;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getRecordedTransaction(hash)];
                    case 1:
                        record = _a.sent();
                        return [2 /*return*/, (record !== undefined && record.hash === hash)];
                }
            });
        });
    };
    EthEtherscanAccountTrackerApp.prototype.getRecordedTransaction = function (hash) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.get("SELECT * FROM processed_transactions WHERE hash = ?", hash)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    EthEtherscanAccountTrackerApp.prototype.getRecordedTransactionCount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var record;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.get("SELECT COUNT(*) as count FROM processed_transactions")];
                    case 1:
                        record = _a.sent();
                        return [2 /*return*/, record.count];
                }
            });
        });
    };
    EthEtherscanAccountTrackerApp.prototype.saveTransactionIfNotRecorded = function (txn) {
        return __awaiter(this, void 0, void 0, function () {
            var isRecorded;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isTransactionRecorded(txn.hash)];
                    case 1:
                        isRecorded = _a.sent();
                        if (!isRecorded) {
                            return [2 /*return*/, this.db.run("INSERT INTO processed_transactions (timestamp, block, hash)\n                VALUES (?, ?, ?)", [
                                    parseInt(txn.timeStamp, NaN),
                                    parseInt(txn.blockNumber, NaN),
                                    txn.hash,
                                ]).then(function (result) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                this.log("saveTransaction: saved transaction( " + txn.hash + " ) at block " + txn.blockNumber);
                                                return [4 /*yield*/, this.outputTransactionToFile(txn)];
                                            case 1: return [2 /*return*/, _a.sent()];
                                        }
                                    });
                                }); })];
                        }
                        else {
                            this.log("saveTransaction: ignored existing transaction( " + txn.hash + " ) at block " + txn.blockNumber);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    EthEtherscanAccountTrackerApp.prototype.outputTransactionToFile = function (txn) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.outputFileDescriptor === undefined) {
                            // initialise
                            this.outputFileDescriptor = fs_1.default.createWriteStream(this.outputFilename, { flags: 'a' });
                        }
                        return [4 /*yield*/, this.outputFileDescriptor.write("MINT " + txn.value + " " + txn.from + "\n")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EthEtherscanAccountTrackerApp.prototype.getLastRecordedTransactionBlock = function () {
        return __awaiter(this, void 0, void 0, function () {
            var record;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.get("SELECT * FROM processed_transactions ORDER BY block DESC LIMIT 0,1")];
                    case 1:
                        record = _a.sent();
                        if (record !== undefined) {
                            return [2 /*return*/, record.block];
                        }
                        return [2 /*return*/, 0];
                }
            });
        });
    };
    EthEtherscanAccountTrackerApp.prototype.log = function (what) {
        what = "[" + new Date().toLocaleString() + "] " + what;
        if (this.logToConsole) {
            console.log(what);
        }
        else {
            this.internalLog.push(what);
        }
    };
    EthEtherscanAccountTrackerApp.prototype.getLog = function () {
        return this.internalLog;
    };
    return EthEtherscanAccountTrackerApp;
}());
exports.default = EthEtherscanAccountTrackerApp;
//# sourceMappingURL=app.js.map