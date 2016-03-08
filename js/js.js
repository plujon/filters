$(document).ready(
  function(){
    var options = {};
    if (window.location.search) {
      // ?os=mac|linux|windows
      var ary = window.location.search.substr(1).split("&");
      for (var i = 0; i < ary.length; ++i) {
        var vv = ary[i].split("=");
        if (vv[0] == "os") {
          switch (vv[1][0].toLowerCase()) {
          case "l": options.search = { "search": "linux" }; break;
          case "m": options.search = { "search": "macosx" }; break;
          case "w": options.search = { "search": "windows" }; break;
          }
        }
      }
    }
    if (!options.search) {
      var _osfamily = osfamily();
      if (_osfamily) {
        options.search = { "search": _osfamily }
      };
    }
    $('#thetable').dataTable(options);
    // TODO: Linkify to feature_legend (or add mouseovers).
    // TODO: Linkify to audience_legend (or add mouseovers).
  });
