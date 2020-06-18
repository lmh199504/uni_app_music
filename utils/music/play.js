import * as Api from '../../config/api.js'

import store from '../../store/index.js'


const audio = uni.getBackgroundAudioManager();
export const playMusic = async (music) => {

	const data = await Api.getPlaySrc(music)
	if(data.src != ''){
		audio.src = data.src;
		audio.coverImgUrl = data.img;
		audio.title = data.songname;
		audio.singer = data.singer;
		audio.play();
		//设置vuex 中的歌曲信息
		store.commit('setMusicMsg',data)
		store.commit('setIsPlay',true)
		const result = isExist(music,'resent');
		console.log(result)
		if(result == -1){ //播放历史中不存在该歌曲
			//获取播放历史
			var list = getStoreMusic('resent');
			list.push(data);
			setStoreMusic('resent',list);
		}else{ //播放历史中存在该歌曲
			var list = getStoreMusic('resent');
			list.splice(result,1);   //删除该歌曲
			list.push(data);
			//存入缓存
			setStoreMusic('resent',list);
		}
		return "success"
	}else{
		playNext()
		return "err"
	}
}
//播放一首歌曲就加入本地播放记录
//判断本地是否存在存在 存在则加入并去掉之前同一各歌曲的记录
//不存在则直接加入

function getMusicList(){
	return store.state.musicList;
}
function getIndex(){
	return store.state.index;
}
function getIsPlay(){
	return store.state.isPlay
}

export const playPrev = () => {
	let list = getMusicList();
	let index = getIndex();
	console.log(list)
	if(list.length != 0){
		if(index == 0){
			index = list.length - 1
		}else{
			index --
		}
		
		
		playMusic(list[index])
		store.commit('setIndex',index);
		
	}
	
	
}

export const playNext = () => {
	let list = getMusicList();
	let index = getIndex();
	if(list.length != 0){
		index ++
		if(index == list.length){
			index = 0
		}
		store.commit('setIndex',index);
		playMusic(list[index])
	}
}

export const playOrPause = ()=> {
	let isPlay = getIsPlay();
	
	if(isPlay == true){
		audio.pause();
		store.commit('setIsPlay',false);
	}else{
		store.commit('setIsPlay',true);
		audio.play()
	}
}

audio.onPlay(()=>{
	store.commit('setIsPlay',true)
	console.log('<'+audio.title + '>正在播放...' );
})

audio.onEnded(()=>{
	let index = getIndex();
	let list = getMusicList();
	index ++ ;
	if(index == list.length){
		index = 0
	}
	store.commit('setIndex',index);
	playMusic(list[index])
	console.log('播放完成..')
})

audio.onError(()=>{
	console.log("播放错误");
	playNext();
})

audio.onPrev(()=>{
	console.log("上一曲")
})

audio.onNext(()=>{
	console.log("上一曲")
})

audio.onWaiting(()=>{
	console.log("加载中...")
})



export const getStoreMusic = (key)=>{
	let value = uni.getStorageSync(key);
	
	if(value){
		value = JSON.parse(value)
	}else{
		value = [];
	}
	return value
}

export const setStoreMusic = (key,list)=>{
	uni.setStorageSync(key,JSON.stringify(list));
}

export const isExist = (music,key) => {
	const list = getStoreMusic(key);
	const index = list.findIndex((value,index,arr)=>{
		return value.songmid == music.songmid
	})
	return index;
}


export const getAudioMsg = () => {
	let curtime = audio.currentTime;
	let duration = audio.duration;
	let percent = parseInt((curtime/duration) *100);
	curtime = formateTime(curtime);
	duration = formateTime(duration);
	return {
		curtime,
		duration,
		percent,
		timestamp:audio.currentTime
	}
}


function formateTime(time){
	let s = parseInt(time%60);
	let m = parseInt(time/60);
	
	
	return (m > 9 ?  m :'0'+ m) +':' + (s > 9 ? s:'0'+s)
}

//添加喜欢
export const addLove = (music) =>{
	const list = getStoreMusic('love');
	const result = isExist(music,'love');
	console.log(result)
	if(result == -1){
		list.push(music);
		setStoreMusic('love',list);
		uni.showToast({
			title:"添加成功",
			icon:"none"
		})
		
	}
}

//删除喜欢
export const removeLove = (music) =>{
	const list = getStoreMusic('love');
	const result = isExist(music,'love');
	if(result != -1){
		list.splice(result,1);
		setStoreMusic('love',list);
		uni.showToast({
			title:"取消成功",
			icon:"none"
		})
	}
}


