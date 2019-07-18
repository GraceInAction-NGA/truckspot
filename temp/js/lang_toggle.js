var curLang;
$(function () {
  const getLang = () => {
    const url = window.location.href.split("/");
    return url[url.length - 2];
  };

  $("#langSelector").change(function () {
    const val = $(this).val();
    var curLang = getLang();
    window.location.href = window.location.href.replace(`/${curLang}/`, `/${val}/`);
  });

  curLang = getLang();

  $(`#langSelector option[value='${curLang}']`).prop("selected", true);
})
