// var pageData = {}
// for (var i = 1; i < 5; ++i) {
//   (function (index) {
//     pageData['slider' + index + 'change'] = function (e) {
//       console.log('slider' + index + '发生change事件，携带值为', e.detail.value)
//     }
//   })(i)
// }

//Page(pageData)

var app = getApp()
var util = require('../../utils/util.js')

const backgroundAudioManager = wx.getBackgroundAudioManager()

const ctx = wx.createCanvasContext('myCanvas')


var n;

Page({
  
   
  /**
   * 页面的初始数据
   */
  data: {

    x: 0,
    y: 0,
    hidden:true,
    width: 0,
    height: 0,

    playing: 0, //2：没有音乐在播放，1：播放中，0：暂停中
    
    formatedPlayTime: '00:00:00',

    hide: false,
   
   // poster: 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000',
    poster: "../../images/icon-130.png",
    // name: '此时此刻',
    // author: '许巍',
    
    songId:'',
    name: ' ',
    author: ' ',

    //src: 'https://api.zanmeishi.com/song/p/' + this.id + '.mp3',
    //src: 'https://api.zanmeishi.com/song/p/6912.mp3',
    src: '',
    fileSrc:'',

    lyrics: '',   //初始格式 
    lyricsParse:'',    //object格式
    lyricsText:'',  //文本格式
    lyricNow:'',   //当前唱到的歌词
    lrcNowId:'', //元素ID

    scrollTop:10,

    showLyrics:false,
    
    value: '',  //slider的值
    totalTime: '',//格式化后的总时长
    duration: '',
    //playTime: 0,
    playTime:'0:00',
    currentPosition:'', //当前时间点
    currentPositionInt:0,

    btnText: '播放',
    btn3Text:'下载歌曲',
    btn4Text:'收藏歌曲',
    isFav :false, //是否收藏过

    loading: false,

    animation:'',
      audioAction: {
        method: 'pause'
      },
      
  },

  start: function (e) {
    this.setData({
      //hidden: false,   //关闭坐标调试
      x: e.touches[0].x,
      y: e.touches[0].y
    })
  },
  move: function (e) {
    this.setData({
      x: e.touches[0].x,
      y: e.touches[0].y
    })
  },
  end: function (e) {
    this.setData({
      hidden: true
    })
  },


likeItOrCancelIt:function(){
 var that = this;
 var text = that.data.btn4Text
    if(text=='收藏歌曲'){
      that.likeIt();

      that.setData({
        isFav: true
      })
 
    } else if (text == '取消收藏') {

     that.cancelIt();

     that.setData({
       isFav: false
     })

    }


},

//收藏歌曲
likeIt () {
    var that = this;
    var likeList = {};
    var key = 'myFav'
    var songId = app.globalData.songId

    wx.getStorage({
      key: key,
      success: function (res) {
        console.log('res data=',res.data);
        likeList = res.data;

        var len = 0;
        for (var data in likeList) {
          len++
        }

        console.log('len of likelist = ', len)

        //likeList[len] = {

        

        likeList[songId] = {  

          songId:songId,
          songName: app.globalData.songName,
          artistName: app.globalData.artistName,
          songSrc: app.globalData.songSrc,
          poster: app.globalData.poster,
          lyrics: app.globalData.lyrics,

         
         // lyrics:that.data.lyrics.toString,

        }

        console.log('likeList = ', likeList)
        //保存歌曲信息
        wx.setStorageSync(key, likeList)
        
        that.setData({
          btn4Text:'取消收藏'
        })
        wx.showToast({
          title: '收藏成功',
        })

      },
      //收藏夹无记录的情况下
      fail: function (res) {
        console.log(res);
        
        likeList[songId] = {
          songId: app.globalData.songId,
          songName: app.globalData.songName,
          artistName: app.globalData.artistName,
          songSrc: app.globalData.songSrc,
          poster: app.globalData.poster,
          lyrics: app.globalData.lyrics,
        }

        console.log('likeList = ', likeList)
        //保存歌曲信息
        wx.setStorageSync(key, likeList)
       
        that.setData({
          btn4Text: '取消收藏'
        })
        wx.showToast({
          title: '收藏成功',
        })       
      }     
    })

  },

checkFavList(){
var that = this;
var likeList = {};
var key = 'myFav'

  wx.getStorage({
    key: key,
    success: function (res) {
      console.log('checkFavlist res data=', res.data);
      likeList = res.data;

      var songId = app.globalData.songId;
      var songName = app.globalData.songName;
      console.log('checkFavList global songId,songName=',  songId,  songName)

      // var songId = that.data.songId;
      // var songName = that.data.name;


      that.setData({
        btn4Text: '收藏歌曲',
        isFav: false
      })

      for (var id in likeList) {

        //非得转成Int才能正常比较，无解
        if ((parseInt(songId) == parseInt(id)) && (songName == likeList[id].songName)) {
         
          that.setData({
            btn4Text: '取消收藏',
            isFav: true
          })
          console.log('found it! songId=',songId)
         
         }
       
      }




    },

    //收藏夹无记录的情况下
    fail: function (res) {
      console.log(res);

      // var key = 'myFav'
      // likeList[0] = {
      //   songId: app.globalData.songId,
      //   songName: app.globalData.songName,
      //   artistName: app.globalData.artistName,
      //   songSrc: app.globalData.songSrc,
      //   poster: app.globalData.poster,
      //   lyrics: app.globalData.lyrics,
      // }

      // console.log('likeList = ', likeList)
      // //保存歌曲信息
      // wx.setStorageSync(key, likeList)

      // that.setData({
      //   btn4Text: '取消收藏'
      // })
      // wx.showToast({
      //   title: '收藏成功',
      // })
    }
  })


},

cancelIt(){

var that = this;
var likeList = {};
var key = 'myFav'


  wx.getStorage({
    key: key,
    success: function (res) {
      console.log('res data=', res.data);
      likeList = res.data;
      
      var songId = app.globalData.songId;
      var songName = app.globalData.songName;


      for (var id in likeList) {
         //非得转成Int才能正常比较，无解
        if((parseInt(songId) == parseInt(id)) && (songName == likeList[id].songName)){
          //删除记录
          delete likeList[id]

        }

      }



      console.log('likeList = ', likeList)
      //重新保存收藏列表
      wx.setStorageSync(key, likeList)

      that.setData({
        btn4Text: '收藏歌曲'
      })
      wx.showToast({
        title: '取消成功',
      })

    },

    //收藏夹无记录的情况下
    fail: function (res) {
      console.log(res);

      // var key = 'myFav'
      // likeList[0] = {
      //   songId: app.globalData.songId,
      //   songName: app.globalData.songName,
      //   artistName: app.globalData.artistName,
      //   songSrc: app.globalData.songSrc,
      //   poster: app.globalData.poster,
      //   lyrics: app.globalData.lyrics,
      // }

      // console.log('likeList = ', likeList)
      // //保存歌曲信息
      // wx.setStorageSync(key, likeList)

      // that.setData({
      //   btn4Text: '取消收藏'
      // })
      // wx.showToast({
      //   title: '收藏成功',
      // })
    }
  })


},


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    
    //查询手机屏幕px值，以后面设置canvas动画
    wx.getSystemInfo({
      success: function(res) {
        self.width = res.windowWidth
        self.height = res.windowHeight

      },
    })

    self.animation = wx.createAnimation({
      duration:1000,
      //timingFunction:"ease",

    })

    //self._enableInterval()

    if (app.globalData.backgroundAudioPlaying) {

      self.setData({
        playing: 1,
      })
    }

    // 使用 wx.createAudioContext 获取 audio 上下文 context
    //this.audioCtx = wx.createAudioContext('myAudio')

    var fromWhere = options.from;
    var songId = options.songId;
    

    console.log('songId=', songId);
    
    //var url = 'https://api.zanmeishi.com/song/p/' + optionId + '.mp3';
    
    // var songName = options.songName;
    // var artistName = options.artistName;
    
    //需要解码，否则分享给别人会乱码
    var songName = decodeURI(options.songName);
    var artistName = decodeURI(options.artistName);

    var poster = decodeURIComponent(options.poster)

    self.setData({
      songId: songId,
      name: songName,
      author: artistName,
      poster: poster
           
    })

    //从快捷入口过来的
    if (fromWhere == -1) {
      self.setData({
        name: app.globalData.songName,
        author: app.globalData.artistName,
        src: app.globalData.songSrc,  //会重新播放吗？
        poster: app.globalData.poster,
        lyrics: app.globalData.lyrics,
        songId: app.globalData.songId,

        hide:true,
        btnText: '暂停',
      })
      //self.audioPlay()

     
      //从歌曲列表过来的 或搜索九酷福音网
    } else if (fromWhere == 0) {

      this.getContentData(songId,0)

      //从搜索页面过来的 赞美诗网
    } else if (fromWhere == 1) {
        var url = options.url;
       // var lyrics = options.lyrics
        
        console.log('songSrc=',url);

        //console.log('lyrics=', lyrics.toString);
        self.setData({
          hide: true,
          src: url,
         // lyrics: lyrics,
          lyricsText:'暂无歌词',
              
        })
        self.audioPlay()

      //搜索jdjgq网过来的
    } else if (fromWhere == 2) {

      this.getContentData(songId,2)

        //从收藏页面过来的
    }else if (fromWhere == 3) {
      var url = options.url;
      var lyrics = options.lyrics
      
      //console.log('lyrics=',lyrics)
      var lyricsParse = util.parseLyric(options.lyrics) 

      self.setData({
        
        hide: true,
        src: url,
        lyrics: lyrics,
        lyricsParse: lyricsParse,

        btn4Text: '取消收藏',
        isFav: true

      })
      self.audioPlay()

      // self.setData({
      //   btn4Text: '取消收藏',
      //   isFav: true
      // })
      //主要是找歌词
     // this.getContentData(songId)

    }
    //console.log('onload')
    //self.checkFavList()  //
    console.log('poster=', poster)

    
  },


  showLyrics:function(){
    var self = this
    var showLyrics = self.data.showLyrics
    self.setData({
       showLyrics : ! showLyrics
    })
    console.log('showLyrics=',showLyrics)

  },

//请求服务器获得url和lyrics
  getContentData: function (songId,fromWhere) {
    var self = this;
    if(fromWhere ==0){
     var url = 'https://www.betterguitars.com/9kufuyinSongSrc?songId='+songId;
    }else if(fromWhere == 2){

      var url = 'https://www.betterguitars.com/jdjgqSongSrc?songId=' + songId;
    }
    console.log(url);
    //network request
    wx.request({
      url: url,
      header: {
        "Content-Type": "application/json"
      },
      method: "GET",
      data: {

      },
      success: function (res) {
        //get data 
   
        var songSrc = encodeURI( res.data.songSrc);
        //var songSrc = (res.data.songSrc);

        //console.log('songSrc0=',res.data.songSrc)

        // if (fromWhere == 0) {
        //   var url = 'https://www.betterguitars.com/9kufuyinSongSrc?songId=' + songId;
        // } else if (fromWhere == 2) {

        //   var url = 'https://www.betterguitars.com/jdjgqSongSrc?songId=' + songId;
        // }

        var lyrics = res.data.lyrics

        // console.log('lyrics=', lyrics)
        // if (lyrics == '\n' || lyrics == ' '){
        //   lyrics ='暂无歌词'

        // }
        

        self.setData({
          src: songSrc,
          lyrics: lyrics,
          })

      
        console.log('songSrc=',songSrc)
        //console.log('lyrics=', lyrics)

        //console.log('lyrics2=', lyrics)

        //var lyricsParse = util.parseLyric(lyrics) 

        //console.log('lyricsParse=', lyricsParse)
        
        //console.log('lyricsParse=', lyricsParse)

        // var lyricsText=''

        // for(var key in lyricsParse){
        //   var tmp = lyricsParse[key] + '\n'
        //    lyricsText= lyricsText + tmp
           
        //  }
        
        //console.log('lyricsText=',lyricsText)

        //  //保存歌曲src(object类型)
        // self.setData({
          
        //   lyricsParse:lyricsParse,
        //   lyricsText:lyricsText,
        // })

        //获得url和lyricsParse后，开始播放
        self.audioPlay()

        // console.log(self.data.image_one)
        // self.update()
        setTimeout(function () {
          self.setData({
            hide: true
          })
        }, 500)
      },

      fail: function ({ errMsg }) {
        console.log('request fail, err is:', errMsg)
        //wx.hideNavigationBarLoading()
        self.setData({
          hide: true
        })
        wx.showToast({
          title: "网络有点卡，请稍后重试",
        })
      }
    });
  },



  funerror: function (u) {
    console.log(u.detail.errMsg);
    wx.showToast({
      title: "因版权等原因，该曲暂时无法播放",
      icon: 'loading',
      duration: 3000
    })
  },



  audioPlayAndPause: function () {
    var that = this
     //var text = this.data.btnVal
     var text = that.data.btnText
     //console.log('text =',text );
    
      if(text == '播放' ){

        //this.audioPlay()
        backgroundAudioManager.play()
        that.setData({
          btnText: '暂停',
        })
        app.globalData.backgroundAudioPlaying = true
      }
      else {
          // this.audioPause()
           backgroundAudioManager.pause()

           that.setData({
             btnText: '播放',
           })
           app.globalData.backgroundAudioPlaying = false
      }
    console.log('click play');
  },

//设置好控制器并播放
audioPlay(){
        var that =this;
        //this.audioCtx.play(); ///////////////////

        // backgroundAudioManager.title = '此时此刻'
        // backgroundAudioManager.epname = '此时此刻'
        // backgroundAudioManager.singer = '汪峰'
        // backgroundAudioManager.coverImgUrl = 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000'

        backgroundAudioManager.title = that.data.name
        backgroundAudioManager.epname = that.data.name
        backgroundAudioManager.singer = that.data.author
        backgroundAudioManager.coverImgUrl = that.data.poster
        
        backgroundAudioManager.src = that.data.src // 设置了 src 之后会自动播放
        
       //设置播放器的全局参数变量
        app.globalData.songId = that.data.songId
        app.globalData.songSrc = that.data.src
        app.globalData.songName = that.data.name
        app.globalData.artistName = that.data.author
        app.globalData.poster = that.data.poster
        app.globalData.lyrics = that.data.lyrics
        //console.log('that.data.lyrics=', that.data.lyrics)


        that.setData({
          btnText: '暂停',
        })
        app.globalData.backgroundAudioPlaying = true

         console.log('audioplay checkFavList')
         that.checkFavList()

},


audioPause() {
  var that = this;
  //this.audioCtx.pause();/////////////////////


  backgroundAudioManager.pause()

  // wx.pauseBackgroundAudio({
  //   //dataUrl: dataUrl,
  //   dataUrl: that.data.src,
  //   success: function () {
  //     that.setData({
  //       playing: 0,
  //     })
  //   }
  // })

   app.globalData.backgroundAudioPlaying = false

  //停止唱片动画
  // clearInterval(this.rotater)


  that.setData({
    btnText: '播放',
  })

},

//分享给好友
 /**
   * 用户点击右上角分享
   */
onShareAppMessage: function (res) {
  if (res.from === 'button') {
    // 来自页面内转发按钮
    console.log(res.target)
  }
 
},

/**
   * 生命周期函数--监听页面初次渲染完成
   */
onReady: function (e) {
  // 使用 wx.createAudioContext 获取 audio 上下文 context
  //this.audioCtx = wx.createAudioContext('myAudio')
  //this.audioCtx.play()
  var that =this;

  //console.log('onready checkFavList')
  //that.checkFavList()

  //clearInterval(this.rotater)

  //that.audioPlay()
  n = 1;
  
  
  

  backgroundAudioManager.onPlay((res) => {
    console.log('音乐播放', res)

    wx.hideNavigationBarLoading()
    

  })

  backgroundAudioManager.onPause((res) => {
    console.log('音乐暂停', res)

  })
  


  backgroundAudioManager.onError((res) => {
    console.log('播放出错', res)
    console.log('播放出错code=', res.errCode)
    var currentPosition
    
    if(res.errCode == 10001 || res.errCode == 10004){

      wx.showToast({
        title: '该歌曲可能已下架，请试试别的吧',
        icon: 'loading',
        duration: 3000
      })
      //wx.stopBackgroundAudio()
      this.audioPause()
      wx.hideNavigationBarLoading()
      

    }else if(res.errCode == 10002){
      backgroundAudioManager.startTime = that.data.currentPosition
      backgroundAudioManager.src = that.data.src // 设置了 src 之后会自动播放
      
      console.log('currentPosition = ', that.data.currentPosition)

      setTimeout(function(){
      // backgroundAudioManager.seek(that.data.currentPositionInt)

      },500)
      

      wx.showToast({
        title: '网络好像有点卡，正在尝试恢复播放',
        icon:'loading',
        duration:3000
      })
    }else{
      wx.showToast({
        title: '未知错误，请稍后重试'+res.errCode,
        icon: 'loading',
        duration: 3000
      })
      //wx.stopBackgroundAudio()
      this.audioPause()
      wx.hideNavigationBarLoading()

    }  

  })


  backgroundAudioManager.onEnded((res)=>{

   // backgroundAudioManager.seek(0)
    
    if(true){
     that.audioPlay();

     that.setData({
       btntext: '暂停'
     })
    }

  })

  backgroundAudioManager.onWaiting((res) => {
    
    console.log('音乐加载中。。。')
    wx.showNavigationBarLoading()



  })


///////////////////////////////////////////
//更新过程
///////////////////////////////////////////
  backgroundAudioManager.onTimeUpdate((res) => {
    //console.log('音乐更新', backgroundAudioManager.currentTime)
    var manger = backgroundAudioManager;
   
    var currentTime = manger.currentTime; //当前进度
    var duration = manger.duration  //总时长 

    var lyrics = util.parseLyric(that.data.lyrics); //lyrics 对象
    var lyricsPrev=[]
    var lyricsNext=[]
    var lyricNow = that.data.lyricNow
    //console.log('currentTime=',currentTime)
  
    //console.log('lyrics.length=', lyrics.length)
    if (lyrics == ' ' || util.isEmptyObject(lyrics) ){
      lyricsPrev.push('暂无歌词')
      lyricsNext.push('暂无歌词')

    }else{
        for(var key in lyrics){
          //if (key < (currentTime) && lyrics[key] != lyricNow){
          if (key <= parseInt(currentTime) ) {  
              lyricsPrev.push(lyrics[key])

          } else if (key > parseInt(currentTime)){
            lyricsNext.push(lyrics[key])
          } else if (key == parseInt(currentTime)) {
            lyricNow = lyrics[key]

          }
        }
        //反转顺序
        lyricsNext.reverse();
    }   
    

    // var str = lyrics[parseInt(currentTime)] 
    // var lyricNow = that.data.lyricNow
    // if(typeof(str)=="undefined"){
    //       //var lyricNow = ''
    //     }else{
    //       //var lyricNow = str + '\n'
    //        lyricNow = str 
    //      }
    

    var timePercent = currentTime / duration * 100;
    var min = parseInt(currentTime / 60);
    var sec = parseInt(currentTime % 60);

    var totalMin = parseInt(duration / 60);
    var totalSec = parseInt(duration % 60);

      if (totalSec < 10) {
        var totalTime = totalMin + ":0" + totalSec;
        } else {
          var totalTime = totalMin + ":" + totalSec;
        }

      if (sec < 10) {
        var playTime = min + ":0" + sec;
        } else {
          var playTime = min + ":" + sec;
        }

      that.rotate();
    
    that.setData({
      //playTime: res.currentPosition,
      value: timePercent,
      playTime: playTime,
      duration: duration,
      totalTime: totalTime,
      currentPosition: currentTime,
      currentPositionInt: parseInt(currentTime),
      //lyricNow: that.data.lyricNow.concat(lyricNow),

      lyricNow: lyricNow,
      //lrcNowId:'lcrNow'

      // btntext:''

      //formatedPlayTime: util.formatTime(res.currentPosition + 1)   ////////////
    })
    
    //////////////////////////////////////////////////
    //显示歌词
    if (that.data.showLyrics == true) {
      
      var width=this.width
      var height=this.height
      var byteLen
     // console.log('width=',width)
      //console.log('height=', height)
      //当前时间之前的歌词
      //动画区高度共300px
      //console.log('lyricsPrev.length=', lyricsPrev.length)
      //console.log('lyricsPrev=', lyricsPrev)

      for (var i = 0; i < 6; i++) {
        //  if(lyricsPrev.length <= i){
        //    ctx.fillText('', 0, 150 - 30 * i)
        //    console.log('i=', i)
        //  }else{
        var tmp = lyricsPrev.pop()
            //console.log('tmp=',tmp)
            //tmp = tmp.trim()
           // tmp = ' hello '.trim()
        
         

          if(i==0){
            
            // var tmp = lyricsPrev.pop()
            ctx.setFillStyle('#1AAD19')
            //ctx.fillRect(0, 0, 100, 75)

           // ctx.setFontSize(20)
            ctx.setFontSize(18)

            if (typeof (tmp) == 'string') { 
              tmp = tmp.trim()
              byteLen = getByteLen(tmp)
             // console.log('len=',byteLen)

              ctx.fillText(tmp, width / 2 - byteLen * 9 / 2, 150-30*i)

              //ctx.fillText(tmp, width / 2 - (tmp.length - 1) * 18 / 2, 150 - 30 * i)

            //ctx.fillText(tmp, 0, 150-30*i)
            } else {
              ctx.fillText('', width / 2, 150 - 30 * i)
            }
           ctx.setFillStyle('darkgray')
           ctx.setFontSize(16)

          }else{

            // console.log('tmp=', tmp)
            if(typeof(tmp)== 'string'){
              tmp = tmp.trim()
              byteLen = getByteLen(tmp)
            //console.log('tmp=', tmp)
            //console.log('tmp.length=', tmp.length)
            ctx.fillText(tmp, width / 2 - byteLen*8/2, 150 - 30 * i)
            //ctx.fillText(tmp, 0, 150 - 30 * i)

              }else {
              ctx.fillText('', width / 2, 150 - 30 * i)
              }

          }
      }

      //当前时间之后的歌词
      for (var i = 1; i <= 5; i++) {
        var tmp = lyricsNext.pop()

        if (typeof (tmp) == 'string') {
          tmp = tmp.trim()
          byteLen = getByteLen(tmp)
        ctx.fillText(tmp, width / 2 - byteLen * 8 / 2, 150 + 30 * i)
        //ctx.fillText(tmp, 0, 150 + 30 * i)
        } else {
          ctx.fillText('', width / 2, 150 + 30 * i)
        }

      }


      //获取字符串长度（汉字算两个字符，字母数字算一个）
      function getByteLen(val) {
        var len = 0;
        for (var i = 0; i < val.length; i++) {
          var a = val.charAt(i);
          if (a.match(/[^\x00-\xff]/ig) != null) {
            len += 2;
          }
          else {
            len += 1;
          }
        }
        return len;
      }

      // ctx.setFillStyle('#1AAD19')
      // //ctx.fillRect(0, 0, 100, 75)
      // ctx.setFontSize(20)
      // ctx.fillText(lyricNow, 160 - 10 * lyricNow.length / 2, 150)


      //console.log('lyrics=',that.data.lyricsText)

      ctx.draw()

      
    }


  })


},





  // audioPause: function () {
  //   this.audioCtx.pause()
  // },
  // audio14: function () {
  //   this.audioCtx.seek(14)
  // },

  audioRestart: function () {

   // this.audioCtx.seek(0)

   // clearInterval(this.updateInterval);

    var that = this;
    
    backgroundAudioManager.seek(0)

    // wx.seekBackgroundAudio({
    //   //position: e.detail.value,
    //   position: 0,
    //   complete: function () {
    //     // 实际会延迟两秒左右才跳过去
    //     setTimeout(function () {
    //       that._enableInterval()
    //     }, 2000)
    //   }
    // })


  },

  seek: function (e) {
    //clearInterval(this.updateInterval)
    var that = this

    wx.seekBackgroundAudio({
      position: e.detail.value,
      complete: function () {
        // 实际会延迟两秒左右才跳过去
        setTimeout(function () {
         // that._enableInterval()
        }, 2000)
      }
    })
  },

  sliderChange: function (e) {
   // clearInterval(this.updateInterval);
    var that = this;
     
    backgroundAudioManager.seek(parseInt(that.data.duration * e.detail.value / 100)) 
     

    //this.audioCtx.seek(that.data.duration*e.detail.value/100)
    //console.log('slider发生change事件，携带值为', e.detail.value)
    //console.log('totalTime=',this.data.totalTime)
    console.log('goto:', parseInt(that.data.duration * e.detail.value / 100))
  },


  audioStop: function () {
    var that = this
    wx.stopBackgroundAudio({
      //dataUrl: dataUrl,
      dataUrl: that.data.src,
      success: function (res) {
        that.setData({
          playing: 2,
          //playTime: 0,
          playTime:'0:00',
          btntext:'播放',
         // formatedPlayTime: util.formatTime(0) //////////////
        })
      }
    })
    app.globalData.backgroundAudioPlaying = false
  },


 

  


  // _enableInterval: function () {
  //   var that = this
    
  //   update()
  //   this.updateInterval = setInterval(update, 500)
  //   function update() {


  //     //获取当前播放音乐的相关属性
  //     wx.getBackgroundAudioPlayerState({
  //       success: function (res) {
  //         var currentTime = res.currentPosition ;
  //         var duration = res.duration
  //         var timePercent = currentTime / duration * 100;
  //         var min = parseInt(currentTime / 60);
  //         var sec = currentTime % 60;

  //         var totalMin = parseInt(duration / 60);
  //         var totalSec = duration % 60;

  //             if (totalSec < 10) {
  //               var totalTime = totalMin + ":0" + totalSec;
  //             } else {
  //               var totalTime = totalMin + ":" + totalSec;
  //             }

  //             if (sec < 10) {
  //               var playTime = min + ":0" + sec;
  //             } else {
  //               var playTime = min + ":" + sec;
  //             }


  //             that.setData({
  //               //playTime: res.currentPosition,
  //               value: timePercent,
  //               playTime:playTime,
  //               duration: duration,
  //               totalTime: totalTime,
  //               currentPosition: res.currentPosition,
  //              // btntext:''

  //               //formatedPlayTime: util.formatTime(res.currentPosition + 1)   ////////////
  //               })

  //          }
  //       })
      
      

  //   }
  // },

  onUnload: function () {
    //clearInterval(this.updateInterval)
    //clearInterval(this.rotater)
    
  },


 

 

  //  function :rotate1() {
  //   var animation2 = wx.createAnimation({
      
  //   })

  //   animation2.rotate(20).step()
  //   this.setData({ animation: this.animation.export() })
  //   //this.animation.rotate(Math.random() * 720 - 360).step()
    
  // },

rotate(){

  
  //this.animation.rotate(Math.random() * 720 - 360).step()

  this.animation.rotate(40*n).step()
  //this.animationTop.rotate(0).step()
  
  this.setData({ 
    animation: this.animation.export(), 
    //animationTop: this.animationTop.export(),
    })

  n++
  
},

/////////////////////////////////////////////////////////
//官方DEMO
/////////////////////////////////////////////////////////
  // onLoad: function () {
  //   this._enableInterval()

  //   if (app.globalData.backgroundAudioPlaying) {
  //     this.setData({
  //       playing: true
  //     })
  //   }
  // },
  // data: {
  //   playing: false,
  //   playTime: 0,
  //   formatedPlayTime: '00:00:00'
  // },

  // play: function (res) {
  //   var that = this
  //   wx.playBackgroundAudio({
  //     dataUrl: dataUrl,
  //     title: '此时此刻',
  //     coverImgUrl: 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000',
  //     complete: function (res) {
  //       that.setData({
  //         playing: true
  //       })
  //     }
  //   })
  //   this._enableInterval()
  //   app.globalData.backgroundAudioPlaying = true
  // },

  // seek: function (e) {
  //   clearInterval(this.updateInterval)
  //   var that = this
  //   wx.seekBackgroundAudio({
  //     position: e.detail.value,
  //     complete: function () {
  //       // 实际会延迟两秒左右才跳过去
  //       setTimeout(function () {
  //         that._enableInterval()
  //       }, 2000)
  //     }
  //   })
  // },

  // pause: function () {
  //   var that = this
  //   wx.pauseBackgroundAudio({
  //     dataUrl: dataUrl,
  //     success: function () {
  //       that.setData({
  //         playing: false
  //       })
  //     }
  //   })
  //   app.globalData.backgroundAudioPlaying = false
  // },

  // stop: function () {
  //   var that = this
  //   wx.stopBackgroundAudio({
  //     dataUrl: dataUrl,
  //     success: function (res) {
  //       that.setData({
  //         playing: false,
  //         playTime: 0,
  //         formatedPlayTime: util.formatTime(0)
  //       })
  //     }
  //   })
  //   app.globalData.backgroundAudioPlaying = false
  // },

  // _enableInterval: function () {
  //   var that = this
  //   update()
  //   this.updateInterval = setInterval(update, 500)
  //   function update() {
  //     wx.getBackgroundAudioPlayerState({
  //       success: function (res) {
  //         that.setData({
  //           playTime: res.currentPosition,
  //           formatedPlayTime: util.formatTime(res.currentPosition + 1)
  //         })
  //       }
  //     })
  //   }
  // },

  // onUnload: function () {
  //   clearInterval(this.updateInterval)
  // },
////////////////////////////////////////////////////////////////////////


  
  
  
 

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
     console.log('onshow checkFavList')
     this.checkFavList()

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





audioDownload: function () {

    var self = this;
    var fileUrl = self.data.src;
    var tempFilePath;

    wx.showToast({
      title: "开始下载...",
      icon: "loading",

    }),
      //wx.showNavigationBarLoading(),
      self.setData({
        loading: true,
        btn3Text: '下载中',
      })

    wx.downloadFile({
      url: fileUrl,

      success: function (res) {
        console.log('downloadFile success, res is', res)

        //wx.hideNavigationBarLoading()


        // wx.playVoice({
        //   filePath: res.tempFilePath
        // })

        self.setData({
          fileSrc: res.tempFilePath
        }),


          //文件存到本地
          tempFilePath = res.tempFilePath
        wx.saveFile({
          // tempFilePath: tempFilePaths[0],
          tempFilePath: tempFilePath,
          success: function (res) {
            var savedFilePath = res.savedFilePath
            console.log('localPath:', savedFilePath)

            self.setData({
              loading: false,
              btn3Text: '下载成功',
            })

            wx.showToast({
              title: "下载成功!"
            }),

              //保存成功后给出文件信息
              wx.getFileInfo({
                success(res) {
                  console.log(res.size)
                  console.log(res.digest)
                }
              })
          },

          fail: function (res) {
            console.log(res);
            self.setData({
              loading: false,
              btn3Text: '下载失败',
            })

            wx.showToast({
              title: "下载失败，可能没空间了",
              icon: "loading",
              duration: 3000
            })
          }

        })

      },


      fail: function ({ errMsg }) {
        console.log('downloadFile fail, err is:', errMsg)
        wx.hideNavigationBarLoading()
        wx.showToast({
          title: "请稍后重试",

        })
      }
    })


  },



})