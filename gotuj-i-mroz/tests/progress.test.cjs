const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(root,'www/index.html'),'utf8');
const original=fs.readFileSync(path.join(root,'index.html'),'utf8');
const android=fs.readFileSync(path.join(root,'android/app/src/main/assets/public/index.html'),'utf8');
function extract(name){
  const re=new RegExp('function '+name+'\\s*\\(');
  const match=re.exec(html);
  assert.ok(match,'Missing function '+name);
  const begin=html.indexOf('{',match.index),start=begin;
  let depth=0,quote='',escape=false,comment='';
  for(let i=start;i<html.length;i++){
    const c=html[i],n=html[i+1];
    if(comment==='line'){if(c==='\n')comment='';continue;}
    if(comment==='block'){if(c==='*'&&n==='/'){comment='';i++;}continue;}
    if(quote){if(escape){escape=false;continue;}if(c==='\\'){escape=true;continue;}if(c===quote)quote='';continue;}
    if(c==='/'&&n==='/'){comment='line';i++;continue;}
    if(c==='/'&&n==='*'){comment='block';i++;continue;}
    if(c==='"'||c==="'"||c==='`'){quote=c;continue;}
    if(c==='{')depth++;else if(c==='}'&&!--depth)return html.slice(match.index,i+1);
  }
  throw Error('Unterminated function '+name);
}
function harness(saved){
  const storage={value:saved===undefined?null:JSON.stringify(saved),setItem(k,v){assert.equal(k,'gotuj_i_mroz_v2');this.value=v;},getItem(){return this.value;}};
  const S={coins:30,day:1,best:0,rep:3,sound:true,music:true,hints:true,diff:'easy',easy:true,hard:false,tutDone:false,maxLv:1,stars:{},learn:true,done:[],quizOK:0,quizTot:0,up:{cook:0,burn:0,pat:0,stock:0},earned:0,running:true,st:[],q:[]};
  const ctx={S,localStorage:storage,RECIPES:[],reviews:()=>[],sfx:{tada(){}},startQuiz(){},showEnd(){},target:()=>100,unlocked:()=>[],Math,JSON,Object,Number};
  vm.createContext(ctx);
  vm.runInContext("const validLevel=n=>Number.isInteger(n)&&n>=1&&n<=50;const levelOr=(n,fallback)=>validLevel(n)?n:fallback;"+extract('load')+';'+extract('save')+';'+extract('endDay'),ctx);
  return {ctx,S,storage,load:()=>vm.runInContext('load()',ctx),save:()=>vm.runInContext('save()',ctx),endDay:()=>vm.runInContext('endDay()',ctx)};
}
test('three game copies remain identical',()=>{assert.equal(original,html);assert.equal(android,html);});
test('all 50 levels unlock sequentially and level 50 is capped',()=>{
  const h=harness();h.S.learn=false;
  for(let level=1;level<=50;level++){
    assert.equal(h.S.day,level);
    h.S.earned=200;h.endDay();
    assert.equal(h.S.maxLv,Math.min(50,level+1));
    assert.equal(h.S.stars[level],3);
  }
  assert.equal(h.S.day,50);
  assert.equal(Object.keys(h.S.stars).length,50);
});
test('replaying an earlier level does not roll back progress',()=>{
  const h=harness();h.S.learn=false;h.S.day=12;h.S.maxLv=38;h.S.earned=200;h.endDay();
  assert.equal(h.S.day,38);assert.equal(h.S.maxLv,38);assert.equal(h.S.stars[12],3);
});
test('failed replay preserves unlocks and stars',()=>{
  const h=harness();h.S.learn=false;h.S.day=12;h.S.maxLv=38;h.S.stars[12]=2;h.S.earned=0;h.endDay();
  assert.equal(h.S.maxLv,38);assert.equal(h.S.stars[12],2);
});
test('save and restore returns to highest unlocked level',()=>{
  const h=harness();h.S.day=7;h.S.maxLv=42;h.S.stars[41]=3;h.save();
  const restored=harness(JSON.parse(h.storage.value));restored.load();
  assert.equal(restored.S.day,42);assert.equal(restored.S.maxLv,42);assert.equal(restored.S.stars[41],3);
});
test('invalid save values are rejected without crashing',()=>{
  const h=harness({day:999,maxLv:-4,stars:{1:9,2:3,51:2},up:{cook:999,burn:2},coins:-100,rep:200});
  h.load();assert.equal(h.S.day,1);assert.equal(h.S.maxLv,1);
  assert.equal(h.S.stars[2],3);assert.equal(h.S.stars[1],undefined);
  assert.equal(h.S.up.cook,0);assert.equal(h.S.up.burn,2);
  assert.equal(h.S.coins,0);assert.equal(h.S.rep,5);
});
test('map contains five chapters of ten levels',()=>{
  assert.match(html,/for\\(let c=0;c<5;c\\+\\+\\)/);
  assert.match(html,/for\\(let i=1;i<=10;i\\+\\+\\)/);
  assert.match(html,/level>S\\.maxLv/);
});
