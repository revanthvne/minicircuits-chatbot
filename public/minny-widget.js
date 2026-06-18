/* Minny — self-contained chat widget.
 * Injects its own styles + FAB + chat panel and talks to the same origin's
 * /api/chat. Designed to be inlined into the mirrored minicircuits.com page
 * (which sets <base href="minicircuits.com">), so ALL URLs here are absolute
 * to our own origin via location.origin. */
(function () {
  if (window.__minnyLoaded) return; window.__minnyLoaded = true;
  var ORIGIN = location.origin;
  var history = [];
  var ACCESS = sessionStorage.getItem('mc_ac') || '';
  var greeted = false, open = false;

  // Minny — a friendly Mini-Circuits chip mascot: smiling, waving, gently dancing.
  var AV = '<svg viewBox="0 0 64 64" style="width:36px;height:36px;flex-shrink:0" xmlns="http://www.w3.org/2000/svg">'
   + '<style>.mcb{animation:mcbob 1.5s ease-in-out infinite;transform-origin:32px 42px}.mca{animation:mcwv 1.2s ease-in-out infinite;transform-origin:17px 31px}@keyframes mcbob{0%,100%{transform:translateY(0) rotate(-3deg)}50%{transform:translateY(-2px) rotate(3deg)}}@keyframes mcwv{0%,100%{transform:rotate(4deg)}50%{transform:rotate(-28deg)}}@media(prefers-reduced-motion:reduce){.mcb,.mca{animation:none}}</style>'
   + '<circle cx="32" cy="32" r="32" fill="#eaf1fb"/>'
   + '<g class="mcb">'
   + '<g fill="#ff9100"><rect x="20" y="45" width="3" height="6" rx="1"/><rect x="26.5" y="45" width="3" height="6" rx="1"/><rect x="33" y="45" width="3" height="6" rx="1"/><rect x="39.5" y="45" width="3" height="6" rx="1"/></g>'
   + '<rect x="17" y="16" width="30" height="30" rx="6" fill="#253b98"/><rect x="24" y="11" width="16" height="6" rx="2" fill="#1c2f86"/>'
   + '<rect x="21" y="21" width="22" height="16" rx="3" fill="#0b1530"/>'
   + '<circle cx="28" cy="28" r="2.6" fill="#fff"/><circle cx="36" cy="28" r="2.6" fill="#fff"/><circle cx="28.7" cy="28.4" r="1.1" fill="#0b1530"/><circle cx="36.7" cy="28.4" r="1.1" fill="#0b1530"/>'
   + '<path d="M27 32.5 Q32 37 37 32.5" stroke="#ff9100" stroke-width="2" fill="none" stroke-linecap="round"/>'
   + '<g class="mca"><path d="M17 31 q-8 -1 -11 -8" stroke="#253b98" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="5.5" cy="22" r="2.6" fill="#ff9100"/></g>'
   + '<path d="M47 33 q8 0 11 5" stroke="#253b98" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="58.5" cy="38" r="2.6" fill="#ff9100"/>'
   + '</g></svg>';

  var css = '\
  #minny-fab{position:fixed;right:22px;bottom:22px;width:62px;height:62px;border-radius:50%;background:linear-gradient(135deg,#253b98,#00183c);box-shadow:0 6px 20px rgba(0,0,0,.3);cursor:pointer;z-index:2147483000;display:flex;align-items:center;justify-content:center;border:3px solid #fff}\
  #minny-fab .b{position:absolute;top:-3px;right:-3px;background:#ff9100;color:#fff;border-radius:50%;width:20px;height:20px;font:700 11px Arial;display:flex;align-items:center;justify-content:center;border:2px solid #fff}\
  #minny-panel{position:fixed;right:22px;bottom:96px;width:390px;max-width:calc(100vw - 28px);height:600px;max-height:calc(100vh - 120px);background:#fff;border-radius:14px;box-shadow:0 16px 50px rgba(0,0,0,.32);z-index:2147483000;display:none;flex-direction:column;overflow:hidden;font-family:"Roboto Condensed",Arial,sans-serif}\
  #minny-panel.open{display:flex}\
  #minny-hd{background:linear-gradient(135deg,#253b98,#00183c);padding:13px 15px;display:flex;align-items:center;gap:11px;border-bottom:3px solid #ff9100}\
  #minny-hd .t{color:#fff;font-weight:700;font-size:15px;font-family:"Cairo",sans-serif}#minny-hd .s{color:#9fb6e6;font-size:11px}\
  #minny-hd .x{margin-left:auto;color:#fff;cursor:pointer;font-size:20px;opacity:.85;background:none;border:none}\
  #minny-msgs{flex:1;overflow-y:auto;padding:14px;background:#f4f6fb}\
  .mn-row{display:flex;gap:9px;margin-bottom:12px;align-items:flex-start}.mn-row.u{justify-content:flex-end}\
  .mn-bub{max-width:80%;padding:9px 12px;border-radius:13px;font-size:13.5px;line-height:1.5;color:#1a2332}\
  .mn-bub.bot{background:#fff;border:1px solid #e3e8f2;border-top-left-radius:4px}\
  .mn-bub.u{background:#253b98;color:#fff;border-top-right-radius:4px}\
  .mn-bub a{color:#253b98;font-weight:700}.mn-bub.u a{color:#fff}\
  .mn-bub table{border-collapse:collapse;margin:6px 0;font-size:12.5px}.mn-bub td,.mn-bub th{border:1px solid #d7deeb;padding:3px 9px}.mn-bub th{background:#eef2fb}\
  .mn-chips{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 12px 39px}\
  .mn-chip{background:#eef2ff;color:#253b98;border:1.5px solid #cdd8f5;border-radius:13px;padding:5px 11px;font-size:11.5px;font-weight:600;cursor:pointer;font-family:inherit}\
  .mn-chip:hover{background:#253b98;color:#fff}\
  .mn-card{border:1.5px solid #e2e8f0;border-radius:9px;padding:9px 11px;margin-top:7px;cursor:pointer;background:#fff;overflow:hidden}\
  .mn-card:hover{border-color:#ff9100}\
  .mn-card .pn{font-weight:800;color:#253b98;font-size:12.5px;font-family:"Courier New",monospace}\
  .mn-card .ds{font-size:11px;color:#5b6b85;margin:2px 0 5px}\
  .mn-card .sp{display:inline-block;background:#eef2f8;border-radius:4px;padding:1px 6px;font-size:10.5px;margin:2px 4px 0 0}\
  .mn-card .lk{font-size:11px;font-weight:700;color:#253b98}\
  #minny-foot{padding:9px 11px;border-top:1px solid #e6eaf2;display:flex;gap:8px;align-items:flex-end;background:#fff}\
  #minny-in{flex:1;border:1.5px solid #d6dbe6;border-radius:18px;padding:9px 13px;font-size:13px;resize:none;max-height:90px;outline:none;font-family:inherit;line-height:1.4}\
  #minny-in:focus{border-color:#ff9100}\
  #minny-send{width:38px;height:38px;border:none;border-radius:50%;background:#ff9100;color:#fff;font-size:17px;cursor:pointer;flex-shrink:0}\
  .mn-typing span{display:inline-block;width:7px;height:7px;background:#aab4c8;border-radius:50%;margin:0 1px;animation:mnb 1s infinite}\
  .mn-typing span:nth-child(2){animation-delay:.2s}.mn-typing span:nth-child(3){animation-delay:.4s}\
  @keyframes mnb{0%,60%,100%{opacity:.3}30%{opacity:1}}';

  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var fab = document.createElement('div'); fab.id = 'minny-fab';
  fab.innerHTML = AV + '<span class="b">1</span>';
  document.body.appendChild(fab);

  var panel = document.createElement('div'); panel.id = 'minny-panel';
  panel.innerHTML =
    '<div id="minny-hd">' + AV + '<div><div class="t">Minny</div><div class="s">Mini-Circuits RF Assistant · online</div></div><button class="x" title="Close">✕</button></div>' +
    '<div id="minny-msgs"></div>' +
    '<div id="minny-foot"><textarea id="minny-in" rows="1" placeholder="Ask me anything RF! ⚡"></textarea><button id="minny-send">➤</button></div>';
  document.body.appendChild(panel);

  var msgs = panel.querySelector('#minny-msgs');
  var input = panel.querySelector('#minny-in');

  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
  function escA(s){return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');}
  function md(s){ if(!s) return '';
    s=s.replace(/\[([^\]]+)\]\(((?:https?:\/\/|\/)[^)\s]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>');
    s=s.replace(/\*\*([^*\n]+)\*\*/g,'<strong>$1</strong>');
    s=s.replace(/^\s*#{1,6}\s*(.+?)\s*$/gm,'<strong>$1</strong>');
    s=s.replace(/^\s*[-*_]{3,}\s*$/gm,'<div style="border-top:1px solid #e6eaf2;margin:7px 0"></div>');
    s=s.replace(/^[ \t]*[-*]\s+(.*)$/gm,'<span style="display:block;padding-left:2px">• $1</span>');
    s=s.replace(/\n{2,}/g,'<br><br>').replace(/\n/g,'<br>');
    s=s.replace(/(<\/div>)<br>/g,'$1');
    return s; }

  function row(html, isUser){ var r=document.createElement('div'); r.className='mn-row'+(isUser?' u':'');
    r.innerHTML=isUser?('<div class="mn-bub u">'+esc(html)+'</div>'):(AV+'<div class="mn-bub bot">'+html+'</div>');
    msgs.appendChild(r); msgs.scrollTop=msgs.scrollHeight; return r; }

  function card(p){
    var f=(p.flo!=null&&p.fhi!=null)?(p.flo+'–'+p.fhi+' MHz'):'';
    var sp=''; if(f)sp+='<span class="sp">'+f+'</span>';
    if(p.gain!=null)sp+='<span class="sp">G:'+p.gain+' dB</span>';
    if(p.nf!=null)sp+='<span class="sp">NF:'+p.nf+' dB</span>';
    if(p.impedance!=null)sp+='<span class="sp">'+p.impedance+'Ω'+(p.impedance_ratio?(' '+p.impedance_ratio+':1'):'')+'</span>';
    var img='<img src="'+ORIGIN+'/api/img?pn='+encodeURIComponent(p.pn)+'&case='+encodeURIComponent(p.case_style||'')+'" onerror="this.style.display=\'none\'" style="float:right;width:58px;height:58px;object-fit:contain;margin:0 0 4px 8px;background:#fff;border-radius:4px">';
    var pp=ORIGIN+'/p/'+encodeURIComponent(p.pn);
    var price=(typeof p.price==='number'&&p.price>0)?('<span class="lk">$'+p.price+'</span> &nbsp; '):'';
    var ds=p.datasheet_url?(' &nbsp; <a class="lk" href="'+escA(ORIGIN+'/dl?u='+encodeURIComponent(p.datasheet_url))+'" target="_blank" rel="noopener" onclick="event.stopPropagation()">Datasheet</a>'):'';
    return '<div class="mn-card" style="cursor:pointer" onclick="window.open(\''+pp+'\',\'_blank\')">'+img+'<div class="pn">'+esc(p.pn)+'</div>'+(p.desc?'<div class="ds">'+esc(p.desc)+'</div>':'')+'<div>'+sp+'</div><div style="margin-top:6px">'+price+'<a class="lk" href="'+escA(pp)+'" target="_blank" rel="noopener" onclick="event.stopPropagation()">View product →</a>'+ds+'</div></div>';
  }

  function chips(list){ var r=document.createElement('div'); r.className='mn-chips';
    r.innerHTML=list.map(function(t){return '<button class="mn-chip" data-q="'+escA(t)+'">'+esc(t)+'</button>';}).join('');
    r.querySelectorAll('.mn-chip').forEach(function(b){b.addEventListener('click',function(){send(b.dataset.q);});});
    msgs.appendChild(r); msgs.scrollTop=msgs.scrollHeight; }

  function chatFetch(message){ return fetch(ORIGIN+'/api/chat',{method:'POST',headers:{'Content-Type':'application/json','x-access-code':ACCESS},body:JSON.stringify({message:message,history:history.slice(-12)})}); }

  function send(message){ message=(message||'').trim(); if(!message) return;
    row(message,true); history.push({role:'user',content:message});
    var t=document.createElement('div'); t.className='mn-row'; t.innerHTML=AV+'<div class="mn-bub bot"><span class="mn-typing"><span></span><span></span><span></span></span></div>'; msgs.appendChild(t); msgs.scrollTop=msgs.scrollHeight;
    chatFetch(message).then(function(resp){
      if(resp.status===401){ ACCESS=(window.prompt('🔒 This assistant is passcode-protected. Enter the access passcode:')||'').trim(); sessionStorage.setItem('mc_ac',ACCESS); return chatFetch(message); }
      return resp;
    }).then(function(resp){ return resp.json().then(function(d){return {ok:resp.ok,status:resp.status,d:d};}); })
    .then(function(o){ t.remove();
      if(!o.ok){ row('<span style="color:#c0392b">⚠️ '+(o.status===401?'Incorrect passcode — reload and try again.':esc((o.d&&o.d.message)||'Something went wrong.'))+'</span>'); return; }
      var d=o.d; var reply=(d.reply||'').replace(/\[NEEDS_HUMAN\]/g,'').trim();
      var html=md(reply); if(d.products&&d.products.length){ html+='<div style="margin-top:8px">'+d.products.slice(0,4).map(card).join('')+'</div>'; }
      row(html,false); history.push({role:'assistant',content:reply});
      if(d.suggestions&&d.suggestions.length) chips(d.suggestions);
    }).catch(function(){ t.remove(); row('<span style="color:#c0392b">⚠️ Minny is offline right now.</span>'); });
  }
  window.__minnySend=function(m){ openPanel(); send(m); };

  function greet(){ if(greeted)return; greeted=true;
    row('Hi, I\'m <strong>Minny</strong>, your Mini-Circuits RF assistant. Tell me your application or target specs and I\'ll help you find the right part — with specifications, live pricing, stock, and datasheets.',false);
    chips(['LNA for 2.4 GHz, NF < 1.5 dB','Balun, 5–1800 MHz','Cascade noise figure','VSWR 1.5 → return loss']);
  }
  function openPanel(){ open=true; panel.classList.add('open'); fab.querySelector('.b').style.display='none'; greet(); setTimeout(function(){input.focus();},50); }
  function closePanel(){ open=false; panel.classList.remove('open'); }
  fab.addEventListener('click',function(){ open?closePanel():openPanel(); });
  panel.querySelector('.x').addEventListener('click',closePanel);
  input.addEventListener('keydown',function(e){ if(e.key==='Enter'&&!e.shiftKey){e.preventDefault(); var v=input.value; input.value=''; input.style.height='auto'; send(v);} });
  input.addEventListener('input',function(){ input.style.height='auto'; input.style.height=Math.min(input.scrollHeight,90)+'px'; });
  panel.querySelector('#minny-send').addEventListener('click',function(){ var v=input.value; input.value=''; input.style.height='auto'; send(v); });
})();
