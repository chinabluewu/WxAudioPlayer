Page({

    data:{

      datas:[],
      hide:false

    },

   //读取收藏记录的信息
   getMyFav(){

     var self = this;

     var likeList = [];
     var key = 'myFav';

     //读取收藏信息
     wx.getStorage({
       key: 'myFav',
       success: function (res) {
         console.log(res.data);
         likeList = res.data;

         var jsonLen = 0;
         for (var data in likeList) {
           jsonLen++
         }

         console.log('len of likelist = ', jsonLen)
         console.log('likeList.lyrics=', likeList.lyrics)

         self.setData({
           //datas: res.fileList,
           datas: likeList,
           hide: true,
         })
       },

       fail: function (res) {
         console.log(res);
         self.setData({
           //datas: res.fileList,
           datas: '',
           hide: true,
         })
         wx.showToast({
           title: '暂无收藏',
         })

       }

     })


   },

    onLoad :function() {

     this.getMyFav()

    //  //读取文件列表
    //  wx.getSavedFileList({
    //    success: function (res) {
    //      console.log(res.fileList)
    //      var list = res.fileList;
    //      console.log('len of list:', list.length)
    //      //var date = Date(1505916233000);

    //      console.log('list[0]=', list[0])

    //      for (var i = 0; i < list.length; i++) {
    //        //var date = new Date(list[i].createTime*1000)  //IDE上的时间戳需要*1000
    //        var date = new Date(list[i].createTime)
    //        list[i].createTime = date.toLocaleDateString() + ' ' + date.toTimeString().substr(0, 8);
    //        list[i].size = (list[i].size / (1024 * 1024)).toFixed(1) + 'M';

    //      }
    //      console.log('list[0].createTime=', list[0].createTime)
    //      console.log('list[0].size=', list[0].size)

    //      self.setData({
    //        //datas: res.fileList,
    //        datas: list,
    //        hide: true,
    //      })
    //    }
    //  })
     
   },

   onShow:function(){
     this.getMyFav()

   },




    // scrollView EventHandler
        upper: function(e) {
            // console.log(e)
          // console.log("upper")
          // var self = this;
          // self.getMyFav()

          
        },
        lower: function(e) {
           console.log(e)
          //  console.log("lower")
          //  var self = this;
          //  self.getMyFav()
        },
        scroll: function(e) {
           // console.log(e)
            // console.log("哈哈哈哈哈")

            

        },

         


})


// var self = this;
// var url = 'http://c.m.163.com/recommend/getChanListNews?channel=T1457068979049&fn=3&passport=JcFEbJV42ahS7jdcT9vZpbA4%2F9KVLFYQL80lbIO6OE1JIqQNgfEC%2FWRVAHVu3xy3rqJv2nCCD2QqQsfBWgSZWQ%3D%3D&devId=Mk119XLnjjUmJ6L3FxYE3ryK4ttyviIGCzbI3myChofd37V%2Fodl6EmNCrUxTtHG2&offset=0&size=30&version=18.0&spever=false&net=wifi&lat=BFUoxL%2F37rMI%2Fv9MpBUrRg%3D%3D&lon=pUmKDmBKaGKeuh74DI4nrQ%3D%3D&ts=1483975657&sign=Evgvdo%2Blfo0JhrbmusywkPe6IIvG%2BTsT0TMucZfhKut48ErR02zJ6%2FKXOnxX046I&encryption=1&canal=appstore';

// //network request
// wx.request({
//   url: url,
//   header: {
//     "Content-Type": "application/json"
//   },
//   method: "GET",
//   data: {

//   },
//   success: function (res) {
//     //get data 
//     var newData = res.data;
//     console.log(newData.视频);
//     self.setData({
//       datas: newData.视频,
//     })

//     setTimeout(function () {
//       self.setData({
//         hide: true
//       })
//     }, 500)
//   }
// });

