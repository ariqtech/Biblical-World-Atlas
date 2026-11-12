"use strict";
(function(){
const lib=window.BWA_MHC;
const $=id=>document.getElementById(id);
const records=[
["The name Immanuel","Isaiah 7:14","Matthew 1:22-23","quotation","Matthew quotes Isaiah in the birth account; interpretation of Isaiah's original historical setting differs among readers."],
["Called out of Egypt","Hosea 11:1","Matthew 2:14-15","application","Matthew applies Hosea's wording to Jesus' return. Hosea's passage originally recalls Israel's past."],
["Rachel's mourning","Jeremiah 31:15","Matthew 2:17-18","application","Matthew applies Jeremiah's description of mourning to the Bethlehem account; read Jeremiah's exile and restoration context."],
["The ruler from Bethlehem","Micah 5:2","Matthew 2:4-6","quotation","Matthew records a citation of Micah's Bethlehem passage in the discussion with Herod."],
["Light in Galilee","Isaiah 9:1-2","Matthew 4:14-16","quotation","Matthew names Isaiah when discussing Galilee and the image of light."],
["Prepare the way","Isaiah 40:3","Matthew 3:1-3","quotation","Matthew cites Isaiah while introducing John the Baptist. Isaiah's original setting also deserves attention."],
["The coming messenger","Malachi 3:1","Matthew 11:9-10","quotation","Jesus' words about John the Baptist quote the messenger passage associated with Malachi."],
["He bore infirmities","Isaiah 53:4","Matthew 8:16-17","quotation","Matthew cites Isaiah's servant passage in a narrative about healing."],
["The chosen servant","Isaiah 42:1-4","Matthew 12:17-21","quotation","Matthew identifies Isaiah when presenting the servant passage in a new narrative setting."],
["Hearing without understanding","Isaiah 6:9-10","Matthew 13:14-15","quotation","Matthew quotes Isaiah when discussing the reception of parables."],
["Reading Isaiah in Nazareth","Isaiah 61:1-2","Luke 4:17-21","application","Luke recounts Jesus reading Isaiah; the reading also draws on language associated with Isaiah 58:6."],
["The wilderness voice in Mark","Isaiah 40:3","Mark 1:2-3","composite","Mark's introduction combines language associated with Isaiah, Malachi and Exodus; compare the sources separately."],
["The messenger in Mark","Malachi 3:1","Mark 1:2-3","composite","Part of Mark's opening citation echoes Malachi 3:1, alongside Isaiah 40:3 and Exodus 23:20."],
["Entry into Jerusalem","Zechariah 9:9","Matthew 21:4-5","quotation","Matthew explicitly relates the entry narrative to Zechariah's description of the king."],
["Entry described in John","Zechariah 9:9","John 12:14-15","quotation","John also cites wording associated with Zechariah in the account of the entry into Jerusalem."],
["The scattered sheep","Zechariah 13:7","Matthew 26:31","quotation","Matthew records Jesus quoting Zechariah's shepherd-and-sheep passage."],
["Isaiah's question about belief","Isaiah 53:1","John 12:37-38","quotation","John quotes Isaiah while narrating how people responded to Jesus' signs."],
["Looking on the pierced one","Zechariah 12:10","John 19:37","quotation","John cites Zechariah. Compare translation differences and the original Hebrew passage."],
["Son of Man imagery","Daniel 7:13-14","Mark 14:61-62","allusion","Mark's Son of Man imagery is commonly connected to Daniel's vision; this is an interpretive textual allusion."],
["Jonah as a narrative comparison","Jonah 1:17","Matthew 12:39-40","allusion","Matthew records a comparison with Jonah's three days; this is a typological comparison, not a quotation of Jonah 1:17."]
];
const VERSION_CODES=new Set(["KJV","NKJV","JUB","AMP","AMPC","NIV","ESV","NLT","ASV","WEB","YLT","DARBY","MSG"]);
const kindLabels={quotation:"Explicit quotation",application:"Textual application",composite:"Composite quotation",allusion:"Allusion / comparison"};
function escapeHTML(input){return String(input).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function readingURL(ref,version){return "https://www.biblegateway.com/passage/?search="+encodeURIComponent(ref)+"&version="+encodeURIComponent(version);}
function render(){
 const search=$("prophecy-search").value.toLowerCase().trim();
 const gospel=$("prophecy-gospel").value;
 const type=$("prophecy-type").value;
 const v=VERSION_CODES.has($("prophecy-version").value)?$("prophecy-version").value:"KJV";
 const filtered=records.filter(r=>(gospel==="all"||r[2].startsWith(gospel+" "))&&(type==="all"||r[3]===type)&&(!search||r.join(" ").toLowerCase().includes(search)));
 $("prophecy-count").textContent=filtered.length+" of "+records.length+" source-linked passage pairs shown. Bible translation: "+v+".";
 $("prophecy-results").innerHTML=filtered.length?filtered.map((r)=>{
  function pane(ref,label){
   const matched=lib.parseReference(ref);
   if(!matched)return "";
   return '<div><h4>'+label+'</h4><strong>'+escapeHTML(ref)+'</strong>'+
   '<a href="'+readingURL(ref,v)+'" target="_blank" rel="noopener noreferrer">Read in '+v+' ↗</a>'+
   '<a class="secondary" href="'+escapeHTML(matched.commentaryUrl)+'" target="_blank" rel="noopener noreferrer">Matthew Henry: '+escapeHTML(matched.book+" "+matched.chapter)+' ↗</a></div>';
  }
  return '<article class="prophecy-card"><div class="prophecy-card-header"><small>'+escapeHTML(r[1].split(" ")[0])+' · '+escapeHTML(r[2].split(" ")[0])+'</small><span class="prophecy-type '+r[3]+'">'+kindLabels[r[3]]+'</span></div><h3>'+escapeHTML(r[0])+'</h3><p>'+escapeHTML(r[4])+'</p><div class="passage-pair">'+pane(r[1],"Earlier writing")+pane(r[2],"Gospel passage")+'</div></article>';
 }).join(""):'<p>No matches. Try clearing the search or changing the passage type.</p>';
}
["prophecy-search","prophecy-gospel","prophecy-type","prophecy-version"].forEach(id=>{
 $(id).addEventListener(id==="prophecy-search"?"input":"change",render);
});
$("prophecy-reset").addEventListener("click",()=>{
 $("prophecy-search").value="";$("prophecy-gospel").value="all";$("prophecy-type").value="all";$("prophecy-version").value="KJV";render();$("prophecy-search").focus();
});
const params=new URL(location.href).searchParams;
const requested=params.get("version");
if(requested&&VERSION_CODES.has(requested))$("prophecy-version").value=requested;
render();
})();
