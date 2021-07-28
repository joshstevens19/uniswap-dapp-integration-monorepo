# uniswap-dapp-integration-monorepo

This repo holds the angular, react, vue uniswap integration packages. It also has the shared package they all use. This is powered by [uniswap-simple-sdk](https://github.com/uniswap-integration/simple-uniswap-sdk). This is funded by unigrants.

## What this repo solves

Integrating uniswap within your dApp should be a simple thing but with all the complex stuff that goes into making it work, managing transaction status, calling the correct methods on the swap, maintaining the users balances, syncing the fiat prices, producing the token icons, handling all the UI making it work on every browser, i could keep going. On top of this you don't really want to pop a window for the user to swap using the uniswap widget, you want to keep the user experience consistent with your dApp. The idea of this library is to give you a really easy but fully flexible way you can integrate with uniswap with only a few lines of code. This has an angular package, vue package and react package so you can easily get running and create your own uniswap experience. You can customise mostly everything from what tokens you support to what colour you want it to be themed as!

## Features 🚀

🚀 Integrate it into your existing dApp with a few lines of code
<br/>
🚀 Supports uniswap v2 and v3 prices together and returns the best price
<br/>
🚀 Queries all the best routes and finds the best price for you
<br/>
🚀 Reactive logic so when the price moves or your trade expiries it generates you a new one but alerts the user (queries new trades on every new block)
<br/>
🚀 Reactive fiat price so users can see the amount the trade is in fiat, this updates as the price changes as well
<br/>
🚀 Reactive balance syncing so the user can see their correct balance all the time (syncs on every new block)
<br/>
🚀 Supports all major browsers
<br/>
🚀 Is fully responsive
<br/>
🚀 Fully customisable, style it as you want, support whatever tokens you want and much more
<br/>
🚀 Uses the awesome [simple-uniswap-sdk](https://github.com/uniswap-integration/simple-uniswap-sdk) for all the uniswap on chain logic
<br/>
🚀 Fully typescript supported with full generated typings
<br/>
🚀 and much more!!

## Live demo

You can view a live demo [here](https://uniswap-dapp-integration.netlify.app). You will need MetaMask installed. It only uses a few tokens just to show the demo working.

## Angular

Full docs for the angular integration please go [here](https://github.com/uniswap-integration/uniswap-dapp-integration-monorepo/tree/master/angular)

## React

Full docs for the react integration please go [here](https://github.com/uniswap-integration/uniswap-dapp-integration-monorepo/tree/master/react-package)

## VUE

Full docs for the vue integration please go [here](https://github.com/uniswap-integration/uniswap-dapp-integration-monorepo/tree/master/vue)
