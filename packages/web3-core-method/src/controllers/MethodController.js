/*
 This file is part of web3.js.

 web3.js is free software: you can redistribute it and/or modify
 it under the terms of the GNU Lesser General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 web3.js is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Lesser General Public License for more details.

 You should have received a copy of the GNU Lesser General Public License
 along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
 */
/**
 * @file MethodController.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

export default class MethodController {
    /**
     * @param {CallMethodCommand} callMethodCommand
     * @param {SendMethodCommand} sendMethodCommand
     * @param {SignAndSendMethodCommand} signAndSendMethodCommand
     * @param {SignMessageCommand} signMessageCommand
     * @param {PromiEvent} PromiEvent
     *
     * @constructor
     */
    constructor(callMethodCommand, sendMethodCommand, signAndSendMethodCommand, signMessageCommand, PromiEvent) {
        this.callMethodCommand = callMethodCommand;
        this.sendMethodCommand = sendMethodCommand;
        this.signAndSendMethodCommand = signAndSendMethodCommand;
        this.signMessageCommand = signMessageCommand;
        this.PromiEvent = PromiEvent;
    }

    /**
     * Checks which command should be executed
     *
     * @method execute
     *
     * @param {AbstractMethodModel} methodModel
     * @param {Accounts} accounts
     * @param {AbstractWeb3Module} moduleInstance
     *
     * @returns {Promise<Object|String>|PromiEvent|String}
     */
    execute(methodModel, accounts, moduleInstance) {
        if (this.hasWallets(accounts)) {
            if (methodModel.isSign()) {
                return this.signMessageCommand.execute(moduleInstance, methodModel, accounts);
            }

            if (methodModel.isSendTransaction()) {
                return this.signAndSendMethodCommand.execute(
                    moduleInstance,
                    methodModel,
                    new this.PromiEvent(),
                    accounts
                );
            }
        }

        if (methodModel.isSendTransaction() || methodModel.isSendRawTransaction() || methodModel.isSign()) {
            return this.sendMethodCommand.execute(moduleInstance, methodModel, new this.PromiEvent());
        }

        return this.callMethodCommand.execute(moduleInstance, methodModel);
    }

    /**
     * Checks if accounts is defined and if wallet is not empty
     *
     * @method hasWallet
     *
     * @param {Accounts} accounts
     *
     * @returns {Boolean}
     */
    hasWallets(accounts) {
        return accounts && accounts.wallet.length > 0;
    }
}