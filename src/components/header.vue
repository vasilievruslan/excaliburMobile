<template>
	<header class="header">
		<div class="header-item header__pairs">
			<div v-on:click="dropdown = !dropdown" class="cur-pair">{{ pair.name }} <span><svg id="SVGDoc" width="14" height="7" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:avocode="https://avocode.com/" viewBox="0 0 14 7"><defs><path d="M283,20l-7,7l-7,-7v0" id="Path-0"/><clipPath id="ClipPath1016"><use xlink:href="#Path-0" fill="#ffffff"/></clipPath></defs><g transform="matrix(1,0,0,1,-269,-20)"><g><title>arrow</title><use xlink:href="#Path-0" fill-opacity="0" fill="#ffffff" stroke-linejoin="miter" stroke-linecap="butt" stroke-opacity="1" stroke="#aeaeae" stroke-miterlimit="50" stroke-width="2" clip-path="url(&quot;#ClipPath1016&quot;)"/></g></g></svg></span></div>

			<transition	name="slide">
				<ul v-if="dropdown" class="pairs">
					<li v-on:click="dropdown = !dropdown" v-for="item in pairs" class="pair__item"><router-link :to="{ name: 'pair', params: { id: item.path }}">{{ item.name }}</router-link></li>
				</ul>
			</transition>
		</div>
		<div class="header__logo"><img src="../assets/excaliburLogo.svg" alt="excalibur_alpha" class="header__logo-img"></div>
		<div @click="$parent.curTab = 'manage'" class="header-item header__balances">
			<span class="amount">{{ amount1 }}</span>
			<span class="symbol"> {{ pair.symbols[0] }}</span><br/>
			<span class="amount">{{ amount2 }}</span> 
			<span class="symbol"> {{ pair.symbols[1] }}</span>
		</div>
		<!-- <div class="header__cotainer --right">
			<ul :class="menu" class="header__navi">
				<li class="header__navi-item"><a target="_blank" @click.prevent href="">github</a></li>
				<li class="header__navi-item"><a target="_blank" :href="etherscan">etherscan</a></li>
				<li class="header__navi-item"><a target="_blank" @click.prevent href="">twitter</a></li>
				<li class="header__navi-item"><a target="_blank" @click.prevent href="">telegram</a></li>
			</ul>	
		</div> -->
		<!-- <div class="apps">
			<div class="apps__item wallets">
				<img src="../assets/wallet.svg" alt="">
				<toolkit class="wallets-toolkit">
					<form>
						<div v-if="!newAccount" class="wallet-container keys-container">
							<div  v-for="item in localAccounts" class="wallet-container__item">
								<div class="wallet_radio">
									<input v-model="picked" type="radio" :id="item.address.substr(38, 42)" :value="item.address">
									<label :class="{active: picked == item.address}" :value="item.account" :for="item.address.substr(38, 42)"><i></i></label>
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

						<div v-if="metamask == 'metamask'" class="wallet-container metamask-container">
							<div class="wallet-container__item">
								<div class="wallet_radio">
									<input v-model="picked" :value="metamaskAccount" type="radio" :id="metamaskAccount.substr(38, 42)">
									<label :class="{active: picked == metamaskAccount}" :for="metamaskAccount.substr(38, 42)"><i></i></label>
								</div>
								<div class="input-wallet">
									 <input readonly="" :value="metamaskAccount" :id="metamaskAccount.substr(36, 42)" class="input-wallet__address" type="text">
									 <button @click.prevent="copy(metamaskAccount.substr(36, 42))" class="input-wallet__btn"><img src="../assets/copy-ico.svg" alt=""></button>
									 <img class="metamask-img" width="18px" src="../assets/metaMask.svg" alt="">
								</div>
							</div>
						</div>
					</form>
				</toolkit>
			</div>
			<div class="apps__item ledger__logo">
				<img src="../assets/ledger.svg" alt="">
				<toolkit class="ledger-toolkit">
					LEDGER <br>
					Available soon.
				</toolkit>
			</div>
			<div class="apps__item metamask__logo">
				<i class="ico" :class="metamask" alt=""></i>


				<toolkit class="metamask-toolkit">
					<div v-if="metamask == 'metamask'" class="metamask-continer">
						<div class="metamask-copy">
							<input id="address" :value="metamaskAccount" type="text">
							<button @click="copy('address')" class="copy"><img src="../assets/copy-ico.svg" alt=""></button>
						</div>
						<div class="indicators">
							<div class="condition --green">ACTIVE</div>
							<transition name="fade">
								<div v-if="copied">COPIED</div>
							</transition>
							<div class="network --purple">{{network.toUpperCase()}}</div>
						</div>
					</div>
					<div v-else class="metamask-continer">
						<div class="title">METAMASK IS NOT AVAILABLE</div>
						<div class="extantion-container">
							<div class="">Please unlock your wallet or install chrome extension.</div>
							<a target="_blank" href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en">INSTALL</a>
						</div>
					</div>
				</toolkit>
			</div>
		</div>	 -->	
	</header>
</template>

<script>
	import exchange from '../exchange.js'
	import settings from '../settings.json'

	import anime from 'animejs'

	import toolkit from './toolkit.vue'

	export default {
		name: 'headerMain',
		components: { toolkit, },
		data: function(){
			return {

				newAccount: false,
				incorrectKey: false,
				newAccountKey: '',
				dropdown: false,
				amount1: '...',
				amount2: '...',
				alert: true,
				menu: '',
				network: settings.network.name,

				metamaskToolkit: false,
				ladgerToolkit: false,

				copied: false,

				picked: localStorage.getItem('currentAddress'),

			}
		},
		computed: {
			web3() {
				return this.$parent.web3
			},
			metamaskAccount(){
				return this.$parent.metamaskAccount
			},
			localAccounts() {
				return this.$parent.accounts
			},
			walletButtons() {
				const vm = this;
				return vm.localAccounts.length !== 5
			},
			etherscan(){
				return settings.network.etherscan + 'address/' + settings.exchangeAddress
			},
			pairs() {
				return settings.pairs;
			},
			metamask(){
				return this.metamaskAccount == undefined || this.metamaskAccount == "" ? 'metamask-disconect' : 'metamask'
			},
			contract(){
				return this.$parent.contract
			}

		},
		props: {
			from: String,
			pair: Object,
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
				vm.picked = account.address;
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
			
			showMenu(){
				this.menu = this.menu == '' ? 'active' : ''
			},
			showBalance(){
				const vm = this;
				exchange.balanceOf(vm.contract, vm.pair.tokens[0], vm.from)
				.then(res => {
					vm.amount1 = +(res / 10**18).toFixed(10)
				})
				exchange.balanceOf(vm.contract, vm.pair.tokens[1], vm.from)
				.then(res => {
					vm.amount2 = +(res / 10**18).toFixed(10)
				})
			},
			
		},
		watch:{
			pair(){
				this.showBalance();
			},
			from(){
				this.showBalance();
			},
			picked(){
				var curAddress = this.picked;
				localStorage.setItem('currentAddress', curAddress);
				this.$parent.from = this.picked;
			}
		},

		created() {
			const vm = this;

			this.$parent.from = this.picked;

			// vm.contract.methods.balanceOf(vm.pair.tokens[0], vm.from).call(function(err, res){
			// 	if (!err){
			// 		vm.amount1 = +(res / 10**18).toFixed(10);
			// 		// alert(res);
			// 	} else {
			// 		// alert(err);
			// 	}
			// });


			setInterval(function () {
				try {
					vm.showBalance();
				} catch(e) {
					// statements
					console.log(e);
				}
				// vm.checkMetaMask();
			}, 5000)



		}
	}
</script>

<style lang="scss">

	@import '../_base.scss';

	.header-item{
		flex: 2;
	}
	.header__logo{
		flex: 1;
		text-align: center;
	}
	.header__balances{
		text-align: right;
		text-transform: uppercase;
	}
	.input-import{
		display: flex;
		background-color: $black-four;
		padding: 38px 15px 25px;
		position: relative;
		align-items: stretch;
		.input-import__cancel-btn{
			position: absolute;
			top: 15px;
			right: 10px;
			cursor: pointer;
			line-height: 0;
		}
		input.input-import__input{
			box-shadow: none;
			box-sizing: border-box;
			padding: 13px 22px;
			border-radius: 3px;
			background-color: $greyish-brown;
			border: solid 1px $warm-grey;
			&.err{
				outline: 1px solid $grapefruit;
			}
		}
		button.input-import__btn{
			background-color: $algae-green;
			border: 1px solid $algae-green;
			@include Text-Style;
			text-transform: uppercase;
			padding: 13px 21px;
			border-radius: 3px;
		}
	}

	.fade-enter-active, .fade-leave-active {
		transition: opacity .3s;
	}
	.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
		opacity: 0;
	}



	
	.toolkit{
		position: absolute;
		right: 0;
		bottom: 0;
		transform: translateY(100%);
		font-size: 14px;
		&.ledger-toolkit{
			text-align: center;
			padding: 33px 15px;
			line-height: 1.6;
		}
		.title{
			margin-bottom: 16px;
		}
		.extantion-container{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-bottom: 11px;
			a{
				background-color: #0be881;
				padding: 12px 20px;
				color: #474747;
				border-radius: 2px;
				text-decoration: none;
			}
		}
		.--green{
			color: #0be881;
		}
		.--purple{
			color: #690496;
		}
		.indicators{
			display: flex;
			justify-content: space-between;
		}
		.metamask-copy{
			margin-bottom: 14px;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		input{
			font-size: 11px;
			box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.5);
			background-color: #242323;
			color: #919191;
			padding: 11px 9px;
			border: none;
			box-sizing: border-box;
			display: block;
			width: 100%;
			outline: none;
		}
		button{
			border: 1px solid #141414;
			background-color: #242323;
			border-radius: none;
			display: block;
			line-height: 0;
			padding: 7px;
			cursor: pointer;
			outline: none;

			&:active{
				box-shadow: inset 0px 1px 3px rgba(0, 0, 0, 0.5);
			}

			img{
				display: block;
				width: 15px;
			}
		}
	}
	.apps__item{
		padding: 7px;
		&.metamask__logo{
			&.disconect{
				filter: grayscale(100%);
			}
		}
		img, i{
			cursor: pointer;
		}
		&:hover{

			.toolkit{
				display: block;
			}
		}


		.toolkit{
			display: none;
		}
	}
	.slide-enter-active{
		animation: slide-in .5s;
	}

	.slide-leave-active {
		animation: slide-in .5s reverse;
	}

	@keyframes slide-in{
		0% {
			transform: rotateX(-90deg);
		}
		100%{
			transform: rotateX(0deg);
		}
	}


	i.ico{
		display: inline-block;
		background-size: cover;
		background-repeat: no-repeat;
		width: 28px;
		height: 25px;
		&.metamask{
			background-image: url(../assets/metaMask.svg);
		}
		&.metamask-disconect{
			background-image: url(../assets/metaMask_disconect.svg)
		}
	}

	.header{
		position: relative;
		width: 100vw;
		box-sizing: border-box;
		display: flex;
		-ms-align-items: center;
		align-items: center;
		background-color: #141414;
		font-size: 14px;
		color: #ffffff;
		height: 46px;
		margin: 7px 0px;
		padding: 0px 23px;
		justify-content: space-between;
	}
	.header__cotainer{
		display: flex;
		-ms-align-items: center;
		align-items: center;
	}
	.header__pairs{
		position: relative;
		font-size: 19px;
	}
	.cur-pair{
		cursor: pointer;
		text-transform: uppercase;
		position: relative;
		padding-right: 20px;
		display: inline-block;

		span{
			position: absolute;
			right: 0;
			top: 50%;
			transform: translateY(-50%);
			line-height: 0;
		}
	}
	.pairs{
		position: absolute;
		list-style-type: none;
		padding: 20px;
		z-index: 2;
		background-color: #141414;
		margin: 0;
		left: -20px;
		transform-origin: 0 0;
	}
	.pair__item{
		margin: 7px 0px;
		a{
			text-transform: uppercase;
			text-decoration: none;
			color: #fff;
		}
	}
	.lang-switcher{
		margin: 0px 50px;
		@extend .cur-pair;
	}
	.balances__title{
		text-transform: uppercase;
		color: #aeaeae;
	}
	.symbol{
		color: #aeaeae;
	}
	.token-balances-list__item{
		text-transform: uppercase;
		margin: 0px 0px 0px 7px;
		text-align: right;
	}
	.header__navi{
		display: flex;
		list-style-type: none;
		margin: 0;
		padding: 0;
	}
	.header__navi-item a{
		color: #fff;
		text-decoration: none;
		text-transform: uppercase;
		margin: 7px;
	}
	.apps{
		display: flex;
		-ms-align-items: center;
		align-items: center;
	}
	.menu{
		display: none;
	}

	@media screen and (max-width: 768px) {
		.menu{
			display: block;
			cursor: pointer;
			position: relative;
			z-index: 3;
		}
		.header__logo{
			margin: 10px 0px;
		}
		.header__navi{
			position: absolute;
			flex-direction: column;
			background-color: rgba(0, 0, 0, 0.8);
			padding-top: 60px;
			top: 0;
			left: 100vw;
			height: 100vh;
			z-index: 2;
			text-align: right;

			transition: all 0.4s ease-in-out;

			&.active{
				transform: translateX(-100%);
			}

			.header__navi-item{
				margin: 10px 20px;
			}
		}
		
	}
</style>