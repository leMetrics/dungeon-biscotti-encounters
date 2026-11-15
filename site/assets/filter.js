(function () {
  var form = document.querySelector('.filters');
  var items = Array.prototype.slice.call(document.querySelectorAll('.card-list > li'));
  var empty = document.querySelector('.empty');
  var count = document.querySelector('[data-count]');
  if (!form || !items.length) return;

  function checked(name) {
    return Array.prototype.map.call(form.querySelectorAll('input[name="' + name + '"]:checked'), function (input) {
      return input.value;
    });
  }

  function update() {
    var types = checked('type');
    var twists = checked('twist');
    var terrains = checked('terrain');
    var short = checked('short').length > 0;
    var query = form.elements.q.value.trim().toLowerCase();
    var shown = 0;

    items.forEach(function (item) {
      var itemTerrains = item.getAttribute('data-terrain').split(' ');
      var ok =
        (!types.length || types.indexOf(item.getAttribute('data-type')) !== -1) &&
        (!twists.length || twists.indexOf(item.getAttribute('data-twist-type')) !== -1) &&
        (!terrains.length ||
          terrains.some(function (t) {
            return itemTerrains.indexOf(t) !== -1;
          })) &&
        (!short || Number(item.getAttribute('data-duration')) <= 30) &&
        (!query || item.textContent.toLowerCase().indexOf(query) !== -1);
      item.hidden = !ok;
      if (ok) shown += 1;
    });

    if (count) count.textContent = String(shown);
    if (empty) empty.hidden = shown !== 0;
  }

  form.addEventListener('input', update);
  form.addEventListener('submit', function (event) {
    event.preventDefault();
  });
  if (empty) {
    empty.querySelector('[data-clear]').addEventListener('click', function () {
      form.reset();
      update();
    });
  }

  form.hidden = false;
  update();
})();
