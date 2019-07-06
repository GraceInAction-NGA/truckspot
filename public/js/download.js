var database = firebase.firestore();
var storage = firebase.storage();
var limit = 10;
var count = limit;
var next = null;

$(function () {
  $("#nextBtn").click(function () {
    $("#lastBtn").removeAttr("disabled");
    $("#loading").show();
    count += limit;
    download(next);
    $(this).blur();
  });

  $("#filterSubmit").click(filter);
});

// Main Functions
const download = (query, isFiltered = false) => {
  const localQuery = query ? query : database.collection("reports").orderBy("time_stamp", "desc").limit(limit);

  localQuery.get().then((querySnapshot) => {
    const {docs} = querySnapshot;
    const hasDocs = docs.length > 0;
    const hasDocsRemaining = docs.length < limit;

    // Hide Loading Animation
    $("#loading").hide();
    
    // Load Data
    if (hasDocs) {
      querySnapshot.forEach(doc => createReportEntry(doc));
      bindReportsDataToModal();
    } else if (!next){
      $(".reports").append("<h5 style='text-align: center'>No Results Were Found</h5>");
    }

    // Update Pagination
    if (!isFiltered && hasDocs) {
      const lastEntry = docs[querySnapshot.docs.length - 1];
      setNextPagination(lastEntry);
    } 

    // Update Next Button
    if (isFiltered || hasDocsRemaining) {
      $("#nextBtn").attr("disabled", "disabled");
    }
  }).catch((e) => {
    console.log("bad");
    console.log(e);
  });
};

const filter = () => {
  const first = $.map($("#first input:checked"), e => $(e).val());  
  const second = $.map($("#second input:checked"), e => $(e).val());  
  const third = $.map($("#third input:checked"), e => $(e).val());  
  const fourth = $.map($("#fourth input:checked"), e => $(e).val());  
  
  let query = database.collection("reports").orderBy("time_stamp", "desc");

  query = modifyQuery(query, first, "city");
  query = modifyQuery(query, second, "duration_range");
  query = modifyQuery(query, third, "truck_amount");
  query = modifyQuery(query, fourth)

  download(query, true);
  $(".reports").empty();
};

// Helpers
const createReportEntry = (doc) => {
  const id = doc.id;
  const report = doc.data();
  const address = report.nearest_address.split(",");
  const $address = '<p id="streetName">' + address[0] + '</p>';
  const $button = '<div class="col-xs-12 col-sm-6 col-md-4"><button type="button" data-toggle="modal" data-target="#myModal" class="btn btn-primary report" id="' + id + '"> ' + $address + ' </button></div>'
  
  $(".reports").append($button);
  $(`#${id}`).data('data', report);
}

const bindReportsDataToModal = () => {
  $(".report").off("click");
  $(".report").on("click", function () {
    const id = $(this)[0].id;
    const data = $(this).data('data');
    const hasNoTruckProblem = !data.uncovered && !data.noise && !data.idle && !data.offRoute;
    const toggleKey = (key) => data[key] ? $(`.modal #${key}`).show() : $(`.modal #${key}`).hide();
    
    $(".modal-title").text(data.nearest_address.split(",")[0]);
    $("#date").text(data.date);
    $("#duration_range").text(data.duration_range);
    $("#nearest_address").text(data.nearest_address);
    $("#name").text(data.name === "" ? "N/P" : data.name);
    $("p#city").text(data.city);
    $("#description").text(data.description);
    $("#truck_amount").text(data.truck_amount);

    hasNoTruckProblem ? $("#na").show() : $("#na").hide();
    toggleKey("offRoute");
    toggleKey("idle");
    toggleKey("noise");
    toggleKey("uncovered");

    $("#media").remove();

    if (data.hasMedia) {
      storage.ref("/" + id).getDownloadURL().then((url) => {
        const media = getElementForMedia(data.media_type, url);
        $(".modal-body").append(media);
      }).catch((e) => {
        console.log("bad");
        console.log(e);
      });;
    }
  });
}

const getElementForMedia = (media_type, url) => {
  if (media_type.indexOf("image") >= 0) {
    return '<img id="media" width="100%" height="auto" src="' + url + '"/>';
  } else if (media_type.indexOf("audio") >= 0) {
    return '<audio id="media" controls><source src="' + url + '" type="' + media_type + '"></audio>'
  } else if (media_type.indexOf("video") >= 0) {
    return '<video id="media" width="100%" height="auto" controls> <source src="' + url + '" type="' + media_type + '"></video>'
  }
}

const setNextPagination = (entry) => {
  next = database.collection("reports")
    .orderBy("time_stamp", "desc")
    .startAfter(entry)
    .limit(limit);
}

const modifyQuery = (query, data, key) => {
  hasValidQuery = data.length > 0 && !data.includes("all");
  const reducer = (acc, queryKey) => acc.where(key ? key : queryKey, "==", queryKey); 

  return hasValidQuery ? data.reduce(reducer, query) : query;
}