const HISTORY_KEY='kana-learning-history-v1';
let history=[];try{const raw=JSON.parse(localStorage.getItem(HISTORY_KEY)||'[]');if(Array.isArray(raw))history=raw.filter(r=>r&&typeof r.attempt_id==='string'&&WORDS[r.word_id]&&typeof r.timestamp==='string')}catch(e){}
let clockStart=null;
function pauseClock(){if(clockStart!==null&&state){state.elapsed=(state.elapsed||0)+Math.max(0,Date.now()-clockStart);clockStart=null;save()}}
function beginClock(){if(state&&!state.answers[state.index]&&clockStart===null&&!document.hidden)clockStart=Date.now()}
function storeAttempt(){
 const a=state.answers[state.index];if(!a||!a.timestamp)return;
 const w=WORDS[state.ids[state.index]],id=state.session+':'+state.index;
 const row={attempt_id:id,session_id:state.session,timestamp:a.timestamp,local_date:a.localDate,word_id:w.id,english:w.english,japanese:w.japanese,script:w.script,categories:w.categories.join('|'),paper_correct:a.paper,romaji_correct:a.r,typed_romaji:a.typed,recall_seconds:a.seconds};
 const i=history.findIndex(r=>r.attempt_id===id);if(i<0)history.push(row);else history[i]=row;
 try{localStorage.setItem(HISTORY_KEY,JSON.stringify(history));$('storageNote').textContent='History is saved in this browser only. Export CSV to keep a backup.'}catch(e){$('storageNote').textContent='Browser storage is unavailable or full. Export CSV before closing to keep your history.'}
}
function localDay(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function percentage(rows,key){const valid=rows.filter(r=>typeof r[key]==='boolean');return valid.length?`${Math.round(100*valid.filter(r=>r[key]).length/valid.length)}% (${valid.filter(r=>r[key]).length}/${valid.length})`:'—'}
function median(values){const a=values.filter(Number.isFinite).sort((a,b)=>a-b);return a.length?(a[Math.floor((a.length-1)/2)]+a[Math.ceil((a.length-1)/2)])/2:null}
function table(parent,headers,rows){const wrap=text(parent,'div','','table-wrap'),t=text(wrap,'table',''),head=text(t,'thead',''),tr=text(head,'tr','');headers.forEach(h=>text(tr,'th',h));const body=text(t,'tbody','');rows.forEach(row=>{const tr=text(body,'tr','');row.forEach(v=>text(tr,'td',String(v)))});return t}
function missedWords(rows){const groups=new Map();rows.forEach(r=>{if(!groups.has(r.word_id))groups.set(r.word_id,[]);groups.get(r.word_id).push(r)});return [...groups].map(([id,rs])=>({id,rows:rs,misses:rs.filter(r=>r.paper_correct===false||r.romaji_correct===false).length})).filter(g=>g.misses).sort((a,b)=>b.misses-a.misses||a.id-b.id)}
function dashboard(){
 pauseClock();screen('analytics');const rows=history;
 $('stats').replaceChildren();const seconds=median(rows.map(r=>r.recall_seconds));
 [['Attempts',rows.length],['Unique words',new Set(rows.map(r=>r.word_id)).size],['Paper accuracy (self-marked)',percentage(rows,'paper_correct')],['Romaji accuracy (automatic)',percentage(rows,'romaji_correct')],['Median time to reveal',seconds===null?'—':seconds.toFixed(1)+' s']].forEach(([label,value])=>{const d=text($('stats'),'div','','metric');text(d,'strong',value);text(d,'p',label,'small')});
 $('emptyHistory').hidden=rows.length>0;$('exportCsv').disabled=!rows.length;
 $('daily').replaceChildren();const days=[...new Set(rows.map(r=>r.local_date))].sort();
 if(days.length){text($('daily'),'p','Self-marked paper accuracy · last 14 practice days','small');days.slice(-14).forEach(day=>{const rs=rows.filter(r=>r.local_date===day),scored=rs.filter(r=>typeof r.paper_correct==='boolean');const label=text($('daily'),'div',day+' · '+percentage(rs,'paper_correct'),'small');if(scored.length){const track=text($('daily'),'div','','progress');track.style.margin='6px 0 12px';const fill=text(track,'div','');fill.style.width=(100*scored.filter(r=>r.paper_correct).length/scored.length)+'%'}});table($('daily'),['Date','Attempts','Paper accuracy','Romaji accuracy'],days.map(day=>{const rs=rows.filter(r=>r.local_date===day);return [day,rs.length,percentage(rs,'paper_correct'),percentage(rs,'romaji_correct')]}))}
 $('categories').replaceChildren();
 const labels={hiragana:'Hiragana',katakana:'Katakana',notes:'Original notes',fruits:'Fruits',food:'Food',cities:'Cities',places:'States / countries'};
 table($('categories'),['Category','Attempts','Paper accuracy','Romaji accuracy'],Object.entries(labels).map(([key,name])=>{const rs=rows.filter(r=>r.script===key||r.categories.split('|').includes(key));return [name,rs.length,percentage(rs,'paper_correct'),percentage(rs,'romaji_correct')]}));
 const hard=missedWords(rows);$('hardest').replaceChildren();$('reviseRecommended').disabled=!hard.length;
 if(hard.length)table($('hardest'),['Word','Missed attempts','Total attempts','Paper accuracy','Romaji accuracy'],hard.slice(0,15).map(g=>[WORDS[g.id].english,g.misses,g.rows.length,percentage(g.rows,'paper_correct'),percentage(g.rows,'romaji_correct')]));else text($('hardest'),'p','No missed answers recorded yet.');
 $('reviseRecommended').onclick=()=>start(hard.slice(0,15).map(g=>g.id));
}
function csvContent(){const fields=['attempt_id','session_id','timestamp','local_date','word_id','english','japanese','script','categories','paper_correct','romaji_correct','typed_romaji','recall_seconds'];const quote=v=>{let s=v===null||v===undefined?'':String(v);if(/^[=+@\-\t\r]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"'};return '\ufeff'+[fields.join(','),...history.map(r=>fields.map(f=>quote(r[f])).join(','))].join('\r\n')}
$('exportCsv').onclick=()=>{const url=URL.createObjectURL(new Blob([csvContent()],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='kana-practice-history.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
$('dashboardButton').onclick=dashboard;$('resultDashboard').onclick=dashboard;$('analyticsHome').onclick=home;
document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseClock();else if(!$('test').hidden)beginClock()});
window.addEventListener('pagehide',pauseClock);
