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

// download function
function download(path) {
  var recentReports = database.ref('/'+path).orderByChild('time_stamp').once("value").then(function(snapshot){
    reports = snapshot.val();
    $("#loading").remove();
    console.log(reports);
    // Populates list with reports and stores data within element
    for (var key in reports) {
      if (key != "count") {
        var report = reports[key];
        var id = key.replace("report", "");
        var $button = '<button type="button" data-toggle="modal" data-target="#myModal" class="btn btn-primary report" id="'+id+'"> ' + report.date + ' ' + report.nearest_address + ' </button>'
        var $button = '<button type="button" data-toggle="modal" data-target="#myModal" class="btn btn-primary report" id="'+id+'"> ' + report.nearest_address + ' </button>'
        var address = report.nearest_address.split(",");
        console.log(address);
        var $address = '<p id="streetName">'+address[0]+'</p>';
//        var $address = '<p id="streetName">'+address[0]+'</p><p>'+address[1]+','+ address[2]+'</p>';
        var $button = '<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3"><button type="button" data-toggle="modal" data-target="#myModal" class="btn btn-primary report" id="'+id+'"> ' + $address + ' </button></div>'
        $(".reports").prepend($button);
        $('#'+id).data('data', report);
      }
    }
    // Bind click event on each report
   $(".report").on("click", function(){
      // Populate Modal with data from the report clicked on
      var id = $(this)[0].id;
      var data = $(this).data('data');
      $(".modal-title").text(data.nearest_address);
      $("#date").text("Date: " + data.date);
      $("#duration_range").text("Duration Range: " + data.duration_range);
      $("#nearest_address").text("Nearest Address: " + data.nearest_address);
      $("#name").text("Name: " + data.name);
      $("#description").text("Description: " + data.description);
      $("#media").remove();
      // check media exists
      var media = null;
      if ("file_name" in data) {
        // If media exists, then obtain the url to load the media from
        storage.ref("/"+path+"/report" +id+"/" + data.file_name).getDownloadURL().then(function(url){
          console.log(url);

          // Identify the type of media and create appropriate element to display or play the media
          if (data.file_type.indexOf("image") >= 0) {
            media = '<img id="media" width="100%" height="auto" src="'+url+'"/>';
          }
          else if (data.file_type.indexOf("audio") >= 0) {
            media = '<audio id="media" controls><source src="'+url+'" type="'+data.file_type+'"></audio>'
          }
          else if (data.file_type.indexOf("video") >= 0) {
            media = '<video id="media" width="100%" height="auto" controls> <source src="'+url+'" type="'+data.file_type+'"></video>'
          }

          // Append to Modal
          $(".modal-body").append(media);
        });
      }
     // if so then download media
    });
  });
}
