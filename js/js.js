function arrayIncludes(ary, x) {
  for (var i = 0; i < ary.length; ++i) {
    if (ary[i] === x) return true;
  }
  return false;
}

(function() {
  var options = {};
  var includes = [];
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
      case "os":       if (arrayIncludes(platforms, x)) includes.push(x); break;
      case "platform": if (arrayIncludes(platforms, x)) includes.push(x); break;
      case "audience": if (arrayIncludes(audiences, x)) includes.push(x); break;
      case "feature":  if (arrayIncludes(features, x))  includes.push(x); break;
      }
    }
  }
  if (!includes.length) {
    if (os.family) {
      includes.push(os.family);
      includes.push('network')
    }
  }
  filterable.addIncludes(includes);
  filterable.addExcludes('dead');
  linkify(document.body);
  // TODO: Linkify to feature_legend (or add mouseovers).
  // TODO: Linkify to audience_legend (or add mouseovers).
})();

