<template>
	<view class="disc-detail">
		<musicIcon></musicIcon>
		<view class="head">
			<image src="../../static/images/head-bg.jpg" mode=""></image>
			<view class='playAll' @click="playAll">
				<i class='iconfont myiconbofang'></i>
				<text>播放全部</text>
			</view>
		</view>
		<view class='song'>
			<view v-for="item in list" :key="item.songmid" class="searchItem" @click="searchItemPlay(item)">
				<view>
					<img :src="item.img" alt="">
				</view>
				<view class="songmsg">
					<view class="songname">{{item.songname}}</view>
					<view class="singer">{{item.singer}}</view>
				</view>
				<view style="position: absolute;right: 0;top:15px">
					<i class="iconfont myiconbofang"></i>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import musicIcon from '@/components/music-icon/myesic-icon.vue'
	import * as player from '../../utils/music/play.js'
	export default {
		data() {
			return {
				list:[]
			}
		},
		methods: {
			async searchItemPlay(item){
				const result = await player.playMusic(item);
				if(result != "success"){
					uni.showToast({
						title:"收费歌曲",
						icon:"none"
					})
				}else{
					uni.showToast({
						title:"播放成功",
						icon:"none"
					})
				}
				
			},
			playAll(){
				if(this.list.length != 0){
					this.$store.commit('setMusicList',this.list);
					this.searchItemPlay(this.list[0])
				}else{
					uni.showToast({
					    title: '暂无歌曲',
					    duration: 2000
					});
				}

			}
		
		},
		onLoad:function(option){

			this.$Api.getSongList(option.dissid).then(res=>{
				console.log(res)
				this.list = res;
			})
		},
		components:{
			musicIcon
		}
	}
</script>

<style scoped>
	page{
		height: 100%!important;
		overflow: hidden;
	}
	.disc-detail{
		width: 100%;
		height: 100%;
		padding: 10px;
		box-sizing: border-box;
		overflow: hidden;
	}
	.head{
		width: 100%;
		height: 150px;
		background-image: url('https://xiaohongll.oss-cn-beijing.aliyuncs.com/head-bg.jpg') no-repeat;
		background-size: cover;
		position: relative;
	}
	.head image{
		width: 100%;
		height: 100%;
	}
	.head .playAll{
		position: absolute;
		bottom: 30px;
		left: 50%;
		transform: translate(-50%,0);
		display: flex;
		color:#4CD964;
		border-radius: 20px;
		border: 1px solid #4CD964;
		padding: 5px 20px;

	}
	.playAll .iconfont{
		line-height: 20px;
		font-size: 15px;
	}
	.playAll text{
		font-size: 15px;
	}
	.song{
		height: calc(100vh - 160px);
		overflow-y: scroll;
		overflow-x: hidden;
	}
	
	
	
	
	
	.searchItem{
		display: flex;
		padding: 5px;
		border-radius: 5px;
		position: relative;
	}
	.searchItem img{
		width: 30px;
		height: 30px;
		border-radius: 50%;
		margin-left: 5px;
	}
	.searchItem:hover{
		background: #EDEDED	;
	}
	.searchItem .songmsg{
		margin-left: 20px;
	}
	.searchItem .songname{
		font-size: 12px;
		color:#000000;
		opacity: 0.8;
	}
	
	.searchItem .singer{
		font-size: 8px;
		color:#000000;
		opacity: 0.6;
	}
	
	
	
	
	
	
</style>
