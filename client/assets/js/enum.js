const kv = (key,value)=>{ return {key,value} }
// 文章状态
export const articleStatus = [kv(0,'待审核'),kv(1,'正常'),kv(2,'审核未通过'),kv(3,'隐藏')]

// 用户状态
export const userStatus = [kv(0,'封禁'),kv(1,'正常')]

// 显示状态
export const viewStatus = [kv(0,'隐藏'),kv(1,'显示')]
