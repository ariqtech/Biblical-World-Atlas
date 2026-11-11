"use strict";
/* Historical primary-source map catalog. Images ©? American Bible Society 1888 (public domain),
   hosted and identified as public domain by GodWeb. Modern map accuracy is not implied. */
const HISTORICAL_MAPS = [
 {id:"sinai",title:"Sinai: the Israelites' journeys",image:"https://www.godweb.org/maps/img/000.jpg",source:"https://www.godweb.org/maps/109.htm",era:"ot",period:"Exodus and wilderness",references:"Exodus 13–17; Numbers 33",passage:"Exodus 14; Numbers 33",description:"Historical reconstruction of routes proposed for the journey from Egypt through Sinai. Route identifications are debated.",terms:"moses egypt exodus wilderness sinai red sea journeys route"},
 {id:"tribes",title:"Canaan divided among the tribes",image:"https://www.godweb.org/maps/img/002.jpg",source:"https://www.godweb.org/maps/110.htm",era:"ot",period:"Israelite tribal territories",references:"Joshua 13–21",passage:"Joshua 13; Joshua 18",description:"An 1888 visual interpretation of territorial divisions. Ancient boundaries are reconstructed, not directly measured.",terms:"canaan israel tribes joshua conquest judah benjamin manasseh ephraim"},
 {id:"david-solomon",title:"The dominion of David and Solomon",image:"https://www.godweb.org/maps/img/003.jpg",source:"https://www.godweb.org/maps/111.htm",era:"ot",period:"United monarchy",references:"2 Samuel 5–8; 1 Kings 4",passage:"2 Samuel 8; 1 Kings 4",description:"The cartographer's representation of biblical royal territories, which depend on the historical interpretation used.",terms:"david solomon monarchy jerusalem israel kingdoms"},
 {id:"divided-kingdoms",title:"Kingdoms of Judah and Israel",image:"https://www.godweb.org/maps/img/004.jpg",source:"https://www.godweb.org/maps/112.htm",era:"ot",period:"Divided monarchy",references:"1 Kings 12; 2 Kings 17",passage:"1 Kings 12; 2 Kings 17",description:"Traditional study map locating the kingdoms of Judah and Israel and neighboring places.",terms:"israel judah kingdom samaria galilee jerusalem prophets"},
 {id:"assyria",title:"Assyria and adjacent lands",image:"https://www.godweb.org/maps/img/005.jpg",source:"https://www.godweb.org/maps/114.htm",era:"ot",period:"Patriarchs and captivities",references:"Genesis 11:27–32; 2 Kings 17–19",passage:"Genesis 11:27-32; 2 Kings 17",description:"Historic map of the Near East showing Assyria, Babylon and neighboring geographical names, connected to patriarchal and exile narratives.",terms:"assyria mesopotamia babylon euphrates tigris nile ur exile ancient near east"},
 {id:"christ",title:"Palestine in the time of Christ",image:"https://www.godweb.org/maps/img/006.jpg",source:"https://www.godweb.org/maps/115.htm",era:"nt",period:"First-century biblical world",references:"Matthew 2–4; Luke 2–4",passage:"Luke 2; Mark 1",description:"Nineteenth-century representation of Judea, Galilee and nearby regions associated with the Gospel accounts.",terms:"jesus christ judea galilee jerusalem bethlehem nazareth gospel"},
 {id:"jerusalem",title:"Plan of Ancient Jerusalem",image:"https://www.godweb.org/maps/img/007.jpg",source:"https://www.godweb.org/maps/116.htm",era:"cross",period:"Ancient city plan",references:"2 Samuel 5:6–10; 1 Kings 6; Luke 19",passage:"2 Samuel 5; Luke 19",description:"A historical city-plan interpretation from an older biblical atlas. Its gates, walls and construction phases should be checked against modern archaeology.",terms:"jerusalem temple david solomon jesus city zion history archaeology"},
 {id:"paul",title:"Missionary journeys and final voyage of Paul",image:"https://www.godweb.org/maps/img/001.jpg",source:"https://www.godweb.org/maps/117.htm",era:"nt",period:"Early Christian missions",references:"Acts 13–28",passage:"Acts 13; Acts 27",description:"Historical map showing portions of Paul's journeys in the eastern Mediterranean and the voyage toward Rome.",terms:"paul acts rome greece corinth ephesus missionary journey mediterranean sea"}
];
const search=document.getElementById("atlas-search");
const filter=document.getElementById("atlas-filter");
const count=document.getElementById("atlas-count");
const cards=document.getElementById("atlas-cards");
function safe(value){return String(value).replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));}
function cardHTML(m) {
 const verses="https://www.biblegateway.com/passage/?search="+encodeURIComponent(m.passage)+"&version=KJV";
 return '<article class="atlas-card" id="map-'+safe(m.id)+'">'+
 '<a class="atlas-image-link" href="'+safe(m.source)+'" target="_blank" rel="noopener noreferrer" aria-label="Open original map and source for '+safe(m.title)+'"><img loading="lazy" src="'+safe(m.image)+'" alt="Original 1888 American Bible Society map: '+safe(m.title)+'. Historical cartographic interpretation." decoding="async"></a>'+
 '<div class="atlas-card-content"><span class="atlas-meta">American Bible Society · 1888 · '+safe(m.period)+'</span><h3>'+safe(m.title)+'</h3><p>'+safe(m.description)+'</p><p class="atlas-ref">Related passages: '+safe(m.references)+'</p><p class="source-uncertainty">Classification: historical map document; depicted routes and boundaries may be interpretive.</p>'+
 '<div class="atlas-card-actions"><a href="'+safe(m.source)+'" target="_blank" rel="noopener noreferrer">Open original map ↗</a><a class="secondary" href="'+safe(verses)+'" target="_blank" rel="noopener noreferrer">Read related KJV ↗</a></div>'+
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
