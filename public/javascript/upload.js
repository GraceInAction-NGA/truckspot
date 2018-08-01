/* Uploads images and data to Firebase Storage */

/* Configuring Firebase */
var config = {
  apiKey: "AIzaSyBRypIzyl38XXbHloKeow9n8oSbWHxOSZo",
  authDomain: "truckstop-a27e6.firebaseapp.com",
  databaseURL: "https://truckstop-a27e6.firebaseio.com",
  projectId: "truckstop-a27e6",
  storageBucket: "truckstop-a27e6.appspot.com",
  messagingSenderId: "498032762100"
};

firebase.initializeApp(config);

// Get reference to databse
var database = firebase.database();

// Get reference to storage
var storage = firebase.storage();

// Get Date (MM/DD/YYYY)
var date = new Date().toISOString().split("T");

// Correctly format date on Safari Browsers
var vendor = window.navigator.vendor;
var isSafari = vendor.includes("Apple");
if (isSafari) {
  var dateParts = date[0].split("-");
  var safariDate = dateParts[1] + "/" + dateParts[2] + "/" + dateParts[0];
  $("#date").val(safariDate);
} else {
  $("#date").val(date[0]);
}

// Get Geolocation (lat, long)
var pos = null;
if ("geolocation" in navigator) {
  /* geolocation is available */
  navigator.geolocation.getCurrentPosition(function (position) {
    console.log(position.coords.latitude);
    console.log(position.coords.longitude);
    pos = position;
    console.log(position);

    // Get Address from Geolocation
    $.getJSON('https://nominatim.openstreetmap.org/reverse', {
      lat: position.coords.latitude,
      lon: position.coords.longitude,
      format: 'json',
    }, function (result) {
      $("#finding").text("Found! Correct if inaccurate.")
      $("#nearestAddress").val(result.address.house_number + " " + result.address.road + ", " + result.address.city + ", " + result.address.state + " " + result.address.postcode);
    });

  }, function (position) {
    $("#finding").text("")
  });
} else {
  $("#finding").text("We couldn't locate you! Please provide the address.")
}

// Upload Function
function upload(path, redirectPath) {
  // Get number of reports uploaded
  firebase.database().ref('/' + path + '/count').once('value').then(function (snapshot) {
      var count = snapshot.val();
      // Get data from form
      var formData = $("form").serializeArray();

      var isValid = true;
      $(".error-block").hide();
      $(".has-error").removeClass("has-error");
      // Check Data
      for (var i = 0; i < formData.length; i++) {
        if (formData[i].name == "date" && formData[i].value == "") {
          isValid = false;
          $("input[name='date']").parent().addClass("has-error").find(".error-block").show();
        } else if (formData[i].name == "duration_range" && formData[i].value == "") {
          isValid = false;
          $("input[name='duration_range']").parent().addClass("has-error").find(".error-block").show();
        } else if (formData[i].name == "nearest_address") {
          var re = new RegExp("^((\\d+) (.+)), (.+), ((.+) ([\\d-]+))$");
          if (re.test(formData[i].value)) {
            console.log("Valid");
          } else {
            isValid = false;
            $("input[name='nearest_address']").parent().addClass("has-error").find(".error-block").show();
            $("#finding").hide();
          }
      } else if (formData[i].name == "description" && formData[i].value == "") {
        isValid = false;
        $("textarea[name='description']").parent().addClass("has-error").find(".error-block").show();
      }
    }

    if (!isValid) {
      $("#loadingScreen").hide();
      return false;
    } else {
      $("#loadingScreen").show();
    }

    // Increment number of reports uploaded
    database.ref("/" + path + "/count").set(count + 1);

    // Prepare data to upload
    var data = {}; $(formData).each(function (index, obj) {
      data[obj.name] = obj.value;
    });

    // Prepare Media for upload
    var mediaFiles = $("input[type='file']")[0].files;

    console.log(mediaFiles);
    var isMediaUploaded = false;
    var isDataUploaded = false; data["time_stamp"] = firebase.database.ServerValue.TIMESTAMP
    // Check if Media exists
    if (mediaFiles.length != 0) {
      // Upload Media
      var task = storage.ref("/" + path + "/report" + count + "/" + mediaFiles[0].name).put(mediaFiles[0]);
      data["file_name"] = mediaFiles[0].name;
      data["file_type"] = mediaFiles[0].type;
      task.on("state_changed", function (snapshot) {
        var newGraph = new ldBar(".ldBar");
        newGraph.set((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        if (snapshot.bytesTransferred == snapshot.totalBytes) {
          isMediaUploaded = true;
        }
        if (isDataUploaded && isMediaUploaded) {
          setTimeout(function () {
            window.location = redirectPath;
          }, 1000);
        }
      });
    } else {
      isMediaUploaded = true;
      var newGraph = new ldBar(".ldBar");
      newGraph.set(100);
    }
    // Upload Data
    database.ref("/" + path + "/report" + count).set(data, function (err) {
      if (err) {
        alert("Upload of data failed");
      } else {
        isDataUploaded = true;
        if (isDataUploaded && isMediaUploaded) {
          window.location = redirectPath;
        }
      }
    });
  });
}

$("#upload-media").change(function(){
    var fileName = $(this)[0].files[0].name;
    console.log($(this).prev());
    $(this).prev().html('<span class="glyphicon glyphicon-upload"></span> ' + fileName);
 });

/* truckIdle.html */
function onBtnIdleFormSubmitClicked() {
  upload("idle_truck", "idle-data.html");
}

/* truckSound.html */
function onBtnAudioFormSubmitClicked() {
  upload("loud_truck", "audio-data.html");
}
