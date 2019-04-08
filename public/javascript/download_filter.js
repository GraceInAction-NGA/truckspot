// filter function

$(function() {
  $("#filterSubmit").click(() => {
    filter();
  })
})


function filter(query) {
  // Clear out old reports
  $(".reports").empty();


var data = [];
  $.each($("#first input:checked"), function(){
    data.push($(this).val());
});

if (data.length === 0)
  data.push("all");

  $.each($("#second input:checked"), function(){
    data.push($(this).val());
});

  if (data.length === 1)
  data.push("all");

  $.each($("#third input:checked"), function(){
    data.push($(this).val());
});

  if (data.length === 2)
  data.push("all");

  $.each($("#fourth input:checked"), function(){
    data.push($(this).val());
});

  if (data.length === 3)
  data.push("all");

console.log(data);
  let initialQuery = database.collection("reports");

    if (data[0] !== "all") {
      initialQuery = database.collection("reports").where("city", "==", data[0])
    }

    if (data[1] !== "all") {
      initialQuery = initialQuery.where("duration_range", "==", data[1]);
    }

    if (data[2] !== "all") {
      initialQuery = initialQuery.where("truck_amount", "==", data[2]);
    }

    if (data[3] !== "all") {
      initialQuery = initialQuery.where(data[3], "==", data[3])

      if(data.length === 5) {
        initialQuery=initialQuery.where(data[4], "==", data[4])
      }

      if(data.length === 6){
        initialQuery=initialQuery.where(data[5], "==", data[5])
      }

      if(data.length === 7){
        initialQuery=initialQuery.where(data[6], "==", data[6])
      }

    }
  let localQuery = initialQuery;

  database.collection("counts").get().then((queryCount) => {
    masterCount = queryCount.docs[0].data().count;

    localQuery.get().then((querySnapshot) => {
      $("#loading").hide();

      console.log(querySnapshot.docs);

      // Set Pagination
      if (querySnapshot.docs.length > 0) {
        const lastEntry = querySnapshot.docs[querySnapshot.docs.length - 1];
        setNextPagination(lastEntry);
        setPrevPagination(lastEntry);
      }

      querySnapshot.forEach(doc => createReportEntry(doc));

      bindReportsDataToModal();

      // Update Pagination
      var pages = Math.round(masterCount / limit);
      var page = Math.round(count / limit);
      $(".pagination").text(page + " out of " + pages);

      // Disables Last Button
      if (count <= limit) {
        $("#lastBtn").attr("disabled", "disabled");
      }

      // Update Next Button
      if (count >= masterCount) {
        $("#nextBtn").attr("disabled", "disabled");
      } else {
        $("#nextBtn").removeAttr("disabled");
      }
    });
  });
};
