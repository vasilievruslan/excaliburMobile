import Vue from 'vue'
import VueTabs from 'vue-nav-tabs'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'

import App from './App.vue'

import AmCharts from 'amcharts3'
import AmSerial from 'amcharts3/amcharts/serial'

import settings from './settings.json'
import exchange from './exchange.js'
import provider from './provider.js'

import workflow from './components/workflow.vue'

import VueSocketio from 'vue-socket.io'

Number.prototype.noExponents = function(){
    var data= String(this).split(/[eE]/);
    if(data.length== 1) return data[0]; 

    var  z= '', sign= this<0? '-':'',
    str= data[0].replace('.', ''),
    mag= Number(data[1])+ 1;

    if(mag<0){
        z= sign + '0.';
        while(mag++) z += '0';
        return z + str.replace(/^\-/,'');
    }
    mag -= str.length;  
    while(mag--) z += '0';
    return str + z;
}

Vue.use(VueSocketio, 'https://excalibursocketdev.herokuapp.com/');

Vue.use(VueResource)
Vue.use(VueTabs)
Vue.use(VueRouter)

Vue.config.productionTip = false

import Web3 from 'web3'

// var web3 = new Web3(new Web3.providers.HttpProvider("https://kovan.infura.io/GiDCavBXupdlU3zX2SVo"));

// console.log(web3)



var router = new VueRouter({
  routes: [
  	{path: '/:id', name: 'pair', component: workflow},
  	{path: '', redirect: settings.pairs[0].path}
  ]
})
var app = new Vue({
	render: h => h(App),
	router: router,	
	created() {

	},

}).$mount('#app')

