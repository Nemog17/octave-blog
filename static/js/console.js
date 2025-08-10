(function(){
  const params = new URLSearchParams(window.location.search);
  const backend = params.get('backend') || 'https://octave-docker-eqcyefaxggbrhtcn.eastus2-01.azurewebsites.net';
  params.delete('backend');
  const search = params.toString();
  const wsUrl = backend.replace(/^http/, 'ws') + '/ws' + (search ? '?' + search : '');
  
  const outputEl = document.getElementById('output');
  const inputEl = document.getElementById('command-input');
  let ws = null;
  let pingTimer = null;
  let history = [];
  let histIndex = 0;
  let queue = [];
  let open = false;

  function connect(callback){
    ws = new WebSocket(wsUrl, ['gotty']);
    ws.addEventListener('open', ()=>{
      open = true;
      ws.send(
        JSON.stringify({
          Arguments: search ? '?' + search : '',
          AuthToken: window.gotty_auth_token || ''
        })
      );
      pingTimer = setInterval(() => {
        if (ws.readyState === 1) ws.send('1');
      }, 30000);
      if (queue.length) {
        queue.forEach((cmd) => ws.send('0' + cmd + '\n'));
        queue = [];
      }
      if (callback) callback();
    });
    ws.addEventListener('message', (e)=>{
      const type = e.data[0];
      const data = e.data.slice(1);
      if(type==='0') appendOutput(atob(data));
    });
    ws.addEventListener('close', () => {
      open = false;
      clearInterval(pingTimer);
      appendOutput('\n[conexión cerrada]\n');
      setTimeout(() => {
        if (!open) connect();
      }, 1000);
    });
  }

  function appendOutput(text){
    outputEl.textContent += text;
    outputEl.parentElement.scrollTop = outputEl.parentElement.scrollHeight;
  }

  function sendCommand(cmd){
    if(!cmd) return;
    history.push(cmd);
    histIndex = history.length;
    if(open && ws.readyState===1){
      ws.send('0'+cmd+'\n');
    } else {
      queue.push(cmd);
      if(!open) {
        connect();
      }
    }
  }

  inputEl.addEventListener('keydown', function(e){
    if(e.key==='Enter'){
      e.preventDefault();
      const cmd = inputEl.value;
      inputEl.value='';
      sendCommand(cmd);
    } else if(e.key==='ArrowUp'){
      e.preventDefault();
      if(histIndex>0){
        histIndex--; inputEl.value = history[histIndex];
      }
    } else if(e.key==='ArrowDown'){
      e.preventDefault();
      if(histIndex < history.length-1){
        histIndex++; inputEl.value = history[histIndex];
      } else { histIndex = history.length; inputEl.value=''; }
    } else if(e.key==='Escape' || (e.key==='l' && e.ctrlKey)){
      e.preventDefault();
      outputEl.textContent='';
    }
  });

  inputEl.addEventListener('blur', ()=> setTimeout(()=> inputEl.focus(), 0));

  window.addEventListener('load', ()=>{
    connect();
    inputEl.focus();
  });
})();
