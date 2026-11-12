"use strict";
const PERIOD_NAMES={pre1500:"Before 1500","1500":"1500–1599","1600":"1600–1699","1700":"1700–1799","1800":"1800–1899","1900":"1900–1999","2000":"2000–present"};
const TYPE_NAMES={manuscript:"Manuscript map",printed:"Printed map / atlas",globe:"Planisphere / globe",science:"Scientific mapping"};
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
let MAPS=[];
function makeCard(r){
 const date=(r.year===1300||r.year===1450?"c. ":"")+r.year;
 return '<article class="historic-card"><a class="historic-preview" href="'+esc(r.url)+'" target="_blank" rel="noopener noreferrer" aria-label="View original archive source for '+esc(r.title)+'">'+
 '<span class="historic-no-image"><strong>'+esc(date)+'</strong><span>Open the original archival map and high-resolution viewer</span></span></a>'+
 '<div class="historic-card-body"><span class="historic-label">'+esc(PERIOD_NAMES[r.period])+' · '+esc(TYPE_NAMES[r.type])+'</span>'+
 '<h3>'+esc(r.title)+'</h3><p class="historic-date">'+esc(date)+' · '+esc(r.institution)+'</p>'+
 '<p>'+esc(r.summary)+'</p><div class="historic-attributes"><strong>Evidence note:</strong> '+esc(r.evidence)+'</div>'+
 '<div class="historic-card-actions"><a href="'+esc(r.url)+'" target="_blank" rel="noopener noreferrer">View original map & source ↗</a>'+
 '<a class="secondary" href="./biblical-maps.html">Bible-map collection ↗</a></div></div></article>';
}
function draw(){
 const q=$("historic-search").value.trim().toLocaleLowerCase().slice(0,120),p=$("historic-period").value,t=$("historic-genre").value;
 const filtered=MAPS.filter(r=>(p==="all"||r.period===p)&&(t==="all"||r.type===t)&&(!q||[r.title,r.institution,r.summary,r.evidence,r.year,r.keywords].join(" ").toLocaleLowerCase().includes(q)));
 $("historic-count").textContent=filtered.length+" of "+MAPS.length+" archival map records found.";
 $("historic-cards").innerHTML=filtered.length?filtered.map(makeCard).join(""):'<p class="historic-empty">No maps found. Try another term or reset the filters.</p>';
}
function reset(){ $("historic-search").value="";$("historic-period").value="all";$("historic-genre").value="all";draw();$("historic-search").focus(); }
$("historic-search").addEventListener("input",draw);
$("historic-period").addEventListener("change",draw);
$("historic-genre").addEventListener("change",draw);
$("historic-clear").addEventListener("click",reset);
const params=new URL(location.href).searchParams;
const query=params.get("search"),period=params.get("period");
if(query)$("historic-search").value=query.slice(0,120);
if(period && Object.prototype.hasOwnProperty.call(PERIOD_NAMES,period))$("historic-period").value=period;
fetch("./historical-map-catalog.json").then(response=>{if(!response.ok)throw new Error("Catalog unavailable");return response.json();}).then(payload=>{
 MAPS=Array.isArray(payload.records)?payload.records.filter(r=>r && typeof r.title==="string" && typeof r.url==="string" && r.url.startsWith("https://")):[];
 draw();
}).catch(()=>{$("historic-count").textContent="Map catalog unavailable."; $("historic-cards").innerHTML='<p class="historic-empty">Could not load the map catalog. Reload this page or use the archival collection links below.</p>';});
