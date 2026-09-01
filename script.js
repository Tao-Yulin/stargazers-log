function fmtDate(iso){
  try{const d=new Date(iso);return d.toLocaleString();}catch(e){return iso}
}

function renderRepos(items){
  const container=document.getElementById('starred-list');
  if(!container){console.error('No container');return}
  if(!items || items.length===0){container.textContent='No starred repositories found.';return}

  const ul=document.createElement('ul');ul.className='repos';
  items.forEach(ev=>{
    const r=ev.repo||ev;
    const li=document.createElement('li');li.className='repo';
    const title=document.createElement('h2');
    const a=document.createElement('a');a.href=r.html_url||r.url||'#';a.textContent=r.name||r.full_name||r.title||'Unnamed repo';a.target='_blank';
    title.appendChild(a);
    li.appendChild(title);

    if(r.description){const p=document.createElement('p');p.className='desc';p.textContent=r.description;li.appendChild(p)}

    const meta=document.createElement('div');meta.className='meta';
    if(r.language){const span=document.createElement('span');span.className='pill';span.textContent=r.language;meta.appendChild(span)}
    if(typeof r.stargazers_count!=='undefined'){const s=document.createElement('span');s.textContent=`★ ${r.stargazers_count}`;s.style.marginRight='8px';meta.appendChild(s)}
    if(ev.starred_at){const d=document.createElement('span');d.textContent='Starred: '+fmtDate(ev.starred_at);meta.appendChild(d)}
    li.appendChild(meta);
    ul.appendChild(li);
  });

  container.textContent='';
  container.appendChild(ul);
}

function showError(err){
  const c=document.getElementById('starred-list');
  if(c) c.textContent='Failed to load starred repositories.';
  console.error(err);
}

document.addEventListener('DOMContentLoaded',()=>{
  fetch('events.json')
    .then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.json()})
    .then(data=>{
      // if data is an object with items, try to extract array
      if(Array.isArray(data)) return renderRepos(data);
      if(data.items && Array.isArray(data.items)) return renderRepos(data.items);
      renderRepos([]);
    })
    .catch(showError);
});
