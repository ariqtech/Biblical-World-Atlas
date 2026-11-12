"use strict";
const search=document.getElementById("atlas-search");
const filter=document.getElementById("atlas-filter");
const count=document.getElementById("atlas-count");
const cards=document.getElementById("atlas-cards");
function safe(value){return String(value).replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));}
function cardHTML(m) {
 const preview="./assets/map-previews/"+m.id+".webp";
 const verses="https://www.biblegateway.com/passage/?search="+encodeURIComponent(m.passage)+"&version=KJV";
 const translation="./bible-library.html?passage="+encodeURIComponent(m.passage);
 return '<article class="atlas-card" id="map-'+safe(m.id)+'">'+
 '<a class="atlas-image-link" href="'+safe(m.source)+'" target="_blank" rel="noopener noreferrer" aria-label="Open original map and source for '+safe(m.title)+'"><img loading="lazy" src="'+safe(preview)+'" alt="Original 1888 American Bible Society map: '+safe(m.title)+'. Historical cartographic interpretation." decoding="async"></a>'+
 '<div class="atlas-card-content"><span class="atlas-meta">American Bible Society · 1888 · '+safe(m.period)+'</span><h3>'+safe(m.title)+'</h3><p>'+safe(m.description)+'</p><p class="atlas-ref">Related passages: '+safe(m.references)+'</p><p class="source-uncertainty">Classification: historical map document; depicted routes and boundaries may be interpretive.</p>'+
 '<div class="atlas-card-actions"><a href="'+safe(m.source)+'" target="_blank" rel="noopener noreferrer">Open original map ↗</a><a class="secondary" href="'+safe(verses)+'" target="_blank" rel="noopener noreferrer">Read related KJV ↗</a><a class="secondary" href="'+safe(translation)+'">Choose a Bible translation →</a></div>'+
 '<p>Image source: <a href="https://www.godweb.org/maps/bmap00.htm" target="_blank" rel="noopener noreferrer">GodWeb, American Bible Society 1888 collection</a> (public domain per the host).</p></div></article>';
}
function renderMaps(){
 const q=search.value.toLocaleLowerCase().trim();
 const era=filter.value;
 const selection=HISTORICAL_MAPS.filter(m=>(era==="all"||m.era===era)&&(!q||[m.title,m.period,m.references,m.description,m.terms].join(" ").toLocaleLowerCase().includes(q)));
 count.textContent=selection.length+" of "+HISTORICAL_MAPS.length+" historical maps shown.";
 cards.innerHTML=selection.length?selection.map(cardHTML).join(""):'<div class="source-note">No matching maps. Try a different search or reset the filters.</div>';
 cards.querySelectorAll("img").forEach(img=>{
  img.addEventListener("error",()=>{
   const wrapper=img.parentElement;
   img.remove();
   const note=document.createElement("span");
   note.className="atlas-image-unavailable";
   note.textContent="The image could not load. Select this panel to view the original map at its source.";
   wrapper.append(note);
  },{once:true});
 });
}
search.addEventListener("input",renderMaps);
filter.addEventListener("change",renderMaps);
document.getElementById("atlas-reset").addEventListener("click",()=>{
 search.value="";filter.value="all";renderMaps();search.focus();
});
const url=new URL(window.location.href);
const seed=url.searchParams.get("search");
if(seed)search.value=seed.slice(0,100);
renderMaps();
// The cards are rendered after page parsing, so resolve incoming map anchors here.
const linkedMap=document.getElementById(url.hash.slice(1));
if(linkedMap?.classList.contains("atlas-card"))linkedMap.scrollIntoView();
