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
      // ?platform=windows|macosx|linux|browser|network|android|ios|chrome|firefox
      // ?audience=addict|parent
      // ?feature=timer+monitoring
      var platforms = [ "android", "browser", "chrome", "firefox", "ios", "linux", "macosx", "network", "windows" ];
      var audiences = [];
      var features = [];
      $("#Audience_legend dt").each(function(){
        audiences.push($(this).text());
      });
      $("#feature_legend dt").each(function(){
        features.push($(this).text());
      });
      var ary = window.location.search.substr(1).split("&");
      for (var i = 0; i < ary.length; ++i) {
        var vv = ary[i].split("=");
        var x = vv[1].toLowerCase();
        switch (vv[0]) {
        case "os":       if (arrayIncludes(platforms, x)) search.push(x); break;
        case "platform": if (arrayIncludes(platforms, x)) search.push(x); break;
        case "audience": if (arrayIncludes(audiences, x)) search.push(x); break;
        case "feature":  if (arrayIncludes(features, x))  search.push(x); break;
        }
      }
    }
    if (!search.length) {
      var _osfamily = osfamily();
      if (_osfamily) {
        search.push(_osfamily);
      };
    }
    options.search = { "search": " " + search.join(" ") };
    $('#thetable').dataTable(options);
    // TODO: Linkify to feature_legend (or add mouseovers).
    // TODO: Linkify to audience_legend (or add mouseovers).
  });
