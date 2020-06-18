import {apiBaseUrl} from './config.js' 

import { Base64 } from 'js-base64'

// import rp from 'request-promise'
const rp = require('request-promise')

export const querySong = (query) =>{
	return new Promise((resolve,reject)=>{
		uni.request({
			url: apiBaseUrl + "/soso/fcgi-bin/client_search_cp",
			data:{
				aggr:1,
				cr:1,
				flag_qc:0,
				p:1,
				n:10,
				w:query
			},
			method:'get',
			success:function(res){
				// resolve(res)
				let data = res.data
				data = data.slice(9,data.length - 1);
				const list = JSON.parse(data).data.song.list;
				const listArr = [];
		
				for(let i = 0;i<list.length;i++){
					listArr.push({
						img: "http://imgcache.qq.com/music/photo/album_300/17/300_albumpic_" + list[i].albumid + "_0.jpg",
						singer:list[i].singer[0].name,
						songid:list[i].songid,
						songmid:list[i].songmid,
						songname:list[i].songname
					})
				}
				resolve(listArr);
			},
			fail(err) {
				reject(err)
			}
		})
	})
}


export const getPlaySrc = music =>{
	return new Promise((resolve,reject)=>{
		uni.request({
			url:apiBaseUrl +  '/base/fcgi-bin/fcg_music_express_mobile3.fcg',
			data:{
				format:'json205361747',
				platform:'yqq',
				cid:'205361747',
				songmid:music.songmid,
				filename:'C400' + music.songmid+'.m4a',
				guid:'126548448'
			},
			method:'get',
			success:function(res){
				
				// console.log(res)
				if(res.data.data.items[0].vkey != ''){
					music.src = 'http://ws.stream.qqmusic.qq.com/' + res.data.data.items[0].filename + '?fromtag=0&guid=126548448&vkey=' + res.data.data.items[0].vkey;
				}else{
					music.src = ''
				}
				
				
				resolve(music)
			},
			fail(err){
				reject(err)
				// console.log()
			}
		})
	})
}

export const getDiscList = ()=>{
	return new Promise((resolve,reject)=>{
		// uni.request({
		// 	method:'get',
		// 	// url:'http://ustbhuangyi.com/music/api/getDiscList',
		// 	url: 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg',
		// 	headers: {
		// 	  referer: 'https://c.y.qq.com/',
		// 	  host: 'c.y.qq.com'
		// 	},
		// 	data:{
			
		// 		format:'json',
		// 		platform:'yqq',
		// 		sin:0,
		// 		ein:19,
		// 		sortId:5,
		// 		categoryId:10000000,
		// 		picmid: 1,
		// 	},
		// 	success:function(res){
		// 		console.log(res)
		// 		resolve(res.data.data.list)
		// 	},
		// 	fail:function(err){
		// 		reject(err)
		// 	}
		// })
		
		rp({
			method: 'GET',
			url: 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg',
			qs: {
				g_tk: 1928093487,
				inCharset: 'utf-8',
				outCharset: 'utf-8',
				notice: 0,
				format: 'json',
				platform: 'yqq',
				hostUin: 0,
				sin: 0,
				ein: 29,
				sortId: 5,
				needNewCode: 0,
				categoryId: 10000000,
				rnd: Math.random()
		
			},
			headers: {
			  referer: 'https://c.y.qq.com/',
			  host: 'c.y.qq.com'
			},
		}).then(res => {
			console.log(res)
			
			resolve(JSON.parse(res).data.list)
		}).catch(err => {
			reject(err)
		})
	})
}


export const getSongList = (disstid)=>{
	let data = {
		g_tk:1928093487,
		inCharset:'utf-8',
		outCharset:'utf-8',
		notice:0,
		format:'jsonp',
		disstid,
		type:1,
		json:1,
		utf8:1,
		onlysong:0,
		platform:'yqq',
		hostUin:0,
		needNewCode:0
	}
	return new Promise((resolve,reject)=>{
		uni.request({
			url:'http://ustbhuangyi.com/music/api/getCdInfo',
			method:'get',
			data,
			success:function(res){
				
				
				const listArr = [];
				for(let i = 0;i<res.data.cdlist[0].songlist.length;i++){
					let list = res.data.cdlist[0].songlist[i];
					listArr.push({
						img: "http://imgcache.qq.com/music/photo/album_300/17/300_albumpic_" + list.albumid + "_0.jpg",
						singer:list.singer[0].name,
						songid:list.songid,
						songmid:list.songmid,
						songname:list.songname
					})
				}
				resolve(listArr)
			},
			fail:function(err){
				reject(err)
				console.log(err)
			}
		})
	})

}

export const getSinger = ()=>{
	return new Promise((resolve,reject)=>{
		uni.request({
			url:apiBaseUrl + '/v8/fcg-bin/v8.fcg',
			method:'get',
			data:{
				g_tk: 1928093487,
				inCharset: 'utf-8',
				outCharset: 'utf-8',
				notice: 0,
				format: 'jsonp',
				channel: 'singer',
				page: 'list',
				key: 'all_all_all',
				pagesize: 100,
				pagenum: 1,
				hostUin: 0,
				needNewCode: 0,
				platform: 'yqq',
				jsonpCallback: 'jp1',
			},
			success:function(res){
				
				let data = JSON.parse(res.data.slice(5,res.data.length - 1))
				resolve(data)
			},
			fail:function(err){
				reject(err)
			}
		})
	})
}



export const getSingerDeatil = (singerId) => {
	return new Promise((resolve,reject)=>{
		uni.request({
			url:apiBaseUrl + '/v8/fcg-bin/fcg_v8_singer_track_cp.fcg',
			method:'get',
			data:{
				singermid: singerId,
				g_tk:1928093487,
				inCharset:'utf-8',
				outCharset:'utf-8',
				notice:0,
				format:'jsonp',
				hostUin:0,
				needNewCode:0,
				platform:'yqq',
				order:'listen',
				begin:0,
				num:80,
				songstatus:1,
				jsonpCallback:'jp1',
			},
			success:function(res){
				let data = JSON.parse(res.data.slice(5,res.data.length - 1)).data.list;
				
				// console.log(data)
				const result = [];
				for(let i = 0;i < data.length;i++){
					result.push({
						img: "http://imgcache.qq.com/music/photo/album_300/17/300_albumpic_" + data[i].musicData.albumid + "_0.jpg",
						singer:data[i].musicData.singer[0].name,
						songid:data[i].musicData.songid,
						songmid:data[i].musicData.songmid,
						songname:data[i].musicData.songname
					})
				}
				resolve(result)
			},
			fail:function(err){
				reject(err)
			}
		})
	})
}


export const getTopList = ()=>{
	return new Promise((resolve,reject)=>{
		uni.request({
			url:apiBaseUrl+"/v8/fcg-bin/fcg_myqq_toplist.fcg",
			method:'get',
			data:{
				g_tk:1928093487,
				inCharset:'utf-8',
				outCharset:'utf-8',
				notice:0,
				format:'jsonp',
				uin:0,
				needNewCode:1,
				platform:'h5',
				jsonpCallback:'jp3'
			},
			success:function(res){
				let data = JSON.parse(res.data.slice(4,res.data.length - 1)).data.topList;
				resolve(data)
			},fail(err){
				reject(err)
			}
			
		})
	})
}


export const getTopDetail = (topid) =>{
	return new Promise((resolve,reject)=>{
		uni.request({
			url:apiBaseUrl + "/v8/fcg-bin/fcg_v8_toplist_cp.fcg",
			method:'get',
			data:{
				g_tk:1928093487,
				inCharset:'utf-8',
				outCharset:'utf-8',
				notice:0,
				format:'jsonp',
				topid:topid,
				needNewCode:1,
				uin:0,
				tpl:3,
				page:'detail',
				type:'top',
				platform:'h5',
				jsonpCallback:'jp5'
			},
			success:function(res){
				let data = JSON.parse(res.data.slice(5,res.data.length - 1)).songlist;
				const result = [];
				for(let i = 0;i<data.length;i++){
					result.push({
						img: "http://imgcache.qq.com/music/photo/album_300/17/300_albumpic_" + data[i].data.albumid + "_0.jpg",
						singer:data[i].data.singer[0].name,
						songid:data[i].data.songid,
						songmid:data[i].data.songmid,
						songname:data[i].data.songname
					})
				}
				resolve(result)
			},
			fail:function(err){
				reject(err)
			}
		})
	})
}


export const getSongLyric = (songmid)=>{
	return new Promise((resolve,reject)=>{
		uni.request({
			
			url:"http://ustbhuangyi.com/music/api/lyric",
			method:'get',
			data:{
				g_tk:1928093487,
				inCharset:'utf-8',
				outCharset:'utf-8',
				notice:0,
				format:'json',
				songmid:songmid,
				platform:'yqq',
				hostUin:0,
				needNewCode:0,
				categoryId:10000000,
				pcachetime:1585214600726
				
			},
			success:function(res){

				let lyric = Base64.decode(res.data.lyric);
				resolve(lyric)
			},
			fail:function(err){
				
				console.log(err)
			}
		})
	})
}