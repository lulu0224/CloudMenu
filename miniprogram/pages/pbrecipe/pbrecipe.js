import {tables,admin} from "../../utils/config"
import Db from "../../utils/db"
import {upload} from "../../utils/upload"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cateList:[],
    fileImgList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getCateAll()
  },

  //获取所有的分类
  _getCateAll:async function(){
    wx.showLoading({
      title: '加载中',
    })
    let res = await Db._selectAll(tables.cate);
    if(res.data.length != 0){
      this.setData({
      cateList:res.data
    })
    }
    wx.hideLoading()
  },
  //选择上传图片
  _selectImg:function(e){
    let fileImgList = e.detail.tempFilePaths.map(item=>{
      return {url:item}
    })
    this.setData({
      fileImgList
    })
  },
  //点击删除图片
  _deleteImg:function(e){
    this.data.fileImgList.splice(e.detail.index,1)
  },
  //表单发布
  _menuPublic:async function(e){
    let {menu_name,menu_info,cate_id} = e.detail.value;
    if(menu_name==""||menu_info==""||cate_id==""||this.data.fileImgList.length == 0){
      wx.showToast({
        title: '选择不能为空',
        icon:'none'
      })
      return
    }
    let res = await upload(this.data.fileImgList)
    let menu_img = res
    if(res.length == this.data.fileImgList.length){
      res = await Db._add(tables.menu,{
        menu_name,
        menu_info,
        menu_img,
        cate_id,
        menu_view:0,
        menu_status:0,
        menu_collect:0
      })
      if(res._id){
        wx.showToast({
          title: '发布成功',
        })
        setTimeout(()=>{
          wx.navigateBack()
        },1000)
      }else{
        wx.showToast({
          title: '发布失败',
          icon:'none'
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})