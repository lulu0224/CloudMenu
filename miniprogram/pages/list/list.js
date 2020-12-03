import {tables} from "../../utils/config"
import Db from "../../utils/db"
import {format} from "../../utils/format"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:"",
    menuList:[],
    flag:0,
    keyword:"",
    isMore:true,
    currentPage:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._setOption(options)
    this._getMenuList(1)
  },
  _setOption:function(options){
    wx.setNavigationBarTitle({
      title: options.name || "搜索结果"
    });
    this.setData({
      id:options.id || "",
      flag:options.flag||0,
      keyword:options.keyword || ""
    })
  },
  //根据浏览排行，默认展示5条，获取该菜谱下的菜品
  _getMenuList:async function(p){
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
      let where = null;
      if(this.data.flag == 1){
        where={
            menu_name: Db.db.RegExp({
              regexp: this.data.keyword,
              options: 'i',
            }),
            menu_status:0
        }
      };
      if(this.data.flag == 0){
        where = {menu_status:0,cate_id:this.data.id}
      }
      let res = await Db._selectByPage(tables.menu,where,p,5,{condition:"menu_view",rule:"desc"});
      if(res.data.length != 0){
        if(res.data.length<5){
          this.setData({
            isMore:false
          })
        }
      res = await Db._selectUserByOther(res.data);
      res.forEach(item=>{
        item.menu_view = format(item.menu_view);
        item.menu_collect = format(item.menu_collect);
      })
      if(p==1){
          this.setData({
            menuList:res
          })
        }else{
          this.setData({
            menuList:this.data.menuList.concat(res)
          })
        }
      }else{
      this.setData({
        isMore:false
      })
    }
    wx.hideLoading()
  },
    //点击菜品，去往相应的菜品详情
    _goDetail:function(e){
      let _id = e.currentTarget.dataset.id;
      let menu_name = e.currentTarget.dataset.name;
      wx.navigateTo({
        url: `../detail/detail?id=${_id}&name=${menu_name}`,
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
    this.setData({
      isMore:true,
      currentPage:1
    })
    this._getMenuList(1)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.data.currentPage++;
    this._getMenuList(this.data.currentPage)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})