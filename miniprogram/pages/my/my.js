// pages/my/my.js
import {tables,admin} from "../../utils/config"
import Db from "../../utils/db"
import {format} from "../../utils/format"
Page({

  data: {
    TabIndex:0,
    isLogin:false, //是否登录。 false 未登录  true，已经登录
    userInfo:{},
    recipes:[],
    types:[],
    collectList:[],
    isMore1:true,
    isMore2:true,
    currentPage1:1,
    currentPage2:1
  },
  onLoad:function(){
    this._login();
    this._getRecipesAll(1)
  },
  _login:function(){
    let that = this
        wx.getSetting({
          success(res){
            if(res.authSetting['scope.userInfo']){
              wx.showLoading({
                title: '登录中',
              })
              wx.getUserInfo({
                success:ress=>{
                  that.setData({
                    userInfo:ress.userInfo,
                    isLogin:true
                  });
                  wx.hideLoading()
                }
              })
            }else{
              wx.removeStorageSync("userInfo");
              wx.removeStorageSync("isLogin");
              wx.removeStorageSync("_openid");
            }
          }
    })
  },

  //获取用户信息
  _getUserInfo:async function(e){
    if(e.detail.userInfo){
      let userInfo = e.detail.userInfo;
      let res = await wx.cloud.callFunction({name:"login"})
      let _openid = res.result.userInfo.openId;
      //先查询用户有没有存储过
      let r = await Db._select(tables.user,
        {_openid});
        if(!r.data.length){
           r = await Db._add(
          tables.user,{userInfo})
        }
      this.setData({
        userInfo,
        isLogin:true
      });
      wx.setStorageSync("userInfo",userInfo);
      wx.setStorageSync("isLogin",this.data.isLogin);
      wx.setStorageSync("_openid",_openid);
    }
  },
  //点击头像，去往分类页面
  _goCate:function(){
     let _openid = wx.getStorageSync("_openid") || "";
    if(_openid == admin){
      wx.navigateTo({
        url: '../category/category'
      })
    }
  },
  //导航栏tab切换
  _selectTab:function(e){
    this.setData({
      TabIndex:e.currentTarget.dataset.index
    })
    if(this.data.TabIndex==1){
      this._getCateAll()
    }
    if(this.data.TabIndex==2){
      this._getMenuCollectAll(1)
    }
  },
  //点击加号
  _jia:function(){
    wx.navigateTo({
      url: '../pbrecipe/pbrecipe',
    })
  },
  //获取所有菜品
  _getRecipesAll:async function(p){
    if(!this.data.isMore1){
      wx.showToast({
        title: '我们是有底线滴~',
        icon:'none'
      })
      return 
    }
    wx.showLoading({
      title: '加载中',
    })
    let _openid = wx.getStorageSync("_openid") || "";
      let res = await Db._selectByPage(tables.menu,{menu_status:0,_openid},p,6,{condition:"menu_view",rule:"desc"});
      if(res.data.length != 0){
        if(res.data.length<6){
          this.setData({
            isMore1:false
          })
        }
      res.data.forEach(item=>{
        item.menu_view = format(item.menu_view);
      })
        if(p==1){
          this.setData({
            recipes:res.data
          })
        }else{
          this.setData({
            recipes:this.data.recipes.concat(res.data)
          })
        }
      }else{
      this.setData({
        isMore1:false
      })
    }
    wx.hideLoading()
  },
  //获取本人发布的所有分类
  _getCateAll:async function(){
    wx.showLoading({
      title: '加载中',
    })
    let _openid = wx.getStorageSync('_openid')
    let res = await Db._selectAll(tables.cate,{
      _openid});
    if(res.data.length != 0){
      this.setData({
        types:res.data
    })
    }
    wx.hideLoading()
  },
  //获取本人关注的所有菜品
  _getMenuCollectAll:async function(p){
    if(!this.data.isMore2){
      wx.showToast({
        title: '我们是有底线滴~',
        icon:'none'
      })
      return 
    }
    wx.showLoading({
      title: '加载中',
    })
    let _openid = wx.getStorageSync('_openid') || '';
    let res = await Db._selectAll(tables.collect,{
      _openid});
      let tasks = []
    res.data.forEach(item=>{
      let promise = Db._selectByPage(tables.menu,{menu_status:0,_id:item.menu_id},p,3,{condition:"menu_view",rule:"desc"});
      tasks.push(promise)
    })
    res  = await Promise.all(tasks)
    if(res.length != 0){
        if(res.length<3){
          this.setData({
            isMore2:false
          })
        }
        let tasks1=[]
        res.forEach((item)=>{
          let promise1 = Db._selectUserByOther(item.data)
          tasks1.push(promise1)
        })
        let result  = await Promise.all(tasks1)
        if(result.length !=0 ){
          result.forEach(item=>{
            item[0].menu_view = format(item[0].menu_view);
            item[0].menu_collect = format(item[0].menu_collect);
          })
        }
      
      if(p==1){
          this.setData({
            collectList:result
          })
        }else{
          this.setData({
            collectList:this.data.collectList.concat(result)
          })
        }
      }else{
      this.setData({
        isMore2:false
      })
    }
    wx.hideLoading();
   
    
    
      
  },
  //点击菜品，去往相应的菜品详情
  _goDetail:function(e){
    let _id = e.currentTarget.dataset.id;
    let menu_name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: `../detail/detail?id=${_id}&name=${menu_name}`,
    })
  },
  _delStyle(){
    wx.showModal({
      title:"删除提示",
      content:"确定要删除么？",
      
    })
  },
  onReachBottom: function () {
    if(this.data.TabIndex==0){
      this.data.currentPage1++;
    this._getRecipesAll(this.data.currentPage1)
    }
  
    if(this.data.TabIndex==2){
      this.data.currentPage2++;
    this._getMenuCollectAll(this.data.currentPage2)
    }
  }
})