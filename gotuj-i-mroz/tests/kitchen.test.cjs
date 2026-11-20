/* Testy silnika gotowania (Kuchnia szefa): dane przepisów, idealny gracz, niechlujny gracz. */
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const dir=path.join(__dirname,'..','www','js');
const ctx={console,Math,JSON,Object,Number,Set};
vm.createContext(ctx);
const src=["k-data.js","k-engine.js","k-more.js","k-more2.js","k-dishes.js","k-quiz.js"].map(f=>fs.readFileSync(path.join(dir,f),"utf8")).join("\n")+"\n;this.K_RECIPES=K_RECIPES;this.K_ING=K_ING;this.K_BOOKS=K_BOOKS2;this.K_LEVELS=K_LEVELS;this.KE=KE;this.KDISH=KDISH;this.K_TIER=K_TIER;this.K_QUIZ=K_QUIZ;this.K_QUIZPICK=K_QUIZPICK;";
vm.runInContext(src,ctx);
const {K_RECIPES,K_ING,K_BOOKS,KE,K_LEVELS,KDISH,K_TIER,K_QUIZ,K_QUIZPICK}=ctx;
const STEP_TYPES=['setup','wash','gather','chop','tap','mix','balance','seq','heat','rest','serve'];

/* idealny gracz: robi dokładnie to, czego wymaga każdy etap */
function perfect(recipe){
  const run=KE.newRun(recipe,'learn');let guard=0;
  while(!run.finished&&guard++<400){
    const st=run.st,s=st.s;
    switch(st.type){
      case 'wash':case 'mix':KE.act(run,'hold',true);for(let k=0;k<400&&!st.ok;k++)KE.tick(run,.05);KE.act(run,'hold',false);break;
      case 'gather':for(const id of s.items)KE.act(run,'item',id);break;
      case 'seq':for(const id of s.order)KE.act(run,'item',id);break;
      case 'setup':for(const task of s.tasks)KE.act(run,'prepare',task.id);break;
      case 'chop':case 'tap':for(let k=0;k<s.n;k++)KE.act(run,'hit');break;
      case 'balance':{const mid=(s.zone[0]+s.zone[1])/2;for(let k=0;k<2000&&!st.ok;k++){KE.act(run,'hold',st.level<mid);KE.tick(run,.05);}break;}
      case 'heat':{KE.act(run,'temp',s.good);KE.act(run,'start');const mid=(s.window[0]+s.window[1])/2;
        const flips=(s.flips||[]).slice();
        for(let k=0;k<4000&&st.p<mid&&!st.taken;k++){KE.tick(run,.02);if(flips.length&&st.p>=flips[0]){KE.act(run,'flip');flips.shift();}}
        KE.act(run,'take');break;}
      case 'rest':KE.act(run,'skip');break;
      case 'serve':KE.act(run,'serve');break;
    }
    assert.ok(st.ok,recipe.id+': etap '+run.i+' ('+st.type+') nie został ukończony przez idealnego gracza');
    KE.next(run);
  }
  return run;
}
/* niechlujny gracz: zbędne składniki, zła kolejność, złe temperatury, wyjmowanie za wcześnie/za późno */
function sloppy(recipe,seed){
  let rnd=seed;const R=()=>{rnd=(rnd*1103515245+12345)%2147483648;return rnd/2147483648;};
  const run=KE.newRun(recipe,'learn');let guard=0;
  while(!run.finished&&guard++<600){
    const st=run.st,s=st.s;
    switch(st.type){
      case 'wash':case 'mix':KE.act(run,'hold',true);for(let k=0;k<400&&!st.ok;k++)KE.tick(run,.05);break;
      case 'gather':KE.act(run,'item','ocet');KE.act(run,'item','maka');KE.act(run,'item','cukier');for(const id of s.items)KE.act(run,'item',id);break;
      case 'setup':KE.act(run,'prepare',s.tasks[2].id);for(const task of s.tasks)KE.act(run,'prepare',task.id);break;
      case 'seq':{const o=s.order.slice().reverse();for(const id of o)KE.act(run,'item',id);for(const id of s.order)KE.act(run,'item',id);break;}
      case 'chop':case 'tap':for(let k=0;k<s.n;k++)KE.act(run,'hit');break;
      case 'balance':for(let k=0;k<2000&&!st.ok;k++){KE.act(run,'hold',true);KE.tick(run,.05);}break;
      case 'heat':{KE.act(run,'temp',s.good==='low'?'high':'low');KE.act(run,'start');for(let k=0;k<8000&&!st.taken&&st.p<(R()<.5?s.window[0]*.4:s.burn);k++)KE.tick(run,.02);KE.act(run,'take');break;}
      case 'rest':KE.act(run,'skip');break;
      case 'serve':KE.act(run,'serve');break;
    }
    if(!st.ok){for(let k=0;k<4000&&!st.ok;k++)KE.tick(run,.05);}
    if(!st.ok)break;
    KE.next(run);
  }
  return run;
}

test('księga przepisów: poprawne dane, unikalne id, istniejące składniki',()=>{
  assert.ok(K_RECIPES.length>=8);
  assert.equal(new Set(K_RECIPES.map(r=>r.id)).size,K_RECIPES.length);
  const books=new Set(K_BOOKS.map(b=>b.id));
  for(const r of K_RECIPES){
    assert.ok(books.has(r.book),r.id+': księga');
    assert.ok(r.name&&r.e&&r.story&&r.storage&&r.price>0&&r.diff>=1&&r.diff<=3,r.id);
    assert.ok(Array.isArray(r.allergens)&&r.ing.length>=3&&r.steps.length>=4,r.id);
    for(const [id,amt] of r.ing){assert.ok(K_ING[id],r.id+': składnik '+id);assert.ok(amt&&amt.length>0,r.id+': ilość '+id);}
    assert.equal(r.steps[r.steps.length-1].type,'serve',r.id+': ostatni etap to podanie');
    for(const s of r.steps){
      assert.ok(STEP_TYPES.includes(s.type),r.id+': typ '+s.type);assert.ok(s.text&&s.text.length>8,r.id+': tekst etapu');
      if(s.type!=='serve')assert.ok(s.why&&s.why.length>8,r.id+': brak „dlaczego tak” w etapie '+s.type);
      if(s.type==='gather'){for(const id of [...s.items,...s.decoys])assert.ok(K_ING[id],r.id+': gather '+id);assert.ok(s.decoys.every(d=>!s.items.includes(d)),r.id+': zbędny = potrzebny');}
      if(s.type==='seq')for(const id of s.order)assert.ok(K_ING[id],r.id+': seq '+id);
      if(s.type==='heat'){assert.ok(['piekarnik','garnek','patelnia'].includes(s.station),r.id);assert.ok(s.temps.some(t=>t[0]===s.good),r.id+': dobra temperatura istnieje');
        assert.ok(s.window[0]>0&&s.window[1]<s.burn&&s.window[0]<s.window[1]&&s.dur>0,r.id+': okno');}
      if(s.type==='balance')assert.ok(s.zone[0]<s.zone[1]&&s.need>0&&s.rise>0&&s.fall>0,r.id);
    }
  }
  assert.ok(K_RECIPES.some(r=>r.id==='zurek')&&K_RECIPES.some(r=>r.id==='wodzionka')&&K_RECIPES.some(r=>r.id==='schabowy')&&K_RECIPES.some(r=>r.id==='majonez')&&K_RECIPES.some(r=>r.id==='chleb')&&K_RECIPES.some(r=>r.id==='sernik'));
});
test('składniki wymienione w etapach należą do przepisu (poza zbędnymi)',()=>{
  for(const r of K_RECIPES){
    const have=new Set(r.ing.map(x=>x[0]));
    for(const s of r.steps){
      const used=s.type==='gather'?s.items:s.type==='seq'?s.order:[];
      for(const id of used)assert.ok(have.has(id)||id==='woda'||id==='sol',r.id+': '+id+' użyty w etapie, a nie ma go na liście składników');
    }
  }
});
test('idealny gracz kończy każdy przepis z 3 gwiazdkami i bez błędów',()=>{
  for(const r of K_RECIPES){
    const run=perfect(r);
    assert.ok(run.finished,r.id);assert.equal(run.result.stars,3,r.id+': '+run.result.pct.toFixed(2)+' '+JSON.stringify(run.result.notes));
    assert.equal(run.mistakes.length,0,r.id+': '+JSON.stringify(run.mistakes));
    assert.ok(run.result.payout>=r.price,r.id+': wypłata');
  }
});
test('niechlujny gracz dostaje niskie oceny i wyjaśnienia błędów',()=>{
  for(const r of K_RECIPES){
    for(const seed of [1,7,42]){
      const run=sloppy(r,seed);
      assert.ok(run.finished,r.id+' seed '+seed);
      assert.ok(run.result.stars<=1,r.id+' seed '+seed+': '+run.result.stars+' gwiazdek, '+run.result.pct.toFixed(2));
      assert.ok(run.mistakes.length>0&&run.result.notes.length>0,r.id);
      assert.ok(run.result.notes.every(n=>n.msg&&typeof n.why==='string'));
    }
  }
});
test('silnik: kolejność w seq, zbędne składniki, przypalenie i obrót kotleta',()=>{
  const r=K_RECIPES.find(x=>x.id==='schabowy');
  const run=KE.newRun(r,'learn');
  // przejdź do etapu panierki
  while(run.st.type!=='seq'){const st=run.st,s=st.s;
    if(st.type==='wash'){KE.act(run,'hold',true);for(let k=0;k<200&&!st.ok;k++)KE.tick(run,.05);}
    else if(st.type==='gather')s.items.forEach(i=>KE.act(run,'item',i));
    else if(st.type==='chop')for(let k=0;k<s.n;k++)KE.act(run,'hit');
    KE.next(run);}
  assert.equal(KE.act(run,'item','bulka'),false);assert.equal(run.mistakes.length,1);
  assert.match(run.mistakes[0].msg,/Zła kolejność/);
  for(const id of run.st.s.order)KE.act(run,'item',id);
  assert.ok(run.st.ok);KE.next(run);
  // smażenie: bez wyboru temperatury start jest odrzucony, przypalenie kończy etap
  assert.equal(run.st.type,'heat');assert.equal(KE.act(run,'start'),false);
  KE.act(run,'temp','high');KE.act(run,'start');
  for(let k=0;k<5000&&!run.st.ok;k++)KE.tick(run,.02);
  assert.ok(run.st.burnt&&run.st.ok);assert.ok(run.st.score<=.2);
});
test('wypłata zależy od jakości, a stan końcowy jest zablokowany',()=>{
  const r=K_RECIPES[0];const good=perfect(r),bad=sloppy(r,3);
  assert.ok(good.result.payout>bad.result.payout);
  assert.equal(KE.next(good),false);assert.equal(KE.act(good,'hit'),false);
});

test('kampania: 72 plansze, 72 przepisy, idealny gracz dostaje 3 gwiazdki w każdym',()=>{
  assert.ok(K_RECIPES.length>=72,'przepisów: '+K_RECIPES.length);
  assert.equal(K_LEVELS.length,72);
  for(const l of K_LEVELS){assert.ok(l.menu.length>=1&&l.menu.every(id=>K_RECIPES.some(r=>r.id===id)),'menu planszy '+l.n);assert.ok(l.guests>=7&&l.guests<=11);assert.ok(l.pat>=150);}
  for(const r of K_RECIPES){const run=perfect(r);assert.equal(run.result.stars,3,r.id+' idealny gracz: '+run.result.pct);}
  assert.equal(new Set(K_LEVELS.map(l=>l.menu[0])).size,72,'każdy przepis jest nowością na jednej planszy');
});
test('kampania: niechlujny gracz nie dostaje 3 gwiazdek z żadnego przepisu',()=>{
  for(const r of K_RECIPES){const run=sloppy(r,7);if(run.finished)assert.ok(run.result.stars<3,r.id);}
});

test('każde danie ma własny rysunek (SVG), a nie emotikonę',()=>{
  for(const r of K_RECIPES){assert.ok(KDISH.MAP[r.id],r.id+': brak rysunku');const s=KDISH.svg(r.id,40);assert.ok(s.startsWith('<svg')&&s.length>200,r.id);}
  const sig=new Set(K_RECIPES.map(r=>JSON.stringify(KDISH.MAP[r.id])));assert.ok(sig.size>=60,'rysunki muszą się różnić: '+sig.size);
});

test('trudność rośnie z numerem planszy, a pomoc maleje',()=>{
  let prev=K_TIER(0);assert.equal(prev.t,0);assert.ok(prev.showList&&prev.showWin&&!prev.hideSeq);
  for(let n=1;n<72;n++){const c=K_TIER(n);assert.ok(c.t>=prev.t&&c.decoys>=prev.decoys&&c.hints<=prev.hints&&c.tight>=prev.tight,'plansza '+n);prev=c;}
  const last=K_TIER(71);assert.equal(last.t,5);assert.ok(last.hideSeq&&last.redact&&!last.showWin&&!last.showList&&last.hints<=1&&last.decoys>=7);
  assert.equal(K_TIER(null).t,0);
});
test('podpowiedzi i pytania szefa wpływają na ocenę',()=>{
  const r=K_RECIPES.find(x=>x.id==='schabowy');
  const a=perfect(r);assert.equal(a.result.stars,3);
  const run=KE.newRun(r,'learn');KE.act(run,'hold',true);for(let k=0;k<400&&!run.st.ok;k++)KE.tick(run,.05);KE.next(run);const h=KE.hint(run);assert.equal(h.type,'item');assert.equal(run.hints,1);
  KE.act(run,'item','ocet');assert.ok(run.mistakes.length>=1);
  const r2=KE.newRun(r,'learn');KE.quiz(r2,false,'zle','bo tak');assert.equal(r2.quizBad,1);assert.equal(r2.mistakes.length,1);
  const r3=KE.newRun(r,'learn');KE.quiz(r3,true);assert.equal(r3.quizOk,1);
});
test('węższe okna na najwyższych planszach, a idealny gracz nadal wygrywa',()=>{
  const t=K_TIER(71);
  for(const r of K_RECIPES){const run=KE.newRun(r,'learn',{tight:t.tight,speed:t.speed});
    for(let g=0;g<400&&!run.finished;g++){const st=run.st,s=st.s;
      switch(st.type){case 'wash':case 'mix':KE.act(run,'hold',true);for(let k=0;k<400&&!st.ok;k++)KE.tick(run,.05);KE.act(run,'hold',false);break;
        case 'gather':for(const id of s.items)KE.act(run,'item',id);break;case 'seq':for(const id of s.order)KE.act(run,'item',id);break;
        case 'setup':for(const task of s.tasks)KE.act(run,'prepare',task.id);break;
        case 'chop':case 'tap':for(let k=0;k<s.n;k++)KE.act(run,'hit');break;
        case 'balance':{const mid=(s.zone[0]+s.zone[1])/2;for(let k=0;k<2000&&!st.ok;k++){KE.act(run,'hold',st.level<mid);KE.tick(run,.05);}break;}
        case 'heat':{KE.act(run,'temp',s.good);KE.act(run,'start');const mid=(s.window[0]+s.window[1])/2;const fl=(s.flips||[]).slice();for(let k=0;k<4000&&st.p<mid&&!st.taken;k++){KE.tick(run,.02);if(fl.length&&st.p>=fl[0]){KE.act(run,'flip');fl.shift();}}KE.act(run,'take');break;}
        case 'rest':KE.act(run,'skip');break;case 'serve':KE.act(run,'serve');break;}
      KE.next(run);}
    assert.ok(run.finished&&run.result.stars>=2,r.id+' na planszy 72: '+(run.result&&run.result.pct));}
});
test('pytania szefa: poprawne dane i losowanie dopasowane do dania',()=>{
  for(const q of K_QUIZ){assert.equal(q.o.length,3,q.q);assert.ok(q.a>=0&&q.a<3&&q.why.length>20&&q.t.length>=1,q.q);}
  const sc=K_RECIPES.find(x=>x.id==='schabowy');
  for(let i=0;i<30;i++){const q=K_QUIZPICK(sc);assert.equal(q.o.length,3);assert.ok(q.a>=0&&q.a<3);}
});
