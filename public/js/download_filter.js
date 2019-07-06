// filter function

$(function() {
  $("#filterSubmit").click(filter);
})

function filter() {
  const first = $.map($("#first input:checked"), e => $(e).val());  
  const second = $.map($("#second input:checked"), e => $(e).val());  
  const third = $.map($("#third input:checked"), e => $(e).val());  
  const fourth = $.map($("#fourth input:checked"), e => $(e).val());  
  
  let query = database.collection("reports");//.orderBy("time_stamp", "desc");

  query = modifyQuery(query, first, "city");
  query = modifyQuery(query, second, "duration_range");
  query = modifyQuery(query, third, "truck_amount");
  query = modifyQuery(query, fourth)

  download(query, true);
  $(".reports").empty();
};

function modifyQuery(query, data, key) {
  hasValidQuery = data.length > 0 && !data.includes("all");
  const reducer = (acc, queryKey) => acc.where(key ? key : queryKey, "==", queryKey); 

  return hasValidQuery ? data.reduce(reducer, query) : query;
}