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
  navigator.geolocation.getCurrentPosition(({coords}) => {
    const request = {
      lat: coords.latitude,
      lon: coords.longitude,
      format: 'json',
    };

    const updateFormAddress = ({address}) => {
        $("#finding").text("Found! Correct if inaccurate.");
        $("#nearestAddress").val(address.house_number + " " + address.road);
    };

    $.getJSON('https://nominatim.openstreetmap.org/reverse', request, updateFormAddress);
  }, 
    (position) => $("#finding").text("")
  );
} else {
  $("#finding").text("We couldn't locate you! Please provide the address.")
}

// Upload Function
function upload() {
  // Clear Errors
  $(".error-block").hide();
  $(".has-error").removeClass("has-error");
  $("#alert").hide();

  // Get data from form
  const formData = $("form").serializeArray();

  if (isFormValidated(formData)) {
    uploadReport(formData);
  }
};

function uploadReport(formData) {
  // Prepare data to upload
  const data = mapFormData(formData);

  // Upload Data
  database.collection("reports")
    .add(data)
    .then((ref) => data.hasMedia ? uploadMedia(ref.id) : redirect())
    .catch((error) => {
      $("#uploadingScreen").hide();
      $("#alert").text("We were unable to upload your report").show();
  });
};

function uploadMedia(refId) {
  const mediaFiles = $("input[type='file']")[0].files;
  const task = storage.ref("/" + refId).put(mediaFiles[0]);

  task.on("state_changed",
    (snapshot) => updateGraph(snapshot.bytesTransferred, snapshot.totalBytes),
    (error) => {
      $("#uploadingScreen").hide();
      $("#alert").text("We were unable to upload your media file").show();
  },
    redirect
  );
}

function redirect() {
  updateGraph();
  setTimeout(() => window.location = "data.html", 1000);
}

function updateGraph(bytesTransferred = 1, totalBytes = 1) {
  var newGraph = new ldBar(".ldBar");
  newGraph.set((bytesTransferred / totalBytes) * 100);
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
    } else if (formData[i].name == "description" && formData[i].value == "") {
      isValid = false;
      $("textarea[name='description']").parent().addClass("has-error").find(".error-block").show();
    }
  }

  const mediaFiles = $("input[type='file']")[0].files;
  if (mediaFiles.length > 0) {
    const regex = RegExp('image\/.*|video\/.*');
    if (!regex.test(mediaFiles[0].type)) {
      isValid = false;
    }
  }

  if (!isValid) {
    $("#uploadingScreen").hide();
  } else {
    $("#uploadingScreen").show();
  }

  return isValid;
}

$("#upload-media").change(function() {
  const fileName = $(this)[0].files[0].name;
  $(this).prev().html('<span class="glyphicon glyphicon-upload"></span> ' + fileName);
});

$(function() {
  $("#alert").hide();
});
