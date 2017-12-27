function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}


function formatMusicTime(time) {
  if (typeof time !== 'number' || time < 0) {
    return time
  }

  var hour = parseInt(time / 3600)
  time = time % 3600
  var minute = parseInt(time / 60)
  time = time % 60
  var second = time

  return ([hour, minute, second]).map(function (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }).join(':')
}

function formatLocation(longitude, latitude) {
  if (typeof longitude === 'string' && typeof latitude === 'string') {
    longitude = parseFloat(longitude)
    latitude = parseFloat(latitude)
  }

  longitude = longitude.toFixed(2)
  latitude = latitude.toFixed(2)

  return {
    longitude: longitude.toString().split('.'),
    latitude: latitude.toString().split('.')
  }
}




function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}


function isEmptyObject(obj) {
  for (var key in obj) {
    return false;
  }
  return true;
}


function parseLyric(lrc) {
  var lyrics = lrc.split("\n");
  var lrcObj = {};
  for (var i = 0; i < lyrics.length; i++) {
    var lyric = decodeURIComponent(lyrics[i]);
    var timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
    var timeRegExpArr = lyric.match(timeReg);
    if (!timeRegExpArr) continue;
    var clause = lyric.replace(timeReg, '');

    for (var k = 0, h = timeRegExpArr.length; k < h; k++) {
      var t = timeRegExpArr[k];
      var min = Number(String(t.match(/\[\d*/i)).slice(1)),
        sec = Number(String(t.match(/\:\d*/i)).slice(1));
      var time = min * 60 + sec;
      lrcObj[time] = clause;
    }
  }
  return lrcObj;
}


function renderLyric(lrc) {
 // lyric.html("");
  var lyricLineHeight = 27,
    offset = lyric_wrap.offset().height * 0.4;

    
  music.lyric.fetch(function (data) {
    music.lyric.parsed = {};
    var i = 0;

    for (var k in data) {
      var txt = data[k];
      if (!txt) txt = "&nbsp;";

      music.lyric.parsed[k] = {
        index: i++,
        text: txt,
        top: i * lyricLineHeight - offset
      };

      var li = $("<li>" + txt + "</li>");

      lyric.append(li);
    }

    $player.bind("timeupdate", updateLyric);
  }, function () {
    lyric.html("<li style='text-align: center'>歌词加载失败</li>");
  });

}


module.exports = {
  formatTime: formatTime,
  formatMusicTime: formatMusicTime,
  formatLocation: formatLocation,
  parseLyric: parseLyric,
  isEmptyObject: isEmptyObject

}
