
var app = getApp()
var currentPage = 0;
var loadType = 0;
var searchWord;
var dataArr;

Page({

    data:{
//body
     datas: [],
     linkShow: true,
     linkText:'',
     //linkHidden: app.globalData.backgroundAudioPlaying,
//modal     
     modalHidden: true,
//loading
     hide: false,     
//data end
     imgSrc : "../../images/icon-130.png",
     inputShowed: false,
     inputVal: ""

    },
    
    // onPullDownRefresh: function () {
    //   wx.showToast({
    //     title: ' 载入中...',
    //     icon: 'loading'
    //   })
    //   console.log('onPullDownRefresh', new Date())
    // },
     
    link:function(){
       
    },

    onShow:function(){

      this.setData({
        linkShow: app.globalData.backgroundAudioPlaying,
        linkText: app.globalData.songName,
      })
    },

    //view load
    onLoad :function() {

    //http://c.m.163.com//nc/article/headline/T1348648037603/0-20.html
    loadType = 0;
    this.getContentData();

    this.setData({
      linkShow:app.globalData.backgroundAudioPlaying,
    })
    
    },

    // scrollView EventHandler
        upper: function(e) {
             console.log(e)
             this.getContentData();
             //console.log('audio---play=',app.globalData.backgroundAudioPlaying)
             
        },
        lower: function(e) {
           console.log(e)
          //  currentPage += 10;
          //  loadType = 1;
          //   this.setData({
          //   hide: false
          // })
          //  this.getContentData();
          
        },
        scroll: function(e) {
           // console.log(e)
           // console.log("哈哈哈哈哈")
        },

      //modal changed
         modalChange: function(e) {
          this.setData({
            modalHidden: true
          })},



          getContentData :function () {

              var self = this;
              var number = 10+currentPage;
              //var url = 'http://c.m.163.com//nc/article/headline/T1348647853363/' +currentPage+ '-' + number +'.html';
              //var url = 'http://c.m.163.com//nc/article/headline/T1348647853363/0-40.html' 
              //var url = 'https://www.betterguitars.com/zms'
              var url = 'https://www.betterguitars.com/9kufuyin';
              console.log(url);
            //network request
            wx.request( {
                  url: url,
                  header: {
                    "Content-Type": "application/json"
                  },
                  method: "GET",
                  data: {
                    
                  },
                  success: function( res ) {
                    //get data 
                    var newData = res.data;
                    dataArr = newData.lists;
                    // if (!loadType) {
                      var jsonLen=0;
                      for(var data in dataArr)
                      {
                        //console.log(dataArr[jsonLen].id)
                        //dataArr[jsonLen].url = 'https://api.zanmeishi.com/song/p/' + dataArr[jsonLen].id + '.mp3';
                         jsonLen++
                         //data.id = 'https://api.zanmeishi.com/song/p/' + data.id + '.mp3';
                        // console.log(dataArr[data].url)
                      }
                      console.log('len of dataArr', jsonLen)
                     //  console.log(dataArr)
                    // } else {
                    //   var tempArr = newData.T1348647853363;
                    //   for (var i = 0; i < tempArr.count-1; i++) {
                    //     dataArr.push(tempArr[i]);
                    //   }
                     
                     // console.log(dataArr)
                     
                    // }

                    //保存歌曲列表
                    self.setData( {
                      datas: dataArr,
                    })
                    
                    // console.log(self.data.image_one)
                    // self.update()

                    setTimeout (function () {
                      self.setData({
                      hide: true
                    })
                    }, 500)
                  },

                  fail: function ({ errMsg }) {
                    console.log('artist request fail, err is:', errMsg)
                    //wx.hideNavigationBarLoading()
                    self.setData({
                      hide: true
                    })
                    wx.showToast({
                      title: "网络有点卡，请稍后重试",

                    })

                  }

                });
    }


})



