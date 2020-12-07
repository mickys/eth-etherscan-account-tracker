# Ethereum Address monitor using Etherscan API

## Installation

Make sure to use node version `10.23.0` for current test build

Hint: get [NVM](https://github.com/nvm-sh/nvm) and install `10.23.0`

**version can be node-latest if we remove automatic eth transfers using moonlet-core**

`npm install`

`npm run build`

## Running

Update the configuration.json file

`npm run minter`

OR specify the monitored address as a startup parameter

`npm run minter 0xe422711D8714b643f18E0c000FC24FD230f06dBB`

Use screen and redirect output to a file or /dev/null

`npm run minter 0xe422711D8714b643f18E0c000FC24FD230f06dBB >> output.log`

`npm run minter 0xe422711D8714b643f18E0c000FC24FD230f06dBB > /dev/null`

## Cleanup

`npm run clean`

**WARNING: this will remove database/main.db and OUTPUT.txt files**

## Testing

`npm run test`
