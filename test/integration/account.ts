import { assert } from "chai";
import mocha from "mocha";

import { EthEtherscanAccountTracker } from "../../src/index";
const receiverAddress = "0xe422711D8714b643f18E0c000FC24FD230f06dBB";

import { Wallet, Blockchains } from 'moonlet-core';
import Ethereum from "moonlet-core/dist/lib/blockchain/ethereum/class.index";

const mnemonic = "exchange neither monster ethics bless cancel ghost excite business record warfare invite";

const defaultWallet: Wallet = new Wallet(mnemonic, "EN");
defaultWallet.loadBlockchain(Ethereum);
const ethBlockchain = defaultWallet.getBlockchain( Blockchains.ETHEREUM );
const blockchain = Blockchains.ETHEREUM;
const account = ethBlockchain.createAccount();
const accounts = ethBlockchain.getAccounts();

describe("Integration", async () => {

    describe("Wallet: constructed with parameters ( mnemonic, language = EN )", async () => {

        describe("create one Ethereum account", async () => {

            it("should create first account", async () => {

                const getAccount = defaultWallet.getAccounts(blockchain)[0];
                const getIndex = defaultWallet.accounts.get(blockchain)[0];

                assert.equal( account, getAccount, "Accounts do not match" );
                assert.equal( account, getIndex, "Accounts do not match" );

                const HDKey = account.hd;
                assert.isNotNull( HDKey, "HDRootKey should not be null" );
                assert.isTrue( account.utils.isValidPrivate( Buffer.from( account.privateKey ) ), "private key is invalid" );
                assert.equal( HDKey.constructor.name, "HDKey", "HDKey class does not match expected" );
                assert.equal( HDKey.npmhdkey.depth, 5, "HDKey depth does not match" );
                assert.equal( HDKey.npmhdkey.index, 0, "HDKey index does not match" );

            });

            it("wallet should have 1 account", async () => {
                assert.equal( accounts.length, 1, "getAccounts length does not match" );
            });
        });

    });

});
