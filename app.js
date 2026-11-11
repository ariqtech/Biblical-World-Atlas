"use strict";
const ENTRIES = [
 {title:"Garden of Eden and its rivers", type:"geography", references:"Genesis 2:8–14", summary:"Genesis names Pishon, Gihon, Hiddekel (Tigris) and Euphrates. The garden's exact geographical location has not been established.", source:"https://www.biblegateway.com/passage/?search=Genesis%202%3A8-14&version=KJV", tags:"eden river rivers pishon gihon tigris euphrates maps"},
 {title:"The Euphrates River",type:"geography", references:"Genesis 2:14; Genesis 15:18",summary:"A documented river of western Asia named in biblical accounts. Distinguish its modern watercourse from any hypothetical ancient placement.",source:"https://www.biblegateway.com/passage/?search=Genesis%2015%3A18&version=KJV",tags:"river rivers euphrates geography"},
 {title:"Enoch: two named people",type:"scripture",references:"Genesis 4:17–18; Genesis 5:18–24",summary:"The Enoch descended from Cain and the Enoch descended from Seth are distinct biblical individuals. The latter is associated with later Enoch traditions.",source:"https://www.biblegateway.com/passage/?search=Genesis%204%3A17-18%3BGenesis%205%3A18-24&version=KJV",tags:"enoch genealogy ancestors book of enoch"},
 {title:"Jude and 1 Enoch",type:"scripture",references:"Jude 1:14–15; 1 Enoch 1:9",summary:"Jude contains a close quotation associated with 1 Enoch 1:9. This is a literary relationship; biblical canons differ in how they classify Enoch.",source:"https://www.biblegateway.com/passage/?search=Jude%201%3A14-15&version=KJV",tags:"enoch jude quotations ancient books manuscripts"},
 {title:"Jubilees and Genesis",type:"scripture",references:"Genesis 5:18–24; Jubilees 4:16–26",summary:"Jubilees expands genealogical traditions involving Enoch. Compare the passages carefully and distinguish their literary genres and manuscript traditions.",source:"https://www.biblegateway.com/passage/?search=Genesis%205%3A18-24&version=KJV",tags:"jubilees enoch genesis genealogy ancient writings"},
 {title:"Watchers and Book of Giants",type:"scripture",references:"Genesis 6:1–4; 1 Enoch 6–11; Book of Giants fragments",summary:"Related ancient traditions appear in 1 Enoch and fragmentary Book of Giants manuscripts. The fragments are not a continuous surviving book.",source:"https://www.biblegateway.com/passage/?search=Genesis%206%3A1-4&version=KJV",tags:"giants watchers nephilim enoch book of giants"},
 {title:"Joshua and the Book of Jashar",type:"scripture",references:"Joshua 10:12–13; 2 Samuel 1:18",summary:"These biblical passages name the Book of Jashar. Its original identity is uncertain; later works bearing the title are not automatically the same text.",source:"https://www.biblegateway.com/passage/?search=Joshua%2010%3A12-13%3B2%20Samuel%201%3A18&version=KJV",tags:"jashar jasher ancient books joshua"},
 {title:"Jerusalem",type:"geography",references:"2 Samuel 5:6–10; 1 Kings 6; Luke 19",summary:"A historically documented city with extensive biblical, archaeological and later Jewish and Christian sources. Maps should cite datasets and dates.",source:"https://www.openbible.info/geo/",tags:"jerusalem cities israel judaea temple maps"},
 {title:"Paul's missionary journeys",type:"geography",references:"Acts 13–28",summary:"Study travel locations in Acts alongside archaeological evidence and historically attested place names. Not every exact journey segment is known.",source:"https://www.biblegateway.com/passage/?search=Acts%2013&version=KJV",tags:"paul maps routes mediterranean sea"},
 {title:"The twelve tribes of Israel",type:"history",references:"Joshua 13–21",summary:"Compare the territorial descriptions in Joshua with ancient Near Eastern scholarship and study-Bible maps; boundary reconstructions may differ.",source:"https://www.biblegateway.com/passage/?search=Joshua%2013&version=KJV",tags:"maps tribes canaan kingdom history"},
 {title:"Prophets and historical context",type:"history",references:"Isaiah; Jeremiah; Ezekiel; Daniel",summary:"Study prophetic texts alongside dated kingdoms, rulers and archaeology. Keep interpretive claims distinct from established geography.",source:"https://www.biblegateway.com/passage/?search=Isaiah%201&version=KJV",tags:"prophecy prophecies prophets history assyria babylon"},
 {title:"Trees and ancient botanical terms",type:"history",references:"Genesis 2; 1 Kings 6:29; Ezekiel 31",summary:"Explore textual tree names, ancient imagery and botanical identifications, recording uncertainty where species translations differ.",source:"https://www.biblegateway.com/passage/?search=Ezekiel%2031&version=KJV",tags:"trees tree garden botanical nature"},
 {title:"Antarctica: documented maps, ice and Bible themes",type:"geography",references:"Job 38:29–30; Job 37:10; Psalm 147:16–17; Genesis 1:9–10 (thematic only)",summary:"Study the Antarctic continent, British Antarctic Survey maps, NASA/USGS satellite imagery, coastlines, ice shelves and Antarctic Treaty. No biblical passage explicitly identifies Antarctica; Bible references about ice and snow are thematic rather than geographical proof.",source:"./antarctica.html",tags:"antarctica antarctic ice wall polar map maps southern ocean ice shelf treaty snow ice job scripture bible"},
 {title:"Seas and coastlines",type:"geography",references:"Genesis 1:10; Jonah 1; Acts 27",summary:"Compare scriptural sea references with documented coastal geography and dated historical charts.",source:"https://www.biblegateway.com/passage/?search=Acts%2027&version=KJV",tags:"oceans ocean sea seas mediterranean maps"},
 {title:"Ethiopian Orthodox biblical tradition",type:"scripture",references:"Canon varies by tradition and enumeration",summary:"Study Geʽez traditions and their broader canonical collections with accurate manuscript and edition distinctions. No single modern English 81-book compilation is assumed authoritative.",source:"https://www.britannica.com/topic/biblical-literature",tags:"ethiopian bible geez meqabyan ancient writings canon"},
 {title:"Historical study-Bible maps",type:"geography",references:"Exodus 13–17; Joshua 13–21; 1–2 Kings; Luke 2–4; Acts 13–28",summary:"Browse eight original American Bible Society (1888) atlas plates: Exodus, tribal territories, monarchies, Assyria, Jerusalem, Jesus and Paul. Images and scripture references are connected to source pages, with historical mapping uncertainty stated.",source:"./biblical-maps.html",tags:"maps atlas egypt canaan tribes jerusalem assyria paul missionary bible maps 1888 historical archives"}
];
const $ = id => document.getElementById(id);
const escapeHTML = str => String(str).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
function evidenceForEntry(item) {
 if (item.title.includes("Garden of Eden")) return {text:"Location unverified",css:"uncertain"};
 if (["Jubilees","Enoch","Giants","Jashar","Ethiopian"].some(t=>item.title.includes(t))) return {text:"Textual reference or literary relationship",css:"context"};
 if (item.type === "scripture") return {text:"Scriptural reference",css:"context"};
 if (item.type === "geography") return {text:"Geographical study entry",css:"partial"};
 return {text:"Historical study entry",css:"partial"};
}
let currentQuery = "";
function render() {
 const filter = $("filter").value;
 const q = currentQuery.toLocaleLowerCase().trim();
 const matches = ENTRIES.filter(item => (filter==="all"||item.type===filter) && (!q||[item.title,item.summary,item.references,item.tags].join(" ").toLocaleLowerCase().includes(q)));
 $("results-count").textContent = matches.length + " curated research "+(matches.length===1?"entry":"entries")+(q?' matching “'+currentQuery+'”':"")+".";
 $("results").innerHTML = matches.length ? matches.map(item=>'<article class="result-card"><span class="type">'+escapeHTML(item.type)+'</span><h3>'+escapeHTML(item.title)+'</h3><p>'+escapeHTML(item.summary)+'</p><p class="refs">'+escapeHTML(item.references)+'</p><span class="evidence-type '+evidenceForEntry(item).css+'">'+escapeHTML(evidenceForEntry(item).text)+'</span><br><a href="'+escapeHTML(item.source)+'" target="_blank" rel="noopener noreferrer">Open source or passage ↗</a></article>').join("") : '<p>No matching entries yet. The index is still being expanded.</p>';
}
function searchFor(query) {
 currentQuery=String(query).trim().slice(0,120);
 $("site-search").value=currentQuery;
 $("filter").value="all";
 render();
 $("research").scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"});
}
$("search-form").addEventListener("submit",event=>{event.preventDefault();searchFor($("site-search").value);});
document.querySelectorAll("[data-search]").forEach(button=>button.addEventListener("click",()=>searchFor(button.dataset.search)));
$("filter").addEventListener("change",render);
$("clear-search").addEventListener("click",()=>searchFor(""));
render();
const NOTE_KEY = "biblical-world-atlas-study-note-v1";
function noteStatus(message){$("note-status").textContent=message;}
try {const saved=localStorage.getItem(NOTE_KEY);if(saved!==null)$("study-note").value=saved;}catch(error){noteStatus("Local browser storage is unavailable. Export a backup to keep your notes.");}
$("save-note").addEventListener("click",()=>{
 try{localStorage.setItem(NOTE_KEY,$("study-note").value);noteStatus("Saved in this browser on this device. Export a backup for safekeeping.");}
 catch(error){noteStatus("Could not save to browser storage. Use Export backup instead.");}
});
$("export-notes").addEventListener("click",()=>{
 const payload={format:"biblical-world-atlas-notes",version:1,exportedAt:new Date().toISOString(),note:$("study-note").value};
 const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
 const url=URL.createObjectURL(blob);
 const link=document.createElement("a");link.href=url;link.download="biblical-world-atlas-notes.json";document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
 noteStatus("Backup downloaded. Keep the file somewhere safe.");
});
$("import-notes").addEventListener("change",async event=>{
 const file=event.target.files?.[0];if(!file)return;
 if(file.size>2_000_000){noteStatus("Backup is too large. Maximum 2 MB.");event.target.value="";return;}
 try{
 const record=JSON.parse(await file.text());
 if(record?.format!=="biblical-world-atlas-notes"||record.version!==1||typeof record.note!=="string")throw new Error("Invalid format");
 if(!confirm("Replace your current note with the imported backup?"))return;
 $("study-note").value=record.note;
 try{localStorage.setItem(NOTE_KEY,record.note);}catch(error){}
 noteStatus("Backup imported. Export another copy after making further edits.");
 }catch(error){noteStatus("Could not read that backup file. No notes were changed.");}
 event.target.value="";
});
if("serviceWorker" in navigator && location.protocol==="https:"){
 window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
}