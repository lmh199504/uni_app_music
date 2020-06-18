<template>
	<view class="chat">
		<view class="top">
			<input type="text" placeholder="搜索歌曲或者歌手" @input="searchSong" v-model="query">
			<view class="searchList">
				<view v-for="item in searchList" :key="item.songmid" class="searchItem" @click="searchItemPlay(item)">
					<view>
						<img :src="item.img" alt="">
					</view>
					<view class="songmsg">
						<view class="songname">{{item.songname}}</view>
						<view class="singer">{{item.singer}}</view>
					</view>
				</view>
			</view>
		</view>
		<swiper :current="active" @change="changeTab" autoplay indicator-dots>
			<swiper-item>
				<image src="../../static/images/cursuval.jpg" mode="scaleToFill	"></image>
			</swiper-item>
			<swiper-item>
				<image src="../../static/images/cursuval.jpg" mode="scaleToFill	"></image>
			</swiper-item>
			<swiper-item>
				<image src="../../static/images/cursuval.jpg" mode="scaleToFill	"></image>
			</swiper-item>
			<swiper-item>
				<image src="../../static/images/cursuval.jpg" mode="scaleToFill	"></image>
			</swiper-item>
		</swiper>
		<view style="margin-top: 10px;">
			<view v-for='item in discList' :key='item.dissid' class="disc-item" @click="toDisc(item)">
				<view>
					<image :src="item.imgurl" mode=""></image>
				</view>
				<view style='margin-left: 10px;'>
					<view class='disc-creator'>{{item.creator.name}}</view>
					<view class="disc-name">{{item.dissname}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import * as player from '../../utils/music/play.js'
	export default {
		data() {
			return {
				active:0,
				query:'',
				queryTimer:null,
				searchList:[],
				discList:[]
			};
		},
		created(){
			//获取全局属性
			const data = getApp().globalData;
			uni.showLoading({
			    title: '加载中'
			});
			this.$Api.getDiscList().then(res=>{
				console.log(res)
				this.discList = res;
				uni.hideLoading();
			})
		},
		methods:{
			changeTab(event){
				this.active = event.detail.current 
			},
			searchSong(){
				clearTimeout(this.queryTimer);

				this.queryTimer = setTimeout(()=>{
					console.log(this.query)
					this.$Api.querySong(this.query).then(res=>{
						this.searchList = res;
					})
				},500)
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
						icon:"success"
					})
					
					this.searchList = []
				}
				
			},
			toDisc(item){
				console.log('跳转')
				uni.navigateTo({
				    url: '/pages/discDetail/discDetail?dissid='+item.dissid,
					success:function(res){
						console.log(res)
					},
					fail:function(err){
						console.log(err)
					}
				});
				// this.$Api.getSongList(item.dissid).then()
			}
			
		}
	}
</script>

<style scoped>
	.chat{
		padding: 10px;
		
	}
	.top{
		position: relative;
	}
	.chat swiper image{
		border-radius: 5px;
		width: 100%;
		height: 100%;
	}
	.top input{
		width: 100%;
		height: 35px;
		margin-bottom: 5px;
		border: 1px solid #b8b8b8;
		border-radius: 5px;
		padding-left: 5px;
		box-sizing: border-box;
	}
	.searchList{
		width: 100%;
		height: auto;
		position: absolute;
		top:40px;
		z-index: 1;
		background: #fff;
		box-shadow:0px 4px 12px rgba(235,235,235,1);
		
	}
	.searchItem{
		display: flex;
		padding: 5px;
		border-radius: 5px;
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
	.disc-item{
		display: flex;
	}
	.disc-item image{
		width: 60px;
		height: 60px;
	}
	.disc-creator{
		font-size: 15px;
		margin-top: 5px;
		color:#000000;
	}
	.disc-name{
		font-size: 10px;
		color: #8F8F94;
		margin-top:10px;
	}
</style>
