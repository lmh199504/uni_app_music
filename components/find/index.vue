<template>
	<view class="toplist">
		<view class="list-item" v-for="top in list" :key="top.id" @click="toDetail(top)">
			<view class='left'>
				<image :src="top.picUrl" mode=""></image>
			</view>
			<view class="right">
				<view v-for=" item in top.songList" :key="item.id" class="song-item">
					{{item.songname}} {{item.singername}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>

export default {
	data() {
		return {
			list:[]
		};
	},
	created(){
		this.$Api.getTopList().then(res=>{
			// console.log(res);
			this.list = res
			
		})
	},
	methods: {
		toDetail(top){
			uni.navigateTo({
				url:"/pages/topDetail/topDetail?id="+top.id,
			})
		}
	},
	components: {

	}
};
</script>

<style scoped>
	*{
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}
	.toplist{
		width: 100%;
		height: 100%;
	}
	.toplist .list-item{
		display: flex;
		flex-direction:row;
		padding: 10px;
		margin: 10px;
		background: #F7F7F7;
		overflow: hidden;
		height: 120px;
		box-sizing: border-box;
	}
	.list-item .left {
		height: 100px;
		width: 100px;
	}
	.list-item .left image{
		width: 100px;
		height: 100px;
	}
	
	.list-item .right{
		width: 70%;
		padding: 10px;
	}
	
	.song-item{
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap; 
		color: #8F8F94;
		font-size: 12px;
		line-height: 25px;
	}
</style>
