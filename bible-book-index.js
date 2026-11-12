"use strict";
(function(){
 const lib=window.BWA_MHC;
 const $=id=>document.getElementById(id);
 const groups=[
  {key:"law",title:"Law / Pentateuch",first:1,last:5,testament:"old"},
  {key:"history",title:"Historical Books",first:6,last:17,testament:"old"},
  {key:"wisdom",title:"Poetry & Wisdom",first:18,last:22,testament:"old"},
  {key:"major",title:"Major Prophets",first:23,last:27,testament:"old"},
  {key:"minor",title:"Minor Prophets",first:28,last:39,testament:"old"},
  {key:"gospels",title:"The Four Gospels",first:40,last:43,testament:"new"},
  {key:"acts",title:"Acts",first:44,last:44,testament:"new"},
  {key:"paul",title:"Letters Traditionally Attributed to Paul",first:45,last:57,testament:"new"},
  {key:"general",title:"Hebrews & General Letters",first:58,last:65,testament:"new"},
  {key:"revelation",title:"Revelation",first:66,last:66,testament:"new"}
 ];
 let active=lib.getBook("Genesis"),chapter=1;
 const TRANSLATIONS=[["KJV","King James Version (KJV)"],["NKJV","New King James Version (NKJV)"],["JUB","Jubilee Bible 2000 (JUB)"],["AMP","Amplified Bible (AMP)"],["AMPC","Amplified Bible Classic (AMPC)"],["NIV","New International Version (NIV)"],["ESV","English Standard Version (ESV)"],["NLT","New Living Translation (NLT)"],["ASV","American Standard Version (ASV)"],["WEB","World English Bible (WEB)"],["BSB","Berean Standard Bible (BSB)"],["JPS1917","JPS Tanakh 1917 (Old Testament only)"],["YLT","Young's Literal Translation (YLT)"],["DARBY","Darby Bible Translation (DARBY)"],["MSG","The Message (MSG)"]];
 const versionSelect=$("chapter-version");
 const translationNote=$("chapter-version-note");
 versionSelect.innerHTML=TRANSLATIONS.map(([code,label])=>'<option value="'+code+'">'+label+'</option>').join("");
 function renderTranslation(){
  const jpsOption=versionSelect.querySelector('option[value="JPS1917"]');
  const oldTestament=active.bookNumber<=39;
  if(jpsOption)jpsOption.disabled=!oldTestament;
  const prior=versionSelect.value;
  if(prior==="JPS1917"&&!oldTestament)versionSelect.value="KJV";
  const code=versionSelect.value;
  const reading=$("read-bible-link");
  if(code==="JPS1917"){
   reading.href="https://new.mechon-mamre.org/e/et/et0.htm";
   reading.textContent="Open JPS 1917 Book Index ↗";
   translationNote.textContent="JPS Tanakh 1917 contains the Hebrew Bible. Choose the chapter on the original source site.";
  }else if(code==="BSB"){
   reading.href="https://berean.bible/";
   reading.textContent="Open Berean Standard Bible Reader ↗";
   translationNote.textContent="Choose the chapter at the original Berean Standard Bible reading site.";
  }else{
   reading.href=lib.chapterBibleLink(active.name,chapter,code);
   reading.textContent="Read "+active.name+" "+chapter+" ("+code+") ↗";
   translationNote.textContent=prior==="JPS1917"&&!oldTestament
    ?"JPS Tanakh does not contain the New Testament. KJV was selected for this book."
    :"The selected translation opens the chapter on Bible Gateway. You can return to the Atlas tab afterward.";
  }
 }
 versionSelect.addEventListener("change",renderTranslation);
 const search=$("book-search"),testament=$("book-testament"),category=$("book-category"),list=$("book-list");
 function itemMatches(item,group){
  return (testament.value==="all"||testament.value===group.testament) &&
   (category.value==="all"||category.value===group.key) &&
   (!search.value.trim()||item.name.toLowerCase().includes(search.value.trim().toLowerCase()));
 }
 function displayBooks(){
  let count=0;
  const sections=groups.map(g=>{
   const books=lib.books.filter(b=>b.number>=g.first&&b.number<=g.last&&itemMatches(b,g));
   if(!books.length)return "";
   count+=books.length;
   return '<section class="book-group" aria-label="'+g.title+'"><div class="book-group-head"><h3>'+g.title+'</h3><span class="book-group-count">'+books.length+' '+(books.length===1?"book":"books")+'</span></div>'+
    '<div class="book-tile-grid">'+books.map(b=>'<button type="button" class="book-tile" data-book="'+b.name+'" aria-pressed="'+(active.name===b.name?'true':'false')+'"><span>'+b.name+'</span><small>'+b.chapters+' '+(b.chapters===1?"ch.":"ch.")+'</small></button>').join("")+'</div></section>';
  }).filter(Boolean);
  $("book-results-count").textContent=count+" of 66 Bible books shown. Select a book to browse chapters.";
  list.innerHTML=sections.length?'<div class="book-groups">'+sections.join("")+'</div>':'<p class="book-empty">No books match your filters. Try a different name or book grouping.</p>';
 }
 function displayChapters(){
  $("selected-book-status").textContent=active.name+" · "+active.chapters+" "+(active.chapters===1?"chapter":"chapters")+". Choose a chapter number to update the reading links.";
  $("chapter-grid").innerHTML=Array.from({length:active.chapters},(_,i)=>{
   const n=i+1;
   return '<button type="button" class="chapter-button" data-chapter="'+n+'" aria-label="'+active.name+' chapter '+n+'" aria-pressed="'+(chapter===n?'true':'false')+'">'+n+'</button>';
  }).join("");
  $("selected-chapter-title").textContent=active.name+" "+chapter;
  renderTranslation();
  $("read-henry-link").href=lib.chapterLink(active.name,chapter);
  $("read-other-translation").href="./bible-library.html?passage="+encodeURIComponent(active.name+" "+chapter);
 }
 function selectBook(name,scroll){
  const candidate=lib.getBook(name);
  if(!candidate)return;
  active=candidate;chapter=1;displayBooks();displayChapters();
  if(scroll)$("chapter-study").scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth",block:"start"});
 }
 list.addEventListener("click",event=>{
  const target=event.target.closest("button[data-book]");
  if(target)selectBook(target.dataset.book,true);
 });
 $("chapter-grid").addEventListener("click",event=>{
  const target=event.target.closest("button[data-chapter]");
  if(!target)return;
  chapter=Number(target.dataset.chapter);
  displayChapters();
  $("chapter-reader").scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth",block:"center"});
 });
 for(const field of [search,testament,category])field.addEventListener(field===search?"input":"change",displayBooks);
 $("book-reset").addEventListener("click",()=>{search.value="";testament.value="all";category.value="all";displayBooks();search.focus();});
 const params=new URL(location.href).searchParams,requested=lib.parseReference(params.get("passage")||"");
 const bookName=requested?.book||params.get("book")||"Genesis";
 const record=lib.getBook(bookName)||lib.getBook("Genesis");
 active=record;chapter=requested?.chapter||Math.min(record.chapters,Math.max(1,Number(params.get("chapter"))||1));
 const initialVersion=params.get("version");
 if(initialVersion&&TRANSLATIONS.some(t=>t[0]===initialVersion))versionSelect.value=initialVersion;
 displayBooks();displayChapters();
})();
