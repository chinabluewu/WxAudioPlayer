
var app = getApp()
var currentPage = 0;
var loadType = 0;
var searchWord;
var dataArr;

Page({

    data:{

      linkShow:false,
      linkText:'',
//body
     datas: [],

     array: ['九酷福音网','赞美诗网','基督教歌曲网' ],
     arrayIndex:0,

//modal     
     modalHidden: true,
//loading
     hide: true,     
//data end
     imgSrc : "../../images/icon-130.png",
     inputShowed: false,
     inputVal: ""

    },


    bindPickerChange: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)

      this.setData({
        arrayIndex: e.detail.value,
        datas:[],
      })
    },
    
    showInput: function () {
      this.setData({
        inputShowed: true
      });
    },

    hideInput: function () {
      this.setData({
        inputVal: "",
        inputShowed: false
      });
    },

    clearInput: function () {
      this.setData({
        inputVal: ""
      });
    },
    
    searchInput: function(){
      this.getContentData();
      this.setData({
        hide: false
      });
    },

    inputTyping: function (e) {
      this.setData({
        inputVal: e.detail.value
      });
      searchWord = e.detail.value
      //console.log('searchword =',searchWord)
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
    onLoad :function() {

    //http://c.m.163.com//nc/article/headline/T1348648037603/0-20.html
    loadType = 0;
    //this.getContentData();
    
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
      var number = 10+currentPage;


      if (self.data.arrayIndex==0){
        //var url = 'https://www.betterguitars.com/zms'
      var url = 'https://www.betterguitars.com/9kufuyinSearch?searchword=' + searchWord;
      } else if (self.data.arrayIndex==1){
        
        var url = 'https://www.betterguitars.com/zms?searchword=' + searchWord;
      } else if (self.data.arrayIndex == 2) {

        var url = 'https://www.betterguitars.com/jdjgq?searchword=' + searchWord;
      }
      


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
          //var self = this
          var newData = res.data;
          dataArr = newData.songs;

          // if (!loadType) {
            var jsonLen=0;
            for(var key in dataArr)
            {
              //来自赞美诗网
              if (self.data.arrayIndex == 1){
              //console.log(dataArr[jsonLen].id)
              dataArr[jsonLen].url = 'https://api.zanmeishi.com/song/p/' + dataArr[jsonLen].songId + '.mp3';
              }
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
            console.log(dataArr)
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
          }, 100)

          if (jsonLen == 0) {
            wx.showToast({
              title: '未找到相关歌曲，请换个曲库找找看',
              icon: 'loading',
              duration: 3000
            })
          }
        },

        fail: function ({ errMsg }) {
          console.log('downloadFile fail, err is:', errMsg)
          //wx.hideNavigationBarLoading()
          self.setData({
            hide: true
          })
          wx.showToast({
            title: "请稍后重试",

          })

        }

      });
    }


})



