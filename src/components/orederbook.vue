<template>
	<div class="window orederbook">
		<div v-if="buyFrom == true" class="orederbook__form">
			<div class="orederbook__form-title">
				<div>{{order.orderType.toUpperCase()}}</div>
				<div @click="closeForm" class="close-btn">
					<svg width="10" height="10" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 10 10">
						<g transform="matrix(1,0,0,1,-351,-64)">
							<path d="M352,72.07107l3.18198,-3.18198l-3.18198,-3.18198l0.7071,-0.70711l3.18198,3.18198l3.18198,-3.18198l0.7071,0.70711l-3.18198,3.18198l3.18198,3.18198l-0.70711,0.7071l-3.18197,-3.18198l-3.18198,3.18198z" fill-opacity="0" fill="#ffffff" stroke-linejoin="miter" stroke-linecap="butt" stroke-opacity="1" stroke="#ffffff" stroke-miterlimit="50" stroke-width="1" id="Path-0"/>
						</g>
					</svg>
				</div>
			</div>
			<form class="orederbook__form-container">
				<div>ORDER</div>
				<div class="orderbook-item flex-item">
					<div class="orderbook-col">
						<div class="od-title">AMOUNT</div>
						<div class="od-amount">{{orderData.orderFills}} {{pair.symbols[0].toUpperCase()}}</div>
						<div class="od-title">PRICE</div>
						<div class="od-amount">{{orderData.price}} {{pair.symbols[1].toUpperCase()}}</div>
					</div>
					<div class="orderbook-col">
						<div class="od-title">EXPIRES</div>
						<div class="od-amount">{{order.expires}}</div>
						<div class="od-title">ADDRESS</div>
						<div class="od-amount">{{`${order.user.substr(0, 7)}...${order.user.substr(34, 42)}`}}</div>
					</div>
				</div>
				<div class="orderbook-item">
					<div>AMOUNT to {{order.orderType}}</div>
					<div class="input-container"><input v-model="order.amount" type="number"><span>{{ pair.symbols[0].toUpperCase()}}</span></div>
					<div class="total">TOTAL = <span class="--white">{{+(order.amount * order.price).toFixed(4)}}</span> {{pair.symbols[1].toUpperCase()}}</div>
				</div>
				<div class="orderbook-item">
					<button class="buy-btn" @click="trade" :class="order.orderType">{{order.orderType.toUpperCase()}}</button>
				</div>
			</form>
		</div>
		<div v-if="cancelForm == true" class="orederbook__form">
			<div class="orederbook__form-title">
				<div>CANCEL</div>
				<div @click.prevent="closeForm" class="close-btn">
					<svg width="10" height="10" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 10 10">
						<g transform="matrix(1,0,0,1,-351,-64)">
							<path d="M352,72.07107l3.18198,-3.18198l-3.18198,-3.18198l0.7071,-0.70711l3.18198,3.18198l3.18198,-3.18198l0.7071,0.70711l-3.18198,3.18198l3.18198,3.18198l-0.70711,0.7071l-3.18197,-3.18198l-3.18198,3.18198z" fill-opacity="0" fill="#ffffff" stroke-linejoin="miter" stroke-linecap="butt" stroke-opacity="1" stroke="#ffffff" stroke-miterlimit="50" stroke-width="1" id="Path-0"/>
						</g>
					</svg>
				</div>
			</div>
			<form class="orederbook__form-container">
				<div>ORDER</div>
				<div class="orderbook-item flex-item">
					<div class="orderbook-col">
						<div class="od-title">AMOUNT</div>
						<div class="od-amount">{{cancelOrderData.orderBody.amount}} {{pair.symbols[0].toUpperCase()}}</div>
						<div class="od-title">PRICE</div>
						<div class="od-amount">{{cancelOrderData.orderBody.price}} {{pair.symbols[1].toUpperCase()}}</div>
					</div>
					<div class="orderbook-col">
						<div class="od-title">EXPIRES</div>
						<div class="od-amount">{{cancelOrderData.expires}}</div>
					</div>
				</div>
				<div class="orderbook-item">
					<button class="buy-btn cancel" @click.prevent="cancelOrder">cancel</button>
				</div>
			</form>
		</div>
		<vue-tabs v-if="buyFrom !== true && cancelForm !== true">
			<v-tab title="ORDERBOOK">
				<div class="orederbook-wrap">
					<div class="orederbook__table orederbook__titles row">
						<div class="col orederbook__titles-item">AMOUNT</div>
						<div class="col orederbook__titles-item">PRICE</div>
						<div class="col orederbook__titles-item">FIAT</div>
					</div>
					<div class="orederbook__container">
						<div class="orederbook__table sell">
							<div v-for="(item, index) in listSell" @click="doOrder(index, 'buy')" :data-hash="item.hash" class="sell row">
								<div class="col value"><span class="value-bar"></span></div>
								<div class="col AMOUNT">{{(((item.orderFills * item.amountGive) / item.amountGet) / 10**18).toFixed(4)}}</div>
								<div class="col PRICE">{{(item.amountGet / item.amountGive).toFixed(4)}}</div>
								<div class="col FIAT"><span class="fiat">${{((((item.orderFills * item.amountGive) / item.amountGet) / 10**18) * fiat).toFixed(2)}}</span></div>
							</div>
						</div>
						<div class="orederbook__spread">
							<div class="spread">spread</div>
							<div class="spread-val">{{spread}}</div>
						</div>
						<div class="orederbook__table buy">
							<div v-for="(item, index) in listBuy" @click="doOrder(index, 'sell')" v-bind:data-hash="item.hash" class="buy row">
								<div class="col value"><span class="value-bar"></span></div>
								<div class="col AMOUNT">{{(item.orderFills / 10**18).toFixed(4)}}</div>
								<div class="col PRICE">{{(item.price).toFixed(4)}}</div>
								<div class="col FIAT"><span class="fiat">${{((item.orderFills / 10**18) * fiat).toFixed(2)}}</span></div>
							</div>
						</div>
					</div>
				</div>
			</v-tab>
			<v-tab title="PERSONAL OB">
				<div class="orederbook-wrap">
					<div class="orederbook__table orederbook__titles row">
						<div class="col">AMOUNT</div>
						<div class="col">PRICE</div>
						<div class="col">FIAT</div>
					</div>
					<div class="orederbook__container">
						<div class="orederbook__table">
							<div v-for="(item, index) in personalOrders" @click="toCancelOrder(index)" v-bind:data-hash="item.hash" :class="item.orderType" class="row personalOrder">
								<div class="col value"><span class="value-bar"></span></div>
								<div class="col AMOUNT">{{(item.amount / 10**18).toFixed(4)}}</div>
								<div class="col PRICE">{{(item.price).toFixed(4)}}</div>
								<div class="col FIAT"><span class="fiat">${{((item.amount / 10**18) * fiat).toFixed(2)}}</span></div>
							</div>
						</div>
					</div>
				</div>
			</v-tab>
		</vue-tabs>

		<alert ctx="transaction" title="TRANSACTION" v-show="popup">
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
	import exchangeLocal from '../exchangeLocal.js'
	import settings from '../settings.json'
	import Tx from 'ethereumjs-tx'
	import EthUtil from 'ethereumjs-util'

	import alert from './alert.vue'

	export default{
		name: 'orederbook',
		data() {
			return {
				ordersList: [],
				buyFrom: false,
				cancelForm: false,
				order: {},
				orderData: {},
				cancelOrderData: {},
				popup: false,
				error: '',
				txhash: '',
				fiat: null,
			}
		},
		computed: {
			web3(){
				return this.$parent.web3;
			},
			tokenGetAddress(){ return this.pair.tokens[0]},
			tokenGiveAddress(){ return this.pair.tokens[1]},
			personalOrders(){
				const vm = this;
				if (vm.from !== null && vm.from !== undefined) {
					vm.ordersList.forEach( function(element) {
						if (element.tokenGet == vm.tokenGetAddress) {
							element.orderType = 'buy'
							element.price = element.amountGive / element.amountGet
							element.amount = element.amountGet
						}else{
							element.amount = element.amountGive
							element.orderType = 'sell'
							element.price = element.amountGet / element.amountGive
						}
					});
					return vm.ordersList.filter(element => element.maker == vm.from.toLowerCase())
				}
			},
			listSell(){
				return this.ordersList.filter(element => element.orderType == 0 || element.orderType == 'sell').sort((a, b) => b.price - a.price);
			},
			listBuy() {
				return this.ordersList.filter(element => element.orderType == 1  || element.orderType == 'buy').sort((a, b) => b.price - a.price);
			},
			sell(){
				const vm = this;
				return this.listSell[vm.listSell.length - 1].price;
			},
			buy(){
				return this.listBuy[0].price;
			},
			spread(){
				const vm = this;
				return vm.listBuy.length !== 0 && vm.listSell.length !== 0 ? +(Math.max(vm.buy, vm.sell) - Math.min(vm.buy, vm.sell)).toFixed(10) : '-';
			},
			txlink(){
				return `${settings.network.etherscan}tx/${this.txhash}`
			},
		},
		props: {
			pair: Object,
			from: String,
			contract: Object,
		},
		watch: {
			txhash(){
				this.popup = true
			},
			pair(){
				this.closeForm();
				this.getFiat();
			},

		},
		sockets: {
			pushOrder(pushOrder) {
				console.log('pushOrder:', pushOrder);
				this.ordersList.push(pushOrder)
			},
			ordersCollection(ordersCollection) {
				const vm = this;
				vm.ordersList = ordersCollection._items;
				console.log('ordersCollection:', ordersCollection);
			},

			trade(trade) {
				let a = this.ordersList.find(element => element.hash == trade.hash)
				a.orderFills = a.orderFills - Number(trade.amountGet);
				if (a.orderFills == 0) {
					this.ordersList = this.ordersList.filter(element => element.hash !== trade.hash)
				}
			},
			cancel(cancel) {
				console.log('cancel: ' + cancel)
				this.ordersList = this.ordersList.filter(function(element) {
					return element.hash !== cancel
				});
			}
		},
		components: {
			alert
		},
		methods: {
			copyHash(){
				let input = document.querySelector('#hash')
				input.select()
				try {
					var successful = document.execCommand('copy');
					var msg = successful ? 'successful' : 'unsuccessful';
					alert('Address was copied ' + msg);
				} catch (err) {
					console.log(err)
				}
				window.getSelection().removeAllRanges()
			},
			closePopup(){
				this.popup = false
			},
			doOrder(i, type){
				var vm = this;
				if (type == 'sell') {
					var data = vm.listBuy[i]

					vm.orderData = {
						orderFills: data.orderFills / 10**18,
						price:  data.price,

					}
					vm.order.orderType = 'sell'
					
				}else{
					var data = vm.listSell[i]
					vm.orderData = {
						orderFills: +(((data.orderFills * data.amountGive) / data.amountGet) / 10**18).toFixed(4),
						price: +(data.amountGet / data.amountGive).toFixed(4),
					}

					vm.order.amount = vm.orderData.orderFills;
					vm.order.orderType = 'buy'
				}

				var rsv = exchange.rsv(vm.web3, data.sig);
				vm.order = {
					orderFills: data.orderFills,
					tokenGet: data.tokenGet,
					amountGet: data.amountGet,
					tokenGive: data.tokenGive,
					amountGive: data.amountGive,
					expires: data.expires,
					nonce: data.nonce,
					user: data.maker,
					v: rsv.v,
					r: rsv.r,
					s: rsv.s,
					amount: vm.orderData.orderFills,
					orderType: type,
					price: data.price,
				}
				vm.buyFrom = true;
			},
			trade: async function(e){
				e.preventDefault()
				const vm = this;
				if(vm.order.orderType == 'buy') {
					vm.orderData.amount = vm.order.amount * vm.order.price
				}else{
					vm.orderData.amount = vm.order.amount
				}
				console.log([vm.contract, Tx, settings.exchangeAddress, vm.from, vm.$parent.privateKeyBuffer, 5, 0, vm.order.tokenGet, EthUtil.toBuffer(vm.order.amountGet), vm.order.tokenGive, EthUtil.toBuffer(vm.order.amountGive), vm.order.expires, vm.order.nonce, vm.order.user, vm.order.v, vm.order.r, vm.order.s, EthUtil.toBuffer(vm.orderData.amount * 10**18), vm.pair.path])
				// console.log(typeof vm.orderData.amount)
				EthUtil.toBuffer(vm.order.amountGet)
				await exchangeLocal.trade(vm.contract, Tx, settings.exchangeAddress, vm.from, vm.$parent.privateKeyBuffer, 5, 0, vm.order.tokenGet, EthUtil.toBuffer(vm.order.amountGet), vm.order.tokenGive, EthUtil.toBuffer(vm.order.amountGive), vm.order.expires, vm.order.nonce, vm.order.user, vm.order.v, vm.order.r, vm.order.s, EthUtil.toBuffer(vm.orderData.amount * 10**18), vm.pair.path, function(h){

					vm.txhash = String(h);
						if (vm.txhash !== undefined) {
							vm.popup = true
						}
				})


				setTimeout(function(){
					vm.buyFrom = false;
				}, 3000)
			},
			closeForm(){
				this.buyFrom = false;
				this.cancelForm = false;
			},
			
			getFiat(){
				const vm = this;
				this.$http.get(`https://api.coinmarketcap.com/v1/ticker/${vm.pair.fullName[0]}/`).then(res => {
					console.log(res)
					vm.fiat = res.body[0].price_usd
				})
			},
			toCancelOrder(i){
				const vm = this;

				if (vm.personalOrders[i].orderType == 'buy') {
					vm.personalOrders[i].orderBody = {
						amount: (vm.personalOrders[i].orderFills / 10**18).toFixed(4),
						price: vm.personalOrders[i].price.toFixed(4),
					}
				}else{
					vm.personalOrders[i].orderBody = {
						amount: (((vm.personalOrders[i].orderFills * vm.personalOrders[i].amountGive) / vm.personalOrders[i].amountGet) / 10**18).toFixed(4),
						price: (vm.personalOrders[i].amountGet / vm.personalOrders[i].amountGive).toFixed(4),
					}
				}
				vm.personalOrders[i].orderBody
				vm.cancelOrderData = vm.personalOrders[i];

				vm.cancelForm = true;

			},
			cancelOrder: async function(i){
				const vm = this;
				let data = this.cancelOrderData;
				let rsv = exchange.rsv(vm.web3, data.sig);

				console.log([vm.contract, vm.from, data.tokenGet, data.amountGet, data.tokenGive, data.amountGive, data.expires, data.nonce, rsv.v, rsv.r, rsv.s, vm.pair.path]);
			
			
				await exchangeLocal.cancel(vm.contract, Tx, settings.exchangeAddress, vm.from, vm.$parent.privateKeyBuffer, 5, 0, data.tokenGet, EthUtil.toBuffer(data.amountGet), data.tokenGive, EthUtil.toBuffer(data.amountGive), data.expires, data.nonce, rsv.v, rsv.r, rsv.s, vm.pair.path, function(h){
					vm.txhash = String(h);
					if (vm.txhash !== undefined) {
						vm.popup = true
					}
				})

				setTimeout(function(){
					vm.cancelForm = false;
				}, 3000)
			},
	    },
	    created() {
	    	var vm = this;
			vm.getFiat();
	    },
	}
</script>

<style lang="scss">
	@import '../_base.scss';
	.etherscan{
		margin-top: 19px;
		a{
			font-size: 14px;
			color: #474747;
			text-transform: uppercase;
			background-color: #0be881;
			padding: 12px;
			display: block;
			margin: 0 auto;
			text-decoration: none;
			text-align: center;
			width: 246px;
		}
	}
	.copy-input{
		.container{
			display: flex;
			justify-content: center;
		}
		input{
			background-color: #242323;
			box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.5);
			border: none;
			box-sizing: border-box;
			padding: 13px;
			width: 383px;
			max-width: 90vw;
			color: #ffffff;
		}
		button.copy{
		    padding: 9px;
    		line-height: 0;
    		background-color: #242323;
    		border: 1px solid #141414;
    		cursor: pointer;
    		outline: none;
		}
	}
	.total{
		margin: 25px 0;
	}
	.--white{
		color: #fff;
	}
	.orderbook-col{
		max-width: 50%;
	}
	.od-title{
		margin-bottom: 8px;
	}
	.od-amount{
		word-wrap: break-word;
		color: #ffffff;
		margin-bottom: 5px;
	}
	.orderbook-item{
		margin: 28px 0px;
	}
	.orederbook__form-title{
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-left: 14px;
		padding-bottom: 13px;
		flex: 1 20px;
	}
	.orederbook__form-container{
		background-color: #2c2c2c;
		padding: 14px 22px;
		padding-bottom: 3px;
		font-size: 14px;
		font-weight: 400;
		color: #aeaeae;
		flex: 0 100%;
		overflow-x: scroll;
	}
	.close-btn{
		padding: 0px 14px;
		cursor: pointer;
	}
	.buy-btn{
		font-size: 14px;
		font-weight: 700;
		text-transform: uppercase;
		color: #fff;
		background-color: #0be881;
		padding: 12px 110px;
		display: block;
		margin: 0 auto;
		border: none;
		outline: none;
		cursor: pointer;
		&.sell{
			background-color: #ff5e57;
		}

		&.cancel{
			background-color: #ef5777;
			color: #ffffff;
		}
	}
	.input-container{
		position: relative;
		margin: 13px 0px;
		input{
			border-radius: 3px;
			border: 1px solid #7a7a7a;
			background-color: #474747;
			display: block;
			width: 100%;
			box-sizing: border-box;
			color: #fff;
			padding: 14px 25px;
			outline: none;
		}
		span{
			position: absolute;
			right: 25px;
			top: 50%;
			transform: translateY(-50%);
		}
	}
	.orederbook__form{
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	.orederbook{
		font-size: 17px;
		flex: 1;
		display: flex;
		flex-direction: column;
	}
	.orederbook-wrap{
		background-color: $black-four;
		font-size: 14px;
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	.orederbook__titles{
		color: #aeaeae;
		flex: 1 43px;
		.col{
			text-transform: uppercase;
			padding: 10px 0px 15px;
			font-size: 14px;
		}
	}
	.orederbook__container{
		flex: 0 100%;
		height: 445px;
		overflow: scroll;
		-ms-overflow-style: none;  // IE 10+
    	overflow: -moz-scrollbars-none;  // Firefox
    	&::-webkit-scrollbar { 
    		display: none;
    	}

	}
	.orederbook__spread{
		background-color: #474747;
		color: #fff;
		display: flex;
		padding: 5px 17px;
		margin: 6px 0px;
		.spread{
			text-transform: uppercase;
		}
		.spread-val{
			text-align: center;
			flex-grow: 3;
		}
	}
	.row{
		display: flex;
		justify-content: flex-end;
		position: relative;
		.col{
			width: 33%;
			text-align: center;
			.fiat{
				min-width: 70px;
				display: inline-block;
				text-align: right;
			}
			&.value{
				position: absolute;
				left: 0;
				height: 15px;
			}
		}
	}
	.orederbook__table{
		.buy .value{
			background-color: #0be881;
		}
		.sell .value{
			background-color: #ff5e57;
		}
		.row{
			padding-left: 30px;
		}
		.buy, .sell{
			font-weight: 400;
			.value{
				position: absolute;
				top: 50%;
				left: 0;
				transform: translateY(-50%);
				width: 3px;
				height: 9px;
			}
			&.row{
				padding: 5px;
				cursor: pointer;
				position: relative;
				&:hover{
					background-color: #242323;
				}
			}
		}
		.sell{
			padding-bottom: 5px;
			font-weight: 400;
		}
	}
</style>