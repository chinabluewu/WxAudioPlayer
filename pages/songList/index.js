
var app = getApp()
var currentPage = 0;
var loadType = 0;
var searchWord;
var dataArr;

Page({

    data:{

      url:'', //请求该url,获取乐团的歌曲列表
      artistId:'',
      linkShow:false,
      linkText:'',
//body
     datas: [],
//modal     
     modalHidden: true,
//loading
     hide: false,     
//data end
     imgSrc : "../../images/icon-130.png",
     inputShowed: false,
     inputVal: ""

    },
    
 
     
    link:function(){
       
    },


    onShow: function () {

      this.setData({
        linkShow: app.globalData.backgroundAudioPlaying,
        linkText: app.globalData.songName,
      })
    },

    //view load
    onLoad :function(options) {
   
      var self =this;

      var artistId = options.artistId
      var img = options.img

      self.setData({
        artistId: artistId,
        imgSrc:img,
      })

    //http://c.m.163.com//nc/article/headline/T1348648037603/0-20.html
    loadType = 0;
    this.getContentData();
    
    },

    // scrollView EventHandler
        upper: function(e) {
            // console.log(e)
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
              var artistId = self.data.artistId;
              var number = 10+currentPage;
              //var url = 'http://c.m.163.com//nc/article/headline/T1348647853363/' +currentPage+ '-' + number +'.html';
              //var url = 'http://c.m.163.com//nc/article/headline/T1348647853363/0-40.html' 
              //var url = 'https://www.betterguitars.com/zms'
              var url = 'https://www.betterguitars.com/9kufuyinArtist?artistId='+artistId;
              

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

                    dataArr = newData.songs;

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
                    console.log(' songList request fail, err is:', errMsg)
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



