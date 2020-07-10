(function (scope) {

  function filterWidgetAdd(el, s = null) {
    var template = document.getElementById('filter-input-template');
    var widget = template.content.cloneNode(true);
    if (s)
      widget.querySelector('input').value = s;
    el.appendChild(widget);
    return widget;
  }

  function filterWidgetRemove(el) {
    console.log(el);
    let parent = el.parentNode;
    parent.removeChild(el);
    refilter();
  }

  function xxcludes(clude) {
    const ary = []
    $('.filter-row').each((_, el) => {
      if (clude === el.querySelector('.filter-row-kind').textContent)
        el.querySelectorAll('input').forEach((x) => {
          let s = x.value.trim();
          if (s)
            ary.push(new RegExp(s, 'i'));
        });
    });
    return ary;
  }

  function refilter() {
    const includes = xxcludes('include');
    const excludes = xxcludes('exclude');
    $('table').each((_, table) => {
      for (let i = 0; i < table.rows.length; ++i) {
        let tr = table.rows[i];
        let shouldShow = true;
        if (includes.length)
          shouldShow = false;
        for (let k = 0; k < includes.length; ++k) {
          if (includes[k].test(tr.textContent)) {
            shouldShow = true;
            break;
          }
        }
        for (let k = 0; k < excludes.length; ++k) {
          if (excludes[k].test(tr.textContent)) {
            shouldShow = false;
            break;
          }
        }
        if (shouldShow)
          $(tr).show();
        else
          $(tr).hide();
      }
    });
  }

  function addTo(selector, x) {
    let ary = ('string' === typeof x) ? [x] : x;
    ary.forEach(function (x) { filterWidgetAdd($(selector).get(0), x) });
    refilter();
  }

  function setup() {
    $('.filter-button-plus').on('click', function (evt) {
      let el = evt.currentTarget;
      filterWidgetAdd(el.parentNode);
    });
    $('.filter-bar').on('click', '.filter-widget-remove', function (evt) {
      let el = evt.currentTarget;
      filterWidgetRemove(el.parentNode.parentNode);
    });
    $('.filter-bar').on('input', 'input', function (evt) {
      refilter();
    });
    $('.filter-bar').on('keypress', 'input', function (evt) {
      if ('Enter' === evt.key) {
        let el = evt.currentTarget;
        filterWidgetAdd(el.parentNode.parentNode);
      }
    });
  }

  setup();

  // filterable.addIncludes('linux');
  scope.filterable = {
    addIncludes: function (x) { addTo('.filter-row-include', x) },
    addExcludes: function (x) { addTo('.filter-row-exclude', x) }
  };
})(this);
