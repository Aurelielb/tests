(function () {
    var oDrawZone = document.getElementById("piano");
    var oCtxt = oDrawZone.getContext('2d');

    var aKeys = ["do","ré","mi","fa","sol","la","si"];
    var aBKeys = ["do#","ré#",null,"fa#","sol#","la#",null];
    var iRepeat = 2;
    var aBlackNotes = [];
    var aBlackKeys = [];
    for (let i = 0; i < iRepeat; i++) {
        aBlackNotes = aBlackNotes.concat(aBKeys);
    }
    var iNbWhiteKeys = aKeys.length * iRepeat;
    var keyWidth = oDrawZone.clientWidth / iNbWhiteKeys;
    var iDrawHeight = oDrawZone.clientHeight;
    var aWhiteKeys = [];
    oDrawZone.setAttribute("width", oDrawZone.clientWidth+"px");
    oDrawZone.setAttribute("height", iDrawHeight+"px");

    var drawKey = function (start,end,type,place) {
        var iHeight = ( type == 'white' ? 1 : 0.65 );
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
        if (type == 'black') {
          oCtxt.fillStyle = "#000";
          oCtxt.fill();
        }
// ajout fichiers sons
        if (type == 'black') {
          var num = (10 > place ? '0' + place : place) + 'b';
        } else {
          var num = (10 > place ? '0' + place : place);
        }
        var source = createSource('medias/wav/key'+num+'.wav', 'audio/wav');
        // var source2 = createSource('medias/key'+num+'.mp3', 'audio/mp3');
        // var source3 = createSource('medias/key'+num+'.ogg', 'audio/ogg');
        var audio = createAudio('key'+num);
        audio.append(source);
        //audio.append(source2);
        // audio.append(source3);
        document.getElementsByTagName("body")[0].append(audio);
        if (type == 'black') {
          aBlackKeys.push([start,end,iLength,audio]);
        } else {
          aWhiteKeys.push([start,end,iLength,audio]);
        }
    }

    for (let i = 0; i < iNbWhiteKeys; i ++) {
        var posX = i * keyWidth;
        drawKey(posX, posX + keyWidth, "white", i + 1);
    }
    var sBlackPlace = keyWidth*0.75;
    for (let i = 0; i < iNbWhiteKeys; i ++) {
        var posX = i * keyWidth;
        if (null != aBlackNotes[i]) {
          drawKey(posX + sBlackPlace, posX + keyWidth/2 + sBlackPlace, "black", i + 1);
        }
    }

    oDrawZone.onclick = checkKeys;
    oDrawZone.ontouchmove = checkTouchKeys;
    function checkTouchKeys(e) {
      for (let key in e.touches) {
        let evt = e;
        evt.offsetX = e.touches[key].clientX;
        evt.offsetY = e.touches[key].clientY;
        checkKeys(evt);
      }
    }
    function checkKeys(e) {
      // les noires doivent être checkées en premier
            for (let i = 0; i < aWhiteKeys.length; i ++) {
              if (
                'undefined' != typeof aBlackKeys[i]
                && e.offsetX >= aBlackKeys[i][0] && e.offsetX < aBlackKeys[i][1]
                && e.offsetY <= aBlackKeys[i][2]
              ) {
                audio = aBlackKeys[i][3];
                break;
              } else if (e.offsetX >= aWhiteKeys[i][0] && e.offsetX < aWhiteKeys[i][1]) {
                audio = aWhiteKeys[i][3];
                //alert('ding ' + i);
                break;
              }
            }
            if ('undefined' != typeof audio) {
              audio.play();
              audio.currentTime = 0;
            }
    }
    function createSource(sSrc, sType) {
      let source = document.createElement('source');
      source.setAttribute('src', sSrc);
      source.setAttribute('type', sType);
      return source;
    }
    function createAudio(sId) {
      let audio = document.createElement('audio');
      audio.setAttribute('id', sId);
      return audio;
    }
})();
