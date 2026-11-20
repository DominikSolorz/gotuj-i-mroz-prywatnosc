/* Gotuj i Mroź 3.0 – dane przepisów (Kuchnia szefa).
   Przepisy są uproszczone na potrzeby gry i mają charakter edukacyjny; czasy w grze są skrócone.
   Każdy przepis = składniki z ilościami + lista etapów (typ czynności, tekst, „dlaczego tak”). */
"use strict";
const K_ING={
  zoltko:{n:"Żółtka",e:"🍳"},olej:{n:"Olej rzepakowy",e:"🌻"},musztarda:{n:"Musztarda",e:"🥫"},cytryna:{n:"Sok z cytryny",e:"🍋"},sol:{n:"Sól",e:"⚪"},
  maka:{n:"Mąka pszenna",e:"🌾"},woda:{n:"Woda",e:"💧"},drozdze:{n:"Drożdże suche",e:"🔸"},cukier:{n:"Cukier",e:"🍬"},cukierpuder:{n:"Cukier puder",e:"❄️"},
  orzechy:{n:"Orzechy laskowe",e:"🌰"},kakao:{n:"Kakao",e:"🍫"},mleko:{n:"Mleko",e:"🥛"},wanilia:{n:"Wanilia",e:"🌼"},
  chleb:{n:"Czerstwy chleb",e:"🍞"},czosnek:{n:"Czosnek",e:"🌿"},majeranek:{n:"Majeranek",e:"🌿"},smalec:{n:"Smalec lub masło",e:"🍮"},
  zakwas:{n:"Zakwas żurowy",e:"🍶"},kielbasa:{n:"Biała kiełbasa",e:"🌭"},boczek:{n:"Boczek wędzony",e:"🥓"},ziemniaki:{n:"Ziemniaki",e:"🥔"},cebula:{n:"Cebula",e:"🧅"},
  jajka:{n:"Jajka",e:"🥚"},smietana:{n:"Śmietana",e:"🥛"},laur:{n:"Liść laurowy",e:"🍃"},
  schab:{n:"Schab",e:"🥩"},pieprz:{n:"Pieprz",e:"⚫"},bulka:{n:"Bułka tarta",e:"🍘"},mukaziem:{n:"Mąka ziemniaczana",e:"⚪"},
  twarog:{n:"Twaróg sernikowy",e:"🍥"},maslo:{n:"Masło",e:"🍮"},budyn:{n:"Budyń waniliowy",e:"🍮"},
  kurczak:{n:"Kurczak (części)",e:"🍗"},marchew:{n:"Marchew",e:"🥕"},pietruszka:{n:"Pietruszka",e:"🥬"},por:{n:"Por",e:"🌱"},seler:{n:"Seler",e:"🍀"},
  ocet:{n:"Ocet",e:"🍾"},drozdzesw:{n:"Drożdże świeże",e:"🟫"},rodzynki:{n:"Rodzynki",e:"🍇"}
};

const K_BOOKS=[
  {id:"podstawy",n:"Podstawy od zera",e:"🥄",d:"Majonez, chleb, krem czekoladowy: robimy sami"},
  {id:"slask",n:"Śląsk",e:"⛏️",d:"Wodzionka, żurek śląski, kluski i schabowy"},
  {id:"klasyka",n:"Polska klasyka",e:"🥘",d:"Rosół i inne domowe obiady"},
  {id:"wypieki",n:"Wypieki",e:"🥧",d:"Sernik i słodkie wypieki"}
];

/* Typy etapów:
   wash   – przytrzymaj, aż ręce będą czyste                    {need}
   gather – dotknij potrzebne składniki (są też zbędne)          {items,decoys}
   chop   – wykonaj N ruchów (krojenie, rozbijanie, ugniatanie)  {n,verb}
   tap    – dotknij N razy (dodawanie po kolei, zbieranie piany) {n,verb}
   mix    – przytrzymaj, aby mieszać                             {dur}
   balance– utrzymaj wskaźnik w zielonej strefie                 {zone,need,rise,fall,label}
   seq    – dotknij składniki w odpowiedniej kolejności          {order}
   heat   – wybierz temperaturę, włóż i wyjmij w dobrym momencie {station,good,dur,window,burn,flips}
   rest   – odczekaj                                              {dur}
   serve  – podaj                                                  {} */
const K_RECIPES=[
{id:"majonez",book:"podstawy",name:"Majonez domowy",e:"🥣",diff:1,price:18,unlock:0,kcal:"ok. 80 kcal w łyżce",
 allergens:["jaja","gorczyca (musztarda)"],
 ing:[["zoltko","2 szt."],["olej","200 ml"],["musztarda","1 łyżeczka"],["cytryna","1 łyżka"],["sol","pół łyżeczki"]],
 story:"Majonez to emulsja: olej rozbity na drobne kropelki w żółtku. Dlatego olej dolewamy cienkim strumieniem.",
 storage:"W lodówce do 2–3 dni, bo zawiera surowe żółtka.",
 steps:[
  {type:"wash",text:"Umyj ręce z mydłem (20–30 sekund), bo pracujesz z surowymi jajkami.",why:"Surowe jajka mogą zawierać bakterie Salmonella. Czyste ręce i świeże jajka to podstawa.",need:2.4},
  {type:"gather",text:"Przygotuj składniki. Wszystkie powinny mieć temperaturę pokojową.",why:"Składniki o tej samej temperaturze łatwiej tworzą trwałą emulsję.",items:["zoltko","olej","musztarda","cytryna","sol"],decoys:["maka","ocet"]},
  {type:"mix",text:"Utrzyj żółtka z musztardą i solą na gładką masę.",why:"Musztarda pomaga emulsji, a sól rozpuszcza się w żółtkach.",dur:3.5},
  {type:"balance",text:"Dolewaj olej cienkim strumieniem i cały czas ucieraj. Trzymaj wskaźnik w zielonej strefie.",why:"Za szybko dolany olej „zważy” majonez: tłuszcz się oddzieli i sos się zwarzy.",label:"Dolewaj olej",zone:[.38,.64],need:6,rise:.55,fall:.42},
  {type:"tap",text:"Dopraw sokiem z cytryny: dodaj go w 2 porcjach.",why:"Kwas poprawia smak i lekko konserwuje, ale nie zastępuje lodówki.",n:2,verb:"Dodaj cytrynę"},
  {type:"serve",text:"Przełóż do czystego słoika i podaj. Przechowuj w lodówce."}
 ]},
{id:"krem",book:"podstawy",name:"Krem czekoladowo-orzechowy",e:"🍫",diff:2,price:24,unlock:0,kcal:"ok. 90 kcal w łyżce",
 allergens:["orzechy","mleko"],
 ing:[["orzechy","200 g"],["kakao","3 łyżki"],["cukierpuder","80 g"],["olej","2 łyżki"],["mleko","100 ml"],["wanilia","szczypta"]],
 story:"Domowy krem typu „nutella”: uprażone orzechy zmielone na gładką pastę z kakao i cukrem.",
 storage:"W szczelnym słoiku, w lodówce do 1–2 tygodni.",
 steps:[
  {type:"gather",text:"Przygotuj składniki. Orzechy najpierw trzeba uprażyć.",why:"Prażenie wydobywa aromat orzechów.",items:["orzechy","kakao","cukierpuder","olej","mleko","wanilia"],decoys:["maka","cukier"]},
  {type:"heat",station:"piekarnik",text:"Upraż orzechy w piekarniku. Wybierz 180°C i wyjmij, gdy się zezłocą.",why:"Przy 180°C orzechy złocą się równo. Zbyt długo i wyjdzie gorycz.",good:"med",dur:9,window:[.62,.84],burn:1.0,temps:[["low","150°C"],["med","180°C"],["high","220°C"]]},
  {type:"chop",text:"Ciepłe orzechy rozetrzyj w ściereczce, aby usunąć łuski.",why:"Łuski są gorzkie, więc warto je usunąć.",n:6,verb:"Pocieraj"},
  {type:"mix",text:"Zmiksuj orzechy na gładką pastę. Przytrzymaj przycisk.",why:"Orzechy puszczają własny tłuszcz, dlatego masa z sypkiej staje się płynna.",dur:5},
  {type:"seq",text:"Dodaj składniki po kolei: kakao, cukier puder, olej, mleko.",why:"Suche składniki najpierw, płynne na końcu: łatwiej uzyskać gładką masę.",order:["kakao","cukierpuder","olej","mleko"]},
  {type:"mix",text:"Miksuj do idealnie gładkiego kremu.",why:"Dłuższe miksowanie daje jedwabistą konsystencję.",dur:4},
  {type:"serve",text:"Przełóż do słoika. Podawaj na pieczywie lub naleśnikach."}
 ]},
{id:"chleb",book:"podstawy",name:"Chleb domowy",e:"🍞",diff:2,price:30,unlock:0,kcal:"ok. 80 kcal w kromce",
 allergens:["gluten (pszenica)"],
 ing:[["maka","500 g"],["woda","ok. 330 ml (ciepła)"],["drozdze","7 g"],["sol","10 g"],["cukier","1 łyżeczka"]],
 story:"Drożdże zjadają cukier i wydzielają gaz, który spulchnia ciasto. Gluten z mąki zatrzymuje ten gaz w cieście.",
 storage:"W lnianej ściereczce lub chlebaku, do 3–4 dni. Pokrojony chleb możesz zamrozić.",
 steps:[
  {type:"wash",text:"Umyj ręce, bo będziesz wyrabiać ciasto.",why:"Czyste ręce to higiena w każdej kuchni.",need:2},
  {type:"gather",text:"Przygotuj składniki.",why:"Odmierzone składniki to połowa sukcesu.",items:["maka","woda","drozdze","sol","cukier"],decoys:["mleko","olej"]},
  {type:"mix",text:"Wymieszaj mąkę z solą, drożdżami i cukrem, potem dolej ciepłą wodę.",why:"Woda powinna być ciepła (ok. 35°C). Za gorąca zabije drożdże.",dur:3},
  {type:"chop",text:"Wyrabiaj ciasto, aż będzie gładkie i elastyczne.",why:"Wyrabianie rozwija gluten, który tworzy sprężystą sieć zatrzymującą gaz.",n:12,verb:"Ugniataj"},
  {type:"rest",text:"Przykryj ciasto i odstaw do wyrośnięcia (ok. 1 godziny).",why:"Drożdże potrzebują ciepła i czasu. Ciasto ma podwoić objętość.",dur:8},
  {type:"chop",text:"Uformuj bochenek i ponacinaj wierzch.",why:"Nacięcia pozwalają chlebowi równo rosnąć w piekarniku.",n:4,verb:"Formuj"},
  {type:"heat",station:"piekarnik",text:"Piecz chleb. Wybierz 220°C i wyjmij, gdy wierzch jest złoty, a spód wydaje głuchy dźwięk.",why:"Wysoka temperatura daje chrupiącą skórkę; za niska da blady, gumowy chleb.",good:"high",dur:12,window:[.68,.88],burn:1.0,temps:[["low","170°C"],["med","200°C"],["high","220°C"]]},
  {type:"rest",text:"Przełóż na kratkę i ostudź przed krojeniem.",why:"Gorący chleb jest jeszcze mokry w środku. Studzenie kończy pieczenie.",dur:3},
  {type:"serve",text:"Pokrój i podaj."}
 ]},
{id:"wodzionka",book:"slask",name:"Wodzionka",e:"🥣",diff:1,price:16,unlock:0,kcal:"ok. 180 kcal w porcji",
 allergens:["gluten (pszenica)"],
 ing:[["chleb","4 kromki"],["woda","1 litr"],["czosnek","3 ząbki"],["majeranek","1 łyżeczka"],["sol","do smaku"],["smalec","2 łyżki"]],
 story:"Śląska zupa dla oszczędnych: czerstwy chleb zalany wrzątkiem z czosnkiem i majerankiem. Nic się nie marnuje.",
 storage:"Najlepsza świeża. Zjedz od razu.",
 steps:[
  {type:"gather",text:"Przygotuj składniki. Nie wyrzucaj czerstwego chleba, bo właśnie do tego się nadaje.",why:"Ograniczanie marnowania żywności to dobra praktyka kuchenna.",items:["chleb","woda","czosnek","majeranek","sol","smalec"],decoys:["maka","cebula"]},
  {type:"chop",text:"Pokrój chleb w kostkę i czosnek w plasterki.",why:"Drobniej pokrojony chleb szybciej nasiąka.",n:7,verb:"Kroj"},
  {type:"heat",station:"garnek",text:"Zagotuj wodę. Wybierz duży ogień i zdejmij, gdy zacznie wrzeć.",why:"Wrzątek (100°C) zalewa chleb i uwalnia aromat przypraw.",good:"high",dur:7,window:[.7,.9],burn:1.15,temps:[["low","Mały ogień"],["med","Średni ogień"],["high","Duży ogień"]]},
  {type:"seq",text:"Do miski włóż po kolei: chleb, czosnek, majeranek, sól, potem zalej wrzątkiem.",why:"Przyprawy lepiej oddają smak, gdy zalewamy je gorącą wodą.",order:["chleb","czosnek","majeranek","sol"]},
  {type:"rest",text:"Przykryj i odstaw na chwilę, aby chleb zmiękł.",why:"Chleb potrzebuje chwili, żeby nasiąknąć.",dur:3},
  {type:"serve",text:"Dodaj łyżkę smalcu lub masła i podaj gorące."}
 ]},
{id:"zurek",book:"slask",name:"Żurek śląski",e:"🍲",diff:2,price:34,unlock:2,kcal:"ok. 400 kcal w porcji",
 allergens:["gluten","jaja","mleko (śmietana)"],
 ing:[["zakwas","500 ml"],["woda","1 litr"],["kielbasa","300 g"],["boczek","100 g"],["ziemniaki","3 szt."],["cebula","1 szt."],["czosnek","3 ząbki"],["majeranek","1 łyżeczka"],["laur","2 liście"],["jajka","2 szt. (ugotowane)"],["smietana","100 ml"]],
 story:"Żurek gotuje się na zakwasie z mąki żytniej. Kwaśny smak równoważą boczek, kiełbasa i jajko.",
 storage:"W lodówce do 2 dni; podgrzewaj bez gwałtownego wrzenia.",
 steps:[
  {type:"wash",text:"Umyj ręce, bo będziesz kroić mięso i wędliny.",why:"Po kontakcie z surowym mięsem zawsze myj ręce.",need:2},
  {type:"gather",text:"Przygotuj składniki.",why:"Dobra organizacja stanowiska (mise en place) oszczędza czas.",items:["zakwas","woda","kielbasa","boczek","ziemniaki","cebula","czosnek","majeranek","laur","jajka","smietana"],decoys:["maka","ocet","cukier"]},
  {type:"chop",text:"Pokrój ziemniaki, cebulę, boczek i kiełbasę.",why:"Równe kawałki gotują się w tym samym czasie.",n:8,verb:"Kroj"},
  {type:"heat",station:"patelnia",text:"Podsmaż boczek z cebulą. Wybierz średni ogień i wyjmij, gdy się zrumieni.",why:"Boczek wytapia tłuszcz, który nada żurkowi smak.",good:"med",dur:7,window:[.6,.82],burn:1.0,temps:[["low","Mały ogień"],["med","Średni ogień"],["high","Duży ogień"]]},
  {type:"heat",station:"garnek",text:"Ugotuj ziemniaki w wodzie z liściem laurowym. Wybierz średni ogień.",why:"Ziemniaki gotuj od zimnej, osolonej wody na średnim ogniu, aby były miękkie wewnątrz.",good:"med",dur:9,window:[.66,.88],burn:1.2,temps:[["low","Mały ogień"],["med","Średni ogień"],["high","Duży ogień"]]},
  {type:"balance",text:"Dodaj zakwas i kiełbasę, potem podgrzewaj delikatnie (bez gwałtownego wrzenia).",why:"Zakwas i śmietana mogą się zważyć przy zbyt mocnym wrzeniu.",label:"Podgrzewaj",zone:[.34,.6],need:6,rise:.4,fall:.45},
  {type:"tap",text:"Dodaj majeranek, czosnek i śmietanę (zahartowaną łyżką zupy).",why:"Hartowanie to stopniowe wyrównywanie temperatur, żeby śmietana się nie zważyła.",n:3,verb:"Dodaj"},
  {type:"serve",text:"Nalej do talerza i dodaj połówkę jajka."}
 ]},
{id:"kluski",book:"slask",name:"Kluski śląskie",e:"⚪",diff:2,price:26,unlock:4,kcal:"ok. 250 kcal w porcji",
 allergens:["jaja (zwykle)"],
 ing:[["ziemniaki","600 g"],["mukaziem","150 g"],["jajka","1 szt."],["sol","do smaku"],["woda","na gotowanie"]],
 story:"Kluski z charakterystycznym wgłębieniem na sos. Część ugotowanych ziemniaków zastępuje się mąką ziemniaczaną.",
 storage:"Najlepsze od razu. Ugotowane można krótko przechować w lodówce.",
 steps:[
  {type:"gather",text:"Przygotuj składniki.",why:"Ziemniaki powinny być mączyste.",items:["ziemniaki","mukaziem","jajka","sol","woda"],decoys:["maka","maslo"]},
  {type:"heat",station:"garnek",text:"Ugotuj ziemniaki w osolonej wodzie na średnim ogniu.",why:"Rozgotowane ziemniaki wchłonęłyby zbyt dużo wody.",good:"med",dur:9,window:[.66,.88],burn:1.2,temps:[["low","Mały ogień"],["med","Średni ogień"],["high","Duży ogień"]]},
  {type:"chop",text:"Rozgnieć ziemniaki na gładką masę (przeciskarką lub tłuczkiem).",why:"Bez grudek kluski będą gładkie.",n:8,verb:"Ugniataj"},
  {type:"seq",text:"Dodaj po kolei: mąkę ziemniaczaną, jajko, sól.",why:"Mąka ziemniaczana nadaje kluskom charakterystyczną, sprężystą konsystencję.",order:["mukaziem","jajka","sol"]},
  {type:"chop",text:"Formuj kluski i zrób palcem wgłębienie w środku.",why:"Wgłębienie zbiera sos i pozwala kluskom równo się ugotować.",n:6,verb:"Formuj"},
  {type:"heat",station:"garnek",text:"Gotuj kluski w osolonym wrzątku, aż wypłyną. Wybierz średni ogień.",why:"Gdy kluski wypłyną na powierzchnię, są prawie gotowe.",good:"med",dur:7,window:[.64,.86],burn:1.15,temps:[["low","Mały ogień"],["med","Średni ogień"],["high","Duży ogień"]]},
  {type:"serve",text:"Odcedź i podaj z sosem lub mięsem."}
 ]},
{id:"schabowy",book:"slask",name:"Kotlet schabowy",e:"🥩",diff:3,price:42,unlock:6,kcal:"ok. 450 kcal w porcji",
 allergens:["gluten","jaja"],
 ing:[["schab","4 plastry (ok. 150 g)"],["sol","do smaku"],["pieprz","do smaku"],["maka","3 łyżki"],["jajka","2 szt."],["bulka","100 g"],["smalec","do smażenia"]],
 story:"Klasyk: cienko rozbite mięso w panierce mąka–jajko–bułka tarta, smażone na złoto.",
 storage:"Najlepszy od razu. Resztki szybko schłodź i zjedz w ciągu 2 dni.",
 steps:[
  {type:"wash",text:"Umyj ręce z mydłem. Za chwilę dotkniesz surowego mięsa.",why:"Surowe mięso może przenosić bakterie. Po nim zawsze myj ręce.",need:2.2},
  {type:"gather",text:"Przygotuj składniki.",why:"Panierkę przygotuj w trzech osobnych talerzach.",items:["schab","sol","pieprz","maka","jajka","bulka","smalec"],decoys:["mukaziem","cukier"]},
  {type:"chop",text:"Rozbij schab na cienkie, równe plastry.",why:"Cienkie i równe mięso smaży się równomiernie i zostaje soczyste.",n:7,verb:"Rozbij"},
  {type:"seq",text:"Dopraw i spanieruj w kolejności: sól, pieprz, mąka, jajko, bułka tarta.",why:"Kolejność ma znaczenie: mąka trzyma jajko, jajko trzyma bułkę tartą.",order:["sol","pieprz","maka","jajka","bulka"]},
  {type:"heat",station:"patelnia",text:"Smaż kotlety na rozgrzanym smalcu. Wybierz średni ogień i wyjmij, gdy są złote (z obu stron).",why:"Za chłodny tłuszcz nasiąka panierką, a za gorący przypali ją, zanim mięso się upiecze.",good:"med",dur:10,window:[.64,.84],burn:1.0,flips:[.45],temps:[["low","Mały ogień"],["med","Średni ogień"],["high","Duży ogień"]]},
  {type:"rest",text:"Odsącz kotlety na papierowym ręczniku.",why:"Nadmiar tłuszczu spływa, a panierka zostaje chrupiąca.",dur:2},
  {type:"serve",text:"Podaj z kluskami i surówką."}
 ]},
{id:"rosol",book:"klasyka",name:"Rosół domowy",e:"🍜",diff:2,price:36,unlock:8,kcal:"ok. 120 kcal w porcji",
 allergens:["seler"],
 ing:[["kurczak","1 kg"],["woda","3 litry (zimna)"],["marchew","2 szt."],["pietruszka","1 szt."],["seler","ćwiartka"],["por","1 szt."],["cebula","1 opalona"],["laur","2 liście"],["sol","1 łyżka (na końcu)"]],
 story:"Rosół gotuje się długo na małym ogniu, żeby był klarowny. Sól dodajemy na końcu.",
 storage:"Szybko schłodź i przechowuj w lodówce do 3 dni albo zamroź w porcjach.",
 steps:[
  {type:"wash",text:"Umyj ręce, bo pracujesz z surowym drobiem.",why:"Surowy drób często zawiera Salmonella i Campylobacter. Po nim myj ręce.",need:2.2},
  {type:"gather",text:"Przygotuj składniki.",why:"Mięso na rosół zaczynamy gotować od zimnej wody.",items:["kurczak","woda","marchew","pietruszka","seler","por","cebula","laur","sol"],decoys:["maka","smietana"]},
  {type:"heat",station:"patelnia",text:"Opal cebulę na suchej patelni. Wybierz średni ogień i wyjmij, gdy jest brązowa.",why:"Opalona cebula nadaje rosołowi złoty kolor i aromat.",good:"med",dur:6,window:[.62,.84],burn:.98,temps:[["low","Mały ogień"],["med","Średni ogień"],["high","Duży ogień"]]},
  {type:"balance",text:"Zalej mięso zimną wodą i gotuj na bardzo małym ogniu (lekko „mrugającym”). Nie pozwól, żeby gwałtownie wrzało.",why:"Delikatne gotowanie daje klarowny rosół. Gwałtowne wrzenie go zmąci.",label:"Utrzymuj mały ogień",zone:[.3,.58],need:7,rise:.42,fall:.4},
  {type:"tap",text:"Zbierz szumowiny łyżką.",why:"Pianka to białka i zanieczyszczenia, które mogłyby zmętnić rosół.",n:4,verb:"Zbierz pianę"},
  {type:"seq",text:"Dodaj warzywa i przyprawy: marchew, pietruszka, seler, por, cebula, liście laurowe.",why:"Warzywa dodajemy po wstępnym gotowaniu mięsa, aby nie rozgotowały się.",order:["marchew","pietruszka","seler","por","cebula","laur"]},
  {type:"rest",text:"Gotuj jeszcze godzinę, przecedź i dopiero teraz dopraw solą.",why:"Sól dodana na początku wyciąga z mięsa sok i wysusza je.",dur:4},
  {type:"serve",text:"Nalej do talerzy, dodaj makaron lub natkę pietruszki."}
 ]},
{id:"sernik",book:"wypieki",name:"Sernik klasyczny",e:"🍰",diff:3,price:48,unlock:10,kcal:"ok. 380 kcal w kawałku",
 allergens:["mleko","jaja","gluten (budyń)"],
 ing:[["twarog","1 kg"],["jajka","5 szt."],["cukier","200 g"],["maslo","250 g"],["budyn","1 opakowanie"]],
 story:"Gładki sernik z twarogu sernikowego. Pieczony powoli i studzony w piekarniku, żeby nie opadł.",
 storage:"W lodówce do 4 dni. Najlepszy po całej nocy w chłodzie.",
 steps:[
  {type:"wash",text:"Umyj ręce, bo pracujesz z surowymi jajkami.",why:"Surowe jajka wymagają czystych rąk i narzędzi.",need:2},
  {type:"gather",text:"Przygotuj składniki.",why:"Masło i jajka powinny mieć temperaturę pokojową.",items:["twarog","jajka","cukier","maslo","budyn"],decoys:["maka","smietana"]},
  {type:"mix",text:"Utrzyj miękkie masło z cukrem na puszystą masę.",why:"Utarte z cukrem masło napowietrza masę, więc sernik będzie lekki.",dur:4},
  {type:"tap",text:"Dodawaj żółtka po jednym, cały czas ucierając.",why:"Jedno żółtko naraz pozwala masie się połączyć i nie zważyć.",n:5,verb:"Dodaj żółtko"},
  {type:"seq",text:"Dodaj twaróg, a potem budyń, i dokładnie wymieszaj.",why:"Twaróg dodajemy stopniowo. Budyń wiąże masę.",order:["twarog","budyn"]},
  {type:"heat",station:"piekarnik",text:"Piecz sernik. Wybierz 170°C i NIE otwieraj piekarnika. Wyjmij, gdy brzegi są ścięte, a środek lekko drży.",why:"Wysoka temperatura i otwieranie piekarnika powodują pękanie i opadanie sernika.",good:"med",dur:14,window:[.7,.9],burn:1.05,temps:[["low","150°C"],["med","170°C"],["high","200°C"]]},
  {type:"rest",text:"Zostaw sernik w wyłączonym piekarniku do wystygnięcia.",why:"Powolne studzenie zapobiega opadaniu i pęknięciom.",dur:4},
  {type:"serve",text:"Pokrój i podaj schłodzony."}
 ]}
];

const K_BYID=Object.fromEntries(K_RECIPES.map(r=>[r.id,r]));
