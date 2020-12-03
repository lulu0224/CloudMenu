import {tables} from "../../utils/config"
import Db from "../../utils/db"
import {format} from "../../utils/format"
Page({
  data: {
    currentPage:1,
    isMore:true,
    types: [],
    recipes:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getCateLimit()
    this._getHotMenu(1)
  },
  
  //获取前三个分类
  _getCateLimit:async function(){
    let res = await Db._selectByPage(tables.cate,{},1,3);
    this.setData({
      types:res.data
    })
  },
  //点击菜谱分类，去往分类页面
  _goCateList:function(){
    wx.navigateTo({
      url: '../type/type',
    })
  },
  //点击菜谱，去往相应的菜品列表页
  _goMenu:function(e){
    let index = e.currentTarget.dataset.index;
    let {_id,cateName} = this.data.types[index]
    wx.navigateTo({
      url: `../list/list?id=${_id}&name=${cateName}`,
    })
  },
  //点击菜品，去往相应的菜品详情
  _goDetail:function(e){
    let index = e.currentTarget.dataset.index;
    let {_id,menu_name} = this.data.recipes[index]
    wx.navigateTo({
      url: `../detail/detail?id=${_id}&name=${menu_name}`,
    })
  },
  //根据浏览排行，默认展示10条，获取热门菜谱
  _getHotMenu:async function(p){
    if(!this.data.isMore){
      wx.showToast({
        title: '我们是有底线滴~',
        icon:'none'
      })
      return 
    }
    wx.showLoading({
      title: '加载中',
    })
      let res = await Db._selectByPage(tables.menu,{menu_status:0},p,10,{condition:"menu_view",rule:"desc"});
      if(res.data.length){
        if(res.data.length<10){
          this.setData({
            isMore:false
          })
        }
        //获取用户信息
      res = await Db._selectUserByOther(res.data);
      res.forEach(item=>{
        item.menu_view = format(item.menu_view);
      })
        if(p==1){
          this.setData({
            recipes:res
          })
        }else{
          this.setData({
            recipes:this.data.recipes.concat(res)
          })
        }
      }else{
      this.setData({
        isMore:false
      })
    }
    wx.hideLoading()
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
    this.setData({
      isMore:true,
      currentPage:1
    })
    this._getHotMenu(1)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.data.currentPage++;
    this._getHotMenu(this.data.currentPage)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})