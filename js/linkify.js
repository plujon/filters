(function (scope) {
  // How to use:
  //
  // <div id="content">
  //  <span id="foo"></span>
  //  <p>This foo will become <a href="#foo">foo</a>.</p>
  //  <span id="bar" data-link-to-me="b a r"></span>
  //  <p>This b a r will become <a href="#bar">b a r</a>.</p>
  // </div>
  //
  // <script>linkify(document.getElementsById("content"));</script>
  //
  //
  // Any "b a r" in DOM will be automatically linked.
  //
  // This file does not handle meaningless divisions of text nodes in
  // the DOM that would divide "foo" into "fo" and "o".
  //
  // The regexp escaping is from
  //
  //   https://stackoverflow.com/questions/3115150/how-to-escape-regular-expression-special-characters-using-javascript#9310752
  //
  // Possibly a better API:
  //
  // linkify.scan(node); // collect ids
  // linkify.link(node); // add links
  // linkify.title(node); // add titles/tooltips
  //
  // Or perhaps more generally:
  //
  // linkify.scan(node); // collect ids
  // linkify.classify(node); // add css classes to all text that matches an id
  var textToIds = {};
  var _regexp;
  function regexp() {
    if ("undefined" !== typeof _regexp) return _regexp;
    var ary = [];
    if (document.querySelectorAll) { // modern browsers (ie9+)
      document.querySelectorAll('[id]').forEach(function (x) {
        var s = (x.dataset && x.dataset.linkToMe) || x.id;
        textToIds[s] = x.id;
        ary.push(s.replace(/[-\[\]{}()*+?.,\\^$|#\s]/g, '\\$&'));
      });
    } else if ($) { // fall back to jquery
      $('[id]').forEach.each(function (i, x) {
        var s = (x.dataset && x.dataset.linkToMe) || x.id;
        textToIds[s] = x.id;
        ary.push(s.replace(/[-\[\]{}()*+?.,\\^$|#\s]/g, '\\$&'));
      });
    }
    if (ary.length)
      _regexp = new RegExp('\\b(?:'+ ary.join('|') +')\\b');
    else
      _regexp = null;
    return _regexp;
  }
  var ws = /^\s*$/;
  var maskedIds = {};
  function linkifyTextNode(node, id) {
    if (maskedIds[id])
      return;
    var a = document.createElement('a');
    a.href = '#' + id;
    var parent = node.parentNode;
    parent.replaceChild(a, node);
    a.appendChild(node);
  }
  function processElementNode(node) {
    if (node.id) maskedIds[node.id] = true;
    processNode(node);
    if (node.id) delete maskedIds[node.id];
  }
  function processTextNode(node) {
    // If node is a text node, see if it matches regexp.  If it
    // doesn't, leave it alone.  If it matches regexp at an index
    // other than 0, split the node into two siblings at the index,
    // leave the first sibling alone, and continue processing the
    // second sibling as if it was the initial node.  The node should
    // now match regexp at index 0.  If the full node value string
    // matches regexp completely, linkify the node.  Otherwise, split
    // the node at the end of the match, linkify the first, and
    // recurse on the second.
    //
    // Gecko has many nodes that are purely whitespace, so skip such
    // nodes as a performance optimization (unmeasured).
    if (ws.test(node.nodeValue)) return;
    var i = node.nodeValue.search(regexp());
    if (-1 == i) return;
    if (i)
      node = node.splitText(i);
    var match = node.nodeValue.match(regexp());
    var len = match[0].length;
    if (0 == len) { console.log("bug"); return; }
    if (len == node.nodeValue.length) {
      linkifyTextNode(node, textToIds[node.nodeValue]);
    } else {
      var next = node.splitText(len);
      linkifyTextNode(node, textToIds[node.nodeValue]);
      processTextNode(next);
    }
  }
  function processNode(node) {
    if (!node.hasChildNodes())
      return;
    var it = node.firstChild;
    var next = it.nextSibling;
    for (; it; it = next, next = it.nextSibling) {
      linkify(it);
      if (!next) break;
    }
  }
  var nodeTypeProcessors = [];
  nodeTypeProcessors[Node.ELEMENT_NODE] = processElementNode;
  nodeTypeProcessors[Node.TEXT_NODE] = processTextNode;
  function linkify(node) {
    var f = (node && nodeTypeProcessors[node.nodeType]) || processNode;
    if (f && regexp()) f(node);
  }
  scope.linkify = linkify;
})(this);
