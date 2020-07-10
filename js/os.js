// Usage:
//
//   if (window.os.family === 'linux') { ... }
//   window.os.showOthers();
//
(function (scope) {

  // The ordering of families is important.  Obscure families should
  // precede popular ones because obscure families imitate popular
  // ones, not the other way around.

  var families = ['windowsphone',
                  'chromeos',
                  'ios',
                  'android',
                  'linux',
                  'macosx',
                  'windows',
                  'unknown'];

  var patterns = {
    'windowsphone': ['Windows Phone'],
    'ios': ['iPhone', 'iPad'],
    'chromeos': ['CrOS'],
    'android': ['Android'],
    'macosx': ['Mac OS X', 'MacOS'],
    'linux': ['Linux'],
    'windows': ['Windows']
  };

  var family;
  var others;

  function init() {
    for (var i = 0; i < families.length; ++i) {
      var x = families[i];
      if (patterns[x]) {
        for (var k = 0; k < patterns[x].length; ++k) {
          if (navigator.userAgent.match(patterns[x][k])) {
            family = x;
            others = JSON.parse(JSON.stringify(families));
            others.splice(i, 1);
            return;
          }
        }
      }
    }
  }

  init();

  scope.os = {
    family: family
  }

})(this);
