## Introduction of NebPay SDK

### Overview
NebPay SDK provides a unified payment interface for transactions on different platforms. While using NebPay in your Dapp page, you can send transaction throw desktop browser extension and mobile wallet App.

### API introduction

The APIs provided by NebPay SDK are as flows：
 
API | Introduction 
:--- | :---
[pay](#pay) | Ordinary transactions between users
[nrc20pay](#nrc20pay)|NRC20 token transactions
[deploy](#deploy)|Deploy a smart contract
[call](#call)|Call a smart contract function
[queryPayInfo](#querypayinfo)|query a transaction result

The first four APIs above are correspond to [SendTransaction](https://github.com/nebulasio/wiki/blob/master/rpc_admin.md#sendtransaction) API, and just refined the usage scenario of `SendTransaction`.
simulateCall is correspond to [Call](https://github.com/nebulasio/wiki/blob/master/rpc.md#call) API, which is only used for interactions with browser extension, and is not supported by mobile wallet App.


### How to use NebPay
While developing your Dapp, if you want to use NebPay SDK to handle transaction, you need to include `nebPay.js` into your Dapp page. And then you can use NebPay module to send transactions.

When users using your Dapp whit desktop browsers (chrome), NebPay will call the browser plugin to process the transaction. And when your Dapp is used on mobile phone, NebPay will jump to the wallet App to process the transaction.

Here is an example of using NebPay in you Dapp. Please refer to `examples/example.html` for more information.

```html
<script src="../dist/nebPay.js"></script>
<script>
    var NebPay = require("nebpay");
    var nebPay = new NebPay();    
    var serialNumber;
    var options = {
        goods: {        //commodity description
            name: "example"
        },
        callback: NebPay.config.testnetUrl,   //tx result query server address
        listener: undefined //specify a listener function for browser extension, which will handle the tx result
    }
    serialNumber = nebPay.pay(to, value, options); //a serialNumber will be returned when calling the NebPay API, then you can query the tx result with this SerialNumber
</script>
```

#### Introduction of API & Parameters

##### options

Every NebPay API has a common parameter `options`. And here is a detailed introduction of it.

```js
var options = {
	goods: {        //Description of this commodity being  traded
		name: "",       //name of commodity
		desc: "",       //description
		orderId: "",    //order ID
		ext: ""         //extended field
	},
	qrcode: {
		showQRCode: false,      //Whether to display QR code information
		container: undefined,    //Specifies the canvas container that displays the QR code. 
		completeTip: undefined, // string of complete payment tip
		cancelTip: undefined // string of cancel payment tip
	},
	extension: {
		openExtension: true //set if need show extension payment mode
	},
	mobile: {
		showInstallTip: true,
		installTip: undefined // string of install NASNano tip
	},
	
	// callback is the server address that records tx results (the results is uploaded by wallet App)
	// we provided tx results query server for testnet and mainnet, and there is a limits to the query frequency.(should less than 20 times per minute)
	//callback: NebPay.config.mainnetUrl,     //tx result query server for mainnet
	callback: NebPay.config.testnetUrl, //tx result query server for testnet
	
	// listener： specify a listener function to handle payment feedback message（just used by browser extension, App wallet doesn't support listener）
	listener: undefined,
	
	// if use nrc20pay API, you need to specify nrc20 params like name, address, symbol, decimals
	nrc20: undefined,
	
	// if debug mode, should open testnet nano and reset the callback
	debug: false
};
```
***

##### pay

    pay(to, value, options)

###### parameters：

- `to` Destination address of this transfer

- `value` Transfer amount in nas.

- `options` Refer to [options](#options)

###### return

- `serialNumber` transaction's serival number, used for query transaction info.

*** 

##### nrc20pay

**[Currently not support for mobile wallet app]**

 ```
 nrc20pay(currency, to, value, options)
 ```

###### parameters：

- `currency` symbol of NRC20 Token, 

- `to` Destination address, which is a Nebulas wallet address

- `value` Transfer amount, The unit is this NRC20 token.

- `options` decimals and Token SmartContract address is required, while Token name and symbol is optional。

```js
options = {
    //nrc20 parameter
    nrc20: {  
        address: "", //contract address of nrc20
        decimals: 0,    //
        name: "",    //Token full name, such as "Nebulas Token"
        symbol: ""  //Token symbol,  such as "NAS","EOS". it's the same with "currency"
    }
}
```

###### return

- `serialNumber` transaction's serival number, used for query transaction info.

***

##### deploy

**[Currently not support for mobile wallet app]**

```
deploy(source, sourceType, args, options)
```

###### parameters：

- `source` source code of smart contract

- `sourceType` source type of smart contract

- `args` initialization parameters of the SmartContract. parameters are in the form of JSON string of the parameters array, such as`["arg"]` , `["arg1","arg2"]`.

- `options` Refer to [options](#options)

###### return

- `serialNumber` transaction's serival number, used for query transaction info.

***

##### call

    call(to, value, func, args, options)

###### parameters：

- `to` address of smart contract

- `value` Transfer amount in nas. Note that the value is transferred to the contract address. If the contract does not have an associated transfer out function, the transferred Nas could not be reached any more.

- `func` the function name that will be called

`args` arguments, in the form of a JSON string of arguments array, such as `["arg"]`, `["arg1","arg2"]`.

`options` Refer to `options` parameter description

###### return

- `serialNumber` transaction's serival number, used for query transaction info.

***

##### queryPayInfo

```
queryPayInfo(serialNumber, options)
```

###### parameters：

- `serialNumber` SerialNumber of this transaction, it's a random number of 32 bytes. After sending a transaction with the interface described above, a serial number of the transaction will be returned. Wallet App will uploaded the tx result to a tx query server, and you can use `queryPayInfo(serialNumber)` to query the tx result.
- `options` which specifies the query server to query results.

###### return
The return value of `queryPayInfo` is a `Promise` object. You can handle the result as follows:

```js
nebPay.queryPayInfo(serialNumber)
  .then(function (resp) {
      console.log(resp);
  })
  .catch(function (err) {
      console.log(err);
  });
```
 **Note:** The query server we provided has limitations on the query frequency, which is 6 times per minute. We suggest that you should set the query period to 10~15s.

#### Dealing with transaction results

It is different between browser extension and wallet app when handling transaction results.
* When using wallet App to send tx, wallet App can't return tx result back to Dapp page directly. Hence wallet App will send the tx result to a server. The Dapp side need to record the SerialNumber of a tx, and then use `queryPayInfo` to query the tx result from this server.
* When using a browser extension to send tx, the extension can send back tx result directly, and you can just specify a  `listener` function to handle tx result. 

#### Transaction result message

The tx result queried by  `queryPayInfo` is a JSON string, the format of this JSON is:
```json
//query failed
{
    "code": 1,  
    "data": {},
    "msg": "payId ZBTSkk74dB4tPJI9J8FDFMu270h7yaut get transaction error"
},
//query succeed
{
    "code": 0,
    "data": {
        "data": null,
        "contractAddress": "",
        "type": "binary",
        "nonce": 136,
        "gasLimit": "30000",
        "gasUsed": "20000",
        "chainId": 1001,
        "from": "n1JmhE82GNjdZPNZr6dgUuSfzy2WRwmD9zy",
        "to": "n1JmhE82GNjdZPNZr6dgUuSfzy2WRwmD9zy",
        "value": "1000000000000000000",
        "hash": "f9549a5c01f50f372607b9fd29bf15d483246578f6cc7008d6e2a537920802e6",
        "gasPrice": "1000000",
        "status": 1,
        "timestamp": 1525508076
    },
    "msg": "success"
}
```

For browser, if you specified a `listener` function, then a `txhash` will be returned, which is a JSON Object. The format of
`txhash` are like this:
```json
{
    "txhash": "a333288574df47b411ca43ed656e16c99c0af98fa3ab14647ce1ad66b45d43f1",
    "contract_address": ""
}
```
### The transaction process using NebPay is as folows:
![](flow_chart.png)

### Example of Dapp using NebPay
Here is a Dapp example Using NebPay: [SuperDictionary](https://yupnano.github.io/SuperDictionary/). It’s source code is on [GitHub](https://github.com/15010159959/super-dictionary).

These videos blow explains the payment process of a Dapp using NebPay both on PC and mobile phone.

Youtube:
- [Nebulas Dapp Using NebPay SDK on PC](https://youtu.be/FSFZqoUIT8A)
- [Nebulas Dapp Using NebPay SDK on mobile](https://youtu.be/Cjlo9KKwlNE)

Or this duplicated video on Chinese vedio website:
- [[星云链]如何在Dapp中使用NebPay SDK ](https://www.bilibili.com/video/av23217213/)

### More info
If you don't like to use NebPay while developing your Dapp page, you can also use [neb.js](https://github.com/nebulasio/neb.js) to get access to Nebulas blockchain directly.
