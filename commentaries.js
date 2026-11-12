"use strict";
const $=id=>document.getElementById(id);
const escapeHTML=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const ACCESS_LABELS={full:"Full commentary online",preview:"Limited preview / sample",access:"Full book access required"};
const GROUP_LABELS={whole:"Whole Bible",major:"Major Prophets",minor:"Minor Prophets"};
let BOOKS=[];
function card(item){
 const links=item.links.map((link,index)=>'<a class="'+(index>0?"secondary":"primary")+'" href="'+escapeHTML(link.url)+'" target="_blank" rel="noopener noreferrer">'+escapeHTML(link.label)+' ↗</a>').join("");
 const alternative=item.alternative?'<p class="commentary-alt"><strong>Free reading on this Bible book:</strong> <a href="'+escapeHTML(item.alternative.url)+'" target="_blank" rel="noopener noreferrer">'+escapeHTML(item.alternative.name)+' ↗</a></p>':"";
 return '<article class="commentary-book"><div class="commentary-book-top"><span class="book-category">'+escapeHTML(GROUP_LABELS[item.group])+' · '+escapeHTML(item.book)+'</span><span class="access-chip access-'+escapeHTML(item.access)+'">'+escapeHTML(ACCESS_LABELS[item.access])+'</span></div>'+
 '<h3>'+escapeHTML(item.title)+'</h3><p class="commentary-author">'+escapeHTML(item.author)+'</p><p class="commentary-series">'+escapeHTML(item.series)+'</p>'+
 '<p class="commentary-note">'+escapeHTML(item.note)+'</p><div class="commentary-links">'+links+'</div>'+alternative+'</article>';
}
function render(){
 const q=$("commentary-search").value.trim().toLocaleLowerCase().slice(0,120),category=$("commentary-category").value,access=$("commentary-access").value;
 const filtered=BOOKS.filter(i=>(category==="all"||i.group===category)&&(access==="all"||i.access===access)&&(!q||[i.book,i.title,i.author,i.series,i.note].join(" ").toLocaleLowerCase().includes(q)));
 $("commentary-count").textContent=filtered.length+" of "+BOOKS.length+" selected commentary titles shown.";
 $("commentary-results").innerHTML=filtered.length?filtered.map(card).join(""):'<p class="commentary-empty">No commentaries match those filters. Try another author, book or category.</p>';
}
function reset(){$("commentary-search").value="";$("commentary-category").value="all";$("commentary-access").value="all";render();$("commentary-search").focus();}
$("commentary-search").addEventListener("input",render);
$("commentary-category").addEventListener("change",render);
$("commentary-access").addEventListener("change",render);
$("commentary-reset").addEventListener("click",reset);
const params=new URL(location.href).searchParams;
if(params.get("search"))$("commentary-search").value=params.get("search").slice(0,120);
fetch("./commentary-links.json").then(r=>{if(!r.ok)throw Error("Link data unavailable");return r.json();}).then(data=>{
 BOOKS=Array.isArray(data.books)?data.books.filter(i=>i&&typeof i.title==="string"&&Array.isArray(i.links)&&i.links.every(link=>typeof link.url==="string"&&link.url.startsWith("https://"))):[];
 render();
}).catch(()=>{
 $("commentary-count").textContent="Commentary catalog unavailable.";
 $("commentary-results").innerHTML='<p class="commentary-empty">Could not load the catalog. Reload this page, or use the Matthew Henry and other reading links below.</p>';
});

const henryForm=document.getElementById("henry-reference-form"),henryInput=document.getElementById("henry-reference-input");
function renderHenryReference(){
 const r=window.BWA_MHC?.parseReference(henryInput.value.trim());
 const status=document.getElementById("henry-reference-status");
 const commentary=document.getElementById("henry-reference-commentary"),bible=document.getElementById("henry-reference-bible");
 if(!r){
  status.textContent="Enter a valid Bible book and chapter, for example Matthew 5 or Isaiah 53.";
  commentary.hidden=true;bible.hidden=true;return;
 }
 status.textContent="Matched "+r.display+". Matthew Henry comments on the full chapter "+r.book+" "+r.chapter+".";
 commentary.href=r.commentaryUrl;commentary.textContent="Read Matthew Henry: "+r.book+" "+r.chapter+" ↗";commentary.hidden=false;
 bible.href=window.BWA_MHC.chapterBibleLink(r.book,r.chapter,"KJV");bible.textContent="Read "+r.book+" "+r.chapter+" (KJV) ↗";bible.hidden=false;
}
henryForm.addEventListener("submit",e=>{e.preventDefault();renderHenryReference();});
henryInput.addEventListener("input",renderHenryReference);
document.querySelectorAll("[data-henry-ref]").forEach(button=>button.addEventListener("click",()=>{henryInput.value=button.dataset.henryRef;renderHenryReference();}));
const preset=new URL(location.href).searchParams.get("passage");
if(preset)henryInput.value=preset.slice(0,100);
renderHenryReference();
