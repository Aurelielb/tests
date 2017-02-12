$(document).ready(function () {
    var oDrawZone = $("#piano");
    var oCtxt = oDrawZone.get(0).getContext('2d');

    var aKeys = ["do","ré","mi","fa","sol","la","si"];
    var iRepeat = 2;
    var iNbWhiteKeys = aKeys.length * iRepeat;
    var keyWidth = oDrawZone.width() / iNbWhiteKeys;
    var iDrawHeight = oDrawZone.height();
    var aWhiteKeys = [];
    oDrawZone.attr("width", oDrawZone.width()+"px");
    oDrawZone.attr("height", iDrawHeight+"px");

    var drawKey = function (start,end,type) {
        var iHeight = ( type == 'white' ? 1 : 0.5 );
        var iLength = iDrawHeight*iHeight;
        oCtxt.lineWidth = 2;
        oCtxt.strokeStyle = "#000";
        oCtxt.beginPath();
        oCtxt.moveTo(start,0);
        oCtxt.lineTo(end,0);
        oCtxt.lineTo(end,iLength);
        oCtxt.lineTo(start,iLength);
        oCtxt.closePath();
        oCtxt.stroke();
        var source = $('<source src="medias/key01.wav" type="audio\wav">');
        var audio = $('<audio id="key'+aWhiteKeys.length+'">');
        audio.append(source);
        $(document).append(audio);
        aWhiteKeys.push([start,end,iLength,audio]);
    }

    for (let i = 0; i < iNbWhiteKeys; i ++) {
        var posX = i * keyWidth;
        drawKey(posX, posX + keyWidth, "white");
    }
    oDrawZone.on('click', function(e){
      for (let i = 0; i < aWhiteKeys.length; i ++) {
        if (e.offsetX >= aWhiteKeys[i][0] && e.offsetX < aWhiteKeys[i][1]) {
          audio = aWhiteKeys[i][3];
          audio.play();
          console.log((i/iNbWhiteKeys)*aKeys.length*iRepeat);
          alert('ding ' + i);
          break;
        }
      }
    });
});
