"use strict";
/* Embedded Strong's lexicon and KJV concordance, with source-hosted data by
   BibleEngine.org (public-domain dictionary and KJV, CC0 search indices).
   No user data leaves the browser beyond requesting static public data files. */
const BASE="https://bibleengine.org/v1";
const $=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const cache=new Map();
const PAGE=20;
let activeCode=null,activeWord=null,allVerseIds=[],pageIndex=0,requestSerial=0;
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
 const title=activeWord ? 'KJV word matches for “'+activeWord+'”' : 'Complete KJV Concordance for '+activeCode;
 const detail=activeWord ? ' that contain this exact word.' : ' for this Strong’s number in the KJV.';
 $("strongs-occurrences").innerHTML='<h3>'+esc(title)+'</h3>'+
 '<p>This source indexes <strong>'+n.toLocaleString()+'</strong> verse'+(n===1?"":"s")+detail+' Browse results in pages of '+PAGE+'.</p>'+
 '<div id="strongs-verses" class="strongs-verses"></div><div id="strongs-pager" class="strongs-pager"></div>';
}
async function displayPage(){
 const word=activeWord,serial=requestSerial;
 const page=pageIndex,first=page*PAGE,subset=allVerseIds.slice(first,first+PAGE);
 const verses=$("strongs-verses"),pager=$("strongs-pager");
 if(!subset.length){verses.textContent="No indexed KJV verse occurrences were returned for this dictionary entry.";pager.innerHTML="";return;}
 verses.innerHTML='<p>Loading KJV passages…</p>';
 const m=await manifest();
 const paths=[...new Set(subset.map(k=>{const n=tokenRef(k);return pad(n.book,2)+"/"+pad(n.chapter,3);} ))];
 const chapters=await Promise.all(paths.map(p=>getJson(BASE+"/kjv/"+p+".json")));
 if(serial!==requestSerial||page!==pageIndex)return;
 const byPath=Object.fromEntries(paths.map((p,i)=>[p,chapters[i]]));
 const result=subset.map(k=>{
  const p=tokenRef(k),ref=bookName(m,p.book)+" "+p.chapter+":"+p.verse;
  const verse=byPath[pad(p.book,2)+"/"+pad(p.chapter,3)]?.[p.verse];
  const queryURL="https://www.biblegateway.com/passage/?search="+encodeURIComponent(ref)+"&version=KJV";
  const text=String(verse?.t||"Text unavailable in source").replace(/[‹›¶]/g,"").replace(/\[(.*?)\]/g,"$1");
  const codes=word ? [...new Set((Array.isArray(verse?.w) ? verse.w : [])
   .filter(token=>normalizeWord(token[0]).replace(/[^a-z']/g,"")===word)
   .flatMap(token=>Array.isArray(token[1]) ? token[1].map(standardCode).filter(Boolean) : []))] : [];
  const tags=codes.length ? '<div class="strongs-token">Open Strong’s '+codes.map(lookupButton).join(" ")+'</div>' : "";
  return '<article class="strongs-verse"><a href="'+esc(queryURL)+'" target="_blank" rel="noopener noreferrer">'+esc(ref)+' ↗</a><p>'+esc(text)+'</p>'+tags+'</article>';
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
 activeCode=code;activeWord=null;pageIndex=0;allVerseIds=[];
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
function normalizeWord(value){
 return String(value??"").normalize("NFKD").replace(/\p{M}/gu,"").toLowerCase().trim().replace(/ς/g,"σ").replace(/’/g,"'");
}
function lookupButton(code){
 return '<button type="button" data-lookup="'+esc(code)+'">'+esc(code)+'</button>';
}
async function findLexiconNames(query){
 const bucket=[...query][0].codePointAt(0).toString(16);
 const keys=await getJson("./strongs-words/buckets.json");
 if(!keys.includes(bucket))return [];
 const records=await getJson("./strongs-words/"+bucket+".json");
 return records.filter(([,original,spelling])=>normalizeWord(original)===query||normalizeWord(spelling)===query);
}
async function findKJVWord(word){
 const meta=await getJson(BASE+"/index/meta.json");
 if(meta.stopwords.includes(word))return {excluded:true,ids:[]};
 const bucket=await getJson(BASE+"/index/words/"+word[0]+".json");
 const ids=Array.isArray(bucket[word]) ? bucket[word].filter(Number.isFinite).sort((a,b)=>a-b) : [];
 return {excluded:false,ids};
}
function showLexiconChoices(matches){
 if(!matches.length)return;
 $("strongs-entry").innerHTML='<h3>Strong’s dictionary matches</h3><div class="strongs-token-grid">'+
 matches.map(([code,original,spelling])=>'<div class="strongs-token"><strong dir="auto">'+
 esc(original)+' '+esc(spelling)+'</strong>'+lookupButton(code)+'</div>').join("")+'</div>';
}
async function searchConcordance(input){
 const raw=String(input).trim();
 if(standardCode(raw)||/^[hg]\s*\d/i.test(raw)){
  await lookup(raw.replace(/^([hg])\s+/i,"$1"));
  return;
 }

 const serial=++requestSerial;
 activeCode=null;activeWord=null;pageIndex=0;allVerseIds=[];
 $("strongs-entry").innerHTML="";$("strongs-occurrences").innerHTML="";
 const query=normalizeWord(raw);
 if(!query){
  setStatus("strongs-status","Enter a Strong’s number or a word.",true);
  return;
 }
 if(/^\d+$/.test(query)){
  const codes=["H","G"].map(language=>standardCode(language+query)).filter(Boolean);
  showLexiconChoices(codes.map(code=>[code,"",code[0]==="H"?"Hebrew":"Greek"]));
  setStatus("strongs-status",codes.length?"Choose the language for Strong’s number "+Number(query)+".":"That number is outside the Strong’s range.",!codes.length);
  return;
 }
 if(!/\p{L}/u.test(query)){
  setStatus("strongs-status","Enter a word, an original-language spelling, or a Strong’s number such as G26.",true);
  return;
 }

 setStatus("strongs-status","Searching for “"+raw+"”…");
 const english=/^[a-z]+(?:'[a-z]+)*$/.test(query);
 const [lexicon,kjv]=await Promise.allSettled([
  findLexiconNames(query),
  english ? findKJVWord(query) : Promise.resolve({excluded:false,ids:[]})
 ]);
 if(serial!==requestSerial)return;
 const matches=lexicon.status==="fulfilled" ? lexicon.value : [];
 const wordResult=kjv.status==="fulfilled" ? kjv.value : {excluded:false,ids:[]};
 const failures=[];
 if(lexicon.status==="rejected")failures.push("Dictionary name search unavailable.");
 if(kjv.status==="rejected")failures.push("KJV word search unavailable.");
 if(wordResult.excluded)failures.push("The source omits this common word from its KJV index.");
 showLexiconChoices(matches);
 const count=wordResult.ids.length;
 const summary=matches.length+" dictionary match"+(matches.length===1?"":"es")+" and "+count.toLocaleString()+" KJV verse match"+(count===1?"":"es")+".";
 const status=matches.length||count||failures.length ? summary : "No matches for “"+raw+"”. Try another spelling or a Strong’s number.";
 setStatus("strongs-status",[status,...failures].join(" "),!matches.length&&!count&&failures.length>0);
 if(count){
  activeWord=query;
  allVerseIds=wordResult.ids;
  occurrencesHeader();
  try{await displayPage();}
  catch(e){if(serial===requestSerial)setStatus("strongs-status","Could not load verses: "+e.message,true);}
 }
}
$("strongs-form").addEventListener("submit",e=>{e.preventDefault();searchConcordance($("strongs-code").value);});
for(const id of ["strongs-entry","strongs-occurrences"]){
 $(id).addEventListener("click",e=>{
  const button=e.target.closest("[data-lookup]");
  if(!button)return;
  lookup(button.dataset.lookup);
  $("strongs-code").focus();
 });
}
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
searchConcordance(seed);
