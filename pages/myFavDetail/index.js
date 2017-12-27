Page({

  data: {
    poster: 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000',
    play_url: "",
    
    audioAction: {
      method: 'pause'
    }

  },

onLoad: function(options) {
    
    //http://c.m.163.com/nc/article/CAAR120K0001875P/full.html
    var self = this;
    var optionId = options.id;
    this.setData ({
      play_url:optionId
    })
    console.log(optionId);
    
},

fileDelete:function(){
  var self = this;
  wx.removeSavedFile({
   // filePath: res.fileList[0].filePath,

    filePath: self.data.play_url,
    complete: function (res) {
      console.log(res)
      wx.showToast({
        title: "删除成功!"
      })
    }
  })

},



})