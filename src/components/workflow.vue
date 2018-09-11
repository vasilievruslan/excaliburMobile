<template>
	<main class="main">
		<transition name="fade">
			<loader v-if="preLoader"></loader>
		</transition>
		<keep-alive>
			<headerMain
				:from="from"
				:pair="pair"
		    ></headerMain>
		</keep-alive>
		<main class="workflow">
			

			<div v-show="curTab == 'charts'" class="window charts-tabs">
				<vue-tabs>
					<v-tab title="PRICE CHART">
						<chart :pair="pair"></chart>
					</v-tab>
					<v-tab title="DEPTH (SOON)">
						<depth></depth>
					</v-tab>
				</vue-tabs>
			</div>
			<forms v-show="curTab == 'trade'" 
				ref="forms"
				:pair="pair"
				:from="from" >
			</forms>
			<orederbook v-show="curTab == 'orders'"
				:pair="pair"
				:from="from"
				:contract="contract"
			></orederbook>
			<history v-show="curTab == 'history'"
				ref="history"
				:pair="pair"
				:from="from">
			</history>
			<manage v-show="curTab == 'manage'"
				:pair="pair"
				:from="from" >
			</manage>

			<nav class="navigation-bar">
				<div :class="{active: curTab == 'charts'}" class="navigation-item">
					<input class="navigation-radio" v-model="curTab" type="radio" value="charts" name="charts" id="charts">
					<label for="charts">CHARTS</label>
				</div>
				<div :class="{active: curTab == 'trade'}" class="navigation-item">
					<input class="navigation-radio" v-model="curTab" type="radio" value="trade" name="trade" id="trade"><label
					 for="trade">TRADE</label></div
					 >
				<div :class="{active: curTab == 'orders'}" class="navigation-item">
					<input class="navigation-radio" v-model="curTab" type="radio" value="orders" name="orders" id="orders">
					<label for="orders">ORDERS</label>
				</div>
				<div :class="{active: curTab == 'history'}" class="navigation-item">
					<input class="navigation-radio" v-model="curTab" type="radio" value="history" name="history" id="history">
					<label for="history">HISTORY</label>
				</div>
			</nav>

	      <!-- <aside class="aside-left">
	       
	        

	      </aside>

		<section class="main-section charts">
			
			
			
		</section>
	      <aside class="aside-right">
			
	        <chat :from="from" :web3="web3" ref="chat"></chat>
	      </aside> -->
	    </main>
	</main>
</template>

<script>
	import provider from '../provider.js'
	import exchange from '../exchange.js'
	import settings from '../settings.json'

	import Tx from 'ethereumjs-tx'
	import EthUtil from 'ethereumjs-util'

	import {VueTabs, VTab} from 'vue-nav-tabs'

	import headerMain from './header.vue'
	import orederbook from './orederbook.vue'
	import history from './history.vue'
	import chat from './chat.vue'
	import chart from './chart.vue'
	import depth from './depth.vue'
	import forms from './forms.vue'
	import loader from './loader.vue'
	import manage from './manage.vue'

	import Web3 from 'web3'


	export default {
		data(){
			return{
				curTab: 'manage',
				pairs: settings.pairs,
				from: null,
				tabName: '',
				preLoader: true,
				accounts: [],
				metamaskAccount: '',
			}
		},
		computed: {
			web3(){ 
				return web3;
			},
			currentAccount(){
				const vm = this;
				return vm.accounts.find(element => element.address == vm.from);
			},
			privateKeyBuffer(){
				const vm = this;
				return EthUtil.toBuffer(vm.privateKey);
			},
			privateKey(){
				const vm = this;
				return this.walletType ? '' : vm.currentAccount.privateKey;
			},
			walletType(){
				return this.from == this.metamaskAccount
			},
			contract(){
				const vm = this;
				return new this.web3.eth.Contract(settings.exchangeAbi, settings.exchangeAddress);
			},
			room(){
				return {
					pair: this.pair.path,
			    	t1: this.pair.tokens[0],
			    	t2: this.pair.tokens[1],
				}
			},
			lastDeal(){ 
				return this.$refs.history;
			}, 
			pairID(){
				return this.$route.params.id
			},
			pair(){
				return this.pairs.find(x => x.path == this.pairID)
			},
			defaultAccount(){
				this.web3.eth.defaultAccount = this.from
				return this.web3.eth.defaultAccount
			}
		},
		sockets:{
		    connect(){
		    	var vm = this;
		    	console.log('socket connected');
		    	setTimeout(function(){vm.preLoader = false}, 3000)

		    },
			trade(trade) {
			   console.log('trade:', trade);
			}
		},
		watch: {
			pair() {
				var vm = this;
				vm.$socket.emit('joinRoom', vm.room);
				console.log(vm.room)
			},

		},
		components: {
			loader,
			headerMain,
			orederbook,
			chat,
			history,
			forms,
			chart,
			depth,
			VueTabs,
			VTab,
			manage,
		},
		methods: {
			getAccounts(){
				if (localStorage.getItem('accounts') == null) {
					return []
				} else{
					return JSON.parse(localStorage.getItem('accounts'))
				}
			},
		},
		created(){
			var vm = this;

			this.$socket.emit('joinRoom', vm.room);

			vm.accounts = vm.getAccounts();

			console.log(vm.contract)


			try{
				vm.web3.currentProvider.publicConfigStore.on('update', function() {
					vm.web3.eth.getAccounts()
					.then(res => {
						// vm.from = res[0];
						vm.metamaskAccount = res[0];
					});
				});
			}catch(e){

			}

		},
	}
</script>

<style lang="scss">

	@import '../_base.scss';
	.main{
		display: flex;
		flex-direction: column;
		max-height: 100vh;
		overflow: hidden;
	}
	.navigation-bar{
		display: flex;
		color: $greyish;
		padding: 0px 32px;
		justify-content: space-between;
	}
	.navigation-item{
		font-size: 12px;
		margin: 17px 0;
		&.active{
			color: $algae-green;
		}
		input{
			display: none;
		};
	}
	::-webkit-scrollbar {
	    width: 0px;  /* remove scrollbar space */
	    background: transparent;  /* optional: just make scrollbar invisible */
	}
	/* optional: show position indicator in red */
	::-webkit-scrollbar-thumb {
	    background: #FF0000;
	}

	input[type=number] { 
		-moz-appearance: textfield;
		appearance: textfield;
		margin: 0; 
		&::-webkit-inner-spin-button, 
		&::-webkit-outer-spin-button { 
			-webkit-appearance: none; 
			margin: 0; 
		}
	}
	.window{
		padding: 5px;
		background-color: $black-three;
		color: #fff;
		border: 1px solid  #141414;
		box-sizing: border-box;
		transition: 0.8s;
		overflow: hidden;
		flex: 1;
	}
	.charts{
		width: 100%;
		display: flex;
		flex-direction: column;
	}
	.charts-tabs{
		flex: 6 0;
		display: flex;
	}
	.workflow{
		display: flex;
		justify-content: space-between;
		height: 100vh;
		box-sizing: border-box;
		flex-direction: column;
	}
	.active{
		.chat{
			flex: 1 0;
		}
		.forms{
			flex: 0 0 46px;
		}
	}
</style>