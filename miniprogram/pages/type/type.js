import {tables} from "../../utils/config"
import Db from "../../utils/db"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cateList:[]
  },

  onLoad: function (options) {
    this._getCateAll()
  },
  //获取所有的分类
  _getCateAll:async function(){
    wx.showLoading({
      title: '加载中',
    })
    let res = await Db._selectAll(tables.cate,{});
    if(res.data.length != 0){
      this.setData({
      cateList:res.data
    })
    }
    wx.hideLoading()
  },
  //点击菜谱，去往相应的菜品列表页
  _goMenu:function(e){
    let index = e.currentTarget.dataset.index;
    let {_id,cateName} = this.data.cateList[index]
    wx.navigateTo({
      url: `../list/list?id=${_id}&name=${cateName}`,
    })
    
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