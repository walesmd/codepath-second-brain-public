(function () {
  var SESSION_KEY = 'cp_sb_auth';
  var DIGEST = '8682ae365cec6997078975dc99642b989f2ef5f691a0056d46e2b0323f153c0d';

  function reveal() {
    document.getElementById('gate-overlay').classList.add('hidden');
    document.body.classList.remove('gate-active');
  }

  if (sessionStorage.getItem(SESSION_KEY) === '1') {
    reveal();
    return;
  }

  var input = document.getElementById('gate-input');
  var btn = document.getElementById('gate-btn');
  var errEl = document.getElementById('gate-error');

  function attempt() {
    var val = input.value;
    if (!val) return;
    btn.disabled = true;
    var enc = new TextEncoder().encode(val);
    crypto.subtle.digest('SHA-256', enc).then(function (buf) {
      var hex = Array.from(new Uint8Array(buf))
        .map(function (b) { return b.toString(16).padStart(2, '0'); })
        .join('');
      if (hex === DIGEST) {
        sessionStorage.setItem(SESSION_KEY, '1');
        reveal();
      } else {
        errEl.textContent = 'Incorrect password.';
        input.classList.add('error');
        input.value = '';
        input.focus();
        btn.disabled = false;
      }
    });
  }

  btn.addEventListener('click', attempt);
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') attempt();
    input.classList.remove('error');
    errEl.textContent = '';
  });

  input.focus();
})();
