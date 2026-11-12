"use strict";
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
let SOURCES=[];
function sourceCard(r){
return '<article class="source-record"><span class="source-type-tag">'+esc(r.type)+' · '+esc(r.institution)+'</span>'+
'<h3>'+esc(r.name)+'</h3><p class="source-resource">Data type: '+esc(r.resource)+'</p>'+
'<p>'+esc(r.note)+'</p><p><strong>Files:</strong> '+esc(r.files)+'</p>'+
'<a href="'+esc(r.url)+'" '+(r.url.startsWith("https://")?'target="_blank" rel="noopener noreferrer"':'')+'>Open source link ↗</a></article>';
}
function draw(){
const text=$("source-search").value.trim().toLowerCase().slice(0,120),type=$("source-type").value;
const filtered=SOURCES.filter(r=>(type==="all"||r.type===type)&&(!text||[r.name,r.type,r.institution,r.resource,r.note,r.files].join(" ").toLowerCase().includes(text)));
$("source-count").textContent=filtered.length+" of "+SOURCES.length+" source records shown.";
$("source-results").innerHTML=filtered.length?filtered.map(sourceCard).join(""):'<p class="source-empty">No sources match the selected filters. Try another term or reset.</p>';
}
$("source-search").addEventListener("input",draw);
$("source-type").addEventListener("change",draw);
$("source-reset").addEventListener("click",()=>{$("source-search").value="";$("source-type").value="all";draw();$("source-search").focus();});
const q=new URL(location.href).searchParams.get("search");
if(q)$("source-search").value=q.slice(0,120);
fetch("./research-source-directory.json").then(r=>{if(!r.ok)throw new Error("Directory unavailable");return r.json();}).then(data=>{
 SOURCES=Array.isArray(data.sources)?data.sources.filter(s=>s&&typeof s.url==="string"&&(s.url.startsWith("https://")||s.url.startsWith("./"))):[];
 const options=[...new Set(SOURCES.map(s=>s.type))].sort();
 $("source-type").innerHTML='<option value="all">All categories</option>'+options.map(type=>'<option value="'+esc(type)+'">'+esc(type)+'</option>').join("");
 draw();
}).catch(()=>{$("source-count").textContent="Source list unavailable."; $("source-results").innerHTML='<p class="source-empty">The source directory did not load. Try refreshing or follow the archive links from the other research pages.</p>';});
