/* Skrypt demo: ustawia stan gry do zrzutów ekranu (nie jest częścią gry w sklepie) */
(function(){
  let s=20260;Math.random=()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};
  const sc=(location.hash||"#play1").slice(1);
  S.sound=false;S.music=false;S.easy=false;S.tutDone=true;
  const sIdx=type=>STN.findIndex(x=>x.type===type);
  function setup(day,n){
    S.day=day;S.rep=4.3;S.coins=148;S.best=212;closeOv();menuMode=false;newDay();
    for(let i=0;i<1200&&(S.q.length<n||S.q.some(c=>c.walk));i++){S.spawn=S.q.length<n?0:99;tick(.1);}
    S.time=58;S.earned=96;S.spawn=9999;
  }
  function put(idx,ings){ings.forEach(i=>{S.stock[i]=3;act({act:"ing",id:i});act({act:"station",i:idx});});}
  function cook(rid,frac){const r=R(rid),i=sIdx(r.st);put(i,r.ing);S.st[i].t=S.st[i].time*frac;return i;}
  function recOrders(){return S.q.map(c=>c.orders.find(o=>o.k==="rec")).filter(Boolean);}
  function finish(){
    S.q.forEach((c,i)=>{c.p=c.max*[.92,.75,.55,.85,.4][i%5];c.walk=false;});
    S.running=false;dirty=true;render();draw();
  }
  if(sc==="play1"||sc==="menu"||sc==="book"||sc==="end"){
    setup(sc==="play1"?5:6,5);
    const F=focusInfo(),r=F.r,idx=F.stIdx;
    put(idx,r.ing.slice(0,2));
    const other=recOrders().find(o=>R(o.rid).st!==r.st&&S.st[sIdx(R(o.rid).st)].state==="idle");
    if(other)cook(other.rid,.55);
    const nx=r.ing[2];S.stock[nx]=3;act({act:"ing",id:nx});S.tab=ING[nx].c;
    S.focusC=F.c;dirty=true;
    finish();
    if(sc==="menu"){S.day=5;menu();}
    if(sc==="book"){S.bookTab="pan";S.running=false;showBook();}
    if(sc==="end"){S.running=true;S.earned=224;S.served=14;S.lost=1;S.incidents=0;S.stat={ideal:6,good:6,late:2};S.time=0;S.q=[];endDay();showEnd();}
  }
  if(sc==="drag"){
    setup(5,5);
    const F=focusInfo();put(F.stIdx,F.r.ing.slice(0,1));
    S.stock.maslo=3;act({act:"ing",id:"maslo"});S.hand=null;S.stock.maslo=3;
    S.tab="dairy";dirty=true;finish();
    const m=document.querySelector(".st.micro");
    if(m){m.classList.add("drop");const b=m.getBoundingClientRect();const g=ghostShow("🧈");g.style.left=(b.left+b.width*.5)+"px";g.style.top=(b.top+b.height*.2)+"px";}
  }
  if(sc==="play4"){
    setup(6,4);
    const c=S.q[1];c.allergy="mleko";c.orders=[{k:"free",need:"kurczak",avoid:"mleko",got:false}];
    S.focusC=c;S.stock.kurczak=3;
    act({act:"ing",id:"kurczak"});act({act:"station",i:sIdx("pan")});
    S.tab="veg";dirty=true;finish();
  }
  if(sc==="school"||sc==="lesson"||sc==="quiz"){
    setup(5,3);S.done=["higiena","techniki"];finish();
    if(sc==="school"){showSchool();}
    if(sc==="lesson"){menuMode=true;S.lesson={id:"temperatury",step:1,score:0,pick:null};lessonView();}
    if(sc==="quiz"){menuMode=false;S.quiz={q:QBANK.find(x=>x.q.indexOf("głęboko mrożoną")>=0),done:true,pick:0};renderQuiz();}
  }
  if(sc==="play2"){
    setup(8,4);
    const ro=recOrders();
    const a=ro[0],ia=cook(a.rid,1);
    const st=S.st[ia];for(let i=0;i<200&&st.state!=="done";i++){S.st.forEach(x=>{if(x.state==="cooking")x.t+=.1;});tick(.1);}
    st.age=1;
    const b=ro.find(o=>R(o.rid).st!==R(a.rid).st);if(b)cook(b.rid,.4);
    act({act:"station",i:ia});
    if(S.q[1])S.q[1].orders[0]={k:"rec",rid:a.rid,got:false};
    S.focusC=S.q[2]||S.q[0];
    S.combo=4;
    S.pops.push({x:S.q[1]?S.q[1].x:200,t:.35,txt:"+38 zł",col:"#ffd25e"},{x:(S.q[1]?S.q[1].x:200)-14,t:.1,txt:"⭐ Idealne!",col:"#fff"});
    dirty=true;finish();
  }
  if(sc==="play3"){
    setup(7,4);
    S.q[0].orders=[{k:"free",need:"kurczak",got:false}];
    if(S.q[1])S.q[1].type="vip";
    if(S.q[3])S.q[3].type="critic";
    S.focusC=S.q[0];
    const oi=sIdx("oven");put(oi,["kurczak","papryka","ser"]);act({act:"cook",i:oi});S.st[oi].t=S.st[oi].time*.5;
    S.hand=null;S.tab="meat";S.combo=2;dirty=true;finish();
  }
})();
