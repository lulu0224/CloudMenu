// pages/category/category.js
import {tables} from "../../utils/config"
import Db from "../../utils/db"
Page({
  data: {
    cateName:"",
    cateList:[],
    fileImgList:[],
    isShowUpdate:false,
    updateCate:"",
    updateCateName:""
  },
  onLoad: function (options) {
    this._getCateAll()
  },
  onReady: function () {

  },
  onShow: function () {

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
  //获取输入框的分类名称
  _getCateName:function(e){
    this.setData({
      cateName:e.detail.value
    })
  },
  //添加分类
  _addCate:async function(){
    if(this.data.cateName){
      let cateName = this.data.cateName;
      let res = await Db._select(tables.cate,{cateName})
      if(!res.data.length){
        let res = await Db._add(tables.cate,{cateName});
        this.setData({
          cateName:res.data
        })
        wx.showToast({
          title: '分类添加成功',
        })
        this._getCateAll()
      }else{
        wx.showToast({
          title: '该分类已存在',
          icon:'none'
        })
      }
      this.setData({
        cateName:""
      })
    }else{
      wx.showToast({
        title: '输入不能为空',
        icon:'none'
      })
    }
    
  },
  //点击蓝色修改按钮
  _updateCate:function(e){
    this.setData({
      isShowUpdate:!this.data.isShowUpdate,
      updateCate: e.currentTarget.dataset.cate,
      updateCateName:e.currentTarget.dataset.cate.cateName
    })
  },
  //修改的输入框
  _inputUpdateCateName:function(e){
    this.setData({
      updateCateName:e.detail.value
    })
  },
  //点击修改
  _updateCateName:async function(){
    if(this.data.updateCateName){
      let cateName = this.data.updateCateName;
      let index = this.data.cateList.findIndex(item=>{
        return item.cateName == cateName
      })
      if(index == -1){
        let res = await Db._update(tables.cate,this.data.updateCate._id, {cateName});
        if(res.stats.updated){
          wx.showToast({
            title: '修改成功',
          })
          this._getCateAll()
        }else{
          wx.showToast({
            title: '修改失败',
            icon:"none"
          })
        }
       this.setData({
         isShowUpdate:false
       })
      }else{
        wx.showToast({
          title: '分类已存在',
          icon:"none"
        })
      }
    }else{
      wx.showToast({
        title: '输入不能为空',
        icon:'none'
      })
    }
    
  },
  //点击删除
  _delCate:function(e){
    wx.showModal({
      title: '友情提示',
      content: '您确定要删除吗？',
      success: async (res)=>{
        if (res.confirm) {
          let res = await Db._delByid(tables.cate,e.currentTarget.dataset.cate._id)
          if(res.stats.removed){
            wx.showToast({
              title: '删除成功',
            })
            this._getCateAll()
          }else{
            wx.showToast({
              title: '删除失败',
              icon:'none'
            })
          }
        } 
      }
    })
  }
})