<template>
	<view class="playing">
		<view class="bg" :style="{ 'background-image': 'url(' + cur_music_msg.img + ')' }"></view>
		<view class="mask"></view>
		<view class="main">
			<view class="head">
				<view>
					<view class="songname">{{ cur_music_msg.songname }}</view>
					<view class="singer">{{ cur_music_msg.singer }}</view>
				</view>
			</view>
			<view class="content">
				<view :class="{ img: true, active: isPlay, show: !imgOrlyrc }" @click="imgOrlyrc = !imgOrlyrc"><image :src="cur_music_msg.img" mode=""></image></view>
				<view :class="{ lyrc: true, show: imgOrlyrc }" @click="imgOrlyrc = !imgOrlyrc">
					<scroll-view scroll-y="true" ref="lyricList" style="height: 100%;" :scroll-top="scrollTop" :scroll-with-animation="true" >
						<view class="lyric-wrapper">
							<view v-if="currentLyric">
								<view
									ref="lyricLine"
									:id="`id-${index}`"
									class="text"
									:class="{ current: currentLineNum === index, lyric_item: true }"
									v-for="(line, index) in currentLyric.lines"
									:key="index"
								>
									{{ line.txt }}
								</view>
							</view>
							<view class="pure-music" v-show="isPureMusic">
								<view>{{ pureMusicLyric }}</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
			<view class="footer">
				<view class="progress-box">
					<view class="curtime">{{ curtime }}</view>
					<view class="percent"><progress :percent="percent" stroke-width="3" /></view>
					<view class="duration">{{ duration }}</view>
				</view>

				<view class="ctrl">
					<view @click="setLove"><i :class="{ iconfont: true, myiconxihuan: true, isLove: isLove }"></i></view>
					<view @click="prevMusic"><i class="iconfont myiconshangyishou"></i></view>
					<view @click="playOrPause"><i :class="{ iconfont: true, myiconzanting: isPlay, myiconbofang: !isPlay }" style="font-size: 30px;"></i></view>
					<view @click="nextMusic"><i class="iconfont myiconxiayishou"></i></view>
					<view><i class="iconfont myiconyinle"></i></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
import Lyric from 'lyric-parser';
import * as player from '../../utils/music/play.js';
const timeExp = /\[(\d{2}):(\d{2}):(\d{2})]/g
export default {
	data() {
		return {
			percent: 10,
			duration: '00:00',
			curtime: '00:00',
			timer: null,
			imgOrlyrc: false,
			isLove: false,
			currentLyric: null,
			pureMusicLyric: '',
			currentLineNum: 0,
			playingLyric: '',
			currentTime: 0,
			scrollTop: 0,
		};
	},
	computed: {
		...mapState({
			cur_music_msg: 'cur_music_msg',
			isPlay: 'isPlay'
		})
	},
	created() {
		var data = player.getAudioMsg();
		this.duration = data.duration;
		this.curtime = data.curtime;
		this.percent = data.percent;
		this.timer = setInterval(() => {
			var data = player.getAudioMsg();
			this.duration = data.duration;
			this.curtime = data.curtime;
			this.percent = data.percent;
			this.currentTime = data.timestamp;
		}, 1000);

		
	},
	mounted(){
		this.initLyric()
	},
	methods: {
		prevMusic() {
			player.playPrev();
			console.log('上一首');
		},
		nextMusic() {
			player.playNext();
			console.log('下一首');
		},
		playOrPause() {
			if(this.isPlay== true && this.currentLyric){
				// console.log('暂停')
				this.currentLyric.stop()
			}else if(this.currentLyric && this.isPlay ==false){
				// console.log('播放')
				this.currentLyric.play(this.currentTime*1000)
			}
			player.playOrPause();
			
			
		},
		initLyric(){
			this.scrollTop == 0;
			this.currentTime = 0;
			this.currentLineNum = 0;
			if (this.currentLyric) {
			  this.currentLyric.stop()
			  // 重置为null
			  this.currentLyric = null
			  this.currentTime = 0
			  this.playingLyric = ''
			  this.currentLineNum = 0
			}
			
			this.$Api.getSongLyric(this.cur_music_msg.songmid).then(res => {
				let lyric = res;
				this.currentLyric = new Lyric(lyric, this.handleLyric);
				
				this.isPureMusic = !this.currentLyric.lines.length;
				if (this.isPureMusic) {
					this.pureMusicLyric = this.currentLyric.lrc.replace(timeExp, '').trim();
					this.playingLyric = this.pureMusicLyric;
				} else {
					
					console.log(this.isPlay)
					if (this.isPlay) {
						console.log("seek to currentTime...")
						this.currentTime = player.getAudioMsg().timestamp;
						// 这个时候有可能用户已经播放了歌曲，要切到对应位置
						this.currentLyric.seek(this.currentTime * 1000);
					}
				}
			});
		},
		setLove() {
			if (this.isLove == false) {
				player.addLove(this.cur_music_msg);
				this.isLove = true;
			} else {
				player.removeLove(this.cur_music_msg);
				this.isLove = false;
			}
			uni.$emit('update', '收藏歌曲更新');
		},
		handleLyric({ lineNum, txt }) {
			var that = this;
			this.currentLineNum = lineNum;
			console.log(this.currentLineNum);
			if (lineNum > 5) {
				let view = uni.createSelectorQuery().selectAll('.lyric_item');

				// #ifdef MP-WEIXIN
				view = wx
					.createSelectorQuery()
					.in(this)
					.selectAll('.lyric_item');
				// #endif

				view.boundingClientRect(data => {
					for (let i = 0; i < that.currentLineNum; i++) {
						console.log(data[i]);
					}
				});
				this.scrollTop = (lineNum - 5) * 32;
				// let lineEl = this.$refs.lyricLine[lineNum - 5]
				// console.log(lineEl)
				// this.$refs.lyricList.scrollToElement(lineEl, 1000)// 滚动到元素
			} else {
				this.scrollTop = 0;
			}
			this.playingLyric = txt;
		}
	},
	watch: {
		cur_music_msg: {
			handler(newVal) {
				
				
				this.initLyric()
				if (player.isExist(newVal, 'love') != -1) {
					this.isLove = true;
				} else {
					this.isLove = false;
				}
			}
			
		}
	}
};
</script>

<style scoped>
* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}
page {
	width: 100%;
	height: 100% !important;
	overflow: hidden;
}
.playing {
	width: 100%;
	height: 100%;
	overflow: hidden;
	position: relative;
}
.bg {
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	filter: blur(30px);
	z-index: -3;
	background-size: 100% 100%;
}
.mask {
	top: 0;
	left: 0;
	z-index: -2;
	background: #000;
	opacity: 0.3;
	width: 100%;
	height: 100%;
	position: absolute;
}

.main {
	padding: 10px;
	position: absolute;
	top: 0;
	right: 0;
	width: 100%;
	box-sizing: border-box;
}
.head {
	/* background: red; */
	height: 60px;
}
.head .songname {
	font-size: 15px;
	color: #f1f1f1;
}
.head .singer {
	margin-top: 5px;
	font-size: 12px;
	color: #c8c7cc;
}
.content {
	/* background: #0077AA; */
	height: calc(100vh - 170px);
	position: relative;
}
.img,
.lyrc {
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	display: none;
	animation-play-state: paused;
}
.img.show,
.lyrc.show {
	display: block;
	transition: all 0.3s ease;
}

.img image {
	width: 100px;
	height: 100px;
	border-radius: 100%;
	overflow: hidden;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	
}
.img{
	animation-play-state: paused;
}
.img.active {
	/* animation-play-state: paused; */
	-webkit-transform: rotate(360deg);
	animation: rotation 30s linear infinite;
	-moz-animation: rotation 30s linear infinite;
	-webkit-animation: rotation 30s linear infinite;
	-o-animation: rotation 30s linear infinite;
}

@-webkit-keyframes rotation {
	from {
		-webkit-transform: rotate(0deg);
	}
	to {
		-webkit-transform: rotate(360deg);
	}
}
.footer {
	/* background: red; */
	height: 100px;
}
.progress-box {
	display: flex;
}
.percent {
	width: calc(100vh - 140px);
	margin-top: 6px;
}
.curtime,
.duration {
	width: 50px;
	margin: 0 5px;
	color: #fff;
	font-size: 12px;
}
.ctrl {
	padding-top: 30px;
	align-items: center;
	display: flex;
	justify-content: center;
	text-align: center;
}
.ctrl view {
	width: 20%;
	text-align: center;
	display: flex;
	justify-content: center;
}

.ctrl .iconfont {
	color: #f1f1f1;
	font-size: 25px;
	text-align: center;
}

.ctrl .isLove {
	color: #d93f30;
}
.lyric-wrapper {
	text-align: center;
	color: rgba(255, 255, 255, 0.5);
	font-size: 14px;
	line-height: 32px;
}
.current {
	color: #fff;
	font-size: 16px;
}
scroll-view {
	transition: all 0.4s ease;
}
</style>
