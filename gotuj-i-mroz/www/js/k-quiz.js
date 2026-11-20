/* Gotuj i Mroź 3.0 – pytania szefa kuchni (nauka bezpiecznego gotowania). Czyste dane, testowalne. */
"use strict";
const K_QUIZ=[
 {t:["higiena"],q:"Jak długo myjemy ręce mydłem?",o:["5 sekund","20–30 sekund","2 minuty"],a:1,why:"Mydło potrzebuje 20–30 sekund tarcia, żeby usunąć bakterie. Pamiętaj o kciukach i okolicach paznokci."},
 {t:["higiena","mieso"],q:"Czego nie wolno robić z deską, na której leżało surowe mięso?",o:["Myć jej gorącą wodą z płynem","Od razu kroić na niej sałatkę","Szorować jej szczotką"],a:1,why:"Bakterie z surowego mięsa przechodzą na gotowe jedzenie. Używaj osobnych desek albo najpierw dokładnie umyj."},
 {t:["higiena","mieso"],q:"Dotknąłeś surowego kurczaka. Co robisz najpierw?",o:["Wycieram ręce o fartuch","Myję ręce mydłem","Dotykam kranu i idę dalej"],a:1,why:"Surowy drób może przenosić Salmonellę i Campylobacter, więc po nim zawsze myjemy ręce."},
 {t:["mieso"],q:"W jakiej temperaturze (w środku) drób jest bezpieczny do jedzenia?",o:["55°C","75°C","90°C, inaczej jest niebezpieczny"],a:1,why:"Drób i mięso mielone powinny mieć w środku co najmniej 75°C, wtedy giną bakterie."},
 {t:["mieso"],q:"Mięso mielone smażymy:",o:["Na krwisto","Do pełnego wysmażenia","Tylko z wierzchu"],a:1,why:"W mielonym mięsie bakterie są wymieszane w całości, nie tylko na powierzchni, więc musi być wysmażone w środku."},
 {t:["mieso"],q:"Mięso rozmrożone w lodówce:",o:["Można znów zamrozić surowe, bez gotowania","Trzeba ugotować lub usmażyć, a nie zamrażać surowe ponownie","Zostawiamy na blacie na całą noc"],a:1,why:"Ponowne zamrażanie surowego mięsa psuje jego jakość i sprzyja bakteriom."},
 {t:["jaja"],q:"Surowe jajka kojarzą się z ryzykiem:",o:["Salmonelli","Cukrzycy","Alergii na gluten"],a:0,why:"Skorupki i surowe jajka mogą zawierać Salmonellę. Po ich dotknięciu myj ręce, a potrawy z surowym jajkiem trzymaj w lodówce."},
 {t:["jaja"],q:"Majonez z surowych żółtek najlepiej przechowywać:",o:["Na blacie","W lodówce i zjeść w ciągu 2 dni","W szafce przez tydzień"],a:1,why:"Majonez z surowym jajkiem szybko się psuje, więc przechowujemy go w zimnie i krótko."},
 {t:["smazenie"],q:"Olej zaczyna mocno dymić. Co robisz?",o:["Podlewam go wodą","Zdejmuję z ognia i zmniejszam temperaturę","Dolewam więcej oleju"],a:1,why:"Dymiący tłuszcz jest za gorący. Nigdy nie gasimy go wodą, bo wystrzeli."},
 {t:["smazenie"],q:"Dlaczego panierkę smażymy w gorącym tłuszczu?",o:["Bo jest wtedy tańsza","Żeby nie nasiąkła tłuszczem","Żeby była słodsza"],a:1,why:"W gorącym tłuszczu panierka szybko się zamyka i staje się chrupiąca, zamiast chłonąć olej."},
 {t:["smazenie","mieso"],q:"Mięso przed wrzuceniem na patelnię powinno być:",o:["Mokre","Osuszone","Zamrożone"],a:1,why:"Woda na powierzchni parowałaby i mięso by się dusiło zamiast rumienić."},
 {t:["smazenie"],q:"Dlaczego rozbijamy schab przed smażeniem?",o:["Żeby był cienki, równy i kruchy","Żeby wyciągnąć z niego sok","Żeby zmienić kolor"],a:0,why:"Cienkie, równe mięso smaży się szybko i równomiernie, więc zostaje soczyste."},
 {t:["pieczenie"],q:"Dlaczego nie otwieramy piekarnika w pierwszych minutach pieczenia ciasta?",o:["Bo spadnie temperatura i ciasto może opaść","Bo wyparuje cukier","Bo zgaśnie światło"],a:0,why:"Zimne powietrze gwałtownie obniża temperaturę, a niedopieczone ciasto może opaść."},
 {t:["pieczenie"],q:"Drożdże do ciasta najbardziej lubią:",o:["Zimno","Ciepło (ok. 30°C)","Gorąco (ok. 90°C)"],a:1,why:"W cieple drożdże się namnażają i wytwarzają gaz, ale gorąco je zabija."},
 {t:["ryz"],q:"Ugotowany ryż stał kilka godzin w cieple. Dlaczego jest niebezpieczny?",o:["Wysechł","Namnażają się w nim bakterie","Straci kolor"],a:1,why:"W cieple w ryżu rozwijają się bakterie (Bacillus cereus). Ugotowany ryż szybko schładzaj i trzymaj w lodówce."},
 {t:["ryz"],q:"Makaron „al dente” jest:",o:["Rozgotowany","Lekko twardy w środku","Surowy"],a:1,why:"Włoskie al dente oznacza „na ząb”: makaron zachowuje delikatny opór."},
 {t:["ogolne"],q:"Resztki zupy po obiedzie:",o:["Zostawiam na kuchence do rana","Szybko schładzam i wkładam do lodówki","Wkładam do szafki"],a:1,why:"Jedzenie nie powinno stać w cieple dłużej niż 2 godziny, bo namnażają się bakterie."},
 {t:["ogolne"],q:"Oznaczenie alergenów w daniu informuje o:",o:["Składnikach, które mogą uczulać","Składnikach drogich","Składnikach słodkich"],a:0,why:"Alergeny (np. gluten, mleko, jaja, orzechy) muszą być widoczne, bo dla alergików mogą być groźne."},
 {t:["ogolne"],q:"Glutenu NIE zawiera:",o:["Mąka pszenna","Ryż","Bułka tarta"],a:1,why:"Gluten jest w zbożach: pszenicy, życie i jęczmieniu. Ryż jest naturalnie bezglutenowy."},
 {t:["ogolne"],q:"Śmietanę do gorącej zupy najlepiej dodać:",o:["Na początku, do zimnej wody","Na końcu i nie gotować dłużej","Razem z mięsem"],a:1,why:"Długie gotowanie lub nagła zmiana temperatury powoduje, że śmietana się zważy."},
 {t:["ogolne"],q:"Cebulę „szklimy”, gdy jest:",o:["Biała i twarda","Przezroczysta i miękka","Czarna"],a:1,why:"Zeszklona cebula jest słodka i miękka, a przypalona robi się gorzka."},
 {t:["ogolne"],q:"Szczypta cukru w sosie pomidorowym:",o:["Zmniejsza kwasowość","Zmienia kolor na zielony","Rozrzedza sos"],a:0,why:"Cukier równoważy kwasowość pomidorów i wydobywa ich smak."},
 {t:["ogolne"],q:"Gorący garnek zdejmujemy z kuchenki:",o:["Mokrą szmatką","Suchą rękawicą lub uchwytem","Gołymi rękami"],a:1,why:"Mokra szmatka przewodzi ciepło i może poparzyć parą. Zawsze używaj suchej rękawicy."},
 {t:["ogolne"],q:"Rączki patelni i garnków ustawiamy:",o:["Nad innym palnikiem","Do środka kuchenki, bezpiecznie","Na zewnątrz, nad podłogą"],a:1,why:"Wystająca rączka łatwo zahaczy o rękaw i przewróci gorące jedzenie."}
];
function K_QUIZPICK(recipe,avoid){
  const ids=recipe.ing.map(x=>x[0]);
  const tags=new Set(["ogolne","higiena"]);
  if(ids.some(i=>["kurczak","kotlet","mielone","schab","boczek","kielbasa","ryba","wedzonka","salami","szynka"].includes(i)))tags.add("mieso");
  if(ids.includes("jajka")||ids.includes("zoltko"))tags.add("jaja");
  if(ids.includes("ryz")||ids.includes("makaron"))tags.add("ryz");
  if(recipe.steps.some(s=>s.type==="heat"&&s.station==="patelnia"))tags.add("smazenie");
  if(recipe.steps.some(s=>s.type==="heat"&&s.station==="piekarnik"))tags.add("pieczenie");
  let pool=K_QUIZ.filter(q=>q.t.some(t=>tags.has(t)&&t!=="ogolne"&&t!=="higiena"));
  if(!pool.length||Math.random()<.3)pool=K_QUIZ.filter(q=>q.t.some(t=>tags.has(t)));
  pool=pool.filter(q=>!(avoid&&avoid.includes(q.q)));
  const q=pool[Math.floor(Math.random()*pool.length)]||K_QUIZ[0];
  /* losowa kolejność odpowiedzi */
  const idx=[0,1,2].sort(()=>Math.random()-.5);
  return {q:q.q,o:idx.map(i=>q.o[i]),a:idx.indexOf(q.a),why:q.why};
}
