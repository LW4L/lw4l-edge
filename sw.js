const C='lw4l-edge-v3',SCOPE=self.registration.scope;
const SHELL=['./','index.html','manifest.json','logo.png','icon-192-1.png','icon-512-1.png','icon-192.png','icon-512.png'];
const EXT=['https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js'];
const isExt=u=>u.hostname=='cdn.jsdelivr.net'||u.hostname=='fonts.googleapis.com'||u.hostname=='fonts.gstatic.com';
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>Promise.allSettled([...SHELL.map(u=>c.add(u)),...EXT.map(u=>c.add(new Request(u,{mode:'no-cors'})))]))); self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
async function notify(){const cs=await self.clients.matchAll({type:'window'});cs.forEach(c=>c.postMessage({type:'update'}))}
async function shell(e,req,key){const c=await caches.open(C),old=await c.match(key);
const upd=fetch(req).then(async r=>{if(r&&r.ok){if(old&&key.url.endsWith('index.html')){const[a,b]=await Promise.all([old.clone().text(),r.clone().text()]);await c.put(key,r.clone());if(a!==b)notify()}else await c.put(key,r.clone())}return r}).catch(()=>null);
if(old){e.waitUntil(upd);return old}const r=await upd;return r||(await c.match(new Request(SCOPE+'index.html')))||Response.error()}
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
if(u.origin===location.origin){const key=r.mode==='navigate'?new Request(SCOPE+'index.html'):r;e.respondWith(shell(e,r,key));return}
if(isExt(u)){e.respondWith(caches.open(C).then(async c=>{const m=await c.match(r);if(m)return m;try{const n=await fetch(r);if(n&&(n.ok||n.type==='opaque'))c.put(r,n.clone());return n}catch(x){return Response.error()}}))}});
