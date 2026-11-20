/* Testy spójności danych gry: przepisy, składniki, lekcje, karty wiedzy i kreator dań. */
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'..','www/index.html'),'utf8').replace(/\r\n/g,'\n');
function between(a,b){
  const i=html.indexOf(a),j=html.indexOf(b);
  assert.ok(i>=0&&j>i,'Brak sekcji '+a);
  return html.slice(i,j);
}
function load(){
  const ctx={console,Math,JSON,Object,Number,btoa,atob,escape,unescape,encodeURIComponent,decodeURIComponent,Date,Set,S:{day:50}};
  vm.createContext(ctx);
  vm.runInContext(between('/* ============ DANE ============ */','/* ============ STAN ============ */'),ctx);
  vm.runInContext('const unlocked=()=>RECIPES.filter(r=>r.day<=S.day);',ctx);
  vm.runInContext(between('/* ============ DANIA ============ */','/* ============ KLIENCI ============ */'),ctx);
  return {ctx,run:s=>vm.runInContext(s,ctx)};
}
const G=load();
const run=G.run;
const sortKey=a=>[...a].sort().join('|');

test('każdy przepis ma poprawne składniki, urządzenie i 2–4 składniki',()=>{
  const bad=run(`RECIPES.filter(r=>!STN.some(s=>s.type===r.st)||r.ing.length<2||r.ing.length>4||!r.ing.every(i=>ING[i])||!(r.price>0)||!(r.time>0)).map(r=>r.id)`);
  assert.deepEqual([...bad],[]);
});
test('identyfikatory przepisów są unikalne, a kombinacje (urządzenie + skład) się nie powtarzają',()=>{
  const ids=run('RECIPES.map(r=>r.id)'),keys=run('RECIPES.map(r=>r.st+":"+key(r.ing))');
  assert.equal(new Set(ids).size,ids.length);
  assert.equal(new Set(keys).size,keys.length);
});
test('hot-dog jest w grze i można zrobić z niego własną wersję',()=>{
  assert.deepEqual([...run('R("hotdog").ing')].sort(),['cebula','chleb','kielbasa']);
  assert.equal(run('R("hotdog").st'),'pan');
  const own=run('sanitizeRecipe({name:"Hot-dog z serem",e:"🌭",st:"pan",ing:["chleb","kielbasa","ser","cebula"],note:""})');
  assert.ok(own);
  assert.equal(run('dupOf("pan",["chleb","kielbasa","ser","cebula"])'),null);
  assert.equal(run('dupOf("pan",["cebula","kielbasa","chleb"])').id,'hotdog');
});
test('każdy składnik ma kartę wiedzy: kalorie, przechowywanie i mrożenie',()=>{
  const missing=run('Object.keys(ING).filter(id=>!FACTS[id]||!(FACTS[id][0]>0)||!FACTS[id][1]||!FACTS[id][2])');
  assert.deepEqual([...missing],[]);
  assert.deepEqual([...run('Object.keys(FACTS).filter(id=>!ING[id])')],[]);
});
test('każdy składnik należy do istniejącej kategorii i ma cenę',()=>{
  assert.deepEqual([...run('Object.keys(ING).filter(id=>!CATS.some(c=>c[0]===ING[id].c)||!(ING[id].p>0))')],[]);
});
test('lekcje: unikalne id, poprawne indeksy odpowiedzi, 3 odpowiedzi, wyjaśnienia',()=>{
  const L=JSON.parse(run('JSON.stringify(LESSONS)'));
  assert.ok(L.length>=10,'oczekiwano co najmniej 10 lekcji');
  assert.equal(new Set(L.map(l=>l.id)).size,L.length);
  for(const l of L){
    assert.ok(l.cards.length>=3,l.id+': za mało kart');
    assert.ok(l.q.length>=3,l.id+': za mało pytań');
    for(const q of l.q){
      assert.equal(q.a.length,3,l.id+': '+q.q);
      assert.ok(Number.isInteger(q.c)&&q.c>=0&&q.c<3,l.id+': indeks odpowiedzi');
      assert.ok(q.w&&q.w.length>10,l.id+': brak wyjaśnienia');
      assert.equal(new Set(q.a).size,3,l.id+': powtórzona odpowiedź');
    }
  }
});
test('alergeny w grze odnoszą się do istniejących składników',()=>{
  assert.deepEqual([...run('Object.keys(AL).filter(g=>AL[g].ing.some(i=>!ING[i]))')],[]);
  assert.deepEqual([...run('allergensOf(["maka","ser"])')].sort(),['gluten','mleko']);
  assert.deepEqual([...run('allergensOf(["pomidor","marchewka"])')],[]);
});
test('kalorie są liczone orientacyjnie i rosną ze składnikami',()=>{
  const a=run('kcalOf(["pomidor","marchewka"])'),b=run('kcalOf(["maslo","czekolada"])');
  assert.ok(a>0&&b>a);
  assert.equal(run('kcalOf(["maka","maka"])'),Math.round(364*0.8*2/5)*5);
});

/* ---------- kreator dań ---------- */
test('sanitizeRecipe odrzuca złe dane i czyści tekst',()=>{
  const ok={name:'  Super   <b>Burger</b> ',e:'🍔',st:'pan',ing:['chleb','wolowina'],note:'Smaż <script>x</script> "krótko"'};
  const r=run(`sanitizeRecipe(${JSON.stringify(ok)})`);
  assert.equal(r.name,'Super bBurgerb');
  assert.ok(!/[<>&"]/.test(r.note));
  assert.equal(r.e,'🍔');
  const bads=[null,[],'x',{},{name:'A',st:'pan',ing:['chleb','ser']},{name:'Ok',st:'xx',ing:['chleb','ser']},{name:'Ok',st:'pan',ing:['chleb']},
    {name:'Ok',st:'pan',ing:['chleb','ser','ser','ser','ser']},{name:'Ok',st:'pan',ing:['chleb','__proto__']},{name:'Ok',st:'pan',ing:['chleb','constructor']},{name:'Ok',st:'pan',ing:'chleb ser'}];
  for(const b of bads)assert.equal(run(`sanitizeRecipe(${JSON.stringify(b)})`),null,JSON.stringify(b));
  assert.equal(run('sanitizeRecipe({name:"Dobre",e:"<img>",st:"pan",ing:["chleb","ser"]})').e,'🍳');
});
test('nazwa jest przycinana do 24 znaków',()=>{
  const r=run('sanitizeRecipe({name:"A".repeat(80),st:"pot",ing:["pomidor","ser"]})');
  assert.equal(r.name.length,24);
});
test('kod przepisu: zapis i odczyt zachowują polskie znaki i emoji',()=>{
  run('MY=[]');
  const list=[{name:'Żółta zupa Gęślą',e:'🍲',st:'pot',ing:['dynia','marchewka','cebula'],note:'Gotuj do miękkości. Zażółć.'},{name:'Hot-dog z serem',e:'🌭',st:'pan',ing:['chleb','kielbasa','ser','cebula'],note:''}];
  const code=run(`encodeRecipes(${JSON.stringify(list)})`);
  assert.ok(code.startsWith('GM1:'));
  const res=run(`decodeRecipes("Cześć! Mój przepis:\\n${code}\\nPozdrawiam")`);
  assert.equal(res.err,'');
  assert.equal(res.list.length,2);
  assert.equal(res.list[0].name,'Żółta zupa Gęślą');
  assert.equal(res.list[1].e,'🌭');
  assert.deepEqual([...res.list[1].ing],['chleb','kielbasa','ser','cebula']);
});
test('odczyt kodu jest odporny na śmieci, złośliwy JSON i zbyt długi tekst',()=>{
  const enc=o=>'GM1:'+Buffer.from(JSON.stringify(o),'utf8').toString('base64');
  const cases=['','abc','GM1:','GM1:!!!','GM1:'+Buffer.from('{zepsute').toString('base64'),enc(5),enc(null),enc([]),enc([{n:'x'}]),enc({n:'<img src=x onerror=alert(1)>',s:'pan',i:['chleb','ser']})];
  for(const c of cases){
    const res=run(`decodeRecipes(${JSON.stringify(c)})`);
    assert.ok(Array.isArray(res.list));
    for(const r of res.list)assert.ok(!/[<>"&]/.test(r.name),'nazwa po czyszczeniu: '+r.name);
  }
  assert.ok(run(`decodeRecipes("A".repeat(50000))`).err);
  const proto=run(`decodeRecipes(${JSON.stringify(enc([{n:'Test',s:'pan',i:['chleb','__proto__']}]))})`);
  assert.equal(proto.list.length,0);
  const many=Array.from({length:100},(_,i)=>({n:'Przepis '+i,s:'pan',i:['chleb','ser']}));
  assert.ok(run(`decodeRecipes(${JSON.stringify(enc(many))})`).list.length<=30);
});
test('esc zamienia znaki specjalne HTML',()=>{
  assert.equal(run('esc(`<a href="x">&\'</a>`)'),'&lt;a href=&quot;x&quot;&gt;&amp;&#39;&lt;/a&gt;');
});
test('parseMy odtwarza zapisane przepisy i ignoruje uszkodzone wpisy',()=>{
  const raw=JSON.stringify([{id:'my_abc123',name:'Mój omlet',e:'🍳',st:'pan',ing:['jajko','jajko','ser','maslo'],note:''},{id:'my_abc123',name:'Dubel id',st:'pot',ing:['pomidor','ser']},{name:'Zły',st:'zzz',ing:[]},5,null]);
  const list=run(`parseMy(${JSON.stringify(raw)})`);
  assert.equal(list.length,2);
  assert.equal(list[0].id,'my_abc123');
  assert.notEqual(list[1].id,'my_abc123');
  assert.ok(list.every(r=>r.mine&&r.price>=10&&r.time===5));
  assert.equal(run('parseMy("to nie json")').length,0);
  assert.equal(run('parseMy(null)').length,0);
});
test('własny przepis jest rozpoznawany przy gotowaniu, a duplikaty odrzucane',()=>{
  run('MY=[]');
  run('MY.push(finishRecipe(sanitizeRecipe({name:"Hot-dog z serem",e:"🌭",st:"pan",ing:["chleb","kielbasa","ser","cebula"]}),"my_test1"))');
  assert.equal(run('findRecipe("pan",["ser","cebula","chleb","kielbasa"]).id'),'my_test1');
  assert.equal(run('R("my_test1").name'),'Hot-dog z serem');
  assert.equal(run('hasLonger("pan",["chleb","kielbasa","cebula"])'),true);
  assert.equal(run('dupOf("pan",["chleb","kielbasa","ser","cebula"]).id'),'my_test1');
  assert.equal(run('dupOf("pan",["chleb","kielbasa","ser","cebula"],"my_test1")'),null);
});
test('sterowanie dotykiem: jedno dotknięcie wystarcza (autoDrop/autoServe, touch-action)',()=>{
  assert.ok(html.includes('function autoDrop()')&&html.includes('function autoServe()'));
  assert.ok(html.includes('autoDrop();}else{act({act:"station",i:d.i});autoServe();'));
  assert.ok(html.includes('.chip,.st{touch-action:none}'));
});
test('kwestie klientów i oceny zmiany są kompletne',()=>{
  for(const k of ['arrive','ideal','good','late','leave'])assert.ok(run(`SAY.${k}.length`)>=3,k);
  assert.equal(run('GRADE.length'),4);
  assert.ok(html.includes('danie dnia'));
});
test('przycisk Wstecz w Androidzie jest obsłużony (pauza zamiast wyjścia)',()=>{
  assert.ok(html.includes('window.addEventListener("popstate"')&&html.includes('history.pushState({g:1},"")'));
});
test('kafelek składnika nie zawiera przycisku kupna, który przechwytuje dotyk (Chrome przyciąga palec do przycisków)',()=>{
  assert.ok(!html.includes('<button class="plus"'));
  assert.ok(html.includes('<span class="plus">'));
  assert.ok(html.includes('.tile .plus{')&&html.includes('pointer-events:none'));
});
test('kopia zapasowa: zapis i odczyt postępu oraz przepisów, odporność na złe dane',()=>{
  run('MY=[]');
  const save={coins:77,day:12,maxLv:12,stars:{1:3,2:2},name:'Ania',up:{cook:1}};
  const my=[{name:'Hot-dog z serem',e:'🌭',st:'pan',ing:['chleb','kielbasa','ser','cebula'],note:'ok'},{name:'Hot-dog z serem 2',e:'🌭',st:'pan',ing:['cebula','chleb','ser','kielbasa'],note:''},{name:'Lody',e:'🍨',st:'frz',ing:['jagoda','mleko','miod']},{name:'Dubel klasyka',st:'pan',ing:['chleb','kielbasa','cebula']}];
  const code=run(`encodeBackup(${JSON.stringify(save)},${JSON.stringify(my)})`);
  assert.ok(code.startsWith('GM2:'));
  const res=run(`decodeBackup("moja kopia: "+${JSON.stringify(code)})`);
  assert.equal(res.err,'');assert.equal(res.save.day,12);assert.equal(res.save.coins,77);
  assert.equal(res.my.length,2,'duplikaty i przepisy z gry są odrzucane');
  for(const bad of ['','GM2:','GM2:!!!','GM1:abc','GM2:'+Buffer.from('[1,2]').toString('base64'),'GM2:'+Buffer.from('{"v":2,"s":{}}').toString('base64'),'GM2:'+Buffer.from('{"v":1,"s":[]}').toString('base64')])
    assert.ok(run(`decodeBackup(${JSON.stringify(bad)})`).err,bad);
  assert.ok(run('decodeBackup("A".repeat(70000))').err);
});
