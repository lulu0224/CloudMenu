import {tables} from "./config"
const db = wx.cloud.database();
const _ = db.command
const _add=(table,data)=>{
  return db.collection(table).add({
    data
  })
}
const _select=(table,where={})=>{
  return db.collection(table).where(where).get()
}
const _selectAll= async (table,where={})=>{
  const MAX_LIMIT = 20;
  const countResult = await db.collection(table)
  .where(where)
  .count()
  const total = countResult.total
  if(total == 0){
    return{
      data:[]
    }
  }
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 20)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection(table).skip(i * MAX_LIMIT).limit(MAX_LIMIT).where(where).get()
    tasks.push(promise)
  }
  // 等待所有
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })
}
const _selectByPage = (table,where={},page=1,limit,order={condition:"_id",rule:"asc"})=>{
  let n = (page-1)*limit
  return db.collection(table).where(where).skip(n).limit(limit).orderBy(order.condition, order.rule).get()
}
const _selectUserByOther = async (data)=>{
  let tasks =[];
  data.forEach(item=>{
  let promise = _select(tables.user,{_openid:item._openid})
  tasks.push(promise)
  })
  let result=await Promise.all(tasks)
  data.forEach((item,index)=>{
      item.userInfo=result[index].data[0].userInfo
  })
  return data
  
}
const _update =(table,id,data)=>{
  return db.collection(table).doc(id).update({
    data
  })
}
const _delByid =(table,id)=>{
  return db.collection(table).doc(id).remove()
}
const _delByWhere = (table,where={})=>{
  return db.collection(table).where(where).remove()
}
export default {
  _add,
  _select,
  _selectAll,
  _update,
  _selectByPage,
  _delByid,
  _delByWhere,
  _selectUserByOther,
  db,
  _
}