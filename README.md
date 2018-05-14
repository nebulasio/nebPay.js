# nebPay

[![NPM](https://nodei.co/npm/nebpay.js.png)](https://nodei.co/npm/nebpay.js/)

This is the Nebulas payment JavaScript API. Users can use it in browser on both PC and mobile. Users can do NAS payment through Chrome extension and iOS/Android wallet with it. [nebPay](https://github.com/nebulasio/nebPay)


## Install && Package

Use `npm` to install dependencies:

```
npm install
```

Use `gulp` to package the nebPay:

```
gulp
```

Now we can check the newly created files in `/dist`

Here you should see a bunch of js files. 

 * `nebPay.js`:Used in brower side. Including outside dependency.


## Usage

`nebPay.js` is a useful library for Nebulas DApp developers. It provides rich underlying support in web's DApp. It implements the payment functions.

For the usage of nebPay please refer to this example:

* [example](examples/example.html) 

An implementation of chrome extension contributed by community is:

* [WebExtensionWallet](https://github.com/ChengOrangeJu/WebExtensionWallet)

The parameter [`options.callback`](/doc/NebPay_Introduction.md#options) is used for querying transaction result. And it's mainnet by default if you don't specify it. 
* to select mainnet: `callback : NebPay.config.mainnetUrl` (default value)
* to select testnet: `callback : NebPay.config.testnetUrl` 

## The process of a transaction using NebPay
![](doc/flow_chart.png)

## Documentation

All NebPay SDK documents are in folder [doc](/doc).

And also there is a blog tutorial:

* [How to use NebPay in your DApp](https://medium.com/nebulasio/how-to-use-nebpay-in-your-dapp-8e785e560fbb)
* [如何在 DApp 中使用 NebPay SDK](https://blog.csdn.net/ycyzyp/article/details/80261142)

## Wiki

Please check our [Wiki](https://github.com/nebulasio/wiki) to learn more about Nebulas.

## Contribution

We are very glad that you are considering to help Nebulas Team or go-nebulas project, including but not limited to source code, documents or others.

If you'd like to contribute, please fork, fix, commit and send a pull request for the maintainers to review and merge into the main code base. If you wish to submit more complex changes though, please check up with the core devs first on our [slack channel](http://nebulasio.herokuapp.com) to ensure those changes are in line with the general philosophy of the project and/or get some early feedback which can make both your efforts much lighter as well as our review and merge procedures quick and simple.

Please refer to our [contribution guideline](https://github.com/nebulasio/wiki/blob/master/contribute.md) for more information.

Thanks.

## License

The go-nebulas project is licensed under the [GNU Lesser General Public License Version 3.0 (“LGPL v3”)](https://www.gnu.org/licenses/lgpl-3.0.en.html).

For the more information about licensing, please refer to [Licensing](https://github.com/nebulasio/wiki/blob/master/licensing.md) page.

