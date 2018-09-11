import Web3 from 'web3'

export default {
	connectWeb3() {
		if (typeof web3 !== 'undefined') {
		// Use Mist/MetaMask's provider
			web3 = new Web3(web3.currentProvider);
			// console.log(web3js)
		} else {
			console.log('No web3? You should consider trying MetaMask!')
			// fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
			web3 = new Web3(new Web3.providers.HttpProvider("https://kovan.infura.io/GiDCavBXupdlU3zX2SVo"));

			// web3.providers.HttpProvider('http://' + BasicAuthUsername + ':' + BasicAuthPassword + '@localhost:8545');
			
		}

		return web3;
	}
}