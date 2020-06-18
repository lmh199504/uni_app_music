<template>
	
	<view>
		<view :class="{'music-icon':true,'show':showMusic,'active':isPlay}" @click="showPlaying">
			<image src="../../static/images/music.png" mode=""></image>
		</view>
	</view>

	
</template>

<script>
	import {mapState} from 'vuex';
	export default{
		data(){
			return {
				showMusic:false
			}
		},
		computed:{
			...mapState({
				cur_music_msg:'cur_music_msg',
				isPlay:'isPlay'
			}),
		},
		methods:{
			showPlaying(){
				uni.navigateTo({
					 url: '/pages/playing/playing'
				})
			}
		},
		watch:{
			cur_music_msg(newVal){
				if(newVal != null){
					this.showMusic = true
				}else{
					this.showMusic = false
				}
			}
		}
	}
</script>

<style>
	
	
	.music-icon{
		z-index: 5;
		width: 40px;
		height: 40px;
		position: fixed;
		right: 5px;
		top:50%;
		display:none;
	}
	.music-icon.show{
		display: block;
	}
	.music-icon.active{
		
		-webkit-transform: rotate(360deg);
		animation: rotation 30s linear infinite;
		-moz-animation: rotation 30s linear infinite;
		-webkit-animation: rotation 30s linear infinite;
		-o-animation: rotation 30s linear infinite;
	}
	.music-icon image{
		width: 40px;
		height: 40px;
		
	}
	
	@-webkit-keyframes rotation {
		from {
			-webkit-transform: rotate(0deg);
		}
		to {
			-webkit-transform: rotate(360deg);
		}
	}
</style>
