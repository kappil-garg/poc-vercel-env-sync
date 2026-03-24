fetch('/api/check-env')
  .then(r => {
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.json();
  })
  .then(data => {
    const isSet = data.GOOGLE_OAUTH_CLIENT_ID === 'set';
    const pill = document.getElementById('pill');
    pill.textContent = isSet ? 'set' : 'not set';
    pill.className = 'status-pill ' + (isSet ? 'set' : 'not-set');
    document.getElementById('raw').textContent = JSON.stringify(data, null, 2);
  })
  .catch(err => {
    const pill = document.getElementById('pill');
    pill.textContent = 'error';
    pill.className = 'status-pill error';
    document.getElementById('raw').textContent = err.message;
    document.getElementById('error-note').style.display = 'block';
  });
