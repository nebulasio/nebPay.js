## Introduction of NebPay SDK

### 简介
NebPay SDK 为不同平台的交易提供了统一的支付接口，开发者在Dapp页面中使用NebPay API可以通过浏览器插件钱包、手机app钱包等实现交易支付和合约调用。

### 接口介绍

目前NebPay 提供了以下五个接口：
 
接口 | 简介 
:--- | :---
pay | 用于账户间的NAS转账
nrc20pay|用于NRC20代币的转账
deploy|用于部署智能合约
call|用于调用智能合约
simulateCall|用于模拟运行智能合约的调用
queryPayInfo|用于查询支付结果

以上接口中，前四个api对应于[SendTransaction](https://github.com/nebulasio/wiki/blob/master/rpc_admin.md#sendtransaction)接口，只是细化了`SendTransaction`的使用场景。simulateCall 对应于RPC [Call](https://github.com/nebulasio/wiki/blob/master/rpc.md#call)接口，只用于和浏览器扩展的交互，移动端钱包app不支持该接口。


### 使用说明
在开发Dapp时，如果要使用NebPay SDK来处理交易， 需要将`nebPay.js`插入到Dapp页面中， 然后就可以使用nebpay模块来发送交易了。

当用户在桌面浏览器（chrome）使用Dapp，nebPay会调用浏览器插件来处理交易。当在手机端使用Dapp，nebPay会跳转到钱包app来处理交易.

Dapp中使用NebPay的例子， 可参考`examples/example.html`.
```html
<script src="../dist/nebPay.js"></script>
<script >
    var NebPay = require("nebpay");
    var nebPay = new NebPay();    
    var serialNumber;
    var options = {
        goods: {        //商品描述
            name: "example"
        },        
        listener: undefined //为浏览器插件指定listener,处理交易返回结果
    }
    serialNumber = nebPay.pay(to, value, options); //调用交易接口会返回32位的交易序列号，Dapp端用该序列号查询交易结果
</script>
```

#### 接口&参数说明

##### options参数说明

每个接口都有一个共同的参数`options`，该参数的详细介绍如下:
```js
var defaultOptions = {
	goods: {        //Dapp端对当前交易商品的描述信息
		name: "",       //商品名称
		desc: "",       //描述信息
		orderId: "",    //订单ID
		ext: ""         //扩展字段
	},
	qrcode: {
		showQRCode: false,      //是否显示二维码信息
		container: undefined    //指定显示二维码的canvas容器，不指定则生成一个默认canvas
	},
	// callback 是记录交易返回信息的交易查询服务器地址（目前是固定的地址，Dapp开发者暂时不能指定自己的交易查询服务器）
	callback: undefined,
	// listener: 指定一个listener函数来处理交易返回信息（仅用于浏览器插件，App钱包不支持listener）
	listener: undefined,
	// if use nrc20pay ,should input nrc20 params like name, address, symbol, decimals
	nrc20: undefined
};
```

##### pay

    pay(to, value, options)

参数说明：

`to` 转账目的地址

`value` 转账数额，单位为nas。（wei是Nas的最小单位，1 Nas = 1e18 wei）

`options` 参见 options参数说明

##### nrc20pay

    nrc20pay(currency, to, value, options)

参数说明：

`currency` NRC20代币名称

`to` 转账目的地址，改地址为nebulas钱包地址

`value` 转账数额，单位为 NRC20 token

`options` 必须指定代币的小数点位数和代币合约地址，另外可指定代币名称、符号。

```js
options = {
    //nrc20参数介绍
    nrc20: {  
        address: "", //contract address of nrc20
        decimals: 0,
        name: "",
        symbol: ""
    }
}
```

##### deploy

    deploy(source, sourceType, args, options)

参数说明：

`source` 合约源代码

`sourceType` 合约代码类型

`args` 合约的初始化函数参数，初始化函数无参数则留空，参数格式为参数数组的JSON字符串，比如`["arg"]` ， `["arg1","arg2"]`。

`options` 参见 options参数说明


##### call

    call(to, value, func, args, options)

参数说明：

`to` 合约地址

`value` 转账数额，单位为nas。注意value是向合约地址转账，如果合约没有相关的转出函数，则转入的Nas将无法转出。

`func` 要调用的合约函数名

`args` 调用的函数参数，格式为参数数组的JSON字符串，比如`["arg"]` ， `["arg1","arg2"]`。

`options` 参见 options参数说明

##### simulateCall

    simulateCall(to, value, func, args, options)

参数说明：

simulateCall 参数与 call 接口参数相同，对应于RPC [Call](https://github.com/nebulasio/wiki/blob/master/rpc.md#call)接口。用来模拟执行合约调用，可以得到合约运行结果、预计gas消耗。主要用于调用合约中的查询函数，得到该函数的返回值。

##### queryPayInfo

    queryPayInfo(serialNumber)

参数说明：

`serialNumber` 交易序列号，使用上面介绍的接口发送交易后会返回该交易的序列号，是一个32位随机数。钱包App会将交易结果会上传到交易查询呢服务器，Dapp端用` queryPayInfo(serialNumber)`来查询交易结果信息。
返回值: `queryPayInfo`会返回一个`Promise`.

```js
nebPay.queryPayInfo(serialNumber)
  .then(function (resp) {
      console.log(resp);
  })
  .catch(function (err) {
      console.log(err);
  });
```

#### 交易返回信息的处理
浏览器插件和钱包app对交易返回信息有不同的处理方式。
* 跳转钱包APP发送交易时，钱包app无法直接返回消息给Dapp页面，所以会将交易信息发送到一个交易查询服务器。Dapp端需要记录发送交易时返回的序列号`serialNumber`，然后使用`queryPayInfo`接口去查询该交易的序列号去获取交易信息.
* 使用浏览器插件发送交易时可以指定一个`listener`函数来接收并处理交易返回信息。浏览器插件也可以将交易结果发送到交易查询服务器。

#### 交易返回信息

 `pay`, `nrc20pay`, `deploy`, `call`的返回信息格式为:
```json
{"txhash":"a333288574df47b411ca43ed656e16c99c0af98fa3ab14647ce1ad66b45d43f1","contract_address":""}
```

`simulateCall`的返回信息格式为:
```json
{"result":"null","execute_err":"","estimate_gas":"20168"}
```

#### 
在开发Dapp页面时，如果不想使用NebPay，也可以使用neb.js直接访问星云链。
