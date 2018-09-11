<template>
	<div class="chart">
		<div class="chart__container">
			<div ref="chart" id="chartdiv"></div>
		</div>
	</div>
</template>

<script>
	// import AmCharts from 'amcharts3'
	// import AmSerial from 'amcharts3/amcharts/serial'

	import settings from '../settings.json'

	export default{
		name: 'chart',
		data(){
			return{
				chart: null,
				chartData: [],
			}

		},
		computed: {
			tokenGetAddress() {
				return this.pair.tokens[0]
			},
			tokenGiveAddress() {
				return this.pair.tokens[1]
			}
		},
		props: {
			pair: Object,
		},
		watch: {
			pair() {
				this.getChartData();
				// console.log('new chart!')
			}
		},
		methods: {
			getChartData(){
				var vm = this
				vm.$http.get(`${settings.apiURL}/v1/priceChart?tget=${vm.tokenGetAddress}&tgive=${vm.tokenGiveAddress}&page=0`).then(res => {
					var data = res.data._items
					data.forEach(function(element){
						element.volume = element.volume / 10**18;
						// element.value = 1
						var newDate = new Date(element.date)
						element.date = newDate;
					})
					vm.chartData = data;
					// console.log(vm.chartData);

					vm.chart = AmCharts.makeChart("chartdiv", {
						"hideCredits": true,
						"type": "stock",
						"theme": "black",
						"useUTC": true,
						"startDate": vm.chartData[0].date,
						"glueToTheEnd": true,
						"panelsSettings": {
							"fontFamily": "'Roboto Mono', monospace",
							"fontWeight": 700
						},
						"dataSets": [
							{
								"fieldMappings": [{
									"fromField": "open",
									"toField": "open"
								}, {
									"fromField": "close",
									"toField": "close"
								}, {
									"fromField": "max",
									"toField": "high"
								}, {
									"fromField": "min",
									"toField": "low"
								}, {
									"fromField": "volume",
									"toField": "volume"
								}, {
									"fromField": "value",
									"toField": "value"
								}],
								"color": "#fff",
								"dataProvider": vm.chartData,
								"title": vm.pair.name.toUpperCase(),
								"categoryField": "date"
							}, {
								"fieldMappings": [{
									"fromField": "value",
									"toField": "value"
								}]
							}
						],
						"stockLegend": {
							"valueTextRegular": undefined,
							"periodValueTextComparing": "[[percents.value.close]]%"
						},
						"panels": [{
							// 	"title": "Value",
							// 	"showCategoryAxis": false,
							// 	"percentHeight": 70,
							"valueAxes": [{
								"labelsEnabled": false,
								"id": "v1",
								"dashLength": 5
							}],
							"showCategoryAxis": false,
							"categoryAxis": {
								"parseDates": true,
								"dashLength": 5,
								"minPeriod": "mm",
								"parseDates": true
							},

							"stockGraphs": [
								{
									"type": "candlestick",
									"id": "g1",
									"openField": "open",
									"closeField": "close",
									"highField": "high",
									"lowField": "low",
									"valueField": "close",
									"lineColor": "#0be881",
									"fillColors": "#0be881",
									"negativeLineColor": "#ff5e57",
									"negativeFillColors": "#ff5e57",
									"fillAlphas": 1,
									"useDataSetColors": false,
									"comparable": true,
									"compareField": "value",
									"showBalloon": true,
									"balloonText": "Open:<b>[[open]]</b><br>Low:<b>[[low]]</b><br>High:<b>[[high]]</b><br>Close:<b>[[close]]</b><br>",
									"proCandlesticks": true
								}
							],
							"stockLegend": {
								// "useGraphSettings": true,
								"markerType": "none",
								"fontSize": 14,
								"fontFamily": "Roboto Mono",
								"marginLeft": 0,
								"marginBottom": 10,
								"autoMargins": false

								}
							}, 
							{
								"title": "Volume",
								"percentHeight": 30,
								"marginTop": 1,
								"showCategoryAxis": true,
								"valueAxes": [{
									"labelsEnabled": false,
									"dashLength": 5
								}],

								"categoryAxis": {
									"dashLength": 5
								},

								"stockGraphs": [{
									"valueField": "volume",
									"type": "column",
									"showBalloon": true,
									"fillAlphas": 1
								}],

								"stockLegend": {
									"markerType": "none",
									"markerSize": 0,
									"labelText": "",
									"periodValueTextRegular": "[[value.close]]"
								}
							}
						],

						"categoryAxesSettings": {
							"minPeriod": "mm"
						},

						"chartCursorSettings": {
							"valueLineBalloonEnabled": true,
							"valueLineEnabled": true
						},
						"chartScrollbarSettings": {
							"graph": "g1",
							"graphType": "line",
   							"usePeriod": "mm"
							// "position": "top"
						},
						"periodSelector": {
							"periodsText": "",
							"inputFieldsEnabled": false,
							"dateFormat": "HH:NN DD-MM-YYYY",
							"position": "top",
							"periods": [{
								"period": "hh",
								"count": 1,
								"label": "1H"
							}, {
								"period": "DD",
								"count": 1,
								"label": "1D"
							}, {
								"period": "DD",
								"label": "1W",
								"count": 7,
								"selected": true
							}]
						}
					});
				})
			},
			updateData(){
				var vm = this
				vm.$http.get(`${settings.apiURL}/v1/priceChart?tget=${vm.tokenGetAddress}&tgive=${vm.tokenGiveAddress}&page=0`).then(res => {
					var data = res.data._items
					data.forEach(function(element){
						element.volume = element.volume / 10**18;
						var newDate = new Date(element.date)
						element.date = newDate;
					})
					vm.chartData = data;

					if (String(vm.chart.dataSets[0].dataProvider[vm.chart.dataSets[0].dataProvider.length - 1].date) !== String(vm.chartData[vm.chartData.length - 1].date)) {
						vm.chart.dataSets[0].dataProvider = vm.chartData
						vm.chart.validateData()

					}
					// console.locationg(vm.chartData)

					// vm.chart.dataSets[0].dataProvider = vm.chartData;
					// vm.chart.validateData()

				})

				return vm.chartData
			}

		},
		created(){	
			let vm = this;
			vm.getChartData();
			setInterval(vm.updateData, 60000)

		}
	}
</script>
<style lang="scss">
	@import '../_base.scss';
	.amChartsPeriodSelector.amcharts-period-selector-div{
		position: absolute;
		top: 0;
		right: 0;
		z-index: 3;
	}
	.amChartsButton.amcharts-period-input,
	.amChartsButtonSelected.amcharts-period-input-selected{
		font-size: 14px;
		color: #FFFFFF !important;
		cursor: pointer;
		border: none !important;
		background: none !important;
		font-weight: 700;
		opacity: 1 !important;
	}
	.amChartsButtonSelected.amcharts-period-input-selected{
		color: #0be881 !important;
	}
	.chart{
		flex: 1 100%;
		display: flex;
		flex-direction: column;
		a{
			display: none !important;
		}
	}
	.window__title{
		padding: 0px 14px;
		flex: 1 33px;
	}
	.chart__container{
		background-color: $black-four;
		padding: 5px;
		box-sizing: border-box;
		flex: 0 100%;
		display: flex;
		flex-direction: column;
	}
	#chartdiv {
		width: 100%;
		height: 200px;
		box-sizing: border-box;
		flex: 1 100%;
	}
</style>