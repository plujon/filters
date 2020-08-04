// Shuffle table rows or list items.
//
// Typical usage:
//
// shuffle(document.getElementsByClassName('shuffle'));
(function (scope) {

  function randInt(a, z) {
    return Math.floor(Math.random() * (z - a + 1)) + a;
  }

  function shuffleChildren(element) {
    if (element.hasChildNodes()) {
      var ary = element.childNodes;
      var i = ary.length;
      while (0 <= --i) {
        var j = randInt(0, i);
        element.appendChild(element.removeChild(ary[j]));
      }
    }
  }

  function shuffleList(element) {
    shuffleChildren(element);
  }

  function shuffleTable(table) {
    var ary = table.childNodes;
    for (var i = 0; i < ary.length; ++i) {
      var element = ary[i];
      if ('TBODY' === (element.tagName || '').toUpperCase())
        shuffleChildren(element);
    }
  }

  var shufflers = [];
  shufflers['ol'] = shufflers['OL'] = shuffleList;
  shufflers['ul'] = shufflers['UL'] = shuffleList;
  shufflers['table'] = shufflers['TABLE'] = shuffleTable;

  function shuffle(node /* or array of nodes */) {
    if ('undefined' !== typeof node.length) {
      for (var i = 0; i < node.length; ++i)
        shuffle(node[i]);
      return;
    }
    shufflers[node.tagName](node);
  }

  scope.shuffle = shuffle;
})(this);
