const format=(num)=>{
if(num<1000){
  return num
}else if(num<10000){
  num = (num/1000).toFixed(2)
  return `${num}k`
}else{
  num = (num/10000).toFixed(2)
  return `${num}w`
}
}
export {
  format
}