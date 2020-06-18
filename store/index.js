import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		cur_music_msg:null,
		isPlay:false,
		index:0,
		musicList:[]
	},
	getters: {
		getMusicMsg: (state) => {
			return state.cur_music_msg;
		},
		getMusicList:(state) => {
			return state.musicList;
		},
		getIndex:(state) =>{
			return state.index;
		},
		getIsPlay:(state) =>{
			return state.isPlay;
		}
	},
	mutations: {
		setMusicMsg: (state, obj) => {
			state.cur_music_msg = obj;
		},
		setMusicList:(state, obj) =>{
			state.musicList = obj;
		},
		setIndex:(state,num)=>{
			state.index = num;
		},
		setIsPlay:(state,flag)=>{
			state.isPlay = flag;
		}
	},
	actions: {
		setMusic: (context, obj) => {
			context.commit('setMusicMsg', obj);
		},
		setMusicListAction:(context, obj) => {
			context.commit('setMusicList', obj);
		}
	}
})



export default store;