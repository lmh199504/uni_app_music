<template>
	<view class="center">
		<view class="head">
			<view class="headImg">
				<image src="../../static/images/head.jpg" mode=""></image>
			</view>
			<view class="head-bg"></view>
			<view class='playAll' @click="playAll">
				<i class='iconfont myiconbofang'></i>
				<text>播放全部</text>
			</view>
		</view>
		<view class="content">
			<view class="tab">
				<view :class="{'tab-item':true ,'active':active==0}" @click="active=0">
					我的收藏
				</view>
				<view :class="{'tab-item':true ,'active':active==1}"  @click="active=1">
					最近播放
				</view>
			</view>
			<swiper :current="active" @change="changeTab">
				<swiper-item>
					<view class="swiper-item">
						<view v-for="item in love" :key="item.songmid" class="searchItem" @click="searchItemPlay(item)">
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
				</swiper-item>
				<swiper-item>
					<view class="swiper-item">
						
						<view v-for="item in resent" :key="item.songmid" class="searchItem" @click="searchItemPlay(item)">
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
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	import * as player from '../../utils/music/play.js';
	import { getStoreMusic } from '../../utils/music/play.js';
	import { mapState } from 'vuex';
	export default {
		data() {
			return {
				active:0,
				resent:[],
				love:[]
			};
		},
		created(){
			this.resent = getStoreMusic('resent');
			this.love = getStoreMusic('love');
			uni.$on('update',(data)=>{
				console.log(data);
				this.love = getStoreMusic('love');
			})
		},
		computed:{
			...mapState({
				cur_music_msg:'cur_music_msg'
			})
		},
		watch:{
			cur_music_msg(){
				this.resent = getStoreMusic('resent');
			}
		},
		methods:{
			changeTab(event){
				this.active = event.detail.current;
			},
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
				if(this.active = 0){
	
					if(this.love.length != 0){
						this.$store.commit('setMusicList',this.love);
						this.searchItemPlay(this.love[0])
					}else{
						uni.showToast({
							title: '暂无歌曲',
							duration: 2000
						});
					}
					
			
				}else{
					if(this.resent.length != 0){
						this.$store.commit('setMusicList',this.resent);
						this.searchItemPlay(this.resent[0])
					}else{
						uni.showToast({
							title: '暂无歌曲',
							duration: 2000
						});
					}
				}
			}
		}
	}
</script>

<style scoped>
	.center{
		padding: 10px;
		width: 100%;
		box-sizing: border-box;
	}
	.head{
		width:100% ;
		position: relative;
		height: 150px;
	}
	.head-bg{
		width: 100%;
		height: 100%;
		background: url('https://xiaohongll.oss-cn-beijing.aliyuncs.com/head-bg.jpg') no-repeat;
		background-size: cover;
		opacity: 0.5;
		position: absolute;
		z-index: 1;
		top:0;
		left:0;
	}
	.headImg{
		width: 50px;
		height: 50px;
		position: absolute;
		top:50%;
		left:50%;
		z-index: 2;
		transform: translate(-50%,-50%);
		background: #000000;
		border-radius: 50%;
		
	}
	.headImg image{
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}
	.content{
		display: block;
		width: 100%;
		height: calc(100vh - 290px);
	}
	.c-item{
		width: 100%;
		padding: 5rpx 10rpx;
		/* display: flex; */
		border-bottom: 1px solid #B8B8B8;
	}
	.c-item:hover{
		background: #F8F8F8;
	}
	.item-text{
		font-size: 35rpx;
		color:#8F8F94;
		float: left;
		
	}
	.item-icon{

		float: right;
	}
	.clearfix:after {
	   content:""; 
	   display: block; 
	   clear:both; 
	}
	.content swiper{
		width: 100%;
		height: 100%;
	}
	.content swiper swiper-item{
		height: 100%;
		width: 100%;
		overflow-x: hidden;
		overflow-y: auto;
	}
	.tab{
		margin-top: 6px;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		margin-bottom: 6px;
	}
	.tab-item{
		text-align: center;
		width: 100px;
		font-size: 30rpx;
		color:#111;
	}
	.tab-item.active{
		font-size: 30rpx;
		font-weight: bold;
	}
	.tab-item.active::after{
		width: 100%;
		height: 2px;
		background: #4CD964;
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
	
	
	.playAll{
		position: absolute;
		bottom: 10px;
		left: 50%;
		transform: translate(-50%,0);
		display: flex;
		color:#4CD964;
		border-radius: 20px;
		border: 1px solid #4CD964;
		padding: 5px 20px;
		z-index: 5;
	
	}
	.playAll .iconfont{
		line-height: 20px;
		font-size: 15px;
	}
	.playAll text{
		font-size: 15px;
	}
</style>
