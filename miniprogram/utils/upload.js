const upload =async (fileList)=>{
  let tasks=[]
  fileList.forEach(item=>{
    let ext = item.url.split(".").pop()
    let filename = (new Date).getTime+Math.random()+"."+ext;
    let promise = wx.cloud.uploadFile({
      filePath:item.url,
      cloudPath:filename
    })
    tasks.push(promise)
  })
  let res =  await Promise.all(tasks)
  return res.map(item=>{
    return item.fileID
  })
}
export{
  upload
}