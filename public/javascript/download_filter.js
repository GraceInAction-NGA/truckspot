// filter function

$(function() {
  $("#filterSubmit").click(() => {
    filter();
  })
})

function filter() {
  let first = $.map($("#first input:checked"), e => $(e).val());  
  let second = $.map($("#second input:checked"), e => $(e).val());  
  let third = $.map($("#third input:checked"), e => $(e).val());  
  let fourth = $.map($("#fourth input:checked"), e => $(e).val());  
  
  let query = database.collection("reports");

  query = !first.includes("all") ? query.where("city", "==", first[0]) : query;
  query = !second.includes("all") ? query.where("duration_range", "==", second[0]) : query;
  query = !third.includes("all") ? query.where("truck_amount", "==", third[0]) : query;
  
  if (!fourth.includes("all")) {
    for (let q of fourth) {
      query = query.where(q, "==", q);
    }
  }
  
  download(query, true);
};
