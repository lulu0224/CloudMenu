import {tables} from "../../utils/config"
import Db from "../../utils/db"
import {format} from "../../utils/format"
Page({

  data: {
    id:'',
    isCollect:false,
    menuDetail:{},
    user:{},
    cate:{}
  },
  onLoad: async function (options) {
    this._setOption(options)
    await this._getMenuDetail();
    await this._jedgeCollect(options.id);
    await this._setView(options.id);
  },
  _setOption:function(options){
    wx.setNavigationBarTitle({
      title: options.name
    });
    this.setData({
      id:options.id || ""
    })
  },
  //设置浏览数量
  _setView:async function(id){
    await Db._update(tables.menu,id,{menu_view:Db._.inc(1)})
  },
  //单独获取该菜品的关注数
  _getItsCollect:async function(){
    let res = await Db._select(tables.menu,{_id:this.data.id})
    res.data[0].menu_view = format(res.data[0].menu_view);
    res.data[0].menu_collect = format(res.data[0].menu_collect);
    
    this.setData({
      menuDetail:res.data[0] || {},
    })
  },
  //获取该菜品信息
  _getMenuDetail:async function(){
    wx.showLoading({
      title: '加载中',
      icon:'none'
    })
    let res = await Db._select(tables.menu,{_id:this.data.id})
    //获取该菜品的分类
    let cate = await Db._select(tables.cate,{_id:res.data[0].cate_id})
    //获取发布该菜品的用户信息
    let user = await Db._select(tables.user,{_openid:res.data[0]._openid})
    
    res.data[0].menu_view = format(res.data[0].menu_view);
    res.data[0].menu_collect = format(res.data[0].menu_collect);
    
    this.setData({
      menuDetail:res.data[0] || {},
      user:user.data[0] || {},
      cate:cate.data[0] || {},
    })
    wx.hideLoading()
  },
  //判断该用户有没有关注过该菜品
  _jedgeCollect:async function(id){
    let isLogin = wx.getStorageSync('isLogin') || '';
    if(isLogin){
       let res = await Db._select(tables.collect,{menu_id:id})
       console.log(res);
       
       if(res.data.length !=0 ){
        this.setData({
          isCollect:true
        })
       }
    }
  },
  //当用户操作关注
  _doCollect:async function(){
    let isLogin = wx.getStorageSync('isLogin') || '';
    if(!isLogin){
      wx.showToast({
        title: '请您先登录',
        icon:'none'
      })
      setTimeout(()=>{
        wx.switchTab({
          url: '../my/my',
        })
      },2000)
    }else{
      //如果用户关注了
      if(this.data.isCollect){
        //用户想取消关注
        Db._delByWhere(tables.collect,{menu_id:this.data.menuDetail._id}).then(res=>{
          return Db._update(tables.menu,this.data.id,{
            menu_collect:Db._.inc(-1)
          })
        }).then(res=>{
          wx.showToast({
            title: '取消关注成功',
            icon:'none'
          });
          this.setData({
            isCollect:false
          })
          this._getItsCollect()
        })
      }else{
        //用户想关注
        Db._add(tables.collect,{menu_id:this.data.menuDetail._id}).then(res=>{
          return Db._update(tables.menu,this.data.id,{
            menu_collect:Db._.inc(1)
          })
        }).then(res=>{
          wx.showToast({
            title: '关注成功'
          });
          this.setData({
            isCollect:true
          })
          this._getItsCollect()
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {

    // 1:来自页面内转发按钮
    if (res.from === 'button') {
      return {
        title: this.data.menuDetail.menu_name+'的做法',
        path: "/pages/detail/detail?id="+this.data.id+"&name="+this.data.menuDetail.menu_name,
        imageUrl:this.data.menuDetail.menu_img[0]
      }
    }
    //2:来自导航右上角菜单“转发”按钮
    if (res.from === 'menu') {
      return {
        title: this.data.menuDetail.menu_name+'的做法',
        path: "/pages/detail/detail?id="+this.data.id+"&name="+this.data.menuDetail.menu_name,
        imageUrl:this.data.menuDetail.menu_img[0]
      }
    }
  },
  //设置分享到朋友圈
  onShareTimeline:function(){
    return {
      title: this.data.menuDetail.menu_name+'的做法',
      query: "/pages/detail/detail?id="+this.data.id+"&name="+this.data.menuDetail.menu_name,
      imageUrl:this.data.menuDetail.menu_img[0]
    }
  }

})