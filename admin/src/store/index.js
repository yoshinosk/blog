import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

Vue.use(Vuex);

const store = new Vuex.Store({
    getters,
    state:{
        user:{ },
		HOST: process.env.VUE_APP_BASE_URL.replace('/api','')
    },
    mutations:{
        $uStore(state, payload) {
			// 判断是否多层级调用，state中为对象存在的情况，诸如user.info.score = 1
			let nameArr = payload.name.split('.');
			let saveKey = '';
			let len = nameArr.length;
			if(len >= 2) {
				let obj = state[nameArr[0]];
				for(let i = 1; i < len - 1; i ++) {
					obj = obj[nameArr[i]];
				}
				obj[nameArr[len - 1]] = payload.value;
				saveKey = nameArr[0];
			} else {
				// 单层级变量，在state就是一个普通变量的情况
				state[payload.name] = payload.value;
				saveKey = payload.name;
			}
		}
    },  
    actions:{

    }
});

export default store;

