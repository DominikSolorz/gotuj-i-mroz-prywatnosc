/* Gotuj i Mroź 3.0 – Kuchnia szefa: scena (szef, klienci przy ladzie), sterowanie dotykiem, zmiana, księga. */
"use strict";
const K=(()=>{
  const KEY="gotuj_i_mroz_k3";
  const $k=id=>document.getElementById(id);
  const rnd=a=>a[Math.floor(Math.random()*a.length)];
  const esc2=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const RANKS=[[0,"Pomocnik kuchenny"],[8,"Kucharz"],[25,"Starszy kucharz"],[50,"Szef zmiany"],[80,"Szef kuchni"],[115,"Mistrz kuchni"]];
  let KS={stars:{},done:{},shifts:0,earned:0,lv:{}};
  let root=null,run=null,cur=null,SH=null,mode="menu",raf=0,last=0,chefT=0,doneShown=false,cid=0;

  /* ---------- zapis ---------- */
  function load(){
    try{const d=JSON.parse(localStorage.getItem(KEY)||"null");
      if(d&&typeof d==="object"){
        for(const r of K_RECIPES){const v=d.stars&&d.stars[r.id];if(Number.isInteger(v)&&v>=1&&v<=3)KS.stars[r.id]=v;const c=d.done&&d.done[r.id];if(Number.isInteger(c)&&c>0)KS.done[r.id]=Math.min(c,99999);}
        KS.shifts=Number.isInteger(d.shifts)&&d.shifts>=0?d.shifts:0;if(d.lv&&typeof d.lv==="object")for(let n=0;n<K_LEVELS.length;n++){const v=d.lv[n];if(Number.isInteger(v)&&v>=1&&v<=3)KS.lv[n]=v;}KS.earned=Number.isFinite(d.earned)&&d.earned>=0?Math.floor(d.earned):0;
      }}catch(e){}
  }
  function ksave(){try{localStorage.setItem(KEY,JSON.stringify(KS));}catch(e){}}
  const total=()=>Object.values(KS.stars).reduce((a,b)=>a+b,0);
  const maxStars=()=>K_RECIPES.length*3;
  const rank=()=>{let r=RANKS[0][1];for(const [n,t] of RANKS)if(total()>=n)r=t;return r;};
  const maxLv=()=>{let m=0;while(m<K_LEVELS.length-1&&(KS.lv[m]||0)>=1)m++;return m;};const isOpen=r=>(r.lvl||0)<=maxLv();
  const openRecipes=()=>K_RECIPES.filter(isOpen);
  /* wykrywanie, czy urządzenie potrafi narysować dany emoji (starsze Androidy pokazują puste kwadraty) */
  const EM=(()=>{let ref=null;const cache={};let x=null;
    const dump=ch=>{x.clearRect(0,0,24,24);x.font="18px 'Segoe UI Emoji','Apple Color Emoji','Noto Color Emoji',sans-serif";x.textBaseline="top";x.fillText(ch,2,2);return x.getImageData(0,0,24,24).data.join(",");};
    return ch=>{if(cache[ch]!==undefined)return cache[ch];
      try{if(!x){const c=document.createElement("canvas");c.width=c.height=24;x=c.getContext("2d");}if(ref===null)ref=dump("\u{10FFFF}");
        const v=dump(ch);cache[ch]=v!==ref&&/[1-9]/.test(v);}catch(e){cache[ch]=true;}return cache[ch];};})();
  const eFix=(e,n)=>EM(e)?e:(n||"?").replace(/[^A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż]/g,"").slice(0,2);
  const ingE=id=>K_ING[id]?eFix(K_ING[id].e,K_ING[id].n):"•";
  const ingN=id=>K_ING[id]?K_ING[id].n:id;
  const stars=n=>"⭐".repeat(n)+"☆".repeat(3-n);

  /* ---------- scena SVG ---------- */
  const SKIN=["#f5d0b0","#e8b88f","#c98f64","#9a6440","#6f4630"],HAIR=["#2b1a12","#5a3420","#8a5a2b","#d9b45a","#b8b8b8","#a33a22"],SHIRT=["#3b82c4","#d0503f","#4aa36a","#e2a63b","#8e5bc4","#2f9aa8","#c9567f","#5f6b78"];
  const PANTS=["#34383f","#3b4a63","#5a4632","#2f3b2f","#4a3a52","#6b6b6b"];const TBL=[{x:250},{x:340},{x:430},{x:520}],ORD_X=185,DOOR_X=30,WY=104,WX0=590,PASSX=590,PASSY=196,SEATY=78,WALKY=96;const CL=[];let chefX=255,chefY=306,chefMoveT=0,HUDT=0;
  const DAYP=[{n:"Śniadanie",e:"🌅",t0:450,sky:"#ffd9a8"},{n:"Obiad",e:"☀️",t0:750,sky:"#bfe3ff"},{n:"Kolacja",e:"🌇",t0:1080,sky:"#f2a56b"}];
  let SCN={w:"bar",j:0,n:0};
  function setScene(lv,book){
    SCN={w:lv?lv.world:(book||"bar"),j:lv?lv.idx:0,n:lv?lv.n:0};chefX=255;chefY=306;
    camMode="full";$k("kSceneBox").innerHTML=sceneSVG();mountHud();fitScene();setDay();
  }
  function sceneSVG(){
    const T=(typeof TH==="function")?TH():{wall:["#8f3d2d","#6a281f"],brick:"rgba(255,225,190,.13)",floor:["#a4723f","#6a4425"]};
    const W=KART.WORLDS.find(x=>x.id===SCN.w)||KART.WORLDS[0];
    return KART.scene({T:{wall:W.wall,brick:W.line,floor:W.floor},W,j:SCN.j,n:SCN.n,tbl:TBL,wx:WX0,wy:WY});
  }
  let VBF=[0,0,640,416],fitS=1,camMode="full",camRaf=0;
  function fitScene(){
    const box=$k("kSceneBox"),svg=$k("kSvg"),kk=$k("kK");if(!box||!svg||!kk)return;
    const w=box.clientWidth||640,h=box.clientHeight||416;
    const H=Math.max(416,Math.min(480,640*h/w)),dy=H-416,s=Math.min(1.2,1+dy/320);
    VBF=[0,0,640,H];fitS=s;svg.setAttribute("preserveAspectRatio","xMidYMid meet");
    kk.setAttribute("transform","translate("+(320*(1-s)).toFixed(1)+" "+(H-416*s).toFixed(1)+") scale("+s.toFixed(3)+")");
    camGo(camMode,0);
  }
  /* kamera: na małych ekranach przybliża kuchnię i podąża za szefem */
  function camTarget(mode){
    const box=$k("kSceneBox");if(!box)return VBF;
    const bw=box.clientWidth||640,bh=box.clientHeight||416,a=bh/bw,H=VBF[3];
    if(mode==="full")return VBF;
    let w=Math.max(330,Math.min(640,bw/1.25));
    w=Math.max(w,205*fitS/a);
    if(w>=620)return VBF;
    let hh=w*a;if(hh>H){hh=H;w=hh/a;}
    const S0=STX[lastKind]||STX.board,g=x=>320+(x-320)*fitS;
    const cx=(g(chefX)+g(S0.x))/2;
    const x0=Math.max(0,Math.min(640-w,cx-w/2));
    return [x0,H-hh,w,hh];
  }
  function camGo(mode,ms){
    camMode=mode;const svg=$k("kSvg");if(!svg)return;
    const to=camTarget(mode),cur=(svg.getAttribute("viewBox")||"").split(/s+/).map(Number);
    cancelAnimationFrame(camRaf);
    const set=v=>svg.setAttribute("viewBox",v.map(x=>x.toFixed(1)).join(" "));
    if(!ms||cur.length!==4||cur.some(isNaN)){set(to);return;}
    const t0=performance.now();
    const step=now=>{const k=Math.min(1,(now-t0)/ms),e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;set(cur.map((v,i)=>v+(to[i]-v)*e));if(k<1)camRaf=requestAnimationFrame(step);};
    camRaf=requestAnimationFrame(step);
  }
  function mountHud(){const box=$k("kSceneBox");if(!box)return;const hud=document.createElement("div");hud.id="kGuests";hud.className="k-guests";box.appendChild(hud);}
  function hudTick(){
    const el=$k("kGuests");if(!el)return;
    const w=SH?CL.filter(c=>c.ph==="seated"&&(c.state==="wait"||c.state==="cooking")):[];
    el.innerHTML=w.map(c=>{const f=c.max<1e8?Math.max(0,Math.min(1,c.pat/c.max)):1,col=f>.5?"#3cb371":f>.25?"#f5a623":"#e5484d";return `<span class="kg${c.state==="cooking"?" on":""}"><b>${KDISH.svg(c.r.id,30)}</b><i style="width:${Math.round(f*100)}%;background:${col}"></i></span>`;}).join("");
  }
  function custSVG(c){return KART.cust(c,esc2);}

  /* ---------- stanowiska ---------- */
  const lerp=(a,b,t)=>a+(b-a)*t;
  const hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
  const mix=(a,b,t)=>{const A=hex(a),B=hex(b);return "#"+A.map((v,i)=>Math.round(lerp(v,B[i],Math.max(0,Math.min(1,t)))).toString(16).padStart(2,"0")).join("");};
  function foodColor(p,s){const [w0,w1]=s.window;if(p<w0)return mix("#ecdcb8","#d9a441",p/w0);if(p<=w1)return mix("#d9a441","#b3711f",(p-w1+(w1-w0))/(w1-w0)*.5);return mix("#b3711f","#241410",(p-w1)/Math.max(.05,s.burn-w1));}
  function workSVG(st,r){
    const nxt=run?run.r.steps.slice(run.i+1).find(x=>x.type==="heat"||x.type==="balance"):null;
    const cont=nxt?(nxt.type==="balance"?"garnek":nxt.station==="patelnia"?"patelnia":"bowl"):"board";
    let kind0;const kind=st.type==="heat"?st.s.station:st.type==="rest"?"rest":st.type==="mix"?"bowl":st.type==="balance"?(/ogień|wrzeni|temperat/i.test(st.s.label||"")?"garnek":"bowl"):(st.type==="wash")?"sink":st.type==="serve"?"plate":(st.type==="seq"||st.type==="tap")?cont:"board";
    const dish=r.e;
    lastKind=kind;switch(kind){
      case "board":return `<rect x="-84" y="-14" width="168" height="14" rx="5" fill="#c98f4b"/><rect x="-84" y="-14" width="168" height="4" rx="2" fill="#e0b070"/><g id="kItems" font-size="26"></g>`;
      case "sink":return `<rect x="-72" y="-18" width="144" height="18" rx="7" fill="#8fa3b5" stroke="#6f7f8e" stroke-width="2"/><rect x="-62" y="-14" width="124" height="8" rx="4" fill="#cfe3f3"/><path d="M60 -18V-72Q60 -84 46 -84H34" stroke="#8a97a4" stroke-width="8" fill="none" stroke-linecap="round"/><rect id="kStream" class="stream" x="31" y="-80" width="5" height="62" rx="2.5" fill="#8fd0ff" opacity="0"/><g id="kSuds"><circle class="bub" cx="-26" cy="-22" r="4" fill="#e6f4ff" stroke="#9fd0f0"/><circle class="bub" style="animation-delay:.25s" cx="-8" cy="-26" r="5" fill="#e6f4ff" stroke="#9fd0f0"/><circle class="bub" style="animation-delay:.5s" cx="12" cy="-23" r="4" fill="#e6f4ff" stroke="#9fd0f0"/><circle class="bub" style="animation-delay:.75s" cx="28" cy="-25" r="5" fill="#e6f4ff" stroke="#9fd0f0"/></g>`;
      case "bowl":return `<path d="M-66 -52Q-66 0 0 0Q66 0 66 -52Z" fill="#e9eef3" stroke="#aab4bd" stroke-width="3"/><ellipse id="kBowlIn" cx="0" cy="-34" rx="56" ry="10" fill="#f6e6a8" opacity="0"/><ellipse cx="0" cy="-52" rx="66" ry="8" fill="#f4f7fa" stroke="#aab4bd" stroke-width="3"/>`;
      case "garnek":return `<rect x="-58" y="-78" width="116" height="78" rx="12" fill="#aab4bd" stroke="#6f7a83" stroke-width="3"/><rect x="-72" y="-62" width="18" height="9" rx="4" fill="#3b4148"/><rect x="54" y="-62" width="18" height="9" rx="4" fill="#3b4148"/><ellipse cx="0" cy="-78" rx="58" ry="9" fill="#d7dde2" stroke="#6f7a83" stroke-width="3"/><ellipse id="kWater" cx="0" cy="-78" rx="50" ry="6" fill="#7fb9d9"/><g id="kBub" opacity="0"><circle class="bub" cx="-22" cy="-78" r="4" fill="#fff"/><circle class="bub" style="animation-delay:.3s" cx="2" cy="-80" r="5" fill="#fff"/><circle class="bub" style="animation-delay:.7s" cx="24" cy="-78" r="4" fill="#fff"/></g><g class="steam" id="kSteam"><path d="M-22 -92q-8-12 0-22M0 -94q-8-14 0-26M22 -92q-8-12 0-22" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/></g>`;
      case "patelnia":return `<rect x="52" y="-26" width="64" height="11" rx="5" fill="#6a432d"/><path d="M-62 -34H62L54 -6Q0 4 -54 -6Z" fill="#2e3136" stroke="#17191c" stroke-width="3"/><ellipse cx="0" cy="-34" rx="62" ry="11" fill="#44484e" stroke="#17191c" stroke-width="3"/><ellipse id="kFood" cx="-12" cy="-34" rx="30" ry="7" fill="#ecdcb8"/><ellipse id="kFood2" cx="24" cy="-33" rx="20" ry="5" fill="#ecdcb8"/><g class="steam" id="kSteam"><path d="M-26 -50q-8-12 0-22M0 -52q-8-14 0-26M26 -50q-8-12 0-22" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/></g>`;
      case "piekarnik":return `<rect x="-78" y="-110" width="156" height="110" rx="10" fill="#cfd4d9" stroke="#5f676e" stroke-width="3"/><rect x="-62" y="-80" width="124" height="66" rx="8" fill="#262a2e"/><rect id="kGlow" x="-62" y="-80" width="124" height="66" rx="8" fill="#ff8a2a" opacity="0"/><ellipse id="kFood" cx="0" cy="-34" rx="34" ry="14" fill="#ecdcb8"/><g fill="#33383e"><circle cx="-48" cy="-96" r="5"/><circle cx="-24" cy="-96" r="5"/><circle cx="24" cy="-96" r="5"/><circle cx="48" cy="-96" r="5"/></g><g class="steam" id="kSteam"><path d="M-30 -118q-8-10 0-18M0 -118q-8-12 0-22M30 -118q-8-10 0-18" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/></g>`;
      case "rest":return `<ellipse cx="0" cy="-4" rx="72" ry="8" fill="#dcdfe3"/><ellipse id="kDough" cx="0" cy="-22" rx="40" ry="20" fill="#f1dcae" stroke="#d0b27a" stroke-width="3"/><g transform="translate(-92 -50)"><circle r="20" fill="#fff" stroke="#6f7a83" stroke-width="3"/><path id="kHand" d="M0 0V-14" stroke="#d93a2f" stroke-width="3" stroke-linecap="round"/><circle r="2.5" fill="#333"/></g>`;
      case "plate":return `<ellipse cx="0" cy="-4" rx="78" ry="10" fill="#e9eef3" stroke="#b6c0ca" stroke-width="3"/><ellipse cx="0" cy="-7" rx="56" ry="6" fill="#fff"/>${KDISH.g(r.id,-30,-72,60)}`;
    }return "";
  }
  function updateWork(){
    if(!run||run.finished)return;const st=run.st,s=st.s;
    const set=(id,a,v)=>{const e=$k(id);if(e)e.setAttribute(a,v);};
    if(st.type==="gather"||st.type==="chop"||st.type==="tap"||st.type==="seq"){
      const it=$k("kItems");if(it&&!it.dataset.set){it.dataset.set="1";
        const ids=(st.type==="gather"?s.items:st.type==="seq"?s.order:run.r.ing.slice(0,5).map(x=>x[0])).slice(0,6);
        it.innerHTML=ids.map((id,i)=>`<text x="${-70+i*28}" y="-18">${ingE(id)}</text>`).join("");}
    }
    if(st.type==="wash"){const e=$k("kSuds");if(e)e.style.opacity=st.holding?1:.4;const w=$k("kStream");if(w)w.setAttribute("opacity",st.holding?.85:0);}
    if(st.type==="balance"){const b=$k("kBub");if(b)b.setAttribute("opacity",st.holding?1:.35);const sm=$k("kSteam");if(sm)sm.classList.add("on");}
    if(st.type==="mix"||st.type==="balance"){const e=$k("kBowlIn");if(e){e.setAttribute("opacity",Math.min(1,.25+(st.type==="mix"?st.held/s.dur:Math.min(1,st.inZone/s.need))*.75));e.setAttribute("fill",st.type==="balance"&&st.level>s.zone[1]?"#ffd9a0":"#f6e6a8");}}
    if(st.type==="heat"){
      const on=st.started&&!st.taken;const p=st.p,c=foodColor(p,s);
      ["kFood","kFood2"].forEach(id=>set(id,"fill",c));
      const sm=$k("kSteam");if(sm)sm.classList.toggle("on",on);
      const b=$k("kBub");if(b)b.setAttribute("opacity",on?1:0);
      const gl=$k("kGlow");if(gl)gl.setAttribute("opacity",on?(.25+.45*Math.min(1,p)):0);
      const w=$k("kWater");if(w)w.setAttribute("fill",on&&p>.5?"#a8d3ea":"#7fb9d9");
    }
    if(st.type==="rest"){const h=$k("kHand");if(h)h.setAttribute("transform","rotate("+(360*st.t/s.dur)+")");const d=$k("kDough");if(d){const g=st.t/s.dur;d.setAttribute("rx",40+22*g);d.setAttribute("ry",20+14*g);}}
  }

  /* ---------- panel kroków ---------- */
  function setChef(a,ms){const c=$k("kChef");if(!c)return;c.dataset.a=a;chefT=ms?ms/1000:0;}
  function chefFor(){
    if(!run||run.finished)return "idle";const st=run.st;
    switch(st.type){case "wash":return st.holding?"wash":"idle";case "mix":return st.holding?"mix":"idle";case "balance":return st.holding?"mix":"idle";
      case "heat":return st.started&&!st.taken?(st.s.station==="patelnia"?"fry":st.s.station==="garnek"?"mix":"idle"):"idle";
      case "serve":return st.ok?"serve":"idle";default:return "idle";}
  }
  const TRAP={maka:["mukaziem"],mukaziem:["maka"],maslo:["smalec","olej"],smalec:["maslo"],cukier:["cukierpuder","sol"],sol:["cukier"],smietana:["mleko"],mleko:["smietana"],ocet:["cytryna"],cytryna:["ocet"],drozdze:["drozdzesw","proszek"],drozdzesw:["drozdze"],ser:["feta","mozzarella"],mozzarella:["ser","feta"],olej:["oliwa","olejsmaz"],oliwa:["olej"],pomidor:["papryka"],cebula:["czosnek"],czosnek:["cebula"],ziemniaki:["frytki"]};
  function decoyList(r,s,n){
    if(run.dc&&run.dc.i===run.i)return run.dc.list;
    const have=new Set([...s.items,...r.ing.map(x=>x[0])]),out=[];
    for(const id of s.items)for(const t of (TRAP[id]||[]))if(K_ING[t]&&!have.has(t)&&!out.includes(t))out.push(t);
    for(const d of s.decoys)if(!have.has(d)&&!out.includes(d))out.push(d);
    const rest=Object.keys(K_ING).filter(k=>!have.has(k)&&!out.includes(k)).sort(()=>Math.random()-.5);
    while(out.length<n&&rest.length)out.push(rest.pop());
    const list=out.slice(0,Math.max(n,2));run.dc={i:run.i,list};return list;
  }
  function shown(s,st){
    let t=s.text;const T=run.tier;if(!T)return t;
    if(st.type==="seq"&&T.hideSeq){const k=t.indexOf(":");if(k>0)t=t.slice(0,k)+". Dodaj składniki we właściwej kolejności.";}
    if(st.type==="heat"&&T.redact)t=t.replace(/\s*(Wybierz|Ustaw)[^.]*?ogni[^.]*?i wyjmij/i," Wyjmij").replace(/(na\s+)?(bardzo\s+)?(mały|średni|duży|małym|średnim|dużym)\s+ogni\w*/gi,"na odpowiednim ogniu");
    if(st.type==="gather"&&T.t>=2)t="Wybierz z pamięci składniki do tego dania. Uważaj na podobne, ale błędne.";
    return t;
  }
  function panelHTML(){
    const st=run.st,s=st.s,n=run.r.steps.length,i=run.i;
    let h=`<div class="kp-h"><span class="n">Krok ${i+1}/${n}</span><b>${KE.TITLES[st.type]}</b><span style="margin-left:auto">${KDISH.svg(run.r.id,38)}</span></div><div class="kp-t">${esc2(shown(s,st))}</div>`;
    const T=run.tier;
    if(T&&T.t>=1&&["gather","seq","heat","balance"].includes(st.type))if(st.type!=="gather"||true)h+=`<button class="kp-hint" data-k="hint"${run.hl<=0?" disabled":""}>💡 Podpowiedź (${run.hl})</button>`;
    switch(st.type){
      case "gather":{const ids=[...s.items,...decoyList(run.r,s,T?T.decoys:2)].sort(()=>Math.random()-.5);
        const amt=Object.fromEntries(run.r.ing);
        h+=`<div class="kp-chips" id="kChips">${ids.map(id=>`<button class="kp-chip" data-k="item" data-id="${id}"><span class="e">${ingE(id)}</span><span>${esc2(ingN(id))}<small>${T&&T.t===0&&amt[id]?esc2(amt[id]):""}</small></span></button>`).join("")}</div><div class="kp-sub">Dotknij tylko te składniki, które są w przepisie.</div>`;break;}
      case "seq":{const ids=s.order.slice().sort(()=>Math.random()-.5);
        h+=`<div class="kp-chips" id="kChips">${ids.map(id=>`<button class="kp-chip" data-k="item" data-id="${id}"><span class="e">${ingE(id)}</span><span>${esc2(ingN(id))}</span></button>`).join("")}</div><div class="kp-sub">Dotknij w dobrej kolejności.</div>`;break;}
      case "chop":case "tap":h+=`<button class="kp-big" id="kHit" data-k="hit">${st.type==="chop"?"🔪":"👆"} ${esc2(s.verb)} (<span id="kCnt">0</span>/${s.n})</button>`;break;
      case "wash":h+=`<button class="kp-big" data-k="hold">🧼 Myj ręce (przytrzymaj)</button>`;break;
      case "mix":h+=`<button class="kp-big" data-k="hold">🥄 Mieszaj (przytrzymaj)</button>`;break;
      case "balance":h+=`<div class="kp-gauge" id="kGauge"><div class="z" style="left:${s.zone[0]*100}%;width:${(s.zone[1]-s.zone[0])*100}%"></div><div class="m" id="kMark"></div></div><button class="kp-big" data-k="hold">🔥 ${esc2(s.label)} (przytrzymaj)</button><div class="kp-sub">Przytrzymaj, aby wskaźnik rósł, puść, aby opadał. Trzymaj go w zielonej strefie.</div>`;break;
      case "heat":h+=`<div class="kp-temps" id="kTemps">${s.temps.map(t=>`<button data-k="temp" data-id="${t[0]}">${esc2(t[1])}</button>`).join("")}</div>
        <div class="kp-row"><button class="kp-big" id="kStart" data-k="start">▶ Włóż</button><button class="kp-big alt" id="kTake" data-k="take" disabled>✋ Wyjmij</button>${s.flips?`<button class="kp-big alt" id="kFlip" data-k="flip" disabled>↻ Obróć</button>`:""}</div>
        <div class="kp-gauge" id="kGauge"><div class="z${T&&!T.showWin?" hid":""}" style="left:${s.window[0]/s.burn*100}%;width:${(s.window[1]-s.window[0])/s.burn*100}%"></div><div class="b" style="right:0"></div><div class="m" id="kMark"></div></div><div class="kp-sub">${T&&!T.showWin?"Obserwuj kolor jedzenia i parę. Wyjmij, gdy danie wygląda na gotowe, ale zanim się przypali.":"Zielone pole to idealny moment. Za późno to przypalenie (czerwona kreska)."}</div>`;break;
      case "rest":h+=`<div class="kp-bar"><i id="kBar"></i></div><button class="kp-big alt" data-k="skip">⏩ Przyspiesz</button>`;break;
      case "serve":if(run.quizQ&&!run.qdone){const q=run.quizQ;h+=`<div class="kp-quiz"><b>🎓 Pytanie szefa</b><p>${esc2(q.q)}</p>${q.o.map((o,k)=>`<button class="kp-chip kq" data-k="quiz" data-id="${k}">${esc2(o)}</button>`).join("")}</div>`;break;}
        h+=run.gl?`<button class="kp-big go" data-k="serve">🍽️ Podaj gościowi</button>`:`<button class="kp-big alt" data-k="glove">🧤 Załóż rękawiczki</button><div class="kp-sub">Gotowe danie podajemy w czystych rękawiczkach jednorazowych.</div>`;break;
    }
    if(st.type!=="gather"&&(!T||T.showList))h+=`<details class="kp-ing"${matchMedia("(min-width:900px) and (min-height:640px)").matches?" open":""}><summary>Składniki</summary>${run.r.ing.map(x=>ingE(x[0])+" "+esc2(ingN(x[0]).toLowerCase())+" <i>"+esc2(x[1])+"</i>").join(" · ")}</details>`;
    h+=`<div id="kDone"></div>`;return h;
  }
  let lastKind="board";
  const STX={sink:{x:170,cx:170,cy:294,front:1},board:{x:300,cx:300,cy:294,front:1},bowl:{x:340,cx:268,cy:306},patelnia:{x:430,cx:352,cy:306},garnek:{x:430,cx:352,cy:306},piekarnik:{x:548,cx:468,cy:306},rest:{x:320,cx:250,cy:306,front:1},plate:{x:320,cx:250,cy:306,front:1}};
  function chefMove(x,y){const c=$k("kChef");y=y||306;const d=Math.abs(x-chefX)+Math.abs(y-chefY);chefX=x;chefY=y;if(!c)return;
    if(d>4){const ms=Math.max(350,Math.min(1300,d*7));c.style.transition="transform "+ms+"ms ease-in-out";c.classList.add("moving");clearTimeout(chefMoveT);chefMoveT=setTimeout(()=>{const e=$k("kChef");if(e)e.classList.remove("moving");},ms);}
    c.style.transform="translate("+x+"px,"+y+"px) scale(.8)";}
  function renderPanel(){const p=$k("kPanel");if(!p)return;p.innerHTML=panelHTML();p.scrollTop=0;doneShown=false;
    {const html=workSVG(run.st,run.r),S0=STX[lastKind]||STX.board,back=!S0.front,wf=$k("kWork"),wb=$k("kWorkB"),tg=back?wb:wf;tg.innerHTML=html;(back?wf:wb).innerHTML="";tg.setAttribute("transform","translate("+S0.x+" 360)");chefMove(S0.cx,S0.cy);camGo("kitchen",650);}const sm=$k("kSteam");if(sm)sm.classList.remove("on");
    updateWork();
    const lbl=$k("kMenu1");if(lbl){lbl.textContent=run.r.name;const l2=$k("kMenu2");if(l2)l2.textContent=KE.TITLES[run.st.type].slice(0,13);}
  }
  function updatePanel(){
    if(!run||run.finished)return;const st=run.st,s=st.s;
    const g=id=>$k(id);
    if(st.type==="chop"||st.type==="tap"){const c=g("kCnt");if(c)c.textContent=st.count;}
    if(st.type==="balance"||st.type==="heat"){const m=g("kMark");if(m)m.style.left=(st.type==="balance"?st.level*100:Math.min(100,st.p/s.burn*100))+"%";}
    if(st.type==="rest"){const b=g("kBar");if(b)b.style.width=(st.t/s.dur*100)+"%";}
    if(st.type==="heat"){
      const started=st.started&&!st.taken;
      const tk=g("kTake"),sb=g("kStart"),fl=g("kFlip");
      if(tk)tk.disabled=!started;if(sb)sb.disabled=st.started||st.taken;if(fl)fl.disabled=!started||!st.flipsLeft.length;
      document.querySelectorAll("#kTemps button").forEach(b=>{b.classList.toggle("on",b.dataset.id===st.temp);b.disabled=st.started||st.taken;});
    }
    if(st.ok&&!doneShown){doneShown=true;const d=g("kDone");if(d){
      d.innerHTML=(s.why?`<div class="kp-why">💡 <b>Dlaczego tak?</b> ${esc2(s.why)}</div>`:"")+(run.i<run.r.steps.length-1?`<button class="kp-big go" data-k="next">Dalej ▶</button>`:`<button class="kp-big go" data-k="next">Zakończ i oceń ▶</button>`);}
      if(st.type!=="serve")sfx.done&&sfx.done();}
  }

  /* ---------- sterowanie ---------- */
  function onPanelDown(e){
    const b=e.target.closest("[data-k]");if(!b||!run||run.finished)return;
    const k=b.dataset.k,st=run.st;
    if(k==="hold"){e.preventDefault();b.classList.add("hold");KE.act(run,"hold",true);
      const rel=()=>{b.classList.remove("hold");KE.act(run,"hold",false);window.removeEventListener("pointerup",rel);window.removeEventListener("pointercancel",rel);};
      window.addEventListener("pointerup",rel);window.addEventListener("pointercancel",rel);return;}
  }
  function onPanelClick(e){
    const b=e.target.closest("[data-k]");if(!b||!run||run.finished)return;
    const k=b.dataset.k,st=run.st,id=b.dataset.id;
    switch(k){
      case "item":{const before=run.mistakes.length;const ok=KE.act(run,"item",id);
        if(ok){b.classList.add("ok");sfx.put&&sfx.put();setChef("serve",250);dropIng(id);}
        else if(run.mistakes.length>before){b.classList.remove("bad");void b.offsetWidth;b.classList.add("bad");sfx.bad&&sfx.bad();toast(run.mistakes[run.mistakes.length-1].msg);}
        break;}
      case "hit":{if(KE.act(run,"hit")){sfx.chop&&sfx.chop();setChef(st.type==="chop"?"chop":"serve",260);haptic&&haptic(8);}break;}
      case "temp":KE.act(run,"temp",id);sfx.put&&sfx.put();break;
      case "start":{const bef=run.mistakes.length;if(KE.act(run,"start")){sfx.put&&sfx.put();}else if(run.mistakes.length>bef)toast(run.mistakes[run.mistakes.length-1].msg);break;}
      case "take":KE.act(run,"take");sfx.take&&sfx.take();break;
      case "flip":{const bef=run.mistakes.length;setChef("flip",450);const ok=KE.act(run,"flip");if(ok)toast("Dobrze obrócone! ✔");else if(run.mistakes.length>bef)toast(run.mistakes[run.mistakes.length-1].msg);sfx.put&&sfx.put();break;}
      case "skip":KE.act(run,"skip");break;
      case "hint":{if(run.hl<=0)break;const hh=KE.hint(run);if(!hh){toast("Tu nie potrzeba podpowiedzi");break;}run.hl--;
        if(hh.type==="item"){const el=document.querySelector('#kChips [data-id="'+hh.id+'"]');if(el){el.classList.add("hint");setTimeout(()=>el.classList.remove("hint"),4500);}}
        else if(hh.type==="heat"||hh.type==="balance"){const z=document.querySelector("#kGauge .z");if(z){z.classList.add("rev");setTimeout(()=>z.classList.remove("rev"),7000);}document.querySelectorAll("#kTemps button").forEach(x=>{if(x.dataset.id===hh.temp){x.classList.add("hint");setTimeout(()=>x.classList.remove("hint"),7000);}});}
        toast("💡 "+(hh.why||"Podpowiedź"));b.textContent="💡 Podpowiedź ("+run.hl+")";if(run.hl<=0)b.disabled=true;break;}
      case "quiz":{const q=run.quizQ,k=+id,ok=k===q.a;KE.quiz(run,ok,"Pytanie szefa: „"+q.q+"” Dobra odpowiedź: "+q.o[q.a]+".",q.why);run.qdone=true;toast((ok?"✔ Dobra odpowiedź! ":"✘ Nie do końca. ")+q.why);renderPanel();break;}
      case "glove":run.gl=1;{const c=$k("kChef");if(c)c.classList.add("gl");}sfx.put&&sfx.put();toast("Rękawiczki założone 🧤");renderPanel();break;
      case "serve":if(!run.gl){toast("Najpierw załóż rękawiczki 🧤");break;}KE.act(run,"serve");setChef("serve",500);camGo("full",800);deliver(cur,run.r.id);break;
      case "next":next();break;
    }
  }
  function toast(m){if(typeof say==="function")say(m);}
  const SVGNS="http://www.w3.org/2000/svg";
  /* szef wrzuca składnik z ręki do garnka, na patelnię lub deskę */
  function dropIng(id){const g=$k("kFx2");if(!g)return;
    const t=document.createElementNS(SVGNS,"text");t.setAttribute("font-size","26");t.setAttribute("text-anchor","middle");t.textContent=ingE(id);g.appendChild(t);
    const S0=STX[lastKind]||STX.board,x0=chefX+35,y0=chefY+48,x1=S0.x,y1=(lastKind==="board"||lastKind==="plate"||lastKind==="rest")?336:300;
    const a=t.animate([{transform:"translate("+x0+"px,"+y0+"px) scale(1)",opacity:1},{transform:"translate("+((x0+x1)/2)+"px,"+(y0-80)+"px) scale(1.2)",opacity:1,offset:.5},{transform:"translate("+x1+"px,"+y1+"px) scale(.6)",opacity:.2}],{duration:520,easing:"ease-in"});
    a.onfinish=()=>{t.remove();splash(x1,y1);};setTimeout(()=>t.remove(),1000);}
  function splash(x,y){const g=$k("kFx2");if(!g)return;const c=document.createElementNS(SVGNS,"ellipse");c.setAttribute("cx",x);c.setAttribute("cy",y+8);c.setAttribute("rx",10);c.setAttribute("ry",4);c.setAttribute("fill","none");c.setAttribute("stroke","#fff");c.setAttribute("stroke-width","2");g.appendChild(c);
    c.animate([{transform:"scale(1)",opacity:.9},{transform:"scale(3.2)",opacity:0}],{duration:450,easing:"ease-out"});c.style.transformBox="fill-box";c.style.transformOrigin="center";setTimeout(()=>c.remove(),500);}
  function mv(el,x,y,ms){if(!el)return;el.style.transitionDuration=(ms||1500)+"ms";el.style.transform="translate("+x+"px,"+y+"px)";}
  function walkTo(c,x,y,ms){if(!c)return;const el=$k("kc"+c.id);c.x=x;c.y=y;if(!el)return;el.classList.remove("still");mv(el,x,y,ms);clearTimeout(c._wt);c._wt=setTimeout(()=>{const e=$k("kc"+c.id);if(e)e.classList.add("still");},ms||1500);}
  function popup(x,y,txt,fill){const f=$k("kFx");if(!f)return;const t=document.createElementNS(SVGNS,"text");t.setAttribute("x",x);t.setAttribute("y",y);t.setAttribute("font-size","20");t.setAttribute("font-weight","900");t.setAttribute("text-anchor","middle");if(fill){t.setAttribute("fill",fill);t.setAttribute("stroke","#1d4d2e");t.setAttribute("stroke-width",".6");}t.textContent=txt;f.appendChild(t);
    t.animate([{transform:"translateY(0)",opacity:1},{transform:"translateY(-34px)",opacity:0}],{duration:1500,fill:"forwards"});setTimeout(()=>t.remove(),1600);}
  /* talerz leci z kuchni na wydawkę, kelner niesie go do stolika, gość je */
  function plateFly(emoji){const f=$k("kFx");if(!f)return;
    const old=$k("kPP");if(old)old.remove();
    const t=document.createElementNS(SVGNS,"g");t.id="kPP";t.innerHTML=KDISH.g(emoji,-17,-30,34);f.appendChild(t);
    const sp=($k("kWork").childNodes.length?$k("kWork"):$k("kWorkB")).getBoundingClientRect(),pt=$k("kSvg").createSVGPoint();pt.x=sp.left+sp.width/2;pt.y=sp.top+sp.height*.4;const o=pt.matrixTransform(f.getScreenCTM().inverse());
    t.animate([{transform:"translate("+o.x+"px,"+o.y+"px) scale(.8)",opacity:1},{transform:"translate("+((o.x+PASSX)/2)+"px,"+(Math.min(o.y,230)-30)+"px) scale(1.1)",opacity:1,offset:.5},{transform:"translate("+PASSX+"px,"+(PASSY-4)+"px) scale(1)",opacity:1}],{duration:800,easing:"ease-in-out",fill:"forwards"});
    setTimeout(()=>{const e=$k("kPP");if(e)e.remove();},7000);}
  function waiterGo(x,y,ms){const w=$k("kWaiter");if(!w)return;w.style.transitionDuration=ms+"ms";w.style.transform="translate("+x+"px,"+y+"px)";}
  function tray(e){const t=$k("kTrayE");if(t)t.innerHTML=e?KDISH.g(e,0,0,26):"";}
  function deliver(c,emoji){
    if(!c)return;
    if(c.ph!=="seated"){c._pend=emoji;return;}
    const ti=c.tbl,tb=TBL[ti];c.state="served";
    const b=$k("kcb"+c.id);if(b)b.style.display="none";
    plateFly(emoji);
    setTimeout(()=>{const pp=$k("kPP");if(pp)pp.remove();tray(emoji);waiterGo(tb.x+34,WY,1600);},900);
    setTimeout(()=>{tray("");const tp=$k("kTP"+ti);if(tp)tp.innerHTML=KDISH.g(emoji,0,0,26);c.ph="eat";c.eatT=5;waiterGo(WX0,WY,1700);},2600);
  }
  function cashRing(){const cs=$k("kCash");if(cs){cs.dataset.a="ring";setTimeout(()=>{cs.dataset.a="idle";},1000);}const k=$k("kKasa");if(k)k.animate([{transform:"translateY(0)"},{transform:"translateY(-3px)"},{transform:"translateY(0)"}],{duration:300});}
  function payFx(c){cashRing();const d=$k("kKasaD");if(d)d.textContent=(c.pay||0)+",00";sfx.coin&&sfx.coin();popup(ORD_X-20,86,"+"+(c.pay||0)+" zł","#7dffb0");}
  function mood(c){const m=$k("kcm"+c.id),r=c.react||0;if(m)m.setAttribute("d",r>=2?"M-6 13Q0 21 6 13":r===1?"M-5 16H5":"M-5 18Q0 12 5 18");popup(c.x,c.y-14,r>=3?"😍":r===2?"😊":r===1?"😐":"😠");}
  function exitCust(c){c.ph="exit";c.t=0;walkTo(c,-70,WALKY,2300);}
  function sit(c){const el=$k("kc"+c.id),tb=TBL[c.tbl];
    if(el){el.style.transitionDuration="0ms";$k("kSeat").appendChild(el);el.style.transform="translate("+tb.x+"px,"+SEATY+"px)";el.classList.add("still");const b=$k("kcb"+c.id);if(b)b.style.display="";}
    c.x=tb.x;c.y=SEATY;c.ph="seated";if(c._pend){const e=c._pend;c._pend=null;deliver(c,e);}}
  function standUp(c,angry){
    const tb=TBL[c.tbl],el=$k("kc"+c.id);const tp=$k("kTP"+c.tbl);if(tp)tp.innerHTML="";
    if(el){el.style.transitionDuration="0ms";$k("kCust").appendChild(el);el.style.transform="translate("+tb.x+"px,"+WALKY+"px)";const b=$k("kcb"+c.id);if(b)b.style.display="none";}
    c.x=tb.x;c.y=WALKY;c.tbl=null;mood(c);
    if(angry){exitCust(c);}else{c.ph="topay";c.t=0;requestAnimationFrame(()=>requestAnimationFrame(()=>walkTo(c,ORD_X,WALKY,2400)));}
  }
  function custTick(c,dt){
    switch(c.ph){
      case "enter":c.t+=dt;if(c.t>=1.7){c.ph="ordering";c.t=0;const b=$k("kcb"+c.id);if(b)b.style.display="";cashRing();sfx.door&&sfx.door();}break;
      case "ordering":c.t+=dt;if(c.t>=1.4){c.ph="toseat";c.t=0;const b=$k("kcb"+c.id);if(b)b.style.display="none";walkTo(c,TBL[c.tbl].x,WALKY,2200);}break;
      case "toseat":c.t+=dt;if(c.t>=2.3)sit(c);break;
      case "seated":
        if(c.state==="wait"||c.state==="cooking"){c.pat-=dt;const p=$k("kcp"+c.id);if(p&&c.max<1e8){const f=Math.max(0,c.pat/c.max);p.setAttribute("width",78*f);p.setAttribute("fill",f>.5?"#3cb371":f>.25?"#f5a623":"#e5484d");}
          if(c.state==="wait"&&c.pat<=0&&SH){SH.lost++;c.react=0;toast("Gość zrezygnował i wyszedł 😠");standUp(c,true);}}
        break;
      case "eat":c.eatT-=dt;if(c.eatT<=0&&c.react!==undefined)standUp(c,false);break;
      case "topay":c.t+=dt;if(c.t>=2.5){c.ph="pay";c.payT=10;}break;
      case "pay":if(c.manual)break;c.payT-=dt;if(c.payT<=0){payFx(c);exitCust(c);}break;
      case "exit":c.t+=dt;if(c.t>=2.4){const el=$k("kc"+c.id);if(el)el.remove();c.ph="gone";}break;
    }
  }
  function spawnCust(r,tb,pat){
    const c={id:++cid,r,tbl:tb,ph:"enter",t:0,x:DOOR_X,y:WALKY,o:1,state:"wait",pat,max:pat,skin:rnd(SKIN),hair:rnd(HAIR),shirt:rnd(SHIRT),pants:rnd(PANTS),hs:Math.floor(Math.random()*6),gl:Math.random()<.25,pat2:Math.random()<.35?"stripe":"",cap:rnd(SHIRT)};
    CL.push(c);$k("kCust").insertAdjacentHTML("beforeend",custSVG(c));
    const el=$k("kc"+c.id);el.classList.remove("still");el.style.transitionDuration="0ms";
    requestAnimationFrame(()=>requestAnimationFrame(()=>walkTo(c,ORD_X,WALKY,1600)));
    return c;
  }
  function pickDish(){const p=SH.pool.filter(r=>r!==SH.last);const r=rnd(p.length?p:SH.pool);SH.last=r;return r;}
  function freeTable(){const used=CL.filter(c=>c.tbl!==null&&c.tbl!==undefined&&c.ph!=="gone"&&c.ph!=="exit").map(c=>c.tbl);for(const i of [1,2,0,3]){if(i<(SH?SH.cap:4)&&!used.includes(i))return i;}return -1;}

  /* ---------- przebieg przepisu ---------- */
  function startCook(recipe,cust){
    const tier=(SH&&SH.lv)?K_TIER(SH.lv.n):(SH?K_TIER(10):K_TIER(null));
    run=KE.newRun(recipe,SH?"shift":"practice",{tight:tier.tight,speed:tier.speed});run.tier=tier;run.hl=tier.hints;run.dc=null;
    run.quizQ=(tier.quiz&&Math.random()<tier.quiz)?K_QUIZPICK(recipe,SH?SH.usedQ:null):null;if(run.quizQ&&SH)(SH.usedQ=SH.usedQ||[]).push(run.quizQ.q);run.qdone=!run.quizQ;run.gl=0;{const ch=$k("kChef");if(ch)ch.classList.remove("gl");}cur=cust||null;mode="cook";
    if(cust){cust.state="cooking";}
    closeModal();renderPanel();setChef("idle");
  }
  function next(){
    if(!run)return;
    const wasLast=run.i>=run.r.steps.length-1;
    KE.next(run);
    if(run.finished){finishCook();return;}
    renderPanel();
  }
  function finishCook(){
    const r=run.r,res=run.result;chefMove(255,306);camGo("full",800);
    const prev=KS.stars[r.id]||0;if(res.stars>prev)KS.stars[r.id]=res.stars;
    KS.done[r.id]=(KS.done[r.id]||0)+1;
    const pay=SH?res.payout:Math.round(res.payout*.4);
    S.coins+=pay;KS.earned+=pay;if(SH){SH.earned+=pay;SH.served++;SH.starSum=(SH.starSum||0)+res.stars;}
    ksave();save();
    const c=cur;if(c){c.react=res.stars;c.pay=pay;}
    setChef(res.stars>=2?"cheer":res.stars===0?"sad":"idle",1800);
    if(res.stars>=2){sfx.tada&&sfx.tada();if(typeof confetti==="function"&&res.stars===3)confetti();}else sfx.coin&&sfx.coin();
    showResult(r,res,pay,prev,[]);
    mode=SH?"shift":"menu";
  }
  function showResult(r,res,pay,prev,unlocked){
    const notes=res.notes.slice(0,3).map(n=>`<div class="k-note"><b>${esc2(n.msg)}</b>${n.why?esc2(n.why):""}</div>`).join("");
    const head=res.stars===3?"Perfekcyjnie!":res.stars===2?"Bardzo dobrze!":res.stars===1?"Da się zjeść…":"Spalone, niedogotowane lub zepsute";
    const best=prev<res.stars?`<p>🏆 Nowy rekord: ${stars(res.stars)}</p>`:"";
    modal(`<h2 style="display:flex;align-items:center;justify-content:center;gap:8px">${KDISH.svg(r.id,40)} ${esc2(r.name)}</h2><div class="k-stars">${stars(res.stars)}</div><p><b>${head}</b> · ocena ${Math.round(res.pct*100)}%</p><p>💰 +${pay} zł${SH?"":" (ćwiczenie płaci 40%)"}</p>${best}
      ${notes?`<p><b>Czego się nauczyć:</b></p>${notes}`:`<p>Brak błędów. Tak trzymać!</p>`}
      <p class="kp-sub">${esc2(r.story)}</p><p class="kp-sub">🧊 ${esc2(r.storage)} · 🚫 Alergeny: ${r.allergens.map(esc2).join(", ")} · ${esc2(r.kcal)} (orientacyjnie)</p>
      <div class="kp-row">${SH?`<button class="kp-big go" data-m="shiftnext">Dalej ▶</button>`:`<button class="kp-big" data-m="again" data-id="${r.id}">↻ Jeszcze raz</button><button class="kp-big alt" data-m="book">📖 Księga</button>`}</div>`);
    run=null;
  }

  /* ---------- restauracja: zmiana ---------- */
  function startShift(lv){
    setScene(lv);clearScene();
    const pool=lv?lv.menu.map(id=>K_BYID[id]):openRecipes();
    SH={cust:CL,spawned:0,total:lv?lv.guests:5,served:0,lost:0,earned:0,t:0,spawnT:.5,pat:lv?lv.pat:150,gap:lv?lv.gap:null,lv:lv||null,pool,starSum:0,tips:0,cap:lv?Math.min(4,2+Math.floor(lv.n/12)):3};
    mode="shift";closeModal();renderIdlePanel();if(lv)showIntro(lv);
  }
  function showIntro(lv){const T=K_TIER(lv.n);modal(`<h2>Plansza ${lv.n+1}</h2><p><b>${esc2(lv.title)}</b></p><div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap">${lv.menu.map(id=>`<span style="text-align:center;font-size:11px;font-weight:700;width:64px">${KDISH.svg(id,48)}<br>${esc2(K_BYID[id].name.split(" ")[0])}</span>`).join("")}</div><p>Goście: <b>${lv.guests}</b> · Trudność: <b>${T.t+1}/6</b></p><p class="kp-sub">${esc2(T.info)}</p><div class="kp-row"><button class="kp-big go" data-m="introgo">Zaczynamy ▶</button></div>`);}
  function startPractice(recipe){
    SH=null;mode="menu";setScene(null,recipe.book);clearScene();
    const c=spawnCust(recipe,1,1e9);PRACTICE=c;startCook(recipe,c);
  }
  let PRACTICE=null,K_TIMER=0,RZ=0;
  function clearScene(){
    chefMove(255,306);CL.length=0;["kCust","kSeat","kFx","kFx2"].forEach(id=>{const g=$k(id);if(g)g.innerHTML="";});
    TBL.forEach((t,i)=>{const e=$k("kTP"+i);if(e)e.innerHTML="";});
    const w=$k("kWaiter");if(w){w.style.transitionDuration="0ms";w.style.transform="translate("+WX0+"px,"+WY+"px)";}tray("");
  }
  function dayInfo(){const l=SH&&SH.lv,dp=DAYP[l?Math.min(2,Math.floor(l.idx/3)):1];const span=l?l.guests*95:600;const m=Math.floor(dp.t0+(SH?SH.t:0)/span*170);return {dp,txt:dp.e+" "+dp.n+" · "+String(Math.floor(m/60)%24).padStart(2,"0")+":"+String(m%60).padStart(2,"0")};}
  function setDay(){const d=dayInfo(),p=$k("kDay");if(p)p.textContent=d.txt;const s=$k("kSky");if(s)s.setAttribute("fill",d.dp.sky);const m=$k("kMeal");if(m)m.textContent=d.dp.n.toUpperCase();}
  function renderIdlePanel(){
    const p=$k("kPanel");if(!p)return;
    const fin=SH&&SH.finishing;
    p.innerHTML=`<div class="kp-h"><b>${SH&&SH.lv?esc2(SH.lv.title)+" · ":""}Goście: ${SH?SH.served+SH.lost:0}/${SH?SH.total:0}</b></div><div class="kp-t">${fin?"Ostatni goście kończą posiłek i płacą…":"Dotknij gościa przy stoliku lub jego zamówienie na liście, aby ugotować danie. Kelner je zaniesie, a kasjerka przyjmie płatność."}</div><div id="kOrders"></div>`;
    $k("kWork").innerHTML="";$k("kWorkB").innerHTML="";updateOrders();setDay();
    const pl=(SH&&SH.pool)||[];const w1=r=>r.name.split(" ").slice(0,2).join(" ").slice(0,12);[1,2,3].forEach(i=>{const e=$k("kMenu"+i);if(e)e.textContent=pl[i-1]?w1(pl[i-1]):"";});
  }
  function updateOrders(){
    const o=$k("kOrders");if(!o||!SH||run)return;
    const w=CL.filter(c=>c.ph==="seated"&&c.state==="wait"),pc=CL.filter(c=>c.ph==="pay"&&!c.manual);
    let h=w.map(c=>`<button class="k-card" data-m="order" data-id="${c.id}"><span class="e">${KDISH.svg(c.r.id,44)}</span><span><b>${esc2(c.r.name)}</b><small>⏱ ${Math.max(0,Math.ceil(c.pat))} s · ${stars(KS.stars[c.r.id]||0)}</small></span><span class="r">${c.r.price} zł</span></button>`).join("");
    h+=pc.map(c=>`<button class="k-card" data-m="kasaorder" data-id="${c.id}"><span class="e">🧾</span><span><b>Gość płaci ${c.pay} zł</b><small>Możesz sam obsłużyć kasę (napiwek). Kasjerka zrobi to za ${Math.max(0,Math.ceil(c.payT))} s</small></span><span class="r">+napiwek</span></button>`).join("");
    o.innerHTML=h||`<div class="kp-sub">Czekamy na gości…</div>`;
  }

  /* ---------- modale i księga ---------- */
  function modal(html){const m=$k("kModal");m.innerHTML=`<div class="k-box">${html}</div>`;m.classList.add("on");}
  function closeModal(){const m=$k("kModal");if(m){m.classList.remove("on");m.innerHTML="";}}
  function showBook(){
    let h=`<h2>📖 Księga przepisów</h2><p class="kp-sub">${rank()} · ⭐ ${total()}/${maxStars()} · 💰 ${S.coins} zł</p>`;
    for(const b of K_WORLDS){const rs=K_RECIPES.filter(r=>r.book===b.id);if(!rs.length)continue;
      h+=`<div class="k-book">${b.e} ${esc2(b.n)}</div>`;
      for(const r of rs){const open=isOpen(r);
        h+=open?`<button class="k-card" data-m="practice" data-id="${r.id}"><span class="e">${KDISH.svg(r.id,44)}</span><span><b>${esc2(r.name)}</b><small>${esc2(r.story.split(". ")[0])}.</small></span><span class="r">${stars(KS.stars[r.id]||0)}<br><small>${r.price} zł</small></span></button>`
          :`<div class="k-card lock"><span class="e">🔒</span><span><b>${esc2(r.name)}</b><small>Odblokuje się na planszy ${r.lvl+1} kampanii (jesteś na ${maxLv()+1})</small></span></div>`;}}
    h+=`<div class="kp-row"><button class="kp-big alt" data-m="menuk">◀ Wróć</button></div>`;
    modal(h);
  }
  function showStart(){
    const lv=K_LEVELS[maxLv()];
    modal(`<h2>🍳 Kuchnia szefa</h2><p>Prowadzisz stołówkę: gotujesz prawdziwe polskie dania krok po kroku, podajesz je gościom w rękawiczkach i rozliczasz przy kasie. <b>${K_LEVELS.length} plansz, ${K_RECIPES.length} przepisów: kuchnia polska, pizzeria, azjatycka i wegetariańska.</b></p><p class="kp-sub">${rank()} · ⭐ ${total()}/${maxStars()} · 💰 ${S.coins} zł</p>
      <div class="kp-row"><button class="kp-big go" data-m="lvl" data-id="${lv.n}">▶ Graj: plansza ${lv.n+1}<br><small>${esc2(K_BYID[lv.menu[0]].name)}</small></button></div>
      <div class="kp-row" style="margin-top:8px"><button class="kp-big" data-m="camp">🗺️ Wybierz planszę</button><button class="kp-big" data-m="book">📖 Księga</button></div>
      <div class="kp-row" style="margin-top:8px"><button class="kp-big alt" data-m="shift">⚡ Szybka zmiana</button><button class="kp-big alt" data-m="exit">◀ Menu główne</button></div>`);
  }
  function showCamp(){
    const mx=maxLv();let sum=0;for(const k in KS.lv)sum+=KS.lv[k];
    let h=`<h2>🗺️ Kampania: Stołówka</h2><p class="kp-sub">Jedna plansza to jedna zmiana (około 10–15 minut): obsłuż gości, wydaj resztę przy kasie i zdobądź gwiazdki. ⭐ ${sum}/${K_LEVELS.length*3}</p>`;
    K_WORLDS.forEach(w=>{
      h+=`<div class="k-book">${w.e} ${esc2(w.n)}</div>`;
      K_LEVELS.filter(l=>l.world===w.id).forEach(l=>{
        const r=K_BYID[l.menu[0]],open=l.n<=mx,s=KS.lv[l.n]||0;
        h+=open?`<button class="k-card" data-m="lvl" data-id="${l.n}"><span class="e">${KDISH.svg(r.id,44)}</span><span><b>${l.n+1}. ${esc2(r.name)}</b><small>trudność ${K_TIER(l.n).t+1}/6 · ${l.guests} gości · menu: ${l.menu.map(id=>KDISH.svg(id,22)).join("")}</small></span><span class="r">${stars(s)}</span></button>`
          :`<div class="k-card lock"><span class="e">🔒</span><span><b>${l.n+1}. ${esc2(r.name)}</b><small>Ukończ poprzednią planszę, aby odblokować</small></span></div>`;});
    });
    h+=`<div class="kp-row"><button class="kp-big alt" data-m="menuk">◀ Wróć</button></div>`;
    modal(h);const cur=document.querySelector('.k-box [data-m=lvl][data-id="'+mx+'"]');if(cur&&cur.scrollIntoView)cur.scrollIntoView({block:"center"});
  }
  function endShift(){
    KS.shifts++;const s=SH,l=s.lv;let st=0,bonus=0;const prevMax=maxLv();
    if(l){const avg=s.served?s.starSum/s.served:0;
      if(s.served>=Math.ceil(s.total*.6))st=1;
      if(s.served>=Math.ceil(s.total*.8)&&avg>=1.8&&s.lost<=1)st=2;
      if(s.lost===0&&s.served>=s.total&&avg>=2.5)st=3;
      if(st>(KS.lv[l.n]||0))KS.lv[l.n]=st;
      if(st>=3)bonus=l.bonus;
    }else bonus=s.lost===0&&s.served>=s.total?30:0;
    if(bonus){S.coins+=bonus;KS.earned+=bonus;}
    ksave();save();
    const nextOpen=l&&l.n<K_LEVELS.length-1&&st>=1;
    const fresh=l&&maxLv()>prevMax?K_RECIPES.filter(r=>r.lvl===maxLv()&&r.lvl>prevMax):[];
    modal(`<h2>📋 Raport szefa kuchni</h2>${l?`<div class="k-stars">${stars(st)}</div><p><b>${esc2(l.title)}</b> · ${st?"plansza zaliczona":"niezaliczona (obsłuż co najmniej 60% gości)"}</p>`:""}<p><b>Obsłużeni goście:</b> ${s.served} z ${s.total} · <b>stracone:</b> ${s.lost}</p><p>💰 Zarobek: ${s.earned} zł${s.tips?` + napiwki ${s.tips} zł`:""}${bonus?` + premia ${bonus} zł`:""}</p>${fresh.length?`<p>🔓 <b>Nowe przepisy:</b> ${fresh.map(x=>KDISH.svg(x.id,20)+" "+esc2(x.name)).join(", ")}</p>`:""}<p class="kp-sub">${rank()} · ⭐ ${total()}/${maxStars()}</p>
      <div class="kp-row">${nextOpen?`<button class="kp-big go" data-m="lvl" data-id="${l.n+1}">Następna plansza ▶</button>`:l?`<button class="kp-big go" data-m="lvl" data-id="${l.n}">↻ Jeszcze raz</button>`:`<button class="kp-big go" data-m="shift">↻ Kolejna zmiana</button>`}<button class="kp-big" data-m="camp">🗺️ Kampania</button></div><div class="kp-row" style="margin-top:8px"><button class="kp-big alt" data-m="exit">◀ Menu główne</button></div>`);
    SH=null;mode="menu";
  }
  /* kasa fiskalna: gość płaci banknotem, gracz wydaje resztę */
  let KAS=null;const NOTES=[20,50,100,200],COINS=[50,20,10,5,2,1];
  function showKasa(){
    const c=SH&&SH.pc;if(!c){afterDish();return;}
    const price=SH.lastPay,given=NOTES.find(n=>n>=price)||price;
    KAS={price,given,change:given-price,sum:0,mis:0,c};kasaFace();
  }
  function kasaFace(){
    const k=KAS,d=$k("kKasaD");if(d)d.textContent=k.price+",00";
    modal(`<h2>🧾 Kasa fiskalna</h2><p>Gość zamówił: <b>${esc2(k.c.r.name)}</b></p><p>Do zapłaty: <b>${k.price} zł</b> · Gość płaci: <b>${k.given} zł</b></p>${k.change>0?`<p><b>Wydaj resztę: ${k.change} zł</b></p><p id="kSum" data-change="${k.change}">W dłoni: <b>0 zł</b></p><div class="kasa-coins">${COINS.map(v=>`<button class="kp-chip" data-m="coin" data-id="${v}"><span class="e">${v>=10?"💵":"🪙"}</span><span>${v} zł</span></button>`).join("")}</div><div class="kp-row" style="margin-top:8px"><button class="kp-big alt" data-m="coinclr">Wyczyść</button><button class="kp-big go" data-m="kasaok">Wydaj resztę ▶</button></div>`:`<p>Gość płaci odliczoną kwotą, reszty nie trzeba wydawać.</p><div class="kp-row"><button class="kp-big go" data-m="kasaok">Wystaw paragon ▶</button></div>`}<p class="kp-sub" id="kMsg">Zawsze wydaj klientowi paragon. Przy reszcie licz na głos.</p>`);
  }
  function kasaCoin(v){if(!KAS)return;KAS.sum+=v;const e=$k("kSum");if(e)e.innerHTML="W dłoni: <b>"+KAS.sum+" zł</b>";sfx.put&&sfx.put();}
  function kasaClear(){if(!KAS)return;KAS.sum=0;const e=$k("kSum");if(e)e.innerHTML="W dłoni: <b>0 zł</b>";}
  function kasaOk(){
    const k=KAS;if(!k)return;
    if(k.sum!==k.change){k.mis++;const m=$k("kMsg");if(m)m.textContent=k.sum<k.change?"Za mało: gość by się upomniał. Do reszty brakuje "+(k.change-k.sum)+" zł.":"Za dużo: stołówka straciłaby "+(k.sum-k.change)+" zł. Policz jeszcze raz.";sfx.bad&&sfx.bad();kasaClear();return;}
    const tip=k.mis===0?Math.max(1,Math.round(k.price*.08)):0;
    if(tip){S.coins+=tip;SH.tips+=tip;KS.earned+=tip;}
    ksave();save();sfx.coin&&sfx.coin();
    const dr=$k("kKasa");if(dr){dr.animate([{transform:"translateY(0)"},{transform:"translateY(-3px)"},{transform:"translateY(0)"}],{duration:300});}{const cs=$k("kCash");if(cs){cs.dataset.a="ring";setTimeout(()=>{cs.dataset.a="idle";},900);}}
    modal(`<h2>🧾 Paragon</h2><div class="paragon"><b>STOŁÓWKA „GOTUJ I MROŹ”</b><br>${esc2(k.c.r.name)} ........ ${k.price},00 zł<br>RAZEM ........ ${k.price},00 zł<br>Zapłacono ${k.given},00 zł<br>Reszta ${k.change},00 zł<br><i>Dziękujemy! Do zobaczenia.</i></div><p>${tip?"💰 Napiwek +"+tip+" zł: reszta wydana bez pomyłki!":"Reszta wydana poprawnie."}</p><div class="kp-row"><button class="kp-big go" data-m="kasadone">Wręcz paragon ▶</button></div>`);
  }
  function kasaDone(){
    const k=KAS;KAS=null;closeModal();
    if(k&&k.c){payFx(k.c);k.c.manual=false;exitCust(k.c);}
    if(SH)SH.pc=null;renderIdlePanel();
  }
  function onModalClick(e){
    const b=e.target.closest("[data-m]");if(!b)return;const m=b.dataset.m,id=b.dataset.id;
    switch(m){
      case "shift":startShift();break;
      case "lvl":startShift(K_LEVELS[+id]);break;
      case "camp":showCamp();break;
      case "menuk":showStart();break;
      case "kasa":showKasa();break;
      case "coin":kasaCoin(+id);break;
      case "coinclr":kasaClear();break;
      case "kasaok":kasaOk();break;
      case "introgo":closeModal();break;
      case "kasadone":kasaDone();break;
      case "kasaorder":{const c=CL.find(x=>x.id===+id&&x.ph==="pay");if(!c||run)return;c.manual=true;SH.pc=c;SH.lastPay=c.pay||10;showKasa();break;}
      case "book":SH=null;showBook();break;
      case "exit":exit();break;
      case "practice":startPractice(K_BYID[id]);break;
      case "again":startPractice(K_BYID[id]);break;
      case "shiftnext":closeModal();afterDish();break;
      case "order":orderTap(+id);break;
    }
  }
  function orderTap(id){
    if(run)return toast("Najpierw skończ obecne danie");
    const c=CL.find(x=>x.id===id&&x.ph==="seated"&&x.state==="wait");if(!c)return;startCook(c.r,c);
  }
  function afterDish(){renderIdlePanel();}
  /* ---------- pętla ---------- */
  function frame(now){
    if(!root||!root.classList.contains("on")){raf=0;return;}
    const dt=Math.min(.1,(now-last)/1000);last=now;
    if(((HUDT=(HUDT||0)+dt))>.45){HUDT=0;hudTick();}
    if(run&&!run.finished){KE.tick(run,dt);updatePanel();updateWork();}
    if(chefT>0){chefT-=dt;if(chefT<=0)setChef(chefFor());}else{const a=chefFor(),c=$k("kChef");if(c&&c.dataset.a!==a)setChef(a);}
    const modalOn=$k("kModal").classList.contains("on");
    if(SH){
      SH.t+=dt;if((SH._d=(SH._d||0)+dt)>1){SH._d=0;setDay();}
      if(!SH.finishing&&SH.spawned<SH.total){
        const act=CL.filter(c=>c.ph!=="gone"&&c.ph!=="exit");
        const entering=act.some(c=>c.ph==="enter"||c.ph==="ordering"||c.ph==="toseat");
        const waiting=act.filter(c=>c.ph==="enter"||c.ph==="ordering"||c.ph==="toseat"||(c.ph==="seated"&&(c.state==="wait"||c.state==="cooking"))).length;
        const tb=freeTable();
        if(!entering&&waiting<SH.cap&&tb>=0){SH.spawnT-=dt;if(SH.spawnT<=0){spawnCust(pickDish(),tb,SH.pat);SH.spawned++;SH.spawnT=SH.gap?SH.gap[0]+Math.random()*(SH.gap[1]-SH.gap[0]):7+Math.random()*4;}}
      }
    }
    for(const c of CL.slice())custTick(c,dt);
    if(SH){
      if(!run&&!modalOn){SH._o=(SH._o||0)+dt;if(SH._o>1){SH._o=0;updateOrders();}}
      if(!SH.finishing&&!run&&!modalOn&&SH.served+SH.lost>=SH.total){SH.finishing=1;renderIdlePanel();}
      if(SH.finishing&&!modalOn&&CL.every(c=>c.ph==="gone"))endShift();
    }
    raf=requestAnimationFrame(frame);
  }

  /* ---------- otwieranie / zamykanie ---------- */
  function build(){
    if(root)return;
    root=document.createElement("div");root.id="k";
    root.innerHTML=`<div class="k-top"><button class="k-btn" id="kBack" title="Wstecz">◀</button><div class="kt" id="kTitle">Kuchnia szefa<small id="kSub"></small></div><span class="k-pill" id="kDay" style="margin-right:6px"></span><span class="k-pill" id="kCoins"></span></div>
      <div class="k-main"><div class="k-scene" id="kSceneBox"></div><div class="k-panel" id="kPanel"></div></div><div class="k-modal" id="kModal"></div>`;
    document.body.appendChild(root);
    root.querySelector("#kPanel").addEventListener("pointerdown",onPanelDown);
    root.querySelector("#kPanel").addEventListener("click",onPanelClick);
    root.querySelector("#kModal").addEventListener("click",onModalClick);
    root.querySelector("#kPanel").addEventListener("click",e=>{const b=e.target.closest("[data-m]");if(b)onModalClick(e);});
    root.querySelector("#kBack").addEventListener("click",back);
    root.querySelector("#kSceneBox").addEventListener("click",e=>{const g=e.target.closest(".cust");if(g&&SH)orderTap(+g.id.slice(2));});
  }
  function open(){
    load();build();
    camMode="full";$k("kSceneBox").innerHTML=sceneSVG();mountHud();CL.length=0;
    root.classList.add("on");fitScene();if(!RZ){RZ=1;window.addEventListener("resize",fitScene);if(window.ResizeObserver)new ResizeObserver(fitScene).observe($k("kSceneBox"));}mode="menu";run=null;SH=null;cur=null;
    const t=$k("kCoins");t.textContent="💰 "+S.coins+" zł";
    $k("kSub").textContent=rank()+" · ⭐ "+total()+"/"+maxStars();
    $k("kPanel").innerHTML=`<div class="kp-h"><b>Witaj w kuchni${S.name?", "+esc2(S.name):""}!</b></div><div class="kp-t">Wybierz, co chcesz robić.</div>`;
    showStart();setChef("idle");last=performance.now();if(!raf)raf=requestAnimationFrame(frame);
    if(!K_TIMER)K_TIMER=setInterval(()=>{const t=$k("kCoins");if(t&&root.classList.contains("on")){t.textContent="💰 "+S.coins+" zł";const s=$k("kSub");if(s)s.textContent=rank()+" · ⭐ "+total()+"/"+maxStars();}},1000);
  }
  function exit(){
    if(root)root.classList.remove("on");run=null;SH=null;cur=null;mode="menu";
    if(typeof menu==="function")menu();
  }
  function back(){
    if(!root||!root.classList.contains("on"))return;
    if(run&&!run.finished){
      modal(`<h2>⏸ Przerwać gotowanie?</h2><p>Postęp w tym daniu zostanie utracony.</p><div class="kp-row"><button class="kp-big go" data-m="resume">Wróć do gotowania</button><button class="kp-big alt" data-m="abort">Przerwij</button></div>`);
      const m=$k("kModal");m.onclick=e=>{const b=e.target.closest("[data-m]");if(!b)return;if(b.dataset.m==="resume"){m.onclick=null;closeModal();}else if(b.dataset.m==="abort"){m.onclick=null;abort();}};return;
    }
    if($k("kModal").classList.contains("on")){exit();return;}
    showStart();
  }
  function abort(){
    const c=cur;run=null;closeModal();
    if(c){c.state="wait";}
    if(SH){renderIdlePanel();}else{PRACTICE=null;showBook();}
  }
  return {peek:n=>{setScene(K_LEVELS[n]);},open,exit,back,active:()=>!!(root&&root.classList.contains("on")),state:()=>({KS,run,SH,mode}),load,save:ksave,total,rank,data:()=>KS};
})();
