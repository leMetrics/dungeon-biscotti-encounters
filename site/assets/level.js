(function () {
  var KEY = 'db-level';
  var picker = document.querySelector('.level-picker');
  var table = document.querySelector('.levels');
  if (!picker || !table) return;

  function stored() {
    try {
      return localStorage.getItem(KEY) || '';
    } catch (e) {
      return '';
    }
  }

  function store(level) {
    try {
      if (level) localStorage.setItem(KEY, level);
      else localStorage.removeItem(KEY);
    } catch (e) {
      /* storage unavailable: the choice lasts for this page only */
    }
  }

  function apply(level) {
    var valid = /^[1-5]$/.test(level) ? level : '';
    table.classList.toggle('has-pick', Boolean(valid));
    table.querySelectorAll('tr[data-level]').forEach(function (row) {
      row.classList.toggle('is-picked', row.getAttribute('data-level') === valid);
    });
    picker.querySelectorAll('button[data-pick]').forEach(function (button) {
      button.setAttribute('aria-pressed', String(button.getAttribute('data-pick') === valid));
    });
  }

  picker.addEventListener('click', function (event) {
    var button = event.target.closest('button[data-pick]');
    if (!button) return;
    var level = button.getAttribute('data-pick');
    store(level);
    apply(level);
  });

  picker.hidden = false;
  apply(stored());

  var reopened = [];
  window.addEventListener('beforeprint', function () {
    reopened = Array.prototype.filter.call(document.querySelectorAll('details.dm-only'), function (d) {
      return !d.open;
    });
    reopened.forEach(function (d) {
      d.open = true;
    });
  });
  window.addEventListener('afterprint', function () {
    reopened.forEach(function (d) {
      d.open = false;
    });
    reopened = [];
  });
})();
