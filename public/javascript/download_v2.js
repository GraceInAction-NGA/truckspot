// Get reference to databse
var database = firebase.firestore();

// Get reference to storage
var storage = firebase.storage();

// download function
function download(path, query) {
  // store reference path
  globPath = path;
  // Clear out old reports
  $(".reports").empty();
  const initialQuery = database.collection("reports")
.where("name", "==", "Angel Gonzalez")
  let localQuery = query ? query : initialQuery


  database.collection("counts").get().then((querySnapshot) => {
    localQuery.get().then((querySnapshot) => {
      $("#loading").hide();
      querySnapshot.forEach((doc) => {
        const id = doc.id;
        const report = doc.data();

        var address = report.nearest_address.split(",");
        var $address = '<p id="streetName">' + address[0] + '</p>';
        var $button = '<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3"><button type="button" data-toggle="modal" data-target="#myModal" class="btn btn-primary report" id="' + id + '"> ' + $address + ' </button></div>'
        $(".reports").append($button);
        $('#' + id).data('data', report);
      });

      // Bind click event on each report
      $(".report").on("click", function () {
        // Populate Modal with data from the report clicked on
        var id = $(this)[0].id;
        var data = $(this).data('data');
        var name = "";
        if (data.name == "") {
          name = "N/P"
        } else {
          name = data.name
        };

        $(".modal-title").text(data.nearest_address.split(",")[0]);
        $("#date").text(data.date);
        $("#duration_range").text(data.duration_range);
        $("#nearest_address").text(data.nearest_address);
        $("#name").text(name);
        $("#description").text(data.description);
        $("#truck_count").text(data.truck_amount);

        if (data.offRoute === undefined) {
          $("#offRoute").hide();
        } else {
          $("#offRoute").show();
        }
        if (data.idle === undefined) {
          $("#idle").hide();
        } else {
          $("#idle").show();
        }
        if (data.noise === undefined) {
          $("#noise").hide();
        } else {
          $("#noise").show();
        }
        if (data.uncovered === undefined) {
          $("#uncovered").hide();
        } else {
          $("#uncovered").show();
        }

        if (data.uncovered === undefined && data.noise === undefined && data.idle === undefined && data.offRoute === undefined) {
          $("#na").show();
        } else {
          $("#na").hide();
        }

        $("#media").remove();
        // check media exists
        if (data.hasMedia) {
          // If media exists, then obtain the url to load the media from
          storage.ref("/" + id).getDownloadURL().then((url) => {
            // Identify the type of media and create appropriate element to display or play the media
            if (data.media_type.indexOf("image") >= 0) {
              media = '<img id="media" width="100%" height="auto" src="' + url + '"/>';
            } else if (data.media_type.indexOf("audio") >= 0) {
              media = '<audio id="media" controls><source src="' + url + '" type="' + data.media_type + '"></audio>'
            } else if (data.media_type.indexOf("video") >= 0) {
              media = '<video id="media" width="100%" height="auto" controls> <source src="' + url + '" type="' + data.media_type + '"></video>'
            }

            // Append to Modal
            $(".modal-body").append(media);
          });
        }
      });
    });
  });
};

$(function () {
  // Displays previous reports
  $("#lastBtn").click(function () {
    $("#loading").show();
    count -= listLength;
    download(globPath, prev);
    $(this).blur();
  });

  // Display next reports
  $("#nextBtn").click(function () {
    $("#lastBtn").removeAttr("disabled");
    $("#loading").show();
    count += listLength;
    download(globPath, next);
    $(this).blur();
  });
});
