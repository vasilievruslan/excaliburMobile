<template>
	<div class="window chat">
		<div class="chat__title">Chat <span id="arr" @click="slideUp"><img src="../assets/arr.svg" alt="arr"></span></div>
		<div class="chat__wrap">
			<div id="content">
				<p class="message" v-for="item in content"><span v-bind:style="{color: item.color}">{{item.author}}</span>{{item.message}}</p>
			</div>
			<div v-if="signBool" class="input btns">
				<div>
					<button @click.prevent="preSignUp" class="btn sign-up">Signup</button>
					<button @click.prevent="signIn" class="btn sign-up">Signin</button>
				</div>
				<div>
					<span>powered by</span>
					<img src="../assets/metamsk.svg" alt="">
				</div>
			</div>
			<div v-else class="input">
				<input :placeholder="status" ref="chatInput" @keyup.enter="sendMessage" v-model="message" type="text" id="input"/>
				<button @click.prevent="sendMessage" class="send-btn"><img src="../assets/send-btn.svg" alt=""></button>
			</div>
		</div>
	</div>
</template>

<script>
	import settings from '../settings.json'
	import exchange from '../exchange.js'
	export default {
		data(){
			return {
				signBool: true,
				status: 'chooseUsername_',
				disabled: true,
				myColor: false,
				myName: false,
				content: [],
				message: '',
				autofocus: false,
				fullSize: false,
				sign: '',
			}
		},
		computed:{
			chatInput() { 
				return this.$refs.chatInput
			},
		},
		props: {
			from: String,
			web3: Object,
		},
		watch:{
			disabled(){
				this.scrollToBottom();
			},
			content(){
				setTimeout(this.scrollToBottom, 100)
				this.scrollToBottom();
			},
			status(){
				this.scrollToBottom();
			}
		},
		sockets: {
			connectToChat(connectToChat){
				console.log('connectToChat:', connectToChat);
				this.status = "message_";
				this.myName = connectToChat.username;
				this.myColor = connectToChat.color;
				this.signBool = false;
			},
			pushMessage(pushMessage){
				console.log('pushMessage:', pushMessage);
				this.addMessage(pushMessage.username, pushMessage.msg, pushMessage.color, new Date(pushMessage.time))
			},
			chatHistory(chatHistory){
				console.log('chatHistory:', chatHistory);
				const vm = this;
				chatHistory._items.forEach(element => {
					vm.addMessage(element.username, element.msg, element.color, new Date(element.time))
				})
				if (localStorage.getItem('chatData') !== null) {
					vm.$socket.emit('signUpChat', JSON.parse(localStorage.getItem('chatData')));
				}
			},
		},
		methods: {
			addMessage(author_, message_, color_, dt_) {
				const vm = this;
		        this.content.push({
		        	color: color_, 
		        	author: author_, 
		        	message: (dt_.getUTCHours() < 10 ? '0' + dt_.getUTCHours() : dt_.getUTCHours()) + ':'
		             + (dt_.getUTCMinutes() < 10 ? '0' + dt_.getUTCMinutes() : dt_.getUTCMinutes())
		             + ' ' + message_
		        });
		    },
		    sendMessage(){
		    	const vm = this;
		    	var msg = vm.message;
	            if (!msg) {
	                return;
	            }

	            // vm.connection.send(msg);
	            
	            vm.message = '';
	            // disable the input field to make the user wait until server
	            // sends back response
	            vm.disabled = true;

	            // we know that the first message sent from a user their name
	            if (vm.myName === false) {
	                vm.signUp(msg);
	            }else{
	            	if (msg == '/logout') {
	            		// vm.$socket.emit(msg.split('/')[1], msg)
	            		localStorage.removeItem('chatData');
	            		this.status = "chooseUsername_";
						this.myName = false;
						this.myColor = false;
						this.signBool = true;

	            	}else{
	            		vm.$socket.emit('pushMessage', msg)
	            	}
	            }
		    },
		    scrollToBottom(){
				var container = this.$el.querySelector("#content");
				container.scrollTop = container.scrollHeight;
		    },
		    slideUp(){
		    	const vm = this;
		    	var aside = document.querySelector('.aside-right');
	    		aside.classList.toggle('active');
		    },
		    signIn: async function(){
		    	const vm = this;
		    	await exchange.sign(vm.web3, vm.from, '0x1234').then(res => vm.sign = res)
		    	let chatSignInData = {
		    		wallet: vm.from,
					msg: '0x1234',
					sig: vm.sign,
		    	};
		    	await localStorage.setItem('chatData', JSON.stringify(chatSignInData));
		    	await this.$socket.emit('signInChat', chatSignInData);
			},
			preSignUp(){
				const vm = this;
				if (vm.from !== null && vm.from !== undefined) {
					vm.signBool = false;
				}
			},
			signUp: async function(username_){
				const vm = this;
				await exchange.sign(vm.web3, vm.from, '0x1234').then(res => vm.sign = res)
				let chatSignUpData = {
					wallet: vm.from,
					username: username_,
					msg: '0x1234',
					sig: vm.sign,
				}
				await localStorage.setItem('chatData', JSON.stringify(chatSignUpData));
				await vm.$socket.emit('signUpChat', chatSignUpData);
			}

		},
		created() {
			const vm = this;
		}

	}
</script>

<style lang="scss">
	.input.btns{
		display: flex;
		align-items: center;
		justify-content: space-between;
		div{
			display: flex;
			align-items: center;
			&:last-child{
				flex: 1;
				justify-content: center;
			}
		}
		span{
			margin-right: 4px;
			margin-left: 9px;
			font-size: 10px;
		}
		img{
			width: 16px;
		}
	}
	.input .btn{
		text-transform: uppercase;
		margin-right: 5px;
		font-size: 12px;
		color: #fff;
		padding: 12px;
		background-color: #F89D35;
		box-sizing: border-box;
		cursor: pointer;
	}
	.chat{
		width: 378px;
		flex: 4 0;
		display: flex;
		flex-direction: column;
	}
	.chat__title{
		padding: 0px 12px;
		margin-bottom: 11px;
		text-transform: uppercase;
		font-size: 17px;
		flex: 0 0;
		position: relative;
	}
	#arr{
		padding: 5px;
		transition: 0.3s ease-in-out;
		position: absolute;
		right: 20px;
		top: calc(50% - 10px);
		transform: rotate(180deg);
		cursor: pointer;
		line-height: 0;
	}
	.active #arr{
		transform: rotate(0deg);
	}
	.chat__wrap{
		width: 100%;
		height: 100%;
		overflow: scroll;
		background-color: #2c2c2c;
		font-weight: 400;
		flex: 1 0;
		display: flex;
		flex-direction: column;
		&::-webkit-scrollbar { 
			display: none;
		}
	}
	.message{
		word-wrap: break-word;
	}
	#content{
		flex: 1;
		box-sizing: border-box;
		padding: 10px;
		overflow-y: scroll;
	}
	.input{
		padding-top: 3px;
		background: #242323;
		position: relative;
	}
	#input{
		display: block;
		box-sizing: border-box;
		width: 100%;
		color: #fff;
		padding: 10px;
		border: none;
		background: #2c2c2c url(../assets/arr-right.svg) 10px center no-repeat;
		outline: #ef5777;
		padding-right: 51px;
		padding-left: 26px;
	}
	.send-btn{
		display: block;
		background-color: transparent;
		border: none;
		position: absolute;
		right: 10px;
		top: calc(50% + 3px);
		transform: translateY(-50%);
		z-index: 2;
		cursor: pointer;
		outline: none;
	}
</style>