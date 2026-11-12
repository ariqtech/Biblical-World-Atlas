"use strict";
const library=window.BWA_MHC,book=document.getElementById("gospel-book"),chapter=document.getElementById("gospel-chapter"),bibleLink=document.getElementById("gospel-bible-link"),henryLink=document.getElementById("gospel-henry-link");
const connections=[
 {title:"Isaiah 7:14 and Matthew 1:22–23",prophet:"Isaiah 7:14",gospel:"Matthew 1:22-23",detail:"Matthew explicitly identifies an Isaiah quotation in the account of Jesus' birth; interpretive readings of the original Isaiah context can differ."},
 {title:"Micah 5:2 and Matthew 2:5–6",prophet:"Micah 5:2",gospel:"Matthew 2:5-6",detail:"Matthew presents a quotation associated with Micah while locating Bethlehem in the birth narrative."},
 {title:"Isaiah 40:3 and Mark 1:2–3",prophet:"Isaiah 40:3",gospel:"Mark 1:2-3",detail:"Mark introduces a composite prophetic citation that includes Isaiah's language about preparing a way; examine the additional allusion to Malachi."},
 {title:"Isaiah 61:1–2 and Luke 4:16–21",prophet:"Isaiah 61:1-2",gospel:"Luke 4:16-21",detail:"Luke describes Jesus reading from Isaiah in the synagogue and responding to those present."},
 {title:"Zechariah 9:9 and Matthew 21:4–5",prophet:"Zechariah 9:9",gospel:"Matthew 21:4-5",detail:"Matthew explicitly connects Jesus' entry into Jerusalem with a prophetic quotation."},
 {title:"Isaiah 53:1 and John 12:38",prophet:"Isaiah 53:1",gospel:"John 12:38",detail:"John quotes an Isaiah passage while discussing the response to Jesus' signs."}
];
const featured=[
 {title:"Sermon on the Mount",ref:"Matthew 5:1-12",description:"Jesus' teaching begins with the Beatitudes."},
 {title:"The Parables of the Kingdom",ref:"Matthew 13:1-23",description:"Teachings presented through stories and their explanations."},
 {title:"Jesus' Early Ministry",ref:"Mark 1:14-20",description:"The proclamation in Galilee and the calling of disciples."},
 {title:"The Birth of Jesus",ref:"Luke 2:1-20",description:"The birth account and the shepherds' response."},
 {title:"The Good Samaritan",ref:"Luke 10:25-37",description:"A parable in response to a question about one's neighbor."},
 {title:"Jesus and Nicodemus",ref:"John 3:1-21",description:"A teaching encounter involving new birth and belief."},
 {title:"The Raising of Lazarus",ref:"John 11:1-44",description:"John's account of Lazarus and Jesus' identity."},
 {title:"The Resurrection",ref:"John 20:1-29",description:"Appearances and testimony following the resurrection."}
];
function selectBook(name){
 const record=library.getBook(name);if(!record)return;
 book.value=record.name;
 chapter.innerHTML=Array.from({length:record.chapters},(_,i)=>'<option value="'+(i+1)+'">Chapter '+(i+1)+'</option>').join("");
 update();
}
function update(){
 const b=book.value,c=Number(chapter.value);
 bibleLink.href=library.chapterBibleLink(b,c,"KJV");
 henryLink.href=library.chapterLink(b,c);
 document.getElementById("gospel-status").textContent="Selected: "+b+" "+c+". Bible text and commentary open separately in new tabs.";
}
function readingLinks(ref){
 const result=library.parseReference(ref);
 if(!result)return "";
 return '<div class="gospel-linkrow"><a target="_blank" rel="noopener noreferrer" href="https://www.biblegateway.com/passage/?search='+encodeURIComponent(ref)+'&version=KJV">Read '+ref+' (KJV) ↗</a>'+
 '<a class="secondary" target="_blank" rel="noopener noreferrer" href="'+result.commentaryUrl+'">Matthew Henry: '+result.book+' '+result.chapter+' ↗</a></div>';
}
document.querySelectorAll("[data-gospel]").forEach(el=>el.addEventListener("click",()=>{
 selectBook(el.dataset.gospel);
 document.querySelector(".gospel-chapter-picker").scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth",block:"center"});
}));
book.addEventListener("change",()=>selectBook(book.value));
chapter.addEventListener("change",update);
document.getElementById("gospel-connections").innerHTML=connections.map(c=>'<article class="gospel-connection"><h3>'+c.title+'</h3><p>'+c.detail+'</p><strong>Prophetic text</strong>'+readingLinks(c.prophet)+'<p><strong>Gospel text</strong></p>'+readingLinks(c.gospel)+'</article>').join("");
document.getElementById("featured-gospels").innerHTML=featured.map(c=>'<article class="gospel-connection"><h3>'+c.title+'</h3><p>'+c.description+'</p>'+readingLinks(c.ref)+'</article>').join("");
const params=new URL(location.href).searchParams,seed=params.get("book")||"Matthew";
selectBook(["Matthew","Mark","Luke","John"].includes(seed)?seed:"Matthew");
const proposed=Number(params.get("chapter"));
if(Number.isInteger(proposed)&&proposed>=1&&proposed<=library.getBook(book.value).chapters){chapter.value=proposed;update();}
