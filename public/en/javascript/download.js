// Get reference to databse
var database = firebase.database();

// Get reference to storage
var storage = firebase.storage();

// Used in Pagination
var firstKey = null;
var lastKey = null;
var globPath = null;
var masterCount = 0;
var count = 0;
var listLength = 5;

// download function
function download(path, startKey) {
  // store reference path
  globPath = path;
  // Clear out old reports
  $(".reports").empty();
  var recentReports;
  var shouldAdd = true;

  // Download the references to reports
  if (lastKey == null && firstKey == null) {
    recentReports = database.ref('/' + path)
      .orderByChild('time_stamp')
      .limitToFirst(listLength + 2)
      .once("value");
  } else if (lastKey == null) {
    recentReports = database.ref('/' + path)
      .orderByChild('time_stamp')
      .limitToFirst(listLength + 1)
      .startAt(startKey)
      .once("value");
  } else if (firstKey == null) {
    recentReports = database.ref('/' + path)
      .orderByChild('time_stamp')
      .limitToLast(listLength + 1)
      .endAt(startKey)
      .once("value");
    shouldAdd = false;
  }

  recentReports.then(function (snapshot) {
    reports = snapshot.val();
    $("#loading").hide();

    // Populates list with reports and stores data within element
    var tempCount = 0;
    for (var key in reports) {

      if (firstKey == null && reports[key].time_stamp != undefined) {
        // Stores first report downloaded
        firstKey = reports[key].time_stamp;
      } else if (firstKey == null) {
        // Stores master count for total number of reports that exists
        masterCount = reports[key];
      }

      // Stores last report downloaded
      if (reports[key].time_stamp != undefined) {
        lastKey = Math.max(reports[key].time_stamp, lastKey);
      }

      if (key != "count") {
        var report = reports[key];
        var id = key.replace("report", "");
        var $button = '<button type="button" data-toggle="modal" data-target="#myModal" class="btn btn-primary report" id="' + id + '"> ' + report.date + ' ' + report.nearest_address + ' </button>'
        var $button = '<button type="button" data-toggle="modal" data-target="#myModal" class="btn btn-primary report" id="' + id + '"> ' + report.nearest_address + ' </button>'
        var address = report.nearest_address.split(",");
        var $address = '<p id="streetName">' + address[0] + '</p>';
        //        var $address = '<p id="streetName">'+address[0]+'</p><p>'+address[1]+','+ address[2]+'</p>';
        var $button = '<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3"><button type="button" data-toggle="modal" data-target="#myModal" class="btn btn-primary report" id="' + id + '"> ' + $address + ' </button></div>'
        $(".reports").append($button);
        $('#' + id).data('data', report);
      }
      tempCount++;
    }

    // Bind click event on each report
    $(".report").on("click", function () {
      // Populate Modal with data from the report clicked on
      var id = $(this)[0].id;
      var data = $(this).data('data');
      var name = "";
      if (data.name == "") {name = "N/P"}
      else {name = data.name};

      $(".modal-title").text(data.nearest_address.split(",")[0]);
      $("#date").text(data.date);
      $("#duration_range").text(data.duration_range);
      $("#nearest_address").text(data.nearest_address);
      $("#name").text(name);
      $("#description").text(data.description);
      $("#truck_count").text(data.truck_amount);
      console.log(data);

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
      var media = null;
      if ("file_name" in data) {
        // If media exists, then obtain the url to load the media from
        storage.ref("/" + path + "/report" + id + "/" + data.file_name).getDownloadURL().then(function (url) {
          // Identify the type of media and create appropriate element to display or play the media
          if (data.file_type.indexOf("image") >= 0) {
            media = '<img id="media" width="100%" height="auto" src="' + url + '"/>';
          } else if (data.file_type.indexOf("audio") >= 0) {
            media = '<audio id="media" controls><source src="' + url + '" type="' + data.file_type + '"></audio>'
          } else if (data.file_type.indexOf("video") >= 0) {
            media = '<video id="media" width="100%" height="auto" controls> <source src="' + url + '" type="' + data.file_type + '"></video>'
          }

          // Append to Modal
          $(".modal-body").append(media);
        });
      }
    });

    // Ensures accurate report count
    if (tempCount >= listLength) {
      // removes last appended report
      $(".report").last().remove();
      // adds if first load or next button was clicked
      if (shouldAdd) {
        count += listLength;
      } else {
        // Ensures proper subtraction on count
        count = (Math.round((count / listLength)) * listLength) - listLength;
      }
    } else {
      // adds if first load or next button was clicked
      if (shouldAdd) {
        count += tempCount;
      } else {
        count -= tempCount;
      }
    }

    // Disables Next Button if count equals the number of reports that exist.
    if (count >= masterCount - 1) {
      $("#nextBtn").attr("disabled", "disabled");
    } else {
      $("#nextBtn").removeAttr("disabled");
    }

    // Update Pagination
    var pages = Math.round(masterCount / listLength);
    var page = Math.round(count / listLength);
    $(".pagination").text(page + " out of " + pages);

    // Disables Last Button
    if (count <= listLength) {
      $("#lastBtn").attr("disabled", "disabled");
    }
  });
}

$(function () {
  // Displays previous reports
  $("#lastBtn").click(function () {
    lastKey = firstKey;
    var fk = firstKey;
    firstKey = null;
    $("#loading").show();
    download(globPath, fk);
    $(this).blur();
  });

  // Display next reports
  $("#nextBtn").click(function () {
    $("#lastBtn").removeAttr("disabled");
    firstKey = lastKey;
    var lk = lastKey;
    lastKey = null;
    $("#loading").show();
    download(globPath, lk);
    $(this).blur();
  });
});
