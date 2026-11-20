/* Gotuj i Mroź 3.0 – kampania "Stołówka": 5 światów, 45 plansz, 45 przepisów (9 ręcznych + 36 z szablonów).
   Czysta logika/dane (testowalne w node vm). Ładowany po k-data.js. */
"use strict";
Object.assign(K_ING,{
  parowki:{n:"Parówki",e:"🌭"},bulkahd:{n:"Bułka do hot-doga",e:"🥖"},ketchup:{n:"Ketchup",e:"🍅"},pomidor:{n:"Pomidory",e:"🍅"},ogorek:{n:"Ogórki",e:"🥒"},
  ser:{n:"Ser żółty",e:"🧀"},szynka:{n:"Szynka",e:"🍖"},pieczarki:{n:"Pieczarki",e:"🍄"},makaron:{n:"Makaron",e:"🍝"},kasza:{n:"Kasza",e:"🥜"},ryz:{n:"Ryż",e:"🍚"},
  mielone:{n:"Mięso mielone",e:"🍖"},kapusta:{n:"Kapusta",e:"🥬"},kapkis:{n:"Kapusta kiszona",e:"🥬"},jablka:{n:"Jabłka",e:"🍎"},mak:{n:"Mak",e:"⚫"},
  fasola:{n:"Fasola",e:"🌱"},groch:{n:"Groch",e:"🟢"},burak:{n:"Buraki",e:"🔴"},koperek:{n:"Koperek",e:"🌿"},ryba:{n:"Filet z ryby",e:"🐟"},
  frytki:{n:"Ziemniaki na frytki",e:"🥔"},toastbr:{n:"Chleb tostowy",e:"🍞"},kotlet:{n:"Mięso z kurczaka",e:"🍗"},
  proszek:{n:"Proszek do pieczenia",e:"✨"},cynamon:{n:"Cynamon",e:"🍂"},owsianka:{n:"Płatki owsiane",e:"🥣"},miod:{n:"Miód",e:"🍯"},
  dzem:{n:"Dżem",e:"🍓"},kefir:{n:"Kefir",e:"🥛"},maslanka:{n:"Maślanka",e:"🥛"},olejsmaz:{n:"Olej do smażenia",e:"🌻"},sosmaj:{n:"Sos majonezowy",e:"🥫"},
  salata:{n:"Sałata",e:"🥬"},ziele:{n:"Ziele angielskie",e:"⚫"},papryka:{n:"Papryka",e:"🌶️"},wedzonka:{n:"Wędzonka",e:"🥓"},suszone:{n:"Suszone grzyby",e:"🍄"}
});
const K_BOOKS2=[
  {id:"podstawy",n:"Kuchnia od zera",e:"🥄",d:"Śniadania, majonez, chleb i krem: robimy sami"},
  {id:"zupy",n:"Zupy",e:"🍲",d:"Rosół, żurek, pomidorowa i inne"},
  {id:"obiady",n:"Obiady i Śląsk",e:"🍽️",d:"Schabowy, kluski, gołąbki, bigos"},
  {id:"bar",n:"Bar szybkiej obsługi",e:"🌭",d:"Hot-dogi, zapiekanki, frytki"},
  {id:"wypieki",n:"Wypieki i desery",e:"🥧",d:"Sernik, szarlotka, pączki, naleśniki"}
];
(function(){
  const T3=[["low","Mały ogień"],["med","Średni ogień"],["high","Duży ogień"]];
  const parse=s=>s.split("|").map(x=>{const i=x.indexOf(":");return [x.slice(0,i),x.slice(i+1)];});
  const pick=(items,k)=>{const pool=["cukier","mukaziem","ocet","kakao","wanilia","rodzynki","pieprz","laur","majeranek","cynamon","miod"].filter(x=>!items.includes(x));return pool.slice(k%3,k%3+2);};
  const W=(raw)=>({type:"wash",text:raw?"Umyj ręce z mydłem. Za chwilę dotkniesz surowego mięsa lub jajek.":"Umyj ręce z mydłem, zanim zaczniesz gotować.",why:raw?"Surowe mięso i jajka mogą przenosić bakterie (Salmonella). Po ich dotknięciu myj ręce.":"Czyste ręce to podstawa w każdej kuchni: najpierw higiena, potem gotowanie.",need:2.2});
  const G=(d,k)=>({type:"gather",text:"Przygotuj składniki.",why:d.gw||"Zanim zaczniesz, przygotuj wszystko pod ręką: kucharze nazywają to „mise en place”.",items:parse(d.ing).map(x=>x[0]).filter(x=>x!=="woda"&&x!=="sol"||true).slice(0,9),decoys:pick(parse(d.ing).map(x=>x[0]),k)});
  const C=(d,n,verb)=>({type:"chop",text:d.c,why:d.cw,n:n||6,verb:verb||"Krój"});
  const S=(d)=>({type:"seq",text:d.s,why:d.sw,order:d.o});
  const H=(d,st,o)=>Object.assign({type:"heat",station:st,text:d.h,why:d.hw,good:"med",dur:9,window:[.62,.84],burn:1.0,temps:T3},o||{});
  const B=(d,label,o)=>Object.assign({type:"balance",text:d.b,why:d.bw,label:label||"Utrzymaj mały ogień",zone:[.3,.58],need:6,rise:.42,fall:.4},o||{});
  const M=(d)=>({type:"mix",text:d.m,why:d.mw,dur:4});
  const R=(txt,why,dur)=>({type:"rest",text:txt,why,dur:dur||3});
  const V=(d)=>({type:"serve",text:d.v||"Podaj gościowi na talerzu."});
  const ARCH={
    pan:(d,k)=>[W(d.raw),G(d,k),C(d),S(d),H(d,"patelnia",d.ho),R(d.r||"Odsącz i odstaw na chwilę.",d.rw||"Chwila odpoczynku sprawia, że danie jest soczyste i nie parzy.",2),V(d)],
    soup:(d,k)=>[W(d.raw),G(d,k),C(d),H(d,"patelnia",d.ho||{dur:6}),B(d,"Utrzymaj mały ogień"),S(d),R(d.r||"Odstaw zupę na chwilę, żeby smaki się połączyły.",d.rw||"Zupa „przegryziona” smakuje lepiej, bo smaki się łączą.",3),V(d)],
    batter:(d,k)=>[W(d.raw),G(d,k),M(d),R(d.r||"Odstaw ciasto, aby odpoczęło.",d.rw||"Odpoczęte ciasto jest gładsze, a gluten się rozluźnia.",3),H(d,"patelnia",Object.assign({flips:[.45]},d.ho||{})),V(d)],
    bake:(d,k)=>[W(d.raw),G(d,k),C(d,5,d.verb||"Ugniataj"),S(d),H(d,"piekarnik",Object.assign({dur:11,good:"med"},d.ho||{})),R(d.r||"Odstaw do przestygnięcia.",d.rw||"Pieczywo i ciasta dochodzą po wyjęciu z piekarnika; nie kroimy ich na gorąco.",3),V(d)],
    boil:(d,k)=>[W(d.raw),G(d,k),B(d,d.bl||"Utrzymaj delikatne wrzenie",{need:6}),{type:"tap",text:d.t||"Zamieszaj kilka razy.",why:d.tw||"Mieszanie zapobiega przywieraniu do dna.",n:4,verb:"Zamieszaj"},S(d),V(d)],
    build:(d,k)=>[W(d.raw),G(d,k),H(d,d.st||"patelnia",d.ho),S(d),V(d)],
    dough:(d,k)=>[W(d.raw),G(d,k),C(d,6,"Wyrabiaj"),R("Odstaw ciasto w ciepłe miejsce, żeby urosło.","Drożdże zjadają cukier i wydzielają gaz, który spulchnia ciasto.",4),H(d,d.st||"piekarnik",d.ho),R(d.r||"Odstaw do przestygnięcia.",d.rw||"Ciepłe wypieki najlepiej odczekać, bo wnętrze dopiero się „ustawia”.",2),V(d)]
  };
  /* skrót: id|świat|nazwa|emoji|cena|trudność|alergeny|kcal|arch|składniki|dane */
  const D=[
   {id:"jajecznica",book:"podstawy",name:"Jajecznica na maśle",e:"🍳",price:14,diff:1,al:["jaja","mleko"],kcal:"ok. 220 kcal w porcji",a:"pan",raw:1,ing:"jajka:3 szt.|maslo:łyżka|sol:szczypta|szczypiorek:garść".replace("|szczypiorek:garść",""),
     story:"Najprostsze śniadanie, które łatwo zepsuć: jajka ścinają się szybko i nie lubią zbyt wysokiej temperatury.",storage:"Najlepsza od razu; nie przechowuj dłużej niż 1 dzień w lodówce.",
     c:"Rozbij jajka do miski i delikatnie roztrzep.",cw:"Dobrze rozmieszane jajko ścina się równo.",s:"Dodaj sól dopiero do roztrzepanych jajek: jajka, sól, masło.",sw:"Sól rozpuszcza się w jajku, a masło daje smak i chroni przed przywarciem.",o:["jajka","sol","maslo"],
     h:"Smaż jajka na średnim ogniu, aż się zetną, ale nadal będą lśniące.",hw:"Zbyt duży ogień daje gumowatą, suchą jajecznicę.",ho:{dur:6,window:[.6,.8],flips:null}},
   {id:"owsianka",book:"podstawy",name:"Owsianka z jabłkiem",e:"🥣",price:12,diff:1,al:["gluten","mleko"],kcal:"ok. 250 kcal w porcji",a:"boil",ing:"owsianka:60 g|mleko:300 ml|jablka:1 szt.|miod:łyżeczka|cynamon:szczypta",
     story:"Płatki owsiane zawierają błonnik, który długo syci. Gotowane powoli w mleku robią się kremowe.",storage:"Przechowuj w lodówce do 2 dni, odgrzej z odrobiną mleka.",
     b:"Zagotuj mleko z płatkami i gotuj na bardzo małym ogniu, żeby nie wykipiało.",bw:"Mleko szybko kipi. Mały ogień i uwaga to sposób na brak wykipiałej kuchenki.",bl:"Utrzymaj mały ogień",
     t:"Zamieszaj kilka razy, żeby płatki nie przywarły do dna.",tw:"Płatki są ciężkie i opadają na dno, gdzie łatwo się przypalają.",s:"Dodaj w kolejności: jabłko, cynamon, miód.",sw:"Miód i cynamon dodajemy na końcu, bo długo gotowany miód traci aromat.",o:["jablka","cynamon","miod"]},
   {id:"grzanki",book:"podstawy",name:"Grzanki z serem i pomidorem",e:"🥪",price:16,diff:1,al:["gluten","mleko"],kcal:"ok. 280 kcal w porcji",a:"build",ing:"toastbr:4 kromki|ser:4 plastry|pomidor:1 szt.|maslo:łyżka",
     story:"Chleb odświeżony na patelni jest chrupiący z zewnątrz i miękki w środku.",storage:"Najlepsze od razu.",
     h:"Podsmaż kromki chleba na średnim ogniu, z jednej i z drugiej strony.",hw:"Średni ogień zrumieni chleb równo, nie przypalając go.",ho:{dur:7,flips:[.5],window:[.6,.82]},s:"Złóż grzankę: masło, ser, pomidor.",sw:"Ser pod pomidorem lekko się roztapia i chroni chrupiący chleb przed wilgocią.",o:["maslo","ser","pomidor"]},
   {id:"surowka",book:"podstawy",name:"Surówka z marchewki i jabłka",e:"🥕",price:11,diff:1,al:["brak"],kcal:"ok. 90 kcal w porcji",a:"build",ing:"marchew:2 szt.|jablka:1 szt.|cytryna:łyżka|olej:łyżka|sol:szczypta",raw:0,
     story:"Surówka dostarcza witamin. Cytryna zapobiega ciemnieniu jabłka i dodaje świeżości.",storage:"Przechowuj w lodówce do 1 dnia.",gw:"Do surówki wybieramy twarde, chrupiące warzywa i owoce.",
     st:"patelnia",h:"Ułóż warzywa i delikatnie je podgrzej na średnim ogniu tylko do lekkiego zmiękczenia (gotowanie na parze).",hw:"Zbyt długie gotowanie niszczy witaminy; chodzi o lekkie podgrzanie.",ho:{dur:5,window:[.5,.75]},s:"Dopraw w kolejności: cytryna, sól, olej.",sw:"Cytryna chroni kolor, sól wyciąga smak, olej łączy całość.",o:["cytryna","sol","olej"]},
   {id:"kasza",book:"podstawy",name:"Kasza gryczana z masłem",e:"🍚",price:13,diff:1,al:["mleko"],kcal:"ok. 200 kcal w porcji",a:"boil",ing:"kasza:100 g|woda:200 ml (dwa razy tyle co kaszy)|sol:szczypta|maslo:łyżka",
     story:"Kaszę gotujemy w proporcji 1:2 z wodą pod przykryciem. Nie mieszamy jej, żeby nie zrobiła się papkowata.",storage:"Do 3 dni w lodówce.",
     b:"Zagotuj wodę z kaszą i gotuj na małym ogniu pod przykryciem.",bw:"Mały ogień pozwala kaszy równo wchłonąć wodę, zamiast przypalić się na dnie.",bl:"Utrzymaj mały ogień",
     t:"Sprawdź kaszę widelcem: ma być sypka.",tw:"Dotknij tylko kilka razy; zbyt częste mieszanie zrobi z niej papkę.",s:"Wymieszaj z masłem i solą na końcu.",sw:"Masło otula ziarna, a sól dodana na końcu nie wydłuża gotowania.",o:["sol","maslo"]},
   {id:"omlet",book:"podstawy",name:"Omlet z szynką",e:"🥞",price:17,diff:2,al:["jaja","mleko"],kcal:"ok. 300 kcal w porcji",a:"batter",raw:1,ing:"jajka:3 szt.|mleko:3 łyżki|szynka:3 plastry|maslo:łyżka|sol:szczypta",
     story:"Omlet jest delikatny, bo jajka rozcieńczone mlekiem ścinają się wolniej.",storage:"Najlepszy od razu.",
     m:"Roztrzep jajka z mlekiem i solą, aż masa będzie jednolita.",mw:"Jednolita masa ścina się równo i jest puszysta.",r:"Odstaw masę na minutę.",rw:"Odpoczęta masa lepiej się ścina.",
     h:"Wylej masę na rozgrzaną patelnię i smaż omlet na średnim ogniu. Obróć, gdy brzegi się zetną.",hw:"Zbyt wysoka temperatura zrumieni spód, zanim środek się zetnie.",ho:{dur:8,flips:[.5]}},
   {id:"pomidorowa",book:"zupy",name:"Zupa pomidorowa z ryżem",e:"🍅",price:22,diff:2,al:["seler","mleko"],kcal:"ok. 160 kcal w porcji",a:"soup",ing:"pomidor:6 szt.|marchew:1 szt.|seler:kawałek|ryz:50 g|smietana:2 łyżki|sol:szczypta",
     story:"Klasyczna zupa z domowego rosołu i pomidorów. Śmietanę dodajemy na końcu, żeby się nie zważyła.",storage:"Do 3 dni w lodówce; ryż najlepiej dodać do porcji.",
     c:"Pokrój warzywa i pomidory w kostkę.",cw:"Równe kawałki gotują się w tym samym czasie.",h:"Zrumień pokrojone warzywa na średnim ogniu.",hw:"Lekkie przyrumienienie warzyw dodaje zupie głębi smaku.",ho:{dur:6},
     b:"Zalej bulionem i gotuj na małym ogniu.",bw:"Delikatne gotowanie wydobywa smak, a pomidory nie tracą świeżości.",s:"Dodaj w kolejności: ryż, śmietana, sól.",sw:"Śmietanę dodajemy na końcu i nie gotujemy, żeby się nie zważyła.",o:["ryz","smietana","sol"]},
   {id:"ogorkowa",book:"zupy",name:"Zupa ogórkowa",e:"🥒",price:22,diff:2,al:["seler","mleko"],kcal:"ok. 140 kcal w porcji",a:"soup",ing:"ogorek:4 kiszone|ziemniaki:3 szt.|marchew:1 szt.|smietana:2 łyżki|koperek:garść|sol:szczypta",
     story:"Ogórkowa to jedna z najpopularniejszych polskich zup. Ogórki kiszone ścieramy i dodajemy na końcu, by zachowały smak.",storage:"Do 3 dni w lodówce.",
     c:"Pokrój ziemniaki i marchew, a ogórki zetrzyj na tarce.",cw:"Starte ogórki szybciej oddają smak zupie.",h:"Lekko podsmaż marchew na średnim ogniu.",hw:"Podsmażenie marchwi uwalnia jej słodycz.",ho:{dur:5},
     b:"Dodaj ziemniaki i gotuj na małym ogniu, aż zmiękną.",bw:"Ziemniaki gotują się równomiernie na małym ogniu.",s:"Dodaj w kolejności: ogórki, śmietana, koperek.",sw:"Koperek i śmietana dodawane na końcu zachowują świeży aromat.",o:["ogorek","smietana","koperek"]},
   {id:"krupnik",book:"zupy",name:"Krupnik z kaszą jęczmienną",e:"🥣",price:24,diff:2,al:["gluten","seler"],kcal:"ok. 200 kcal w porcji",a:"soup",ing:"kasza:100 g|marchew:2 szt.|ziemniaki:2 szt.|seler:kawałek|por:1 szt.|sol:szczypta",
     story:"Sycąca zupa na wywarze. Kasza jęczmienna zagęszcza ją i daje uczucie sytości.",storage:"Do 3 dni w lodówce; zgęstnieje, więc rozcieńcz wodą.",
     c:"Pokrój wszystkie warzywa w kostkę.",cw:"Drobniejsze kawałki zmiękną w tym samym czasie.",h:"Podsmaż pora i marchew na średnim ogniu.",hw:"Delikatne podsmażenie podkreśla smak warzyw.",ho:{dur:6},
     b:"Dodaj kaszę i gotuj na małym ogniu.",bw:"Kasza potrzebuje czasu na zmięknięcie; za silny ogień przypali dno.",s:"Dodaj w kolejności: ziemniaki, seler, sól.",sw:"Sól na końcu pozwala dopasować smak do gęstości zupy.",o:["ziemniaki","seler","sol"]},
   {id:"grochowka",book:"zupy",name:"Grochówka z wędzonką",e:"🍲",price:26,diff:2,al:["seler"],kcal:"ok. 260 kcal w porcji",a:"soup",ing:"groch:200 g (namoczony)|wedzonka:150 g|marchew:1 szt.|cebula:1 szt.|majeranek:łyżeczka|sol:szczypta",
     story:"Groch warto namoczyć na noc. Majeranek ułatwia trawienie i pasuje do strączkowych.",storage:"Do 3 dni w lodówce lub zamroź.",
     c:"Pokrój wędzonkę, cebulę i marchew.",cw:"Drobne kawałki oddają więcej smaku.",h:"Podsmaż wędzonkę i cebulę na średnim ogniu.",hw:"Tłuszcz z wędzonki wydobywa aromat cebuli.",ho:{dur:6},
     b:"Dodaj groch i gotuj na małym ogniu do zmięknięcia.",bw:"Groch potrzebuje długiego, spokojnego gotowania.",s:"Dodaj w kolejności: marchew, majeranek, sól.",sw:"Sól dodana na końcu nie utwardza grochu.",o:["marchew","majeranek","sol"]},
   {id:"barszcz",book:"zupy",name:"Barszcz czerwony",e:"🍷",price:23,diff:2,al:["seler"],kcal:"ok. 80 kcal w porcji",a:"soup",ing:"burak:3 szt.|marchew:1 szt.|czosnek:2 ząbki|ocet:łyżka|ziele:3 ziarna|sol:szczypta",
     story:"Barszcz zawdzięcza kolor burakom. Kwas (cytryna lub ocet) utrwala czerwoną barwę.",storage:"Do 5 dni w lodówce; smakuje lepiej następnego dnia.",
     c:"Obierz i pokrój buraki w cienkie plasterki.",cw:"Cienkie plastry szybciej oddadzą kolor.",h:"Lekko podsmaż marchew i czosnek na średnim ogniu.",hw:"Delikatne podsmażenie wydobywa słodycz i aromat.",ho:{dur:5},
     b:"Dodaj buraki i gotuj na małym ogniu. Nie dopuść do mocnego wrzenia.",bw:"Zbyt mocne gotowanie sprawia, że buraki tracą kolor.",s:"Dodaj w kolejności: ziele, ocet, sól.",sw:"Ocet utrwala kolor, a sól dodajemy na samym końcu.",o:["ziele","ocet","sol"]},
   {id:"kapusniak",book:"zupy",name:"Kapuśniak z kapusty kiszonej",e:"🥬",price:25,diff:2,al:["seler"],kcal:"ok. 150 kcal w porcji",a:"soup",ing:"kapkis:300 g|ziemniaki:3 szt.|boczek:100 g|cebula:1 szt.|laur:2 liście|sol:szczypta",
     story:"Kiszonka jest naturalnym probiotykiem. Płuczemy ją tylko wtedy, gdy jest bardzo kwaśna.",storage:"Do 4 dni w lodówce.",
     c:"Pokrój boczek, cebulę i ziemniaki.",cw:"Równe kawałki to równe gotowanie.",h:"Podsmaż boczek z cebulą na średnim ogniu.",hw:"Wytopiony tłuszcz nadaje zupie dymny smak.",ho:{dur:6},
     b:"Dodaj kapustę i gotuj na małym ogniu.",bw:"Kapusta kiszona potrzebuje czasu, żeby zmiękła i oddała smak.",s:"Dodaj w kolejności: ziemniaki, laur, sól.",sw:"Kiszonka jest słona, więc soli dodajemy ostrożnie na końcu.",o:["ziemniaki","laur","sol"]},
   {id:"mielony",book:"obiady",name:"Kotlet mielony",e:"🍔",price:34,diff:2,al:["gluten","jaja"],kcal:"ok. 380 kcal w porcji",a:"pan",raw:1,ing:"mielone:400 g|cebula:1 szt.|jajka:1 szt.|bulka:3 łyżki|sol:szczypta|pieprz:szczypta|smalec:do smażenia",
     story:"Domowy mielony: mięso, cebula i bułka tarta dla soczystości. Zawsze smażymy do pełnego wysmażenia.",storage:"Do 2 dni w lodówce.",
     c:"Wyrabiaj masę mięsną z cebulą i jajkiem.",cw:"Wyrabianie łączy składniki, a kotlety zachowują kształt.",verb:"Wyrabiaj",s:"Dopraw w kolejności: sól, pieprz, bułka tarta, jajko.",sw:"Bułka tarta wiąże wilgoć, a jajko trzyma całość.",o:["sol","pieprz","bulka","jajka"],
     h:"Smaż kotlety na średnim ogniu i obróć, gdy się zrumienią.",hw:"Mięso mielone musi być wysmażone w środku. Średni ogień daje równomierne wysmażenie.",ho:{dur:10,flips:[.45]}},
   {id:"golabki",book:"obiady",name:"Gołąbki w sosie pomidorowym",e:"🥬",price:38,diff:3,al:["seler"],kcal:"ok. 340 kcal w porcji",a:"soup",raw:1,ing:"kapusta:1 główka|mielone:400 g|ryz:100 g|cebula:1 szt.|pomidor:300 ml przecieru|sol:szczypta",
     story:"Liście kapusty parzymy, żeby zmiękły i dały się zawinąć. Gołąbki dusimy długo, na małym ogniu.",storage:"Do 3 dni w lodówce lub zamroź.",
     c:"Sparz liście kapusty i zawiń w nie farsz.",cw:"Sparzone liście są elastyczne i nie pękają.",verb:"Zawiń",h:"Zrumień gołąbki na średnim ogniu z obu stron.",hw:"Przyrumienienie dodaje smaku.",ho:{dur:7,flips:[.5]},
     b:"Zalej sosem pomidorowym i duś na małym ogniu.",bw:"Powolne duszenie sprawia, że farsz jest soczysty.",s:"Dodaj w kolejności: sól, cebula, pomidor.",sw:"Sól i cebula wzmacniają sos, pomidor dodajemy na końcu.",o:["sol","cebula","pomidor"]},
   {id:"bigos",book:"obiady",name:"Bigos staropolski",e:"🥘",price:40,diff:3,al:["seler"],kcal:"ok. 300 kcal w porcji",a:"soup",ing:"kapkis:500 g|kapusta:300 g|boczek:100 g|kielbasa:200 g|pieczarki:100 g|laur:2 liście|ziele:3 ziarna",
     story:"Bigos najlepiej smakuje po kilku dniach, bo smaki się przegryzają. Gotuje się go kilka godzin.",storage:"Do 7 dni w lodówce; można też zamrozić.",
     c:"Pokrój kapustę, boczek, kiełbasę i grzyby.",cw:"Drobniejsze składniki szybciej oddają smak.",h:"Podsmaż mięso z kiełbasą na średnim ogniu.",hw:"Podsmażone mięso dodaje bigosowi głębi.",ho:{dur:7},
     b:"Dodaj kapustę i duś na bardzo małym ogniu.",bw:"Bigos powinien powoli się dusić, nie gotować intensywnie.",s:"Dodaj w kolejności: laur, ziele, pieczarki.",sw:"Przyprawy korzenne dodajemy do duszenia, aby oddały aromat.",o:["laur","ziele","pieczarki"]},
   {id:"pierogi",book:"obiady",name:"Pierogi ruskie",e:"🥟",price:36,diff:3,al:["gluten","mleko","jaja"],kcal:"ok. 320 kcal w porcji",a:"boil",ing:"maka:300 g|ziemniaki:300 g|twarog:200 g|cebula:1 szt.|sol:szczypta|smalec:łyżka",
     story:"Pierogi ruskie mają farsz z ziemniaków i twarogu. Gotujemy je krótko, aż wypłyną.",storage:"Do 2 dni w lodówce lub zamroź surowe.",
     b:"Wrzuć pierogi do wrzątku i gotuj na delikatnym ogniu.",bw:"Zbyt mocne gotowanie rozerwie pierogi.",bl:"Utrzymaj delikatne wrzenie",
     t:"Zamieszaj delikatnie, żeby się nie posklejały.",tw:"Pierogi opadają na dno i mogą się przykleić.",s:"Dodaj w kolejności: cebula, smalec, sól.",sw:"Zrumieniona cebula z tłuszczem to klasyczna zasmażka.",o:["cebula","smalec","sol"]},
   {id:"spaghetti",book:"obiady",name:"Spaghetti z sosem pomidorowym",e:"🍝",price:32,diff:2,al:["gluten"],kcal:"ok. 420 kcal w porcji",a:"boil",ing:"makaron:200 g|pomidor:400 g|czosnek:2 ząbki|olej:łyżka|sol:szczypta|ser:garść",
     story:"Makaron gotujemy al dente, czyli lekko twardy w środku. Sos robimy równolegle.",storage:"Do 2 dni w lodówce.",
     b:"Ugotuj makaron w osolonym wrzątku, mieszając.",bw:"Duży garnek wody zapobiega sklejeniu makaronu.",bl:"Utrzymaj wrzenie",
     t:"Zamieszaj makaron kilka razy.",tw:"Mieszanie na początku zapobiega sklejaniu.",s:"Dodaj w kolejności: czosnek, pomidor, ser.",sw:"Czosnek krótko, bo łatwo się przypala i robi się gorzki.",o:["czosnek","pomidor","ser"]},
   {id:"placki",book:"obiady",name:"Placki ziemniaczane",e:"🥔",price:28,diff:2,al:["gluten","jaja"],kcal:"ok. 350 kcal w porcji",a:"batter",raw:1,ing:"ziemniaki:600 g|cebula:1 szt.|jajka:1 szt.|maka:2 łyżki|sol:szczypta|olejsmaz:do smażenia",
     story:"Ziemniaki trzemy tuż przed smażeniem, bo szybko ciemnieją. Placki smażymy na gorącym tłuszczu.",storage:"Najlepsze od razu.",
     m:"Zetrzyj ziemniaki z cebulą i wymieszaj z jajkiem i mąką.",mw:"Starte ziemniaki ciemnieją, więc łączymy masę od razu.",r:"Odlej nadmiar soku.",rw:"Nadmiar wody sprawi, że placki będą mokre.",
     h:"Smaż placki na średnim ogniu i obróć, gdy się zrumienią.",hw:"Zbyt chłodny tłuszcz sprawi, że placki będą tłuste.",ho:{dur:8,flips:[.5]}},
   {id:"ryba",book:"obiady",name:"Ryba smażona z cytryną",e:"🐟",price:37,diff:3,al:["ryby","gluten"],kcal:"ok. 310 kcal w porcji",a:"pan",raw:1,ing:"ryba:2 filety|maka:2 łyżki|cytryna:1 szt.|sol:szczypta|pieprz:szczypta|maslo:łyżka",
     story:"Delikatna ryba smaży się krótko. Zbyt długo i będzie sucha.",storage:"Najlepsza od razu; resztki zjedz w ciągu doby.",
     c:"Osusz filety i oprósz je mąką.",cw:"Sucha powierzchnia sprawia, że ryba się zrumieni zamiast się dusić.",s:"Dopraw w kolejności: sól, pieprz, mąka.",sw:"Sól i pieprz wnikają w mięso, mąka tworzy cienką skorupkę.",o:["sol","pieprz","maka"],
     h:"Smaż rybę na średnim ogniu, obróć raz.",hw:"Ryba potrzebuje tylko kilku minut. Obracaj ją raz, żeby się nie rozpadła.",ho:{dur:7,flips:[.5],window:[.6,.8]}},
   {id:"hotdog",book:"bar",name:"Hot-dog klasyczny",e:"🌭",price:15,diff:1,al:["gluten","gorczyca"],kcal:"ok. 330 kcal",a:"build",ing:"parowki:2 szt.|bulkahd:2 szt.|ketchup:łyżka|musztarda:łyżka|cebula:pół",
     story:"Parówki są już ugotowane, wystarczy je podgrzać. Bułki delikatnie przypiekamy.",storage:"Zjedz od razu.",
     h:"Podgrzej parówki na średnim ogniu, aż będą lekko zrumienione.",hw:"Parówki podgrzewamy tylko do ciepła; za długie smażenie je wysuszy.",ho:{dur:6,flips:[.5]},s:"Złóż hot-doga w kolejności: parówka, musztarda, ketchup, cebula.",sw:"Sos nakładamy na parówkę, nie na bułkę, żeby bułka nie namokła.",o:["parowki","musztarda","ketchup","cebula"]},
   {id:"zapiekanka",book:"bar",name:"Zapiekanka z pieczarkami",e:"🍕",price:19,diff:2,al:["gluten","mleko"],kcal:"ok. 420 kcal",a:"build",ing:"bulkahd:1 duża bagietka|pieczarki:150 g|ser:100 g|ketchup:łyżka|cebula:pół",st:"piekarnik",
     story:"Klasyczna polska zapiekanka z budek ulicznych: bagietka, pieczarki i dużo sera.",storage:"Zjedz od razu.",
     h:"Zapiecz zapiekankę w piekarniku na średniej temperaturze.",hw:"Zbyt wysoka temperatura zrumieni ser, zanim bagietka się nagrzeje.",ho:{dur:9,window:[.6,.82]},s:"Ułóż w kolejności: ketchup, pieczarki, cebula, ser.",sw:"Ser na wierzchu się rumieni i chroni składniki przed wysuszeniem.",o:["ketchup","pieczarki","cebula","ser"]},
   {id:"frytki",book:"bar",name:"Frytki domowe",e:"🍟",price:13,diff:2,al:["brak"],kcal:"ok. 380 kcal w porcji",a:"build",ing:"frytki:400 g|olejsmaz:do smażenia|sol:szczypta",
     story:"Frytki robimy z pokrojonych i osuszonych ziemniaków. Mokre frytki chlapią tłuszczem.",storage:"Zjedz od razu.",
     h:"Smaż frytki na dużym ogniu, aż będą złote.",hw:"Gorący tłuszcz tworzy chrupiącą skorupkę. Za zimny sprawi, że frytki będą tłuste.",ho:{dur:8,good:"high",window:[.62,.82],flips:[.5]},s:"Posól frytki dopiero po usmażeniu.",sw:"Sól wyciąga wodę, więc sól dodana przed smażeniem rozmoczy frytki.",o:["sol"]},
   {id:"kanapka",book:"bar",name:"Kanapka z szynką i serem",e:"🥪",price:12,diff:1,al:["gluten","mleko"],kcal:"ok. 310 kcal",a:"build",ing:"toastbr:2 kromki|szynka:2 plastry|ser:2 plastry|salata:liść|maslo:łyżeczka",
     story:"Prosta kanapka: świeże składniki ułożone w dobrej kolejności, żeby chleb nie namókł.",storage:"Do 1 dnia w lodówce.",
     h:"Przypiecz kromki chleba na średnim ogniu, aby były chrupiące.",hw:"Przypieczony chleb nie namiąka od sałaty i pomidora.",ho:{dur:5,flips:[.5]},s:"Złóż w kolejności: masło, szynka, ser, sałata.",sw:"Masło tworzy barierę dla wilgoci.",o:["maslo","szynka","ser","salata"]},
   {id:"tosty",book:"bar",name:"Tosty z szynką i serem",e:"🥪",price:14,diff:1,al:["gluten","mleko"],kcal:"ok. 340 kcal",a:"build",ing:"toastbr:4 kromki|szynka:2 plastry|ser:2 plastry|maslo:łyżka",
     story:"Tost to kanapka zapieczona na patelni lub w opiekaczu. Ser w środku się roztapia.",storage:"Zjedz od razu.",
     h:"Zrumień tosty na średnim ogniu z obu stron.",hw:"Zbyt mocny ogień przypali chleb, zanim ser się roztopi.",ho:{dur:7,flips:[.5],window:[.6,.82]},s:"Złóż tost: masło, ser, szynka, ser.",sw:"Ser po obu stronach szynki skleja kanapkę.",o:["maslo","ser","szynka"]},
   {id:"nuggetsy",book:"bar",name:"Nuggetsy z kurczaka",e:"🍗",price:22,diff:2,al:["gluten","jaja"],kcal:"ok. 350 kcal w porcji",a:"pan",raw:1,ing:"kotlet:300 g|jajka:1 szt.|bulka:4 łyżki|maka:2 łyżki|sol:szczypta|olejsmaz:do smażenia",
     story:"Kawałki kurczaka w chrupiącej panierce. Kurczak musi być w środku dobrze wysmażony.",storage:"Do 2 dni w lodówce.",
     c:"Pokrój kurczaka na małe kawałki.",cw:"Małe, równe kawałki wysmażą się w całości w tym samym czasie.",s:"Panieruj w kolejności: mąka, jajko, bułka tarta.",sw:"Mąka trzyma jajko, jajko trzyma bułkę.",o:["maka","jajka","bulka"],
     h:"Smaż nuggetsy na średnim ogniu, aż będą złote.",hw:"Kurczak musi być w środku biały, bez różowego koloru.",ho:{dur:9,flips:[.45]}},
   {id:"burger",book:"bar",name:"Burger domowy",e:"🍔",price:28,diff:3,al:["gluten","jaja","mleko"],kcal:"ok. 520 kcal",a:"build",raw:1,ing:"mielone:150 g|bulkahd:1 bułka|ser:1 plaster|pomidor:2 plastry|salata:liść|ketchup:łyżka",
     story:"Burger smażymy do pełnego wysmażenia. Bułkę lekko przypiekamy, żeby nie namokła.",storage:"Zjedz od razu.",
     h:"Usmaż kotlet na średnim ogniu, obróć raz.",hw:"Mięso mielone musi być wysmażone w środku. Obracaj tylko raz.",ho:{dur:10,flips:[.5]},s:"Złóż burgera: ketchup, sałata, kotlet, ser, pomidor.",sw:"Ser kładziemy na gorący kotlet, żeby się roztopił.",o:["ketchup","salata","ser","pomidor"]},
   {id:"kielbaska",book:"bar",name:"Kiełbaska z grilla",e:"🌭",price:20,diff:2,al:["gorczyca"],kcal:"ok. 350 kcal",a:"build",ing:"kielbasa:2 szt.|musztarda:łyżka|chleb:2 kromki|cebula:pół",
     story:"Surowa kiełbasa musi się wysmażyć w środku. Nie nakłuwamy jej, żeby nie wyciekł sok.",storage:"Zjedz od razu.",
     h:"Smaż kiełbaskę na średnim ogniu, obracając.",hw:"Zbyt wysoki ogień przypali skórkę, a środek będzie surowy.",ho:{dur:10,flips:[.35,.7]},s:"Podaj w kolejności: chleb, kiełbasa, musztarda, cebula.",sw:"Chleb zbiera sok, a musztarda dodaje pikantności.",o:["chleb","kielbasa","musztarda","cebula"]},
   {id:"kurczakgrill",book:"bar",name:"Kurczak z rożna",e:"🍗",price:34,diff:3,al:["brak"],kcal:"ok. 400 kcal w porcji",a:"build",raw:1,ing:"kurczak:4 kawałki|papryka:łyżeczka|sol:szczypta|czosnek:2 ząbki|olej:łyżka",st:"piekarnik",
     story:"Kurczak musi mieć w środku co najmniej 75°C. Marynata z papryki i czosnku daje kolor i smak.",storage:"Do 3 dni w lodówce.",
     h:"Piecz kurczaka w piekarniku na średniej temperaturze.",hw:"Zbyt wysoka temperatura zrumieni skórkę, ale środek zostanie surowy.",ho:{dur:12,window:[.64,.84]},s:"Natrzyj w kolejności: olej, sól, papryka, czosnek.",sw:"Olej niesie smaki przypraw.",o:["olej","sol","papryka","czosnek"]},
   {id:"szarlotka",book:"wypieki",name:"Szarlotka z cynamonem",e:"🥧",price:44,diff:3,al:["gluten","jaja","mleko"],kcal:"ok. 330 kcal w kawałku",a:"bake",raw:1,ing:"maka:400 g|maslo:200 g|jablka:1 kg|cukier:100 g|cynamon:łyżeczka|jajka:2 szt.",
     story:"Kruche ciasto trzeba wyrabiać szybko i na zimno, żeby masło się nie roztopiło.",storage:"Do 3 dni w temperaturze pokojowej.",
     c:"Szybko zagnieć kruche ciasto z mąki, masła i jajek.",cw:"Zimne masło daje kruchość. Zbyt długie wyrabianie ją niszczy.",s:"Ułóż w kolejności: ciasto, jabłka, cukier, cynamon.",sw:"Cukier i cynamon posypujemy na jabłka, żeby puściły mniej soku.",o:["maka","jablka","cukier","cynamon"],
     h:"Piecz szarlotkę w piekarniku na średniej temperaturze, aż się zezłoci.",hw:"Zbyt wysoka temperatura przypali wierzch, zanim jabłka zmiękną.",ho:{dur:12}},
   {id:"drozdzowki",book:"wypieki",name:"Drożdżówki z dżemem",e:"🥐",price:30,diff:3,al:["gluten","jaja","mleko"],kcal:"ok. 280 kcal",a:"dough",raw:1,ing:"maka:500 g|drozdzesw:25 g|mleko:200 ml|maslo:80 g|cukier:50 g|dzem:4 łyżki|jajka:1 szt.",
     c:"Zagnieć ciasto z mąki, mleka, drożdży i masła, aż będzie gładkie.",cw:"Wyrabianie rozwija gluten, który zatrzymuje gaz z drożdży i daje puszystość.",story:"Ciasto drożdżowe musi wyrosnąć w cieple. Dopiero wtedy drożdżówki są puszyste.",storage:"Do 2 dni w pojemniku.",
     h:"Piecz drożdżówki w piekarniku na średniej temperaturze.",hw:"Zbyt gorący piekarnik zrumieni wierzch, zanim środek się upiecze.",ho:{dur:11}},
   {id:"paczki",book:"wypieki",name:"Pączki smażone",e:"🍩",price:35,diff:3,al:["gluten","jaja","mleko"],kcal:"ok. 300 kcal",a:"dough",raw:1,ing:"maka:500 g|drozdzesw:30 g|mleko:250 ml|jajka:3 szt.|cukier:60 g|olejsmaz:do smażenia|dzem:4 łyżki",st:"patelnia",
     c:"Zagnieć ciasto z mąki, mleka, jajek i drożdży, aż będzie gładkie i elastyczne.",cw:"Dobrze wyrobione ciasto rośnie równo i daje lekkie pączki.",story:"Pączki smażymy na średnim ogniu, żeby wyrosły i nie były surowe w środku. Dobry pączek ma jasną obwódkę.",storage:"Najlepsze od razu.",
     h:"Smaż pączki na średnim ogniu i obróć w połowie.",hw:"Zbyt gorący tłuszcz przypali pączki, zimny sprawi, że nasiąkną.",ho:{dur:10,flips:[.5],window:[.62,.84]}},
   {id:"nalesniki",book:"wypieki",name:"Naleśniki z serem",e:"🥞",price:26,diff:2,al:["gluten","jaja","mleko"],kcal:"ok. 310 kcal w porcji",a:"batter",raw:1,ing:"maka:200 g|mleko:300 ml|jajka:2 szt.|twarog:200 g|cukier:2 łyżki|olejsmaz:łyżka",
     story:"Ciasto naleśnikowe ma być płynne i bez grudek. Dobrze odpoczęte jest elastyczne.",storage:"Do 2 dni w lodówce.",
     m:"Wymieszaj mąkę, mleko i jajka na gładkie, rzadkie ciasto.",mw:"Gładkie ciasto bez grudek daje cienkie, elastyczne naleśniki.",r:"Odstaw ciasto na chwilę.",rw:"Odpoczęte ciasto jest elastyczne i nie pęka.",
     h:"Smaż naleśniki na średnim ogniu i obróć, gdy brzegi się zetną.",hw:"Zbyt mocny ogień przypali naleśnik.",ho:{dur:7,flips:[.5]}},
   {id:"makowiec",book:"wypieki",name:"Makowiec zawijany",e:"🥐",price:40,diff:3,al:["gluten","jaja","mleko"],kcal:"ok. 320 kcal w kawałku",a:"bake",raw:1,ing:"maka:400 g|mak:250 g|maslo:100 g|cukier:100 g|jajka:2 szt.|drozdze:15 g",
     story:"Mak mielimy i parzymy, żeby był delikatny. Makowiec zwijamy ciasno w rulon.",storage:"Do 5 dni w temperaturze pokojowej.",
     c:"Zagnieć ciasto i rozwałkuj je na prostokąt.",cw:"Cienko rozwałkowane ciasto da więcej warstw masy makowej.",verb:"Wałkuj",s:"Ułóż w kolejności: ciasto, mak, cukier, jajko.",sw:"Jajko smaruje wierzch, nadając połysk.",o:["maka","mak","cukier","jajka"],
     h:"Piecz makowiec w piekarniku na średniej temperaturze.",hw:"Zbyt mocny piekarnik przypali wierzch.",ho:{dur:12}},
   {id:"babka",book:"wypieki",name:"Babka piaskowa",e:"🍰",price:36,diff:3,al:["gluten","jaja","mleko"],kcal:"ok. 340 kcal w kawałku",a:"bake",raw:1,ing:"maka:300 g|mukaziem:100 g|maslo:250 g|cukier:200 g|jajka:5 szt.|proszek:łyżeczka",
     story:"Babka piaskowa jest delikatna dzięki mące ziemniaczanej. Masło i jajka powinny mieć temperaturę pokojową.",storage:"Do 5 dni w temperaturze pokojowej.",
     c:"Ucieraj masło z cukrem na puszystą masę.",cw:"Dobrze utarta masa napowietrza ciasto.",verb:"Ucieraj",s:"Dodaj w kolejności: jajka, mąka, proszek.",sw:"Proszek dodajemy z mąką, żeby równo się rozprowadził.",o:["jajka","maka","proszek"],
     h:"Piecz babkę w piekarniku na średniej temperaturze, aż się zezłoci.",hw:"Zbyt wysoka temperatura zrumieni wierzch, a środek zostanie surowy.",ho:{dur:12}},
   {id:"gofry",book:"wypieki",name:"Gofry z cukrem pudrem",e:"🧇",price:24,diff:2,al:["gluten","jaja","mleko"],kcal:"ok. 290 kcal",a:"batter",raw:1,ing:"maka:250 g|mleko:300 ml|jajka:2 szt.|maslo:50 g|proszek:łyżeczka|cukierpuder:łyżka",
     story:"Gofry mają kratkę, bo piecze się je w specjalnej formie. Ciasto ma być gęstsze niż naleśnikowe.",storage:"Najlepsze od razu.",
     m:"Wymieszaj składniki na gęste, gładkie ciasto.",mw:"Gęste ciasto trzyma kształt w formie i jest chrupiące.",r:"Odstaw ciasto na chwilę.",rw:"Ciasto z proszkiem lepiej rośnie po krótkim odpoczynku.",
     h:"Piecz gofry na średnim ogniu, aż będą złote.",hw:"Zbyt mocny ogień przypali kratkę.",ho:{dur:8,flips:[.5]}},
   {id:"racuchy",book:"wypieki",name:"Racuchy z jabłkami",e:"🥞",price:25,diff:2,al:["gluten","jaja","mleko"],kcal:"ok. 300 kcal",a:"batter",raw:1,ing:"maka:250 g|kefir:250 ml|jajka:1 szt.|jablka:2 szt.|proszek:łyżeczka|cukierpuder:łyżka",
     story:"Racuchy robimy na kefirze, który robi je puszystymi. Smażymy na średnim ogniu, żeby się wypiekły w środku.",storage:"Do 2 dni w lodówce.",
     m:"Wymieszaj mąkę z kefirem, jajkiem i jabłkami.",mw:"Kefir z proszkiem do pieczenia robi ciasto puszystym.",r:"Odstaw ciasto na chwilę.",rw:"Odpoczynek pozwala rozpuścić się proszkowi.",
     h:"Smaż racuchy na średnim ogniu i obróć, gdy się zrumienią.",hw:"Zbyt mocny ogień przypali wierzch, a środek będzie surowy.",ho:{dur:8,flips:[.5]}}
  ];
  const existing=K_RECIPES.slice();
  const mapBook={majonez:"podstawy",chleb:"podstawy",krem:"podstawy",wodzionka:"zupy",zurek:"zupy",rosol:"zupy",kluski:"obiady",schabowy:"obiady",sernik:"wypieki"};
  existing.forEach(r=>{if(mapBook[r.id])r.book=mapBook[r.id];});
  function mk(d,k){return {id:d.id,book:d.book,name:d.name,e:d.e,diff:d.diff,price:d.price,unlock:0,kcal:d.kcal,allergens:d.al,ing:parse(d.ing),story:d.story,storage:d.storage,steps:ARCH[d.a](d,k)};}
  function rebuild(){
    for(const k of Object.keys(K_BYID))delete K_BYID[k];
    K_RECIPES.forEach(r=>{K_BYID[r.id]=r;delete r.lvl;});
    const world=b=>K_RECIPES.filter(r=>r.book===b);
    const LV=[];
    K_BOOKS2.forEach((bk,w)=>{
      const ds=world(bk.id).slice().sort((x,y)=>x.diff-y.diff||x.price-y.price);
      for(let j=0;j<9;j++){
        const n=w*9+j;
        const menu=[ds[j].id],want=3+(j>=3?1:0)+(j>=6?1:0);
        for(let q=1;menu.length<want&&q<9;q++){for(const c of [ds[(j+q)%9],ds[(j-q+9)%9]]){if(menu.length<want&&!menu.includes(c.id))menu.push(c.id);}}
        if(w>0&&j>=2){const prev=world(K_BOOKS2[w-1].id);const p=prev[(j*3)%prev.length];if(!menu.includes(p.id))menu.push(p.id);}
        LV.push({n,world:bk.id,idx:j,title:bk.n+" · dzień "+(j+1),menu,guests:7+Math.floor(j/3)+(w>1?1:0)+(w>4?1:0),pat:Math.max(170,320-n*2),gap:[13,20],bonus:20+8*w});
      }
    });
    LV.forEach(l=>{l.menu.forEach(id=>{const r=K_BYID[id];if(r.lvl===undefined||l.n<r.lvl)r.lvl=l.n;});});
    K_RECIPES.forEach(r=>{if(r.lvl===undefined)r.lvl=0;});
    globalThis.K_LEVELS=LV;globalThis.K_WORLDS=K_BOOKS2;
  }
  globalThis.K_ADD=function(list,books){if(books)books.forEach(b=>K_BOOKS2.push(b));list.forEach(d=>K_RECIPES.push(mk(d,K_RECIPES.length)));rebuild();};
  globalThis.K_ARCH={ARCH,parse};
  /* kolejność światów: najpierw dania, na które ma się ochotę; podstawy na końcu */
  globalThis.K_ORDER=function(ids){K_BOOKS2.sort((a,b)=>ids.indexOf(a.id)-ids.indexOf(b.id));rebuild();};
  /* poziom trudności zależny od numeru planszy (0–71); null = ćwiczenie z pełną pomocą */
  globalThis.K_TIER=function(n){
    const t=n==null?0:Math.min(5,Math.floor(n/10));
    return {t,decoys:[2,3,4,5,6,7][t],showList:t<=1,showWin:t<=2,hideSeq:t>=2,redact:t>=3,quiz:t>=1?(t>=3?1:.5):0,hints:[99,5,4,3,2,1][t],
      tight:n==null?0:Math.min(.5,n*.007),speed:n==null?0:Math.min(.3,n*.004),
      info:["Z pomocą: widzisz przepis i zielone pola.","Więcej składników do wyboru, pytania szefa, 5 podpowiedzi na danie.","Lista składników i kolejność są ukryte. Myśl i pamiętaj, masz 4 podpowiedzi.","Zielone pole przy smażeniu ukryte, temperatury nie podajemy, 3 podpowiedzi.","Bardzo dużo składników do wyboru, węższe okna czasowe, 2 podpowiedzi.","Mistrzowski poziom: jedna podpowiedź i bardzo wąskie okna."][t]};
  };
  D.forEach((d,k)=>K_RECIPES.push(mk(d,k)));
  rebuild();
})();
