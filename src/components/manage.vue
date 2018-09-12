<template>
	<div class="window manage">
		<vue-tabs>
			<v-tab title="MANAGE">
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
			</v-tab>
			<v-tab title="WALLET">
				<form class="wallets-container">
					<div v-if="!newAccount" class="wallet-container keys-container">
						<div  v-for="item in localAccounts" class="wallet-container__item">
							<div class="wallet_radio">
								<input v-model="curAddress" type="radio" :id="item.address.substr(38, 42)" :value="item.address">
								<label :class="{active: curAddress == item.address}" :value="item.account" :for="item.address.substr(38, 42)">{{`${item.address.substr(0, 8)}...${item.address.substr(34, 42)}`}}</label>
							</div>
							<div class="input-wallet">
								 <input readonly="" :value="item.address" :id="item.address.substr(37, 42)" class="input-wallet__address" type="text">
								 <input readonly="" :value="item.privateKey" :id="item.privateKey.substr(37, 42)" class="input-wallet__private-key" type="text">
								 <button @click.prevent="copy(item.address.substr(37, 42))" class="input-wallet__btn"><img src="../assets/copy-ico.svg" alt=""></button>
								 <button @click.prevent="copy(item.privateKey.substr(37, 42))" class="input-wallet__btn"><img src="../assets/private-key.svg" alt=""></button>
								 <button @click.prevent="deleteWallet(item.address)" class="input-wallet__btn"><img src="../assets/trash.svg" alt=""></button>
							</div>
						</div>


						<div v-show="walletButtons" class="buttuns-container">
							<button @click.prevent="generateKey" class="generate-btn btn">GENERATE</button>
							<button @click.prevent="newAccount = true" class="import-btn btn">IMPORT</button>
						</div>
					</div>
					<div class="input-import" v-if="newAccount">
						<input @keyup.enter="imortKey" :class="{err: incorrectKey}" class="input-import__input" placeholder="privateKey_" type="text" name="account" v-model="newAccountKey" id="">
						<button @click.prevent="imortKey" class="input-import__btn">import</button>
						<i class="input-import__cancel-btn"><svg @click="closeInput()" width="10" height="10" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 10 10"><g transform="matrix(1,0,0,1,-351,-64)"><path d="M352,72.07107l3.18198,-3.18198l-3.18198,-3.18198l0.7071,-0.70711l3.18198,3.18198l3.18198,-3.18198l0.7071,0.70711l-3.18198,3.18198l3.18198,3.18198l-0.70711,0.7071l-3.18197,-3.18198l-3.18198,3.18198z" fill-opacity="0" fill="#ffffff" stroke-linejoin="miter" stroke-linecap="butt" stroke-opacity="1" stroke="#ffffff" stroke-miterlimit="50" stroke-width="1" id="Path-0"></path></g></svg></i>
					</div>
				</form>
			</v-tab>
		</vue-tabs>
	</div>
</template>

<script>
	import settings from '../settings.json'
	import exchange from '../exchange.js'
	import exchangeLocal from '../exchangeLocal.js'
	import Tx from 'ethereumjs-tx'
	import EthUtil from 'ethereumjs-util'
	export default{
		data() {
			return {
				depositToken: this.pair.tokens[0],
				withdrawToken: this.pair.tokens[0],
				settings: settings,
				depositAmount: null,
				withdrawAmount: null,
				picked: '',
				spender: settings.exchangeAddress,
				curAddress: localStorage.getItem('currentAddress'),
				newAccount: false,
				incorrectKey: false,
				newAccountKey: '',
			}
		},
		computed: {
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
			localAccounts() {
				return this.$parent.accounts
			},
			walletButtons() {
				const vm = this;
				return vm.localAccounts.length !== 5
			},
		},
		props:{
			pair: Object,
			from: String,
		},
		methods: {
			closeInput(){
				const vm = this;
				vm.newAccount = false;
				vm.incorrectKey = false;
				vm.newAccountKey = '';
			},
			imortKey(){
				const vm = this;
				if (vm.newAccountKey.length > 64) {
					var account = vm.web3.eth.accounts.privateKeyToAccount(vm.newAccountKey);
					if (account.address !== vm.from) {
						vm.localAccounts.push(account);
						vm.curAddress = account.address;
						localStorage.setItem('accounts', JSON.stringify(vm.localAccounts))
					}
					vm.newAccountKey = '';
					vm.newAccount = false;
					vm.incorrectKey = false;
				}else{
					vm.incorrectKey = true;
				}
			},
			generateKey(){
				const vm = this;
				if (vm.localAccounts == null) {
					vm.localAccounts = [];
				}
				var account = vm.web3.eth.accounts.create();
				vm.curAddress = account.address;
				vm.localAccounts.push(account);
				localStorage.setItem('accounts', JSON.stringify(vm.localAccounts))
			},
			deleteWallet(address){
				const vm = this;
				if(address !== vm.from){
					vm.$parent.accounts = vm.localAccounts.filter(function(element) {
						return element.address !== address;
					});
					localStorage.setItem('accounts', JSON.stringify(vm.localAccounts))
				}
			},
			copy(id){
				const vm = this;
				let input = document.getElementById(id)
				input.select()
				try {
					var successful = document.execCommand('copy');
					var msg = successful ? 'successful' : 'unsuccessful';
					// alert('Address was copied ' + msg);
					vm.copied = true;

					setTimeout(function(){
						vm.copied = false;
					}, 3000)

				} catch (err) {
					console.log(err)
				}
				window.getSelection().removeAllRanges()
			},
			deposit(){
				const vm = this
				var amount = vm.depositAmount * 10**18
				if (this.depositToken == '0x0000000000000000000000000000000000000000') {
					exchangeLocal.depositLocal(vm.web3, Tx, vm.contract, vm.spender, vm.from, vm.$parent.privateKeyBuffer, 5, EthUtil.toBuffer(amount),  function(h){
							if (h != undefined) {
								vm.txhash = String(h);
								vm.tx = true;
							}
						})
				}else{
					const tokenContract = new vm.web3.eth.Contract(settings.tokenAbi, vm.depositToken);
					exchangeLocal.depositTokenLocal(vm.web3, Tx, vm.contract, tokenContract, vm.spender, vm.depositToken, vm.from, vm.$parent.privateKeyBuffer, 10, amount, 0, function(h){
							if (h != undefined) {
								vm.txhash = String(h);
								vm.tx = true;
							}
						});
				}
			},
			withdraw(){
				const vm = this
				if (this.withdrawToken == '0x0000000000000000000000000000000000000000') {
					exchangeLocal.withdrawLocal(vm.web3, Tx, vm.contract, vm.spender, vm.from, vm.$parent.privateKeyBuffer, 5, vm.withdrawAmount * 10**18, 0, function(h){
							if (h != undefined) {
								vm.txhash = String(h);
								vm.tx = true;
							}
						})
				}else{
					const tokenContract = new vm.web3.eth.Contract(settings.tokenAbi, vm.withdrawToken);
					exchangeLocal.withdrawTokenLocal(vm.web3, Tx, vm.contract, tokenContract, vm.spender, vm.withdrawToken, vm.from, vm.$parent.privateKeyBuffer, 10, vm.withdrawAmount * 10**18, 0, function(h){
							if (h != undefined) {
								vm.txhash = String(h);
								vm.tx = true;
							}
						});
				}

			},
		},
		watch: {
			curAddress(){
				var curAddress = this.curAddress;
				localStorage.setItem('currentAddress', curAddress);
				this.$parent.from = this.curAddress;
			}
		}
	}
</script>

<style lang="scss">
	@import '../_base.scss';

	.manage{
		display: flex;
		flex-direction: column;
		.wallets-container, 
		.tab-container, 
		.tab-content, 
		.vue-tabs{
			flex: 1;
		}

	}

	.wallets-container{
		max-width: 100vw;
		overflow: hidden;
		background-color: $black-four;
		position: relative;
	}
	.buttuns-container{
		display: flex;
		justify-content: center;
		margin: 15px 0 0;
		.btn{
			width: 150px;
			height: 60px;
			background-color: $algae-green;
			display: flex;
			align-items: center;
			justify-content: center;
			line-height: 1;
			font-weight: bold;
			border-radius: 3px;
			margin: 0px 5px;


			&.generate-btn{
				color: $white;
				background-color: $algae-green;
			}

			&.import-btn{
				color: $algae-green;
  				border: solid 0.8px $algae-green;
  				background-color: transparent;
			}
		}
	}

	.wallets-toolkit{
		padding: 0;
		width: 478px;
		z-index: 5;
	}
	.wallet-container{
		padding: 10px 5px 5px;
		font-size: 15px;
	}
	.wallet-container__item{
		display: flex;
		justify-content: center;
		
		&:not(:first-child){
			margin: 15px 0px;
		}

		.wallet_radio{
			input{
				display: none;
			}
			label{
				background-color: $black-three;
				padding: 12px 16px;
				height: 49px;
				box-sizing: border-box;
				display: block;
  				cursor: pointer;
  				font-size: 15px;
  				display: flex;
  				align-items: center;
  				justify-content: center;


  				&.active{
					background-color: $algae-green;
					box-shadow: none;
  				}
			}
		}

		.input-wallet{
			display: flex;

			.input-wallet__address,
			.input-wallet__private-key{
				position: absolute;
				right: -9999px;
			}
		}
	}
	.input-wallet__btn{
		background-color: $black-three;
  		border: solid 1.2px $black-two;
  		width: 49px;
  		height: 49px;
  		display: flex;
  		align-items: center;
  		justify-content: center;
  		box-sizing: border-box;
	}
</style>