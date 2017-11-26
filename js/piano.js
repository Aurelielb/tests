(function () {
    let oDrawZone = document.getElementById("piano");
    let oCtxt = oDrawZone.getContext('2d');

    let aKeys = ["do","ré","mi","fa","sol","la","si"];
    let aBKeys = ["do#","ré#",null,"fa#","sol#","la#",null];
    let iRepeat = 2;
    let aBlackNotes = [];
    let aBlackKeys = [];
    for (let i = 0; i < iRepeat; i++) {
        aBlackNotes = aBlackNotes.concat(aBKeys);
    }
    let iNbWhiteKeys = aKeys.length * iRepeat;
    let keyWidth = oDrawZone.clientWidth / iNbWhiteKeys;
    let iDrawHeight = oDrawZone.clientHeight;
    let aWhiteKeys = [];
    oDrawZone.setAttribute("width", oDrawZone.clientWidth+"px");
    oDrawZone.setAttribute("height", iDrawHeight+"px");

    let drawKey = function (start,end,type,place) {
        let iHeight = ( type == 'white' ? 1 : 0.65 );
        let iLength = iDrawHeight*iHeight;
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
        let source = createSource('medias/wav/key'+num+'.wav', 'audio/wav');
        // let source2 = createSource('medias/key'+num+'.mp3', 'audio/mp3');
        // let source3 = createSource('medias/key'+num+'.ogg', 'audio/ogg');
        let audio = createAudio('key'+num);
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
        let posX = i * keyWidth;
        drawKey(posX, posX + keyWidth, "white", i + 1);
    }
    let sBlackPlace = keyWidth*0.75;
    for (let i = 0; i < iNbWhiteKeys; i ++) {
        let posX = i * keyWidth;
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
