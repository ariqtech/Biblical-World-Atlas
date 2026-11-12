"use strict";
/* Sourced biblical terms; evidence status describes identification uncertainty, not the truth of a faith claim. */
const NATURE_RECORDS=[
 {
  "id": 1,
  "title": "Fig",
  "category": "fruits",
  "scripture": "Deuteronomy 8:8",
  "description": "The fig is one of the agricultural foods named in descriptions of the land.",
  "identity": "Usually associated with the cultivated fig (Ficus carica); the passage itself does not supply a Latin species name.",
  "status": "text",
  "tags": "fig figs fruit orchard",
  "reference": "https://powo.science.kew.org/"
 },
 {
  "id": 2,
  "title": "Grape and vine",
  "category": "fruits",
  "scripture": "Numbers 13:23",
  "description": "The spies bring back a cluster of grapes from the valley of Eshcol.",
  "identity": "An agricultural passage; the exact vineyard variety is not stated.",
  "status": "text",
  "tags": "grapes vine grape vineyards raisins eshcol",
  "reference": "https://powo.science.kew.org/"
 },
 {
  "id": 3,
  "title": "Pomegranate",
  "category": "fruits",
  "scripture": "Deuteronomy 8:8",
  "description": "The pomegranate is among the foods named in descriptions of the land.",
  "identity": "Commonly associated with Punica granatum; text does not describe a particular cultivar.",
  "status": "text",
  "tags": "pomegranates fruit seeds temple ornament",
  "reference": "https://powo.science.kew.org/"
 },
 {
  "id": 4,
  "title": "Olive and olive oil",
  "category": "fruits",
  "scripture": "Deuteronomy 8:8",
  "description": "Olive oil and olive cultivation appear throughout biblical agriculture and worship.",
  "identity": "Generally associated with Olea europaea; descriptions also concern processed oil.",
  "status": "text",
  "tags": "olives oil olive tree fruit",
  "reference": "https://powo.science.kew.org/"
 },
 {
  "id": 5,
  "title": "Cucumber and melon",
  "category": "vegetables",
  "scripture": "Numbers 11:5",
  "description": "The Israelites remember cucumbers and melons among foods eaten in Egypt.",
  "identity": "The ancient words need original-language study before assigning a modern species or cultivar.",
  "status": "uncertain",
  "tags": "cucumbers melons egypt vegetables garden food",
  "reference": "https://powo.science.kew.org/"
 },
 {
  "id": 6,
  "title": "Onion, leek and garlic",
  "category": "vegetables",
  "scripture": "Numbers 11:5",
  "description": "The same passage also lists leeks, onions and garlic.",
  "identity": "The modern common terms are conventional translations of ancient plant names.",
  "status": "uncertain",
  "tags": "garlic onion onions leek leeks vegetables edible bulbs",
  "reference": "https://powo.science.kew.org/"
 },
 {
  "id": 7,
  "title": "Lentils",
  "category": "vegetables",
  "scripture": "Genesis 25:34",
  "description": "Esau is described as eating bread and lentil pottage.",
  "identity": "The passage names a pulse food, not a specific cultivated variety.",
  "status": "text",
  "tags": "lentil lentils legumes pulses beans soup esau",
  "reference": "https://powo.science.kew.org/"
 },
 {
  "id": 8,
  "title": "Wheat and barley",
  "category": "grains",
  "scripture": "Deuteronomy 8:8",
  "description": "The land is described as producing wheat and barley.",
  "identity": "Grain names occur repeatedly; exact ancient varieties and processing methods require more evidence.",
  "status": "text",
  "tags": "wheat barley grain harvest bread cereal",
  "reference": "https://powo.science.kew.org/"
 },
 {
  "id": 9,
  "title": "Cedar wood",
  "category": "trees",
  "scripture": "1 Kings 6:9",
  "description": "Cedar wood appears in descriptions of the construction of Solomon's temple.",
  "identity": "Cedar of Lebanon is an important traditional identification, but specific ancient building materials can require contextual study.",
  "status": "uncertain",
  "tags": "cedar cedars temple trees wood lebanon",
  "reference": "https://powo.science.kew.org/"
 },
 {
  "id": 10,
  "title": "Shittim wood (acacia)",
  "category": "trees",
  "scripture": "Exodus 25:10",
  "description": "The ark's construction instructions use the term shittim wood in the KJV.",
  "identity": "Often translated as acacia; the exact botanical species cannot be established from this passage alone.",
  "status": "uncertain",
  "tags": "acacia shittim ark wood desert tree",
  "reference": "https://powo.science.kew.org/"
 },
 {
  "id": 11,
  "title": "Hyssop",
  "category": "trees",
  "scripture": "Psalm 51:7",
  "description": "Hyssop appears as an emblem of cleansing.",
  "identity": "The biblical term does not necessarily refer to the modern garden herb sold as hyssop.",
  "status": "uncertain",
  "tags": "hyssop herb cleansing botanical",
  "reference": "https://powo.science.kew.org/"
 },
 {
  "id": 12,
  "title": "Frankincense",
  "category": "resins",
  "scripture": "Matthew 2:11",
  "description": "Frankincense is named among the gifts presented to Jesus.",
  "identity": "Traditionally an aromatic gum resin from Boswellia trees; the verse does not identify the source species.",
  "status": "uncertain",
  "tags": "frankincense incense resin aromatic boswellia",
  "reference": "https://powo.science.kew.org/"
 },
 {
  "id": 13,
  "title": "Myrrh",
  "category": "resins",
  "scripture": "Matthew 2:11",
  "description": "Myrrh is also named among the gifts presented to Jesus.",
  "identity": "Aromatic resins sold as myrrh can originate from different Commiphora species.",
  "status": "uncertain",
  "tags": "myrrh resin perfume commiphora fragrance",
  "reference": "https://powo.science.kew.org/"
 },
 {
  "id": 14,
  "title": "Soil in the sower parable",
  "category": "soil",
  "scripture": "Matthew 13:3-9",
  "description": "Different ground conditions appear in the parable of the sower.",
  "identity": "This is a teaching passage, not a classification of modern soil horizons.",
  "status": "text",
  "tags": "soil earth ground field fertile dirt farming",
  "reference": "https://www.nrcs.usda.gov/resources/education-and-teaching-materials/what-is-soil"
 },
 {
  "id": 15,
  "title": "Dust of the ground",
  "category": "soil",
  "scripture": "Genesis 2:7",
  "description": "The creation account refers to dust from the ground.",
  "identity": "Ancient wording has theological and literary context; it is not a mineral analysis.",
  "status": "text",
  "tags": "dust dirt soil earth creation adam",
  "reference": "https://www.nrcs.usda.gov/resources/education-and-teaching-materials/what-is-soil"
 },
 {
  "id": 16,
  "title": "Potter's clay",
  "category": "soil",
  "scripture": "Jeremiah 18:1-6",
  "description": "A potter working clay is used in a prophetic lesson.",
  "identity": "Clay is a material category; no deposit or mineral species is given in the text.",
  "status": "text",
  "tags": "clay pottery potter ceramics sediment mud",
  "reference": "https://www.nrcs.usda.gov/resources/education-and-teaching-materials/what-is-soil"
 },
 {
  "id": 17,
  "title": "Memorial stones",
  "category": "stone",
  "scripture": "Joshua 4:3-9",
  "description": "Stones serve as memorials in the crossing of the Jordan.",
  "identity": "The passage does not identify the geological rock type.",
  "status": "text",
  "tags": "rock rocks stone stones jordan river",
  "reference": "https://www.usgs.gov/faqs/what-difference-between-a-rock-and-a-mineral"
 },
 {
  "id": 18,
  "title": "Rock and water",
  "category": "stone",
  "scripture": "Exodus 17:6",
  "description": "Water from a rock appears in the wilderness narrative.",
  "identity": "The rock type and precise site are not established by this passage.",
  "status": "text",
  "tags": "rock water wilderness moses geology",
  "reference": "https://www.usgs.gov/faqs/what-difference-between-a-rock-and-a-mineral"
 },
 {
  "id": 19,
  "title": "Onyx",
  "category": "gems",
  "scripture": "Genesis 2:12",
  "description": "The land of Havilah is associated in the text with onyx stone.",
  "identity": "The mineral represented by an ancient gemstone term can be debated; do not treat it as confirmed modern onyx.",
  "status": "uncertain",
  "tags": "onyx gemstones gem precious stones havilah",
  "reference": "https://pubs.usgs.gov/gip/gemstones/terms.html"
 },
 {
  "id": 20,
  "title": "Sapphire",
  "category": "gems",
  "scripture": "Exodus 28:18",
  "description": "A gemstone translated as sapphire appears in descriptions of the priestly breastpiece.",
  "identity": "Ancient gem names do not necessarily correspond to current gemological definitions of blue corundum.",
  "status": "uncertain",
  "tags": "sapphire breastplate gemstones gem blue",
  "reference": "https://pubs.usgs.gov/gip/gemstones/terms.html"
 },
 {
  "id": 21,
  "title": "Jasper",
  "category": "gems",
  "scripture": "Revelation 21:19",
  "description": "Jasper is named in the description of the New Jerusalem's foundations.",
  "identity": "Historical gemstone terminology can differ from modern mineralogical categories.",
  "status": "uncertain",
  "tags": "jasper gemstone new jerusalem precious stones",
  "reference": "https://pubs.usgs.gov/gip/gemstones/terms.html"
 },
 {
  "id": 22,
  "title": "Gold",
  "category": "metals",
  "scripture": "Genesis 2:12",
  "description": "Gold is named in the description of Havilah.",
  "identity": "Gold is a recognized chemical element; identifying Havilah geographically is a separate question.",
  "status": "text",
  "tags": "gold minerals metal ore havilah",
  "reference": "https://www.usgs.gov/faqs/what-difference-between-a-rock-and-a-mineral"
 },
 {
  "id": 23,
  "title": "Silver",
  "category": "metals",
  "scripture": "Exodus 25:3",
  "description": "Silver is among the materials requested for the sanctuary.",
  "identity": "The biblical reference names a metal but does not describe its geological ore source.",
  "status": "text",
  "tags": "silver precious metals mining sanctuary",
  "reference": "https://www.usgs.gov/faqs/what-difference-between-a-rock-and-a-mineral"
 },
 {
  "id": 24,
  "title": "Iron and copper/bronze",
  "category": "metals",
  "scripture": "Deuteronomy 8:9",
  "description": "The text describes a land associated with iron and a metal translated as brass in the KJV.",
  "identity": "Ancient copper-alloy terminology varies across translations; the verse is not a modern ore survey.",
  "status": "uncertain",
  "tags": "iron copper bronze brass metal ore mining",
  "reference": "https://www.usgs.gov/faqs/what-difference-between-a-rock-and-a-mineral"
 },
 {
  "id": 25,
  "title": "Salt",
  "category": "metals",
  "scripture": "Leviticus 2:13",
  "description": "Salt appears in instructions for offerings.",
  "identity": "A common natural substance; this verse does not identify the deposit or source location.",
  "status": "text",
  "tags": "salt halite mineral offering",
  "reference": "https://www.usgs.gov/faqs/what-difference-between-a-rock-and-a-mineral"
 },
 {
  "id": 26,
  "title": "Bitumen or pitch",
  "category": "soil",
  "scripture": "Genesis 11:3",
  "description": "The Babel account describes a substance used as mortar, called slime in the KJV.",
  "identity": "Commonly understood as bitumen or asphalt in translations; the material's provenance is not documented in this verse.",
  "status": "uncertain",
  "tags": "bitumen pitch asphalt slime mortar babylon babel",
  "reference": "https://www.nrcs.usda.gov/resources/education-and-teaching-materials/what-is-soil"
 }
];
const NATURE_CATEGORIES={"fruits":"Fruits & olives","vegetables":"Vegetables & pulses","grains":"Grains","trees":"Trees & herbs","resins":"Resins & fragrances","soil":"Soil, dust & clay","stone":"Rocks & stones","metals":"Metals & minerals","gems":"Gemstones"};
const byId=id=>document.getElementById(id);
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const scriptureURL=reference=>"https://www.biblegateway.com/passage/?search="+encodeURIComponent(reference)+"&version=KJV";
function drawNature(){
 const query=byId("nature-search").value.trim().toLocaleLowerCase().slice(0,120);
 const category=byId("nature-category").value;
 const evidence=byId("nature-evidence").value;
 const filtered=NATURE_RECORDS.filter(record=>{
  if(category!=="all"&&record.category!==category)return false;
  if(evidence!=="all"&&record.status!==evidence)return false;
  return !query||[record.title,record.description,record.identity,record.scripture,record.tags].join(" ").toLocaleLowerCase().includes(query);
 });
 byId("nature-count").textContent=filtered.length+" of "+NATURE_RECORDS.length+" entries shown.";
 const rows=filtered.map(record=>{
  const ambiguous=record.status==="uncertain";
  const status=ambiguous?"Modern identification uncertain":"Biblical term documented";
  return '<article class="nature-card"><span class="nature-category">'+escapeHTML(NATURE_CATEGORIES[record.category])+'</span><h3>'+escapeHTML(record.title)+'</h3>'+
  '<p>'+escapeHTML(record.description)+'</p><p>'+escapeHTML(record.identity)+'</p>'+
  '<span class="nature-status '+(ambiguous?"uncertain":"")+'">'+escapeHTML(status)+'</span>'+
  '<p class="nature-citation">Scripture: '+escapeHTML(record.scripture)+'</p>'+
  '<a href="'+escapeHTML(scriptureURL(record.scripture))+'" target="_blank" rel="noopener noreferrer">Read KJV passage ↗</a>'+
  '<a class="nature-extra" href="'+escapeHTML(record.reference)+'" target="_blank" rel="noopener noreferrer">Scientific reference directory ↗</a></article>';
 });
 byId("nature-results").innerHTML=rows.length?rows.join(""):'<div class="source-note">No results found. Try another word or reset your filters.</div>';
}
for(const id of ["nature-search","nature-category","nature-evidence"])byId(id).addEventListener(id==="nature-search"?"input":"change",drawNature);
byId("nature-reset").addEventListener("click",()=>{
 byId("nature-search").value="";
 byId("nature-category").value="all";
 byId("nature-evidence").value="all";
 drawNature();
 byId("nature-search").focus();
});
const url=new URL(location.href),term=url.searchParams.get("search");
if(term)byId("nature-search").value=term.slice(0,120);
drawNature();
