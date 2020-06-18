<template>
	<view class="content">
		
		
		<view class="main_content">
			<swiper class="home_swiper" :current="active" @change="changeTab">
				<swiper-item>
					<chat></chat>
				</swiper-item>
				<swiper-item>
					<tongxunlu></tongxunlu>
				</swiper-item>
				<swiper-item>
					<find></find>
				</swiper-item>
				<swiper-item>
					<mycenter></mycenter>
				</swiper-item>
			</swiper>
		</view>
		
		<view class="bottom_tabbar">
			<view :class="{'tabbar-item':true,'active':index === active}" v-for="(item,index) in tabArr" :key="item.name" @click="clickTab(index)">
				
				<i :class="['iconfont',item.iconClass]"></i>
				<p>{{item.name}}</p>
				
			</view>
		
		</view>

		<view :class="{'music-icon':true,'show':cur_music_msg!=null,'active':isPlay}" @click="showPlaying">
			<image src="../../static/images/music.png" mode=""></image>
		</view>

	</view>
</template>

<script>
	import chat from '@/components/chat';
	import find from '@/components/find';
	import mycenter from '@/components/mycenter';
	import tongxunlu from '@/components/tongxunlu';
 	import uniBadge from "@/components/uni-badge/uni-badge.vue"
	import musicIcon from '@/components/music-icon/myesic-icon.vue'
	import { mapState } from 'vuex';
	export default {
		data() {
			return {
				active:0,
				tabArr:[
					{
						iconClass:'myiconliaotian',
						name:'首页'
					},{
						iconClass:'myicontongxunlu',
						name:'通讯录'
					},{
						iconClass:'myiconfaxian',
						name:'发现'
					},{
						iconClass:'myiconwo',
						name:'我'
					}
				],
				showMusic:false
			}
		},
		onLoad() {
			if(this.$store.state.cur_music_msg != null){
				this.showMusic = true
			}
		},
		computed:{
			...mapState({
				cur_music_msg:'cur_music_msg',
				isPlay:'isPlay'
			}),
		},
		methods: {
			toLogin() {
				console.log("登陆");
				uni.navigateTo({

					url: '/pages/login/login'
				})
			}
		},
		components: {
			uniBadge,
			chat,
			find,
			tongxunlu,
			mycenter,
			musicIcon
		},
		onPullDownRefresh() {
			setTimeout(()=>{
				console.log("下拉刷新完成")
				uni.stopPullDownRefresh();//得到数据后停止下拉刷新
			},1500)
		},
		onReachBottom(){
			console.log("到底了")
			setTimeout(()=>{
				for(let i = 0;i<10;i++){
					this.badgeArr.push(this.badgeArr.length+1)
				}
			},1000)
			
		},
		methods:{
			changeTab(event){
				this.active = event.detail.current 
				let title = ''
				if(this.active == 0){
					title = '首页'
				}else if(this.active == 1){
					title = '通讯录'
				}else if(this.active == 2){
					title = '发现'
				}else if(this.active == 3){
					title = '个人中心'
				}
				
				uni.setNavigationBarTitle({
				    title
				});
			},
			clickTab(index){
				this.active = index;
				let title = ''
				if(this.active == 0){
					title = '首页'
				}else if(this.active == 1){
					title = '通讯录'
				}else if(this.active == 2){
					title = '发现'
				}else if(this.active == 3){
					title = '个人中心'
				}
				
				uni.setNavigationBarTitle({
				    title
				});
			},
			showPlaying(){
				uni.navigateTo({
					 url: '/pages/playing/playing'
				})
			}
		},
		components:{
			chat,
			tongxunlu,
			mycenter,
			find
		},
		watch:{
			
		}
	}
</script>

<style>
	page{
		height: 100%;
	}
	.content {
		display: flex;
		justify-content: center;
		height: 100%;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
	
	.badgeIcon{
		line-height: 30rpx;
		height:30rpx;
	}
	
	.bottom_tabbar{
		display: flex;
		width: 100%;
		height: 60px;
		position: fixed;
		bottom:0px;
		left: 0;
	}
	
	.tabbar-item{
		width: 25%;
		text-align: center;
		background: rgb(246, 246, 246);
		border-top:1px solid rgb(229, 229, 229);
		padding-top: 10rpx;
	}
	.tabbar-item.active{
		color:#4CD964;
	}
	.tabbar-item .iconfont{
		font-size: 40rpx;
	}
	.tabbar-item p{
		font-size: 30rpx;
	}
	.main_content{
		height: calc(100% - 65px);
		overflow: hidden;
		width: 100%;
	}
	.swiper{
		height: 100%;
		width: 100%;
	}
	.home_swiper{
		width: 100%;
		height: 100%;
	}
	.home_swiper swiper-item{
		width: 100%;
		height: 100%;
		overflow-x: hidden!important;
		overflow-y: scroll!important;
	}
	
	/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
	::-webkit-scrollbar
	{
	    width: 0px;  /*滚动条宽度*/
	    height: 0px  /*滚动条高度*/
	}
	
	/*定义滚动条轨道 内阴影+圆角*/
	::-webkit-scrollbar-track
	{
	    /*滚动条的背景区域的内阴影*/
	    box-shadow:0px 1px 3px rgba(0,0,0,0.3) inset;
	
	    /*滚动条的背景区域的圆角*/
	    border-radius: 5px;
	
	    /*滚动条的背景颜色*/
	    background-color: #f7f7f7;
	}
	
	/*定义滑块 内阴影+圆角*/
	::-webkit-scrollbar-thumb
	{
	    /*滚动条的内阴影*/
	    box-shadow:0px 1px 3px rgba(0,0,0,0.3) inset;
	
	    /*滚动条的圆角*/
	    border-radius: 5px;
	
	    /*滚动条的背景颜色*/
	    background-color: #555;
	}
	
	
	
	
	
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
