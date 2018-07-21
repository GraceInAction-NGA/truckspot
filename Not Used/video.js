  navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia;

  var recBtn = document.querySelector('button#rec');
  var pauseResBtn = document.querySelector('button#pauseRes');
  var stopBtn = document.querySelector('button#stop');
  var uploadBtn = document.querySelector('button#upload');

  var videoElement = document.querySelector('video');
 // var dataElement = document.querySelector('#data');
 // var downloadLink = document.querySelector('a#downloadLink');
  //console.log(downloadLink);

  videoElement.controls = false;

    if(getBrowser() == "Chrome"){
    var constraints = {"audio": false, "video": { "mandatory": { "minWidth": 320, "maxWidth": 320, "minHeight": 240,"maxHeight": 240 }, "optional": [] } };
    }else if(getBrowser() == "Firefox"){
      var constraints = {audio: true,video: { width: { min: 320, ideal: 320, max: 1280 }, height: { min: 240, ideal: 240, max: 720 }}}; 
    }


  function onBtnRecordClicked (){
    if (typeof MediaRecorder === 'undefined' || !navigator.getUserMedia) {
      alert('Sorry! This demo requires Firefox 30 and up or Chrome 47 and up.');
    }else {
      navigator.getUserMedia(constraints, startRecording, errorCallback);
    }
  }

  var mediaRecorder;
  var chunks = [];
  var count = 0;
  var formData= new FormData();
  
  function startRecording(stream) {
  if (typeof MediaRecorder.isTypeSupported == 'function'){
    /*
      MediaRecorder.isTypeSupported is a function announced in https://developers.google.com/web/updates/2016/01/mediarecorder and later introduced in the MediaRecorder API spec http://www.w3.org/TR/mediastream-recording/
    */
  if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
      var options = {mimeType: 'video/webm;codecs=vp9'};
    } else if (MediaRecorder.isTypeSupported('video/webm;codecs=h264')) {
      var options = {mimeType: 'video/webm;codecs=h264'};
    } else  if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
      var options = {mimeType: 'video/webm;codecs=vp8'};
    }
    console.log('Using '+options.mimeType);
    mediaRecorder = new MediaRecorder(stream, options);
  }else{
    console.log('isTypeSupported is not supported, using default codecs for browser');
    mediaRecorder = new MediaRecorder(stream);
  }
  pauseResBtn.textContent = "Pause";
  mediaRecorder.start(10);

  var url = window.URL || window.webkitURL;
  videoElement.src = url ? url.createObjectURL(stream) : stream;
  videoElement.play();



  mediaRecorder.ondataavailable = function(e) {
   // console.log('Data available...');
   // console.log(e.data);
  //  console.log(e.data.type);
  //  console.log(e);
    chunks.push(e.data);
  };

  mediaRecorder.onerror = function(e){
    console.log('Error: ' + e);
    console.log('Error: ', e);
  };


  mediaRecorder.onstart = function(){
    console.log('Started & state = ' + mediaRecorder.state);
  };

  mediaRecorder.onstop = function(){
    console.log('Stopped  & state = ' + mediaRecorder.state);

    var blob = new Blob(chunks, {type: "video/webm"});

    chunks = [];

    var videoURL = window.URL.createObjectURL(blob);

    var rand =  Math.floor((Math.random() * 10000000));
    var name  = "video_"+rand+".webm" ;

    formData.append('fname',name)
    formData.append('data', blob);

  };

  mediaRecorder.onpause = function(){
    console.log('Paused & state = ' + mediaRecorder.state);
  }

  mediaRecorder.onresume = function(){
    console.log('Resumed  & state = ' + mediaRecorder.state);
  }

  mediaRecorder.onwarning = function(e){
    console.log('Warning: ' + e);
  };
}

function getBrowser(){
  var nVer = navigator.appVersion;
  var nAgt = navigator.userAgent;
  var browserName  = navigator.appName;
  var fullVersion  = ''+parseFloat(navigator.appVersion);
  var majorVersion = parseInt(navigator.appVersion,10);
  var nameOffset,verOffset,ix;

  // In Opera, the true version is after "Opera" or after "Version"
  if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
   browserName = "Opera";
   fullVersion = nAgt.substring(verOffset+6);
   if ((verOffset=nAgt.indexOf("Version"))!=-1)
     fullVersion = nAgt.substring(verOffset+8);
  }
  // In MSIE, the true version is after "MSIE" in userAgent
  else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
   browserName = "Microsoft Internet Explorer";
   fullVersion = nAgt.substring(verOffset+5);
  }
  // In Chrome, the true version is after "Chrome"
  else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
   browserName = "Chrome";
   fullVersion = nAgt.substring(verOffset+7);
  }
  // In Safari, the true version is after "Safari" or after "Version"
  else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
   browserName = "Safari";
   fullVersion = nAgt.substring(verOffset+7);
   if ((verOffset=nAgt.indexOf("Version"))!=-1)
     fullVersion = nAgt.substring(verOffset+8);
  }
  // In Firefox, the true version is after "Firefox"
  else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
   browserName = "Firefox";
   fullVersion = nAgt.substring(verOffset+8);
  }
  // In most other browsers, "name/version" is at the end of userAgent
  else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) <
       (verOffset=nAgt.lastIndexOf('/')) )
  {
   browserName = nAgt.substring(nameOffset,verOffset);
   fullVersion = nAgt.substring(verOffset+1);
   if (browserName.toLowerCase()==browserName.toUpperCase()) {
    browserName = navigator.appName;
   }
  }
  // trim the fullVersion string at semicolon/space if present
  if ((ix=fullVersion.indexOf(";"))!=-1)
     fullVersion=fullVersion.substring(0,ix);
  if ((ix=fullVersion.indexOf(" "))!=-1)
     fullVersion=fullVersion.substring(0,ix);

  majorVersion = parseInt(''+fullVersion,10);
  if (isNaN(majorVersion)) {
   fullVersion  = ''+parseFloat(navigator.appVersion);
   majorVersion = parseInt(navigator.appVersion,10);
  }


  return browserName;
}

function onBtnRecordClicked (){
   if (typeof MediaRecorder === 'undefined' || !navigator.getUserMedia) {
    alert('MediaRecorder not supported on your browser, use Firefox 30 or Chrome 49 instead.');
  }else {

    navigator.getUserMedia(constraints, startRecording, errorCallback);

    recBtn.disabled = true;
    pauseResBtn.disabled = false;
    stopBtn.disabled = false;
  }
}

function onBtnStopClicked(){
  mediaRecorder.stop();
  videoElement.controls =true ;

  recBtn.disabled = false;
  pauseResBtn.disabled = true;
  stopBtn.disabled = true;
  uploadBtn.disabled=false;
}

function onPauseResumeClicked(){
  if(pauseResBtn.textContent === "Pause"){
    console.log("pause");
    pauseResBtn.textContent = "Resume";
    mediaRecorder.pause();
    stopBtn.disabled = true;
  }else{
    console.log("resume");
    pauseResBtn.textContent = "Pause";
    mediaRecorder.resume();
    stopBtn.disabled = false;
  }
  recBtn.disabled = true;
  pauseResBtn.disabled = false;
}

function errorCallback(error){
  console.log('navigator.getUserMedia error: ', error); 
}

function onVideoUploadClicked(){

  var storageRef = firebase.storage().ref('sweet_gifs/' + formData.get("fname"));
  
  var task = storageRef.put(formData.get("data"));
  task.on('state_changed',

    function progress(snapshot){
       var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    },

    function error(err){

      console.log("error"+" "+err);
    },
    function complete(){
       console.log("complete");
    }
  ); 
}

function onBtnAudioClicked(){
  window.location="audio.html";
}