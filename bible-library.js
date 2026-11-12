"use strict";
const VERSIONS = [
 {code:"ASV",name:"American Standard Version (1901)",classification:"Historical public-domain English",detail:"Public-domain American English Bible.",example:"Genesis 1"},
 {code:"KJV",name:"King James Version",classification:"Historical English",detail:"Traditional English Bible. Special Crown rights may apply in the United Kingdom.",example:"2 Timothy 2:15"},
 {code:"JPS1917",name:"JPS Tanakh (1917)",classification:"Jewish Hebrew Bible",detail:"Historical Jewish Publication Society English Tanakh; read the original 1917 edition at Mechon-Mamre.",example:"Genesis 1",homepage:"https://new.mechon-mamre.org/e/et/et0.htm"},
 {code:"NKJV",name:"New King James Version",classification:"Modern English · Publisher-hosted",detail:"Authorized online reading; text is not reproduced here.",example:"John 3:16"},
 {code:"AMP",name:"Amplified Bible",classification:"Modern English · Publisher-hosted",detail:"Authorized online reading; text is not reproduced here.",example:"Romans 8"},
 {code:"AMPC",name:"Amplified Bible, Classic Edition",classification:"Modern English · Publisher-hosted",detail:"Authorized online reading; text is not reproduced here.",example:"Romans 8"},
 {code:"JUB",name:"Jubilee Bible 2000",classification:"Jubilee Bible · Publisher edition",detail:"Jubilee Bible 2000 (Russell M. Stendal); source of the atlas homepage verse.",example:"2 Timothy 2:15"},
 {code:"WEB",name:"World English Bible",classification:"Modern English · Public domain",detail:"Modern English translation freely available to read.",example:"Genesis 1"},
 {code:"BSB",name:"Berean Standard Bible",classification:"Modern English · Public domain",detail:"Modern-English public-domain translation; browse the publisher’s reading site.",example:"Genesis 1",homepage:"https://berean.bible/"},
 {code:"YLT",name:"Young's Literal Translation",classification:"Historical literal English",detail:"An older literal English Bible translation.",example:"Genesis 1"},
 {code:"DARBY",name:"Darby Bible Translation",classification:"Historical English",detail:"An older literal-oriented English edition.",example:"Genesis 1"},
 {code:"NIV",name:"New International Version",classification:"Modern English · Publisher-hosted",detail:"Authorized online reading; full text is not reproduced here.",example:"Genesis 1"},
 {code:"ESV",name:"English Standard Version",classification:"Modern English · Publisher-hosted",detail:"Authorized online reading; full text is not reproduced here.",example:"Genesis 1"},
 {code:"NLT",name:"New Living Translation",classification:"Modern English · Publisher-hosted",detail:"Authorized online reading; full text is not reproduced here.",example:"Genesis 1"},
 {code:"MSG",name:"The Message",classification:"Contemporary English · Publisher-hosted",detail:"Authorized online reading; full text is not reproduced here.",example:"Genesis 1"}
];
const $=id=>document.getElementById(id);
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const select=$("version-select"),search=$("version-search"),passage=$("passage-input"),list=$("translation-list"),count=$("translation-count"),feedback=$("reader-feedback");
function getURL(version,text){
 if(version.homepage)return version.homepage;
 return "https://www.biblegateway.com/passage/?search="+encodeURIComponent(text)+"&version="+encodeURIComponent(version.code);
}
function renderVersions(){
 const q=search.value.toLowerCase().trim();
 const versions=VERSIONS.filter(v=>(v.name+" "+v.code+" "+v.classification).toLowerCase().includes(q));
 const previous=select.value;
 select.innerHTML=versions.map(v=>'<option value="'+escapeHTML(v.code)+'">'+escapeHTML(v.name)+' ('+escapeHTML(v.code)+')</option>').join("");
 if(versions.some(v=>v.code===previous))select.value=previous;
 count.textContent=versions.length+" Bible translations found.";
 if(!versions.length){list.innerHTML='<p class="library-note">No matching editions. Try another name or abbreviation.</p>';feedback.textContent="No translation matches your search.";return;}
 list.innerHTML=versions.map(v=>'<article class="reading-card"><span class="reading-meta">'+escapeHTML(v.classification)+'</span><h3>'+escapeHTML(v.name)+'</h3><p>'+escapeHTML(v.detail)+'</p><a href="'+escapeHTML(getURL(v,v.example))+'" target="_blank" rel="noopener noreferrer">Read '+escapeHTML(v.code)+' ↗</a></article>').join("");
 feedback.textContent="Selected: "+VERSIONS.find(v=>v.code===select.value).name+".";
}
search.addEventListener("input",renderVersions);
select.addEventListener("change",()=>{const v=VERSIONS.find(x=>x.code===select.value);if(v)feedback.textContent="Selected: "+v.name+".";});
$("passage-chooser").addEventListener("submit",event=>{
 event.preventDefault();
 const v=VERSIONS.find(x=>x.code===select.value);
 if(!v){feedback.textContent="Choose a translation first.";return;}
 const text=passage.value.trim();
 if(!text){feedback.textContent="Enter a book or passage.";passage.focus();return;}
 if(v.code==="JPS1917"){
  feedback.textContent="JPS 1917 contains the Hebrew Bible (Tanakh), not the New Testament. Open its complete book index and select a chapter there.";
 }else if(v.homepage){
  feedback.textContent="Opening the publisher’s reading library for "+v.name+". Choose the passage there.";
 }else{
  feedback.textContent="Opening "+v.name+" — "+text+" in an authorized reader.";
 }
 const href=getURL(v,text);
 const link=document.createElement("a");
 link.href=href;link.target="_blank";link.rel="noopener noreferrer";
 link.textContent="Open "+v.name+" ↗";
 feedback.append(" ",link);
 link.click();
});
renderVersions();
const urlPassage=new URL(location.href).searchParams.get("passage");
if(urlPassage)passage.value=urlPassage.slice(0,120);
function updateHenryLink(){
 const parsed=window.BWA_MHC?.parseReference(passage.value);
 const link=$("henry-passage-link"),message=$("henry-passage-message");
 if(!parsed){message.textContent="Enter a Bible book and chapter (example: John 3:16 or Isaiah 53).";link.hidden=true;return;}
 message.textContent="Historical commentary on "+parsed.book+" chapter "+parsed.chapter+" (chapter-level, even if you entered a specific verse).";
 link.href=parsed.commentaryUrl;link.textContent="Read Matthew Henry on "+parsed.book+" "+parsed.chapter+" ↗";link.hidden=false;
}
passage.addEventListener("input",updateHenryLink);
updateHenryLink();

function getPassageRange(reference) {
 const match=reference.trim().match(/^(?<book>.+?)\s+(?<chapter>\d{1,3})(?::(?<verse>\d{1,3}))?(?:\s*[-–—]\s*(?<end>\d{1,3})(?::(?<endVerse>\d{1,3}))?)?$/);
 if(!match)return null;
 const {book:bookName,chapter,verse,end,endVerse}=match.groups;
 const book=window.BWA_MHC.getBook(bookName);
 const first=Number(chapter);
 // A bare number after a verse (Genesis 11:27–32) is an ending verse.
 const last=end&&(!verse||endVerse)?Number(end):first;
 if(!book||first<1||last<first||last>book.chapters)return null;
 return {book:book.name,first,last};
}

function updatePassageMaps() {
 const ranges=passage.value.split(";").map(getPassageRange).filter(Boolean);
 const maps=HISTORICAL_MAPS.filter(map=>map.chapters.some(([book,first,last=first])=>
  ranges.some(range=>range.book===book&&range.first<=last&&range.last>=first)
 ));
 const links=maps.map(map=>{
  const item=document.createElement("li");
  const link=document.createElement("a");
  link.href="./biblical-maps.html#map-"+map.id;
  link.textContent=map.title;
  item.append(link);
  return item;
 });
 $("passage-map-links").replaceChildren(...links);
 $("passage-maps").hidden=links.length===0;
}

passage.addEventListener("input",updatePassageMaps);
updatePassageMaps();
