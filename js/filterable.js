// terms
//
// filter-rules: the graphical presentation of the rules, including
// clickable buttons.
//
// rules: an array of rules that is the model of the filter terms.
//
// pill: the graphical representation of a filter term
//
// rule: a horizontal row in the rules that contains a leading
//      plus-button followed by zero or more terms.  The terms in a
//      rule represent a union (OR-relationship) when the filter is
//      applied.  On the other hand, it is the intersection
//      (AND-relationship) of the rules that govern the filtering.
//
// term: a word or phrase in an include or exclude rule
//
// rules is an array of rules.  Each rule is an array in which the
// first element is the kind of the array (include or exclude) and
// subsequent elements are the terms, i.e., pills.  The elements in
// rules map directly to the buttons displayed in a fiterable rules.
//
// [["include", "a", "b"], ["exclude", "d"]]

(function (scope) {

  const rules = [];

  let filterRules = document.querySelector('.filter-rules');

  function childElementIndex(el) {
    let htmlCollection = el.parentNode.children;
    for (let i = 0; i < htmlCollection.length; ++i) {
      if (htmlCollection.item(i) == el)
        return i;
    }
    return -1;
  }

  function removeAllChildren(node) {
    while (node.firstChild)
      node.removeChild(node.firstChild);
  }

  function templateToElement(templateId) {
    let template = document.getElementById(templateId);
    let el = template.content.cloneNode(true);
    if (el instanceof DocumentFragment && 1 == el.children.length)
      el = el.children[0];
    else
      console.error(el);
    return el;
  }

  function elementToSlotIndex(el) {
    return childElementIndex(elementToParentPillElement(el));
  }

  function elementToParentRuleElement(el) {
    while (!el.classList.contains('filter-rule'))
      el = el.parentNode;
    return el;
  }

  function elementToParentPillElement(el) {
    while (!el.classList.contains('filter-pill'))
      el = el.parentNode;
    return el;
  }

  function elementToRule(el) {
    return rules[elementToRuleIndex(el)]
  }

  function elementToRuleIndex(el) {
    return childElementIndex(elementToParentRuleElement(el))
  }

  function filterPillAdd(el, slot, colIndex = -1) {
    let widget = templateToElement('filter-pill-template');
    if (slot)
      widget.querySelector('input').value = slot;
    if (colIndex < 0 || !el.children ||
        (el.children && el.children.length <= colIndex)) {
      el.appendChild(widget);
    } else if (0 == colIndex) {
      el.insertBefore(widget, el.firstChild);
    } else {
      let sibling = el.children[colIndex];
      el.insertBefore(widget, sibling);
    }
    return widget;
  }

  function ruleHasNonEmptySlot(rule) {
    for (let i = 1; i < rule.length; ++i)
      if (rule[i])
        return true;
    return false;
  }

  function ruleMatches(rule, text) {
    for (let i = 1; i < rule.length; ++i) {
      let slot = rule[i];
      if (slot && (new RegExp(slot, 'i')).test(text))
        return true;
    }
    return false;
  }

  function apply() {
    $('table').each(function(_, table) {
      for (let i = 0; i < table.rows.length; ++i) {
        let tr = table.rows[i];
        let shouldShow = true;

        for (let k = 0; k < rules.length; ++k) {
          let rule = rules[k];
          let kind = rule[0];
          switch (kind) {
          case 'include':
            if (ruleHasNonEmptySlot(rule))
              shouldShow = false;
            break;
          case 'exclude': break;
          default: console.error(rule); break;
          }
          if (ruleMatches(rule, tr.textContent)) {
            if ('include' == kind)
              shouldShow = true;
            else if ('exclude' == kind)
              shouldShow = false;
          }
          if (shouldShow)
            $(tr).show();
          else {
            $(tr).hide();
            break;
          }
        }
      }
    });
  }

  function modelToDom() {
    renderFilterRules();
    apply();
  }

  function renderFilterRules() {
    removeAllChildren(filterRules);
    rules.forEach(function (rule, index) {
      let el = templateToElement('filter-rule-template');
      el.querySelector('.filter-rule-kind').textContent = rule[0];
      filterRules.appendChild(el);
      rule.slice(1).forEach(function (slot) {
        filterPillAdd(el, slot);
      });
    });
  }

  function setup() {
    $('.filter-rules-plus').on('click', function (evt) {
      evt.preventDefault();
      let el = evt.currentTarget;
      rules.push([el.textContent, '']);
      modelToDom();
    });
    $('.filter-rules').on('click', '.filter-button-plus', function (evt) {
      let el = evt.currentTarget;
      let rule = elementToRule(el);
      rule.push('');
      modelToDom();
    });
    $('.filter-rules').on('click', '.filter-pill-remove', function (evt) {
      let el = evt.currentTarget;
      let rule = elementToRule(el);
      let ruleIndex = elementToRuleIndex(el);
      let slotIndex = elementToSlotIndex(el);
      rule.splice(slotIndex, 1);
      el = elementToParentPillElement(el);
      el.parentNode.removeChild(el);
      if (rule.length <= 1)
        rules.splice(ruleIndex, 1);
      modelToDom();
    });
    $('.filter-rules').on('input', 'input', function (evt) {
      var el = evt.currentTarget;
      let rule = elementToRule(el);
      let index = elementToSlotIndex(el);
      rule[index] = el.value;
      apply();
    });
    $('.filter-rules').on('keypress', 'input', function (evt) {
      if ('Enter' === evt.key) {
        let el = evt.currentTarget;
        let ruleIndex = elementToRuleIndex(el);
        let slotIndex = elementToSlotIndex(el);
        let rule = elementToRule(el);
        rule.push('');
        modelToDom();
        $(filterRules.children[ruleIndex].children[slotIndex]).focus();
      }
    });
  }

  function init(obj) {
    obj.forEach(function (ary) {
      rules.push(ary)
    });
    modelToDom();
  }

  setup();

  scope.filterable = {
    rules: rules,
    init: init
  };

})(this);
