// Get reference to databse
var database = firebase.firestore();

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
if ("geolocation" in navigator) {
  /* geolocation is available */
  navigator.geolocation.getCurrentPosition(function (position) {
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
function upload() {
  // Clear Errors
  $(".error-block").hide();
  $(".has-error").removeClass("has-error");

  // Get data from form
  const formData = $("form").serializeArray();

  if (!isFormValidated(formData)) return;

  // Prepare data to upload
  const data = mapFormData(formData);

  // Upload Data
  database.collection("reports")
    .add(data)
    .then((ref) => {
      incrementReportCount();
      if (data.hasMedia) {
        uploadMedia(ref.id);
      } else {
        redirect()
      }
    }).catch((error) => {
      console.error("Error", error);
      alert("Data Upload Failed");
    });
};

function incrementReportCount() {
  database.collection("counts").get().then((querySnapshot) => {
    const id = querySnapshot.doc[0].id;
    const count = querySnapshot.doc[0].count + 1;
    database.collection("counts").get(id).update({
      count: count
    });
  });
}

function uploadMedia(ref) {
  const mediaFiles = $("input[type='file']")[0].files;
  const task = storage.ref("/" + ref).put(mediaFiles[0]);

  task.on("state_changed",
    (snapshot) => {
      var newGraph = new ldBar(".ldBar");
      newGraph.set((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
    },
    (error) => {
      console.error("Error", error);
      alert("Media Upload Failed");
    },
    () => {
      redirect();
    }
  );
}

function redirect() {
  var newGraph = new ldBar(".ldBar");
  newGraph.set(100);
  setTimeout(() => window.location = "data.html", 1000);
}

function mapFormData(formData) {
  const mediaFiles = $("input[type='file']")[0].files;
  const hasMedia = mediaFiles.length != 0;

  let data = {};
  $(formData).each(function (index, obj) {
    data[obj.name] = obj.value;
  });

  data["time_stamp"] = firebase.firestore.FieldValue.serverTimestamp();
  data["hasMedia"] = hasMedia;
  data["media_name"] = hasMedia ? mediaFiles[0].name : null;
  data["media_type"] = hasMedia ? mediaFiles[0].type : null;

  return data;
}

function isFormValidated(formData) {
  var isValid = true;
  // Check Data
  for (var i = 0; i < formData.length; i++) {
    if (formData[i].name == "date" && formData[i].value == "") {
      isValid = false;
      $("input[name='date']").parent().addClass("has-error").find(".error-block").show();
    } else if (formData[i].name == "duration_range" && formData[i].value == "") {
      isValid = false;
      $("input[name='duration_range']").parent().addClass("has-error").find(".error-block").show();
    } else if (formData[i].name == "nearest_address") {
      // var re = new RegExp("^((\\d+) (.+)), (.+), ((.+) ([\\d-]+))$");
      // if (re.test(formData[i].value)) {
        // console.log("Valid");
      // } else {
        // isValid = false;
        // $("input[name='nearest_address']").parent().addClass("has-error").find(".error-block").show();
        // $("#finding").hide();
      // }
    } else if (formData[i].name == "description" && formData[i].value == "") {
      isValid = false;
      $("textarea[name='description']").parent().addClass("has-error").find(".error-block").show();
    }
  }

  if (!isValid) {
    $("#loadingScreen").hide();
  } else {
    $("#loadingScreen").show();
  }

  return isValid;
}

$("#upload-media").change(function () {
  var fileName = $(this)[0].files[0].name;
  $(this).prev().html('<span class="glyphicon glyphicon-upload"></span> ' + fileName);
});
