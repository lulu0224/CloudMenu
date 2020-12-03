import {tables,admin} from "../../utils/config"
import Db from "../../utils/db"
Page({
  data: {
    hotSearchList:[],
    lastSearchList:[],
    keyword:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getHotSearchList(1);
    this._getLastSearchList()
  },
  //获取热门搜索列表
  _getHotSearchList:async function(p){
    wx.showLoading({
      title: '加载中',
    })
    let res = await Db._selectByPage(tables.menu,{menu_status:0},p,9,{condition:"menu_view",rule:"desc"});
    if(res.data.length!=0){
      this.setData({
        hotSearchList:res.data
      })
    }
    wx.hideLoading()
  },
  //获取近期搜索列表
  _getLastSearchList:function(){
    let keywordsArr = wx.getStorageSync('keywordsArr') || [];
    this.setData({
      lastSearchList:keywordsArr
    })
  },
  //点击搜索按钮
  _search:function(){
    let keyword = this.data.keyword;
    if(keyword == ""){
      wx.showToast({
        title: '搜索关键词不能为空',
        icon:'none'
      })
      return
    }else{
      let keywordsArr = wx.getStorageSync('keywordsArr') || [];
      let index = keywordsArr.indexOf(keyword);
      if(index == -1){
        keywordsArr.unshift(keyword)
      }else{
        keywordsArr.splice(index,1);
        keywordsArr.unshift(keyword)
      }
      keywordsArr = keywordsArr.splice(0,9);
      wx.setStorageSync('keywordsArr', keywordsArr)
      wx.navigateTo({
        url: '../list/list?flag=1&keyword='+keyword,
      })
    }
  },
  //点击菜品，去往相应的菜品详情
  _goDetail:function(e){
    let _id = e.currentTarget.dataset.id;
    let menu_name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: `../detail/detail?id=${_id}&name=${menu_name}`,
    })
  },
  //获取输入的内容
  _inputKeyword:function(e){
      this.setData({
        keyword:e.detail.value
      })
  },
  //点击近期搜索里的关键词，跳到列表
  _lastSearchgo:function(e){
    wx.navigateTo({
      url: '../list/list?flag=1&keyword='+e.currentTarget.dataset.keyword,
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