function arrayIncludes(ary, x) {
  for (var i = 0; i < ary.length; ++i) {
    if (ary[i] === x) return true;
  }
  return false;
}

$(document).ready(
  function(){
    var options = {};
    var search = [];
    if (window.location.search) {
      // ?os=windows|macosx|linux|browser|network
      // ?platform=windows|macosx|linux|browser|network
      // ?audience=addict|parent
      var platforms = [ "browser", "linux", "macosx", "network", "windows" ];
      var audiences = [];
      $("#Audience_legend dt").each(function(){
        audiences.push($(this).text());
      });
      var ary = window.location.search.substr(1).split("&");
      for (var i = 0; i < ary.length; ++i) {
        var vv = ary[i].split("=");
        var x = vv[1].toLowerCase();
        switch (vv[0]) {
        case "os":       if (arrayIncludes(platforms, x)) search.push(x); break;
        case "platform": if (arrayIncludes(platforms, x)) search.push(x); break;
        case "audience": if (arrayIncludes(audiences, x)) search.push(x); break;
        }
      }
    }
    if (!search.length) {
      var _osfamily = osfamily();
      if (_osfamily) {
        search.push(_osfamily);
      };
    }
    options.search = { "search": search.join(" ") };
    $('#thetable').dataTable(options);
    // TODO: Linkify to feature_legend (or add mouseovers).
    // TODO: Linkify to audience_legend (or add mouseovers).
  });
