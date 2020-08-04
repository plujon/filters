function arrayIncludes(ary, x) {
  for (var i = 0; i < ary.length; ++i) {
    if (ary[i] === x) return true;
  }
  return false;
}

(function() {
  var options = {};
  var includes = {};
  if (window.location.search) {
    // ?os=windows|macosx|linux|browser|network
    // ?platform=windows|macosx|linux|browser|network|android|ios
    // ?audience=addict|parent
    // ?feature=timer+monitoring
    var platforms = [ "android", "browser", "ios", "linux", "macosx", "network", "windows" ];
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
      var name_value = ary[i].split("=");
      var name = name_value[0].toLowerCase();
      var value = name_value[1].toLowerCase();
      if ('os' == name) name = 'platform';
      if (!includes[name]) includes[name] = [];
      var possibles = [];
      switch (name) {
      case "platform": possibles = platforms; break;
      case "audience": possibles = audiences; break;
      case "feature": possibles = features; break;
      }
      if (arrayIncludes(possibles, value)) includes[name].push(value);
      else if ('all' == value) includes[name] = possibles;
    }
  }
  {
    var init = [];
    for (var k in includes) {
      console.log(k, includes);
      init.push(['include'].concat(includes[k]));
    }
    if (0 == init.length && os.family)
      init.push(['include', os.family, 'network']);
    init.unshift(['include', '']);
    init.push(['exclude', 'defunct']);
    filterable.init(init);
  }
  linkify(document.body);

  $('.shuffler').on('click', function () {
    shuffle(document.getElementsByClassName('shuffle'))
  });

  var el = $('.filter-pill input').get(0);
  if (el && !el.value) {
    $(el).attr('placeholder', 'type something here such as addict or parent...');
    $(el).focus();
  }
  // TODO: Linkify to feature_legend (or add mouseovers).
  // TODO: Linkify to audience_legend (or add mouseovers).
})();

