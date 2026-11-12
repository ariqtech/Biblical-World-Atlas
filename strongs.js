"use strict";
/* Embedded Strong's lexicon and KJV concordance, with source-hosted data by
   BibleEngine.org (public-domain dictionary and KJV, CC0 search indices).
   No user data leaves the browser beyond requesting static public data files. */
const BASE="https://bibleengine.org/v1";
const $=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const cache=new Map();
const PAGE=20;
let activeCode=null,allVerseIds=[],pageIndex=0,requestSerial=0;
const BOOK_ALIASES={"gen":"genesis","exo":"exodus","ex":"exodus","lev":"leviticus","num":"numbers","deut":"deuteronomy","dt":"deuteronomy","jos":"joshua","ps":"psalms","psalm":"psalms","psa":"psalms","prov":"proverbs","pr":"proverbs","isa":"isaiah","jer":"jeremiah","ezek":"ezekiel","ez":"ezekiel","dan":"daniel","mt":"matthew","matt":"matthew","mk":"mark","mr":"mark","lk":"luke","jn":"john","jhn":"john","rom":"romans","1 cor":"1 corinthians","2 cor":"2 corinthians","1 tim":"1 timothy","2 tim":"2 timothy","rev":"revelation","re":"revelation"};
function setStatus(id,message,error=false){const el=$(id);el.textContent=message;el.classList.toggle("error",error);}
function pad(n,len){return String(n).padStart(len,"0");}
async function getJson(url){
 if(!cache.has(url)){
  const p=fetch(url).then(r=>{if(!r.ok)throw new Error("Source returned "+r.status);return r.json();}).catch(err=>{cache.delete(url);throw err;});
  cache.set(url,p);
 }
 return cache.get(url);
}
function standardCode(input){
 const m=/^([HG])0*([1-9][0-9]{0,4})$/i.exec(String(input).trim());
 if(!m)return null;
 const letter=m[1].toUpperCase(),number=Number(m[2]);
 if(number>(letter==="H"?8674:5624))return null;
 return letter+number;
}
function safeExpanded(value){
 const doc=new DOMParser().parseFromString(String(value||""),"text/html");
 return (doc.body.textContent||"").replace(/\s+/g," ").trim();
}
function tokenRef(verseId){
 const id=Number(verseId);
 return {book:Math.floor(id/1000000),chapter:Math.floor(id/1000)%1000,verse:id%1000};
}
async function manifest(){return getJson(BASE+"/kjv/manifest.json");}
function bookName(manifestData,number){
 const book=(manifestData.books||[]).find(b=>Number(b.id)===number);
 return book?.name || ("Book "+number);
}
function wordURL(code){return "https://biblehub.com/"+(code[0]==="H"?"hebrew":"greek")+"/"+Number(code.slice(1))+".htm";}
function showLexicon(code,record){
 const part=code[0]==="H"?"Hebrew":"Greek";
 const name=record.o||"(word form not supplied)";
 const data=[
  ["Transliteration",record.tr],
  ["Pronunciation",record.ph],
  ["Part of speech",record.pos],
  ["Derivation / etymology",record.et],
  ["Dictionary cross-reference",record.ref]
 ].filter(x=>x[1]);
 const details=data.map(([label,value])=>'<div><strong>'+esc(label)+'</strong>'+esc(value)+'</div>').join("");
 const meaning=record.str||safeExpanded(record.ipd)||"The source has no definition for this entry.";
 const expanded=record.ipd?safeExpanded(record.ipd):"";
 $("strongs-entry").innerHTML=
  '<span class="strongs-strong-number">'+esc(code)+' · Strong’s '+part+' Dictionary</span>'+
  '<h3>'+esc(code)+' — '+esc(part)+' word study</h3>'+
  '<p class="strongs-lemma" dir="'+(part==="Hebrew"?"rtl":"ltr")+'">'+esc(name)+'</p>'+
  '<p><strong>Strong’s concise definition</strong></p><div class="strongs-definition">'+esc(meaning)+'</div>'+
  (expanded&&expanded!==meaning?'<p><strong>Expanded definition</strong></p><div class="strongs-definition">'+esc(expanded)+'</div>':"")+
  (details?'<div class="strongs-meta">'+details+'</div>':"")+
  '<p><a href="'+esc(wordURL(code))+'" target="_blank" rel="noopener noreferrer">Compare this entry in another lexicon ↗</a></p>';
}
function occurrencesHeader(){
 const n=allVerseIds.length;
 $("strongs-occurrences").innerHTML='<h3>Complete KJV Concordance for '+esc(activeCode)+'</h3>'+
 '<p>This source indexes <strong>'+n.toLocaleString()+'</strong> verse'+(n===1?"":"s")+' for this Strong’s number in the KJV. Browse all results in pages of '+PAGE+'.</p>'+
 '<div id="strongs-verses" class="strongs-verses"></div><div id="strongs-pager" class="strongs-pager"></div>';
}
async function displayPage(){
 const id=activeCode,serial=requestSerial;
 const first=pageIndex*PAGE,subset=allVerseIds.slice(first,first+PAGE);
 const verses=$("strongs-verses"),pager=$("strongs-pager");
 if(!subset.length){verses.textContent="No indexed KJV verse occurrences were returned for this dictionary entry.";pager.innerHTML="";return;}
 verses.innerHTML='<p>Loading KJV passages…</p>';
 const m=await manifest();
 const bookNames=m.books||[];
 const paths=[...new Set(subset.map(k=>{const n=tokenRef(k);return pad(n.book,2)+"/"+pad(n.chapter,3);} ))];
 const chapters=await Promise.all(paths.map(p=>getJson(BASE+"/kjv/"+p+".json")));
 if(serial!==requestSerial||id!==activeCode)return;
 const byPath=Object.fromEntries(paths.map((p,i)=>[p,chapters[i]]));
 const result=subset.map(k=>{
  const p=tokenRef(k),ref=bookName(m,p.book)+" "+p.chapter+":"+p.verse;
  const verse=byPath[pad(p.book,2)+"/"+pad(p.chapter,3)]?.[p.verse];
  const queryURL="https://www.biblegateway.com/passage/?search="+encodeURIComponent(ref)+"&version=KJV";
  const text=String(verse?.t||"Text unavailable in source").replace(/[‹›¶]/g,"").replace(/\[(.*?)\]/g,"$1");
  return '<article class="strongs-verse"><a href="'+esc(queryURL)+'" target="_blank" rel="noopener noreferrer">'+esc(ref)+' ↗</a><p>'+esc(text)+'</p></article>';
 }).join("");
 verses.innerHTML=result;
 const pages=Math.ceil(allVerseIds.length/PAGE);
 pager.innerHTML='<button type="button" id="strongs-prev" '+(pageIndex===0?"disabled":"")+'>Previous '+PAGE+'</button>'+
 '<span>Verses '+(first+1)+'–'+Math.min(first+PAGE,allVerseIds.length)+' of '+allVerseIds.length+' · Page '+(pageIndex+1)+' of '+pages+'</span>'+
 '<button type="button" id="strongs-next" '+(pageIndex>=pages-1?"disabled":"")+'>Next '+PAGE+'</button>';
 $("strongs-prev").addEventListener("click",()=>{if(pageIndex>0){pageIndex--;displayPage().catch(e=>setStatus("strongs-status","Could not load verses: "+e.message,true));}});
 $("strongs-next").addEventListener("click",()=>{if(pageIndex<pages-1){pageIndex++;displayPage().catch(e=>setStatus("strongs-status","Could not load verses: "+e.message,true));}});
}
async function lookup(codeInput){
 const code=standardCode(codeInput);
 if(!code){setStatus("strongs-status","Use G followed by 1–5624 or H followed by 1–8674 (for example G26 or H430).",true);return;}
 const serial=++requestSerial;
 $("strongs-code").value=code;
 activeCode=code;pageIndex=0;allVerseIds=[];
 $("strongs-entry").innerHTML="";$("strongs-occurrences").innerHTML="";
 setStatus("strongs-status","Loading "+code+" from the original Strong’s dictionaries and KJV index…");
 const lang=code[0],number=Number(code.slice(1));
 const lexURL=BASE+"/lexicon/"+lang+"/"+Math.floor(number/100)+".json";
 const occurrenceURL=BASE+"/index/strongs/"+lang+"/"+Math.floor(number/1000)+".json";
 try{
  const [dictionary,concordance]=await Promise.all([getJson(lexURL),getJson(occurrenceURL)]);
  if(serial!==requestSerial)return;
  const entry=dictionary?.[code];
  if(!entry){setStatus("strongs-status","No dictionary entry was returned for "+code+". Try another number or open the source dictionary.",true);
   $("strongs-entry").innerHTML='<a href="'+esc(wordURL(code))+'" target="_blank" rel="noopener noreferrer">Open '+esc(code)+' in an external lexicon ↗</a>';return;
  }
  showLexicon(code,entry);
  allVerseIds=Array.isArray(concordance?.[code])?concordance[code].filter(Number.isFinite).sort((a,b)=>a-b):[];
  setStatus("strongs-status","Loaded "+code+": "+(entry.tr||entry.o||"dictionary entry")+".");
  occurrencesHeader();
  await displayPage();
 }catch(e){
  if(serial!==requestSerial)return;
  setStatus("strongs-status","The external dictionary data is temporarily unavailable. Check your connection or open the linked source below.",true);
  $("strongs-entry").innerHTML='<p><a href="'+esc(wordURL(code))+'" target="_blank" rel="noopener noreferrer">View '+esc(code)+' at Bible Hub ↗</a></p><p><a href="https://bibleengine.org/advanced" target="_blank" rel="noopener noreferrer">View source data information ↗</a></p>';
 }
}
$("strongs-form").addEventListener("submit",e=>{e.preventDefault();lookup($("strongs-code").value);});
document.querySelectorAll("[data-strongs]").forEach(b=>b.addEventListener("click",()=>lookup(b.dataset.strongs)));
function canonicalBookName(raw){
 return String(raw).toLowerCase().trim().replace(/\s+/g," ");
}
function locateBook(name,books){
 const canon=canonicalBookName(name);
 const alias=BOOK_ALIASES[canon]||canon;
 return books.find(b=>canonicalBookName(b.name)===alias)||null;
}
async function showVerse(input){
 const match=/^(.+?)\s+(\d{1,3}):(\d{1,3})$/.exec(String(input).trim());
 if(!match){setStatus("verse-status","Enter one verse, such as Genesis 1:1 or John 3:16.",true);return;}
 setStatus("verse-status","Loading original-language word tags for "+input+"…");
 $("verse-words").innerHTML="";
 try{
  const m=await manifest(),book=locateBook(match[1],m.books||[]);
  if(!book){setStatus("verse-status","The book name was not recognized. Try the full Bible book name, such as Genesis or 1 Corinthians.",true);return;}
  const chapter=Number(match[2]),verse=Number(match[3]);
  if(chapter<1||chapter>(book.chapters?.length||0)||verse<1){setStatus("verse-status","The chapter or verse is outside this book's range.",true);return;}
  const content=await getJson(BASE+"/kjv/"+pad(Number(book.id),2)+"/"+pad(chapter,3)+".json");
  const record=content?.[verse];
  if(!record){setStatus("verse-status","That verse was not found in the KJV index.",true);return;}
  const ref=book.name+" "+chapter+":"+verse;
  const tokens=Array.isArray(record.w)?record.w:[];
  const grid=tokens.map(t=>{
   const word=t[0]||"",numbers=Array.isArray(t[1])?t[1].filter(n=>standardCode(n)):[];
   const links=numbers.map(n=>'<button type="button" data-lookup="'+esc(standardCode(n))+'">'+esc(standardCode(n))+'</button>').join("");
   return '<div class="strongs-token"><strong>'+esc(word)+'</strong><small>'+(numbers.length?"Original-language reference":"No Strong’s identifier")+'</small>'+links+'</div>';
  }).join("");
  $("verse-words").innerHTML='<h3>'+esc(ref)+'</h3><p>'+esc(String(record.t).replace(/[‹›¶]/g,""))+'</p>'+
  '<p>Select a Strong’s number below to study its dictionary entry and all indexed verses.</p>'+
  '<div class="strongs-token-grid">'+grid+'</div>';
  setStatus("verse-status",tokens.length+" tagged word group"+(tokens.length===1?"":"s")+" loaded for "+ref+".");
 }catch(e){setStatus("verse-status","Could not retrieve the KJV word data. Check your internet connection and try again.",true);}
}
$("verse-form").addEventListener("submit",e=>{e.preventDefault();showVerse($("verse-reference").value);});
$("verse-words").addEventListener("click",e=>{
 const button=e.target.closest("[data-lookup]");
 if(!button)return;
 lookup(button.dataset.lookup);
 $("strongs-tool").scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"});
});
const params=new URL(location.href).searchParams;
const seed=params.get("strong")||"G26";
lookup(seed);
