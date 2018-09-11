<template>
	<div class="window history">
		<vue-tabs>
			<v-tab title="TRADE HISTORY">
				<div class="history__table">
					<div  class="row history__header">
						<div class="col">amount</div>
						<div class="col">price</div>
						<div class="col">time</div>
					</div>
					<div class="history__container">
						<a target="_blank" :href="`https://kovan.etherscan.io/tx/${item.txHash}`" v-for="item in historyData" :class="item.orderType" class="row history__row">
							<div class="col amount">{{(item.amount / 10**18).toFixed(4)}}</div>
							<div class="col price"><span>{{(item.price).toFixed(4)}}</span></div>
							<div class="col time">{{item.formatDate}}</div>
						</a>
					</div>
				</div>
			</v-tab>
			<v-tab title="PERSONAL TH">
				<div class="history__table">
					<div  class="row history__header">
						<div class="col">amount</div>
						<div class="col">price</div>
						<div class="col">time</div>
					</div>
					<div class="history__container">
						<a :href="`https://kovan.etherscan.io/tx/${item.txHash}`" v-for="item in personalHistoryData" :class="item.orderType" class="row history__row">
							<div class="col amount">{{(item.amount / 10**18).toFixed(4)}}</div>
							<div class="col price"><span>{{item.price.toFixed(4)}}</span></div>
							<div class="col time">{{item.formatDate}}</div>
						</a>
					</div>
				</div>
			</v-tab>
		</vue-tabs>
	</div>
</template>

<script>
	

	export default{
		name: 'histiry',
		data() {
			return {
				historyData: [],
			}
		},
		computed: {
			personalHistoryData() {
				const vm = this;
				if (vm.from !== null && vm.from !== undefined) {
					return vm.historyData.filter(element => element.maker == vm.from.toLowerCase() || element.taker == vm.from.toLowerCase());
				}
			},
			tokenGetAddress(){
				return this.pair.tokens[0]
			},
			tokenGiveAddress(){ return this.pair.tokens[1]},

		},
		sockets: {
			tradeHistoryCollection(tradeHistoryCollection) {
				const vm = this;
				console.log('tradeHistoryCollection:', tradeHistoryCollection);
				this.historyData = tradeHistoryCollection._items.reverse()
				this.historyData.forEach(element => {vm.formating(element)})
			},
			trade(trade){
				this.formating(trade);
				this.historyData.unshift(trade);
			}
		},
		props: {
			pair: Object,
			from: String,
		},
		methods: {
			formating(el){
				const vm = this;
				el.formatDate = new Date(el.date);
				el.formatDate = `${
					el.formatDate.getUTCMonth() + 1 < 10 ? '0' + (el.formatDate.getUTCMonth() + 1) : (el.formatDate.getUTCMonth() + 1)}/${
					el.formatDate.getUTCDate() < 10 ? '0' + el.formatDate.getUTCDate() : el.formatDate.getUTCDate()} ${
					el.formatDate.getUTCHours() < 10 ? '0' + el.formatDate.getUTCHours() : el.formatDate.getUTCHours()}:${
					el.formatDate.getUTCMinutes() < 10 ? '0' + el.formatDate.getUTCMinutes() : el.formatDate.getUTCMinutes()}`;
				

				if(el.tokenGet == vm.tokenGetAddress){
					el.orderType = 'buy'
					el.price = el.amountGive / el.amountGet;
					el.amount = el.amountGet
				}else{
					el.orderType = 'sell'
					el.price = el.amountGet / el.amountGive;
					el.amount = el.amountGive
				}
			},
		},
		created(){
			var vm = this;
		}
	}
</script>

<style lang="scss">
	@import '../_base.scss';
	.history__row{
		.price{
			display: flex;
			align-items: center;
			justify-content: center;
		}
		&.buy{
			.price:after{
				margin: 0px 5px;
				content: '';
				width: 0;
				height: 0;
				border-style: solid;
				border-width: 0 7px 7px 7px;
				border-color: transparent transparent #0be881 transparent;
			}
		}
		&.sell{
			.price:after{
				margin: 0px 5px;
				content: '';
				width: 0;
				height: 0;
				border-style: solid;
				border-width: 7px 7px 0 7px;
				border-color: #ff5e57 transparent transparent transparent;
			}
		}
	}
	.col.price span {
		width: 70px;
		text-align: right;
	}
	.history{
		width: 100%;
		height: 540px;
		flex: 4 0;
		display: flex;
		flex-direction: column;
	}
	.vue-tabs{
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	.nav-tabs-navigation{
		flex: 0 30px;
	}
	.tab-content{
		flex: 1 100%;
		display: flex;
		flex-direction: column;
	}
	.tab-container{
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	.history__table{
		background-color: $black-four;
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	.history__header{
		color: #aeaeae;
		flex: 0 43px;
		.col{
			text-transform: uppercase;
			padding: 10px 0px 15px;
			font-size: 14px;
		}
	}
	.history__container{
		flex: 1px;
		overflow: scroll;
		-ms-overflow-style: none;  // IE 10+

		&::-webkit-scrollbar { 
			display: none;
		}
	}
	.history__row{
		font-weight: 400;
		padding: 4px 0px;
		font-size: 14px;
		width: 100%;
		color: #fff;
		text-decoration: none;

		&:hover{
			background-color: #242323;
		}

		&:last-child{
			margin-bottom: 17px;
		}
	}
</style>