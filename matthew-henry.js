"use strict";
/* Matthew Henry chapter link builder. Holds only 66-book metadata and URL patterns,
   never commentary text. The reader remains on the original source site. */
(function(root){
 const bookDefinitions=[["Genesis",50],["Exodus",40],["Leviticus",27],["Numbers",36],["Deuteronomy",34],["Joshua",24],["Judges",21],["Ruth",4],["1 Samuel",31],["2 Samuel",24],["1 Kings",22],["2 Kings",25],["1 Chronicles",29],["2 Chronicles",36],["Ezra",10],["Nehemiah",13],["Esther",10],["Job",42],["Psalms",150],["Proverbs",31],["Ecclesiastes",12],["Song of Solomon",8],["Isaiah",66],["Jeremiah",52],["Lamentations",5],["Ezekiel",48],["Daniel",12],["Hosea",14],["Joel",3],["Amos",9],["Obadiah",1],["Jonah",4],["Micah",7],["Nahum",3],["Habakkuk",3],["Zephaniah",3],["Haggai",2],["Zechariah",14],["Malachi",4],["Matthew",28],["Mark",16],["Luke",24],["John",21],["Acts",28],["Romans",16],["1 Corinthians",16],["2 Corinthians",13],["Galatians",6],["Ephesians",6],["Philippians",4],["Colossians",4],["1 Thessalonians",5],["2 Thessalonians",3],["1 Timothy",6],["2 Timothy",4],["Titus",3],["Philemon",1],["Hebrews",13],["James",5],["1 Peter",5],["2 Peter",3],["1 John",5],["2 John",1],["3 John",1],["Jude",1],["Revelation",22]];
 const aliases={"psalm":"Psalms","song of songs":"Song of Solomon","song of solomon":"Song of Solomon","canticles":"Song of Solomon","acts of the apostles":"Acts","revelations":"Revelation","rev":"Revelation","ps":"Psalms","psa":"Psalms","jn":"John","mt":"Matthew","matt":"Matthew","mk":"Mark","lk":"Luke","isa":"Isaiah","jer":"Jeremiah","ezek":"Ezekiel","dan":"Daniel","hos":"Hosea","zec":"Zechariah","zech":"Zechariah","hab":"Habakkuk","1 sam":"1 Samuel","2 sam":"2 Samuel","1 cor":"1 Corinthians","2 cor":"2 Corinthians","1 tim":"1 Timothy","2 tim":"2 Timothy","1 thess":"1 Thessalonians","2 thess":"2 Thessalonians","1 pet":"1 Peter","2 pet":"2 Peter"};
 const canonical=new Map(bookDefinitions.map((x,i)=>[x[0].toLowerCase(),{name:x[0],bookNumber:i+1,chapters:x[1]}]));
 function getBook(text){
  const key=String(text||"").toLowerCase().replace(/[.]/g,"").replace(/\s+/g," ").trim();
  return canonical.get((aliases[key]||key).toLowerCase())||null;
 }
 function chapterLink(bookName,chapter){
  const item=getBook(bookName),c=Number(chapter);
  if(!item||!Number.isInteger(c)||c<1||c>item.chapters)return null;
  return "https://mhc.thekingsbible.com/MHC/MHC"+String(item.bookNumber).padStart(2,"0")+String(c).padStart(3,"0")+".HTM";
 }
 function parseReference(input){
  const first=String(input||"").split(/[;\n]/)[0].trim().replace(/[–—]/g,"-");
  const match=first.match(/^(.+?)\s+(\d{1,3})(?::(\d{1,3})(?:[-,]\d{1,3})?)?(?:\b|$)/);
  if(!match)return null;
  const item=getBook(match[1]),chapter=Number(match[2]);
  if(!item||chapter<1||chapter>item.chapters)return null;
  return {book:item.name,chapter,verse:match[3]?Number(match[3]):null,display:item.name+" "+chapter+(match[3]?":"+match[3]:""),commentaryUrl:chapterLink(item.name,chapter)};
 }
 function chapterBibleLink(book,chapter,version){
  const item=getBook(book),c=Number(chapter);
  if(!item||!Number.isInteger(c)||c<1||c>item.chapters)return null;
  return "https://www.biblegateway.com/passage/?search="+encodeURIComponent(item.name+" "+c)+"&version="+encodeURIComponent(version||"KJV");
 }
 root.BWA_MHC=Object.freeze({books:bookDefinitions.map((x,i)=>({name:x[0],chapters:x[1],number:i+1})),getBook,chapterLink,parseReference,chapterBibleLink,indexUrl:"https://mhc.thekingsbible.com/"});
})(window);
