<template>
	<div class="window forms">
		<vue-tabs>
			<v-tab title="BUY">
				<div class="forms__content">
					<form class="forms__box form__buy">
						<div class="form__buy__amount">
							<p class="input__title">AMOUNT</p>
							<p class="input__contaner --amount"><input v-model="buyAmount" placeholder="amount_" type="number"><span class="symbol-toolkit">{{pair.symbols[0]}}</span></p>
						</div>
						<div class="form__buy__price">
							<p class="input__title">PRICE</p>
							<p class="input__contaner --price"><input @click="updatePrice = false" onClick="this.select();" v-model="buyPrice" placeholder="price_" type="number"><span class="symbol-toolkit">{{pair.symbols[1]}}</span></p>
						</div>
						<p>TOTAL = <span>{{buyTotal}}</span> {{pair.symbols[1].toUpperCase()}}</p>
						<p>CHOOSE EXPIRES: 
							<span v-for="item in expires">
								<input class="radio-btn" type="radio" :id="item.title" :value="item.blockAmount" v-model="picked">
								<label :class="{active: picked == item.blockAmount}" class="expries " :for="item.title">{{item.title}}</label>
							</span>
						</p>
						<p class="button-container"><button @click.prevent="postOrder(token1, token2, buyAmount, buyTotal, 1)" class="button">PLACE BUY ORDER</button></p>
					</form>
				</div>
			</v-tab>

			<v-tab title="SELL">
				<div class="forms__content">	
					<form class="forms__box form__sell">
						<div class="form__buy__amount">
							<p class="input__title">AMOUNT</p>
							<p class="input__contaner --amount"><input v-model="sellAmount" placeholder="amount_" type="number"><span class="symbol-toolkit">{{pair.symbols[0]}}</span></p>
						</div>
						<div class="form__buy__price">
							<p class="input__title">PRICE</p>
							<p class="input__contaner --price"><input @click="updatePrice = false" onClick="this.select();" v-model="sellPrice" placeholder="price_" type="number"><span class="symbol-toolkit">{{pair.symbols[1]}}</span></p>
						</div>
						<p>TOTAL = <span>{{sellTotal}}</span> {{pair.symbols[1].toUpperCase()}}</p>
						<p>CHOOSE EXPIRES: 
							<span v-for="item in expires">
								<input class="radio-btn" type="radio" :id="item.title" :value="item.blockAmount" v-model="picked">
								<label :class="{active: picked == item.blockAmount}" class="expries" :for="item.title">{{item.title}}</label>
							</span>
						<p class="button-container"><button @click.prevent="postOrder(token2, token1, sellTotal, sellAmount, 0)" class="button sell">PLACE SELL ORDER</button></p>
					</form>
				</div>	
			</v-tab>

			<!-- <v-tab title="MANAGE">
				<div class="forms__content">
					<form class="forms__box form__manage">
						<div class="form__sell__deposit">
							<p class="input__title">DEPOSIT -><span v-for="item in tokensData"><input 
								class="radio-btn"  
								type="radio"  
								:id="item.name"  
								:value="item.token"  
								v-model="depositToken"><label  
								:class="{active: depositToken == item.token}"  
								class="expries " 
								:for="item.name">{{item.name}}</label></span>[choose currency]</p>
								<p class="input__contaner --amount"><input v-model="depositAmount" placeholder="amount_" type="number"><button @click.prevent="deposit" class="btn btn_deposit">SEND</button></p>
						</div>
					</form>
					<form class="forms__box form__manage">
						<div class="form__sell__withdraw">
							<p class="input__title">WITHDRAW -><span v-for="item in tokensData"><input
								class="radio-btn" 
								type="radio" 
								:id="item.token" 
								:value="item.token" 
								v-model="withdrawToken"><label 
								:class="{active: withdrawToken == item.token}" 
								class="expries" 
								:for="item.token">{{item.name}}</label></span>[choose currency]</p>
							<p class="input__contaner --amount"><input v-model="withdrawAmount" placeholder="amount_" type="number"><button @click.prevent="withdrawBool = true" class="btn btn_deposit">SEND</button></p>
						</div>
					</form>
				</div>
			</v-tab> -->
		</vue-tabs>

		<alert ctx="error" :title="errorTitle" v-show="popup">
			<div class="reslove-container">
				<div class="reslove">
					<div>PLEASE CHECK:</div>
					<ul>
						<li>* BALANCE</li>
						<li>* ORDER AMOUNT</li>
						<li>* METAMASK CONNECTION</li>
					</ul>
				</div>

				<div class="support-btn">SUPPORT</div>
			</div>
		</alert>
		<alert v-show="withdrawBool" ctx="error" title="Alert">
			<p class="withdraw-alert"><span>All your orders will delete!</span> <button @click.prevent="withdraw" class="btn accept">Accept</button></p>
		</alert>
		<alert ctx="transaction" title="TRANSACTION" v-show="tx">
			<div class="copy-input">
				<div class="container"><input id="hash" ref="hash" v-model="txhash" type="text"><button @click.stop.prevent="copyHash" class="copy"><img src="../assets/copy-ico.svg" alt=""></button></div>
				<div class="etherscan"><a target="_blank" :href="txlink">VIEW ON ETHERSCAN</a></div>
			</div>
		</alert>
	</div>
</template>

<script>
	
	import provider from '../provider.js'
	import exchange from '../exchange.js'
	import settings from '../settings.json'
	import exchangeLocal from '../exchangeLocal.js'
	import Tx from 'ethereumjs-tx'
	import EthUtil from 'ethereumjs-util'
	import alert from "./alert.vue"

	export default {
		name: 'forms',
		data(){
			return {
				settings: settings,
				depositToken: this.pair.tokens[0],
				withdrawToken: this.pair.tokens[0],
				buyAmount: '',
				buyPrice: '',
				sellAmount: '',
				sellPrice: '',
				depositAmount: null,
				withdrawAmount: null,
				hash: null,
				sign: null,
				updatePrice: true,


				spender: settings.exchangeAddress,

				picked: '',

				popup: false,
				withdrawBool: false,
				error: '',
				errorTitle: '',

				tx: false,
				txhash: '',
			}
		},
		components: {
			alert,
		},
		computed: {
			web3(){
				return this.$parent.web3
			},
			contract(){
				const vm = this;
				return exchange.initContract(vm.web3, settings.exchangeAbi, settings.exchangeAddress);
			},
			token1(){ return this.pair.tokens[0]},
			token2(){ return this.pair.tokens[1]},
			txlink(){ return `${settings.network.etherscan}tx/${this.txhash}`},
			blockSpeed(){ return this.settings.blockSpeed},
			expires(){
				return [
					{
						title: '1H',
						blockAmount: parseFloat((3600 / this.blockSpeed).toFixed(0)),
					},
					{
						title: '1D',
						blockAmount: parseFloat((86400 / this.blockSpeed).toFixed(0)),
					},
					{
						title: '1W',
						blockAmount: parseFloat((604800 / this.blockSpeed).toFixed(0)),
					}
				]
			},
			lastDeal(){
				return this.$parent.lastDeal
			},
			tokensData(){
				return [
					{
						name: this.pair.symbols[0],
						token: this.pair.tokens[0],
					},
					{
						name: this.pair.symbols[1],
						token: this.pair.tokens[1],
					}
				]
			},
			resource() {
	            return this.$resource('https://exapi1.herokuapp.com/v0.1/pushOrder')
	        },
			buyTotal(){
				var res = this.buyAmount * this.buyPrice;
				return +res.toFixed(10);
			},
			sellTotal(){
				var res = this.sellAmount * this.sellPrice; 
				return +res.toFixed(10);
			},
		},
		watch: {
			lastDeal(){
				this.buyPrice = '';
				this.sellPrice = '';
				this.getPrice();
			},
			tokensData(){
				this.depositToken = this.pair.tokens[0];
				this.withdrawToken = this.pair.tokens[0];
			},
			pair(){
				this.updatePrice = true;
				this.buyPrice = '';
				this.sellPrice = '';
				console.log("something changed")
				this.getPrice();
			},
		},
		sockets: {
			error(error){
				this.popup = true;
				this.errorTitle = `Error ${error}`
			},
			trade(trade){
				if (this.updatePrice) {
					this.buyPrice = '';
					this.getPrice();
				}
			},
			pushOrder(pushOrder){
				const vm = this;
				if (pushOrder.maker == vm.from) {
					vm.buyAmount = '';
					vm.sellAmount = '';
				}
			}
		},
		props:{
			pair: Object,
			from: String,
		},
		
		methods: {
			closePopup(){
				this.popup = false;
				this.tx = false;
				this.withdrawBool = false;
			},
			getPrice(){
				const vm = this;
				try {
					vm.buyPrice = vm.updatePrice == true ? vm.lastDeal : vm.buyPrice;
					vm.sellPrice = vm.updatePrice == true ? vm.lastDeal : vm.sellPrice;
				} catch(e) {
					console.log(e);
				}
			},

			// depositMetamask(){
			// 	const vm = this
			// 	if (this.depositToken == '0x0000000000000000000000000000000000000000') {
			// 		exchange.deposit(this.contract, this.from, (this.depositAmount * 10**18).noExponents(), function(h){
			// 			if (h != undefined) {
			// 				vm.txhash = String(h);
			// 				vm.tx = true;
			// 			}
			// 		}).then(res => console.log(res), err => console.log(err))
			// 	}else{
			// 		(async function () {
			// 			const contract = exchange.initContract(vm.web3, settings.tokenAbi, vm.depositToken)
			// 			console.log(contract)
			// 			await exchange.depositToken(vm.contract, contract, vm.from, vm.spender, vm.depositToken, (vm.depositAmount * 10**18).noExponents(), function(h){
			// 				if (h != undefined) {
			// 					vm.txhash = String(h);
			// 					vm.tx = true;
			// 				}
			// 			}).then(res => console.log(res), err => console.log(err))
			// 		})()
			// 	}
			// },
			// depositLocal(){
			// 	const vm = this
			// 	var amount = vm.depositAmount * 10**18
			// 	if (this.depositToken == '0x0000000000000000000000000000000000000000') {
			// 		exchangeLocal.depositLocal(vm.web3, Tx, vm.contract, vm.spender, vm.from, vm.$parent.privateKeyBuffer, 5, EthUtil.toBuffer(amount),  function(h){
			// 				if (h != undefined) {
			// 					vm.txhash = String(h);
			// 					vm.tx = true;
			// 				}
			// 			})
			// 	}else{
			// 		const tokenContract = new vm.web3.eth.Contract(settings.tokenAbi, vm.depositToken);
			// 		exchangeLocal.depositTokenLocal(vm.web3, Tx, vm.contract, tokenContract, vm.spender, vm.depositToken, vm.from, vm.$parent.privateKeyBuffer, 10, amount, 0, function(h){
			// 				if (h != undefined) {
			// 					vm.txhash = String(h);
			// 					vm.tx = true;
			// 				}
			// 			});
			// 	}
			// },
			// deposit() {
			// 	const vm = this
			// 	if (this.$parent.walletType) {
			// 		vm.depositMetamask();
			// 	}else{
			// 		vm.depositLocal();
			// 	}
			// },
			// withdrawAlert(){
			// 	this.withdrawBool = true;
			// },
			// withdrawLocal(){
			// 	const vm = this
			// 	if (this.withdrawToken == '0x0000000000000000000000000000000000000000') {
			// 		exchangeLocal.withdrawLocal(vm.web3, Tx, vm.contract, vm.spender, vm.from, vm.$parent.privateKeyBuffer, 5, vm.withdrawAmount * 10**18, 0, function(h){
			// 				if (h != undefined) {
			// 					vm.txhash = String(h);
			// 					vm.tx = true;
			// 				}
			// 			})
			// 	}else{
			// 		const tokenContract = new vm.web3.eth.Contract(settings.tokenAbi, vm.withdrawToken);
			// 		exchangeLocal.withdrawTokenLocal(vm.web3, Tx, vm.contract, tokenContract, vm.spender, vm.withdrawToken, vm.from, vm.$parent.privateKeyBuffer, 10, vm.withdrawAmount * 10**18, 0, function(h){
			// 				if (h != undefined) {
			// 					vm.txhash = String(h);
			// 					vm.tx = true;
			// 				}
			// 			});
			// 	}

			// },
			// withdrawMetamask(){
			// 	const vm = this;
			// 	if (vm.withdrawAmount !== null) {
			// 		if (this.withdrawToken == '0x0000000000000000000000000000000000000000') {
			// 			exchange.withdraw(this.contract, this.from, this.withdrawAmount * 10**18, function(h){
			// 				if (h != undefined) {
			// 					vm.txhash = String(h);
			// 					vm.tx = true;
			// 				}
			// 			}).then(res => console.log(res), err => console.log(err))
			// 		}else{
			// 			exchange.withdrawToken(this.contract, this.from, this.withdrawToken, this.withdrawAmount * 10**18, function(h){
			// 				if (h != undefined) {
			// 					vm.txhash = String(h);
			// 					vm.tx = true;
			// 				}
			// 			}).then(res => console.log(res), err => console.log(err))
			// 		}
			// 	}
			// },
			// withdraw() {
			// 	const vm = this
			// 	this.withdrawBool = false;
			// 	if (this.$parent.walletType) {
			// 		vm.withdrawMetamask();
			// 	}else{
			// 		vm.withdrawLocal();
			// 	}
			// },
			postOrder(tokenGet, tokenGive, amountGet, amountGive, orderType){
				const vm = this;
				(async function(){
					var nonce = Math.floor(Math.random() * 1000000) + 100
					var expires = null;
					var hash = null;
					await web3.eth.getBlockNumber().then(res => expires = res + parseFloat(vm.picked))
					if(vm.$parent.walletType){
						await exchange.getSign(vm.web3, vm.from, settings.exchangeAddress, tokenGet.toLowerCase(), amountGet * 10**18, tokenGive.toLowerCase(), amountGive * 10**18, expires, nonce, function(h){
							hash = h;
						})
						.then(res => vm.sign = res)
					}else{
						console.log([vm.web3, settings.exchangeAddress, tokenGet.toLowerCase(), Number(amountGet * 10**18), tokenGive.toLowerCase(), Number(amountGive * 10**18), expires, nonce])
						
						hash = exchange.orderHash(vm.web3, settings.exchangeAddress, tokenGet.toLowerCase(), amountGet * 10**18, tokenGive.toLowerCase(), amountGive * 10**18, expires, nonce);

						console.log(hash);

						var signature = vm.web3.eth.accounts.sign(hash, vm.$parent.privateKey);
						vm.sign = signature.signature;

						console.log(signature);

						vm.web3.eth.accounts.recover
					}

					var price = orderType == 1 ? parseFloat(amountGet) / parseFloat(amountGive) : parseFloat(amountGive) / parseFloat(amountGet);

					vm.$socket.emit('pushOrder',{
					    "orderType": orderType,
					    "pair": vm.pair.path,
					    "maker": vm.from.toLowerCase(),
					    "tokenGet": tokenGet.toLowerCase(),
					    "amountGet": parseFloat(amountGet) * 10**18,
					    "tokenGive": tokenGive.toLowerCase(),
					    "amountGive": parseFloat(amountGive) * 10**18,
					    "price": price,
					    "expires": expires,
					    "nonce": parseFloat(nonce),
					    "orderFills": parseFloat(amountGet) * 10**18,
					    "hash": hash,
					    "sig": vm.sign,
					    "expiresTime": Date(),
					});
				})()
			},

		},
		created(){

			const vm = this;
			// exchangeLocal.depositLocal(vm.web3, Tx, vm.contract, vm.spender, vm.from, vm.$parent.privateKeyBuffer, 5, (50 * 10**18).noExponents());

			this.picked = this.expires[0].blockAmount;
		},

	}
</script>

<style lang="scss">

	@import '../_base.scss';
	.reslove-container{
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.support-btn{
		width: 245px;
		background-color: #0be881;
		text-align: center;
		box-sizing: border-box;
		padding: 12px;
		cursor: pointer;
		color: #474747;
	}
	.reslove{
		font-size: 12px;
		ul{
			list-style-type: none;
			padding: 0
		}
	}
	.withdraw-alert{
		display: flex;
		align-items: center;
		justify-content: space-between;
		.btn{
			margin-right: 10px;
			padding: 8px 10px;
		}
	}
	.btn{
		background-color: #0be881;
		color: #474747;
		border: none;
		border-radius: 3px;
		width: 100px;
		text-align: center;
		outline: none;
		cursor: pointer;

		&:active{
			box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.5);
		}
	}
	.radio-btn{
		display: none;
	}
	.nav-tabs{
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;

	}
	.forms__box{
		max-width: 350px;
		margin: 0 auto;
	}
	.tab{
		padding: 15px 0;
		width: 100%;
		text-align: center;
		&.active{
			background-color: $black-four;
		}
		a{
			color: #fff;
			text-decoration: none;
		}
	}
	.forms{
		flex: 6 0;
		display: flex;
	}
	.tabs__item{
		text-transform: uppercase;
	}
	.forms__content{
		background-color: $black-four;
		padding: 22px;
		font-size: 14px;
		overflow: scroll;
		flex: 1;
	}
	.input__title{
		color: #aeaeae;
	}
	.symbol-toolkit{
		position: absolute;
		text-transform: uppercase;
		color: #aeaeae;
		right: 25px;
		top: 50%;
		transform: translateY(-50%);
	}
	.input__contaner{
		box-sizing: border-box;
		display: flex;
		position: relative;
		input{
			display: block;
			box-sizing: border-box;
			border-radius: 3px;
			border: 1px solid #7a7a7a;
			background-color: #474747;
			padding: 12px 25px;
			width: 100%;
			color: #fff;
			outline: none;
		}
	}
	.form__manage,
	.form__buy{
		.expries{
			&.active{
				color: #0be881;
			}
		}
	}
	.form__sell{
		.expries{
			&.active{
				color: #ff5e57;
			}
		}
	}
	.expries{
		margin: 5px;
		cursor: pointer;
		text-transform: uppercase;
	}
	.button-container{
		text-align: center;
		margin-top: 30px;
	}
	.btn_deposit{
		font-weight: 700;
	}
	.button{
		background-color: #0be881;
		border: none;
		padding: 12px;
		display: inline-block;
		box-sizing: border-box;
		text-transform: uppercase;
		color: #474747;
		min-width: 246px;
		outline: none;
		cursor: pointer;
		font-weight: 700;

		&:active{
			box-shadow: inset 0 1px 3px rgba(0,0,0,0.5);
		}
		&.sell{
			background-color: #ff5e57;
			color: #fff;
		}
	}
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		/* display: none; <- Crashes Chrome on hover */
		-webkit-appearance: none;
		margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
	}
</style>