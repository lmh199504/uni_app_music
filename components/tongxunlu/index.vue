<template>
	<view class="txl">
		<phone-directory :phones="singers" @paramClick="paramClick"></phone-directory>
		</view>
</template>

<script>
const HOT_SINGER_LEN = 10;
const HOT_NAME = '热门';
const TITLE_HEIGHT = 30;
const ANCHOR_HEIGHT = 18;

import Singer from '../../common/js/singer.js';
import phoneDirectory from '@/components/phone-directory/phone-directory.vue';
export default {
	data() {
		return {
			singers: {}
		};
	},

	methods: {
		_getSingerList() {
			this.$Api.getSinger().then(res => {
				if (res.code === 0) {
					this.singers = this.formateData(res.data.list)
				}
			});
		},
		_normalizeSinger(list) {
			let map = {
				hot: {
					title: HOT_NAME,
					items: []
				}
			};
			list.forEach((item, index) => {
				if (index < HOT_SINGER_LEN) {
					map.hot.items.push(
						new Singer({
							name: item.Fsinger_name,
							id: item.Fsinger_mid
						})
					);
				}
				const key = item.Findex;
				if (!map[key]) {
					map[key] = {
						title: key,
						items: []
					};
				}
				map[key].items.push(
					new Singer({
						name: item.Fsinger_name,
						id: item.Fsinger_mid
					})
				);
			});
			// 为了得到有序列表，我们需要处理 map
			let ret = [];
			let hot = [];
			for (let key in map) {
				let val = map[key];
				if (val.title.match(/[a-zA-Z]/)) {
					ret.push(val);
				} else if (val.title === HOT_NAME) {
					hot.push(val);
				}
			}
			ret.sort((a, b) => {
				return a.title.charCodeAt(0) - b.title.charCodeAt(0);
			});
			return hot.concat(ret);
		},
		paramClick(data) {
			// console.log(data);
			uni.navigateTo({
				url:'/pages/singerDetail/singerDetail?id='+data.id
			})
		},
		formateData(data) {
			var obj = {};
			
			for (var i = 0; i < data.length; i++) {
				var Findex = data[i].Findex;

				if(Findex != 9){
					if (obj.hasOwnProperty(Findex)) {
						obj[Findex].push({
							avatar: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${data[i].Fsinger_mid}.jpg?max_age=2592000`,
							id: data[i].Fsinger_mid,
							name: data[i].Fsinger_name
						})
					} else {
						obj[Findex] = [{
							avatar: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${data[i].Fsinger_mid}.jpg?max_age=2592000`,
							id: data[i].Fsinger_mid,
							name: data[i].Fsinger_name
						}]
					}
				}
			}
			
		
			var newData = {};
			Object.keys(obj).sort().map(key => {
			  newData[key]=obj[key]
			})
			return newData
		}
	},
	created() {
		this._getSingerList();
	},
	components: {
		phoneDirectory
	}
};
</script>

<style scoped>
.txl {
	width: 100%;
	height: 100%;
}
</style>
