/* Gotuj i Mroź 3.0 – grafika restauracji (SVG): postacie, sala, kuchnia. Czysty generator tekstu SVG, bez DOM. */
"use strict";
const KART=(()=>{
  const hx=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
  const mx=(a,b,t)=>{const A=hx(a),B=hx(b);return "#"+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,"0")).join("");};
  /* postać w układzie: środek głowy (0,8), cień na y=66 */
  function person(o){
    const sk=o.skin,skd=mx(sk,"#5a2e18",.28),sc=o.shirt,hc=o.hair,pn=o.pants||"#34383f",hs=o.hs||0,sh=o.shoes||"#262626";
    let s=`<ellipse cx="0" cy="66" rx="24" ry="5" fill="rgba(0,0,0,.28)"/>`;
    s+=`<rect x="-13" y="52" width="11" height="17" rx="3" fill="${pn}"/><rect x="2" y="52" width="11" height="17" rx="3" fill="${pn}"/><rect x="-15" y="66" width="14" height="6" rx="3" fill="${sh}"/><rect x="1" y="66" width="14" height="6" rx="3" fill="${sh}"/>`;
    if(hs===1)s+=`<path d="M-17 6Q-21 -15 0 -15Q21 -15 17 6L20 40Q13 46 9 37L9 8H-9L-9 37Q-13 46 -20 40Z" fill="${hc}"/>`;
    s+=`<rect x="-5" y="15" width="10" height="11" fill="${skd}"/>`;
    s+=`<rect x="-19" y="21" width="38" height="43" rx="15" fill="${sc}"/><rect x="8" y="23" width="11" height="40" rx="8" fill="rgba(0,0,0,.14)"/><path d="M-16 28Q-16 22 -6 22H-2Q-12 26 -12 34Z" fill="rgba(255,255,255,.22)"/>`;
    if(o.pat==="stripe")s+=[30,38,46,54].map(y=>`<path d="M-17 ${y}H17" stroke="rgba(255,255,255,.3)" stroke-width="3"/>`).join("");
    if(o.apron)s+=`<path d="M-12 36H12V64H-12Z" fill="${o.apron}"/>`;
    s+=`<path d="M-7 21L0 30L7 21Z" fill="${skd}"/>`;
    if(!o.noArms)s+=`<rect x="-27" y="25" width="10" height="32" rx="5" fill="${sc}"/><circle cx="-22" cy="59" r="5.5" fill="${sk}"/><rect x="17" y="25" width="10" height="32" rx="5" fill="${sc}"/><circle cx="22" cy="59" r="5.5" fill="${sk}"/>`;
    s+=`<circle cx="-16" cy="9" r="3.6" fill="${sk}"/><circle cx="16" cy="9" r="3.6" fill="${sk}"/><circle cx="0" cy="8" r="16" fill="${sk}"/>`;
    s+=`<path d="M9 -3Q18 8 8 22Q16 10 9 -3Z" fill="rgba(0,0,0,.08)"/>`;
    s+=`<ellipse cx="-5.5" cy="8" rx="2.9" ry="3.3" fill="#fff"/><ellipse cx="5.5" cy="8" rx="2.9" ry="3.3" fill="#fff"/><circle cx="-5.2" cy="8.6" r="1.8" fill="#2b1a12"/><circle cx="5.8" cy="8.6" r="1.8" fill="#2b1a12"/><circle cx="-4.6" cy="7.9" r=".6" fill="#fff"/><circle cx="6.4" cy="7.9" r=".6" fill="#fff"/>`;
    s+=`<path d="M-9.5 3.2Q-5.5 1 -2.5 3M2.5 3Q5.5 1 9.5 3.2" stroke="${hs===4?mx(sk,"#000000",.45):hc}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
    s+=`<path d="M0 9.5Q2.2 12 0 13" stroke="${skd}" stroke-width="1.2" fill="none" stroke-linecap="round"/><circle cx="-10" cy="13" r="3" fill="#f2a28a" opacity=".35"/><circle cx="10" cy="13" r="3" fill="#f2a28a" opacity=".35"/>`;
    s+=`<path ${o.id!=null?`id="kcm${o.id}"`:""} d="M-5 16Q0 19.5 5 16" stroke="#7a2e2e" fill="none" stroke-width="1.8" stroke-linecap="round"/>`;
    if(hs===3)s+=`<path d="M-14 10Q-14 27 0 27Q14 27 14 10Q9 19 0 19Q-9 19 -14 10Z" fill="${hc}"/><path d="M-5 16Q0 19.5 5 16" stroke="#7a2e2e" fill="none" stroke-width="1.8" stroke-linecap="round" transform="translate(0 .5)"/>`;
    if(hs===4)s+=`<path d="M-16 6Q-17.5 -3 -12 -7Q-15 0 -15.5 7ZM16 6Q17.5 -3 12 -7Q15 0 15.5 7Z" fill="${hc}"/>`;
    else if(hs===5)s+=`<path d="M-17 3Q-16 -16 0 -16Q16 -16 17 3Z" fill="${o.cap||"#c0392b"}"/><rect x="-18" y="1.5" width="36" height="5" rx="2.5" fill="${mx(o.cap||"#c0392b","#000000",.25)}"/><path d="M8 3Q23 3 25 7.5Q15 8.5 8 6Z" fill="${mx(o.cap||"#c0392b","#000000",.15)}"/>`;
    else s+=`<path d="M-16.5 6Q-18.5 -14 0 -14.5Q18.5 -14 16.5 6Q10 -3 0 -4Q-10 -3 -16.5 6Z" fill="${hc}"/>`;
    if(hs===2)s+=`<circle cx="0" cy="-16" r="7" fill="${hc}"/>`;
    if(o.gl)s+=`<circle cx="-5.5" cy="8" r="4.8" fill="rgba(200,230,255,.18)" stroke="#222" stroke-width="1.2"/><circle cx="5.5" cy="8" r="4.8" fill="rgba(200,230,255,.18)" stroke="#222" stroke-width="1.2"/><path d="M-0.7 8H0.7" stroke="#222" stroke-width="1.2"/>`;
    return s;
  }
  function cust(c,esc){
    const nm=c.r?(c.r.name.length>15?c.r.name.slice(0,14)+"…":c.r.name):"";
    return `<g class="cust still" id="kc${c.id}" style="transform:translate(${c.x}px,${c.y}px);opacity:${c.o};cursor:pointer">
<g class="walk" transform="scale(1.25)">${person({id:c.id,skin:c.skin,hair:c.hair,shirt:c.shirt,pants:c.pants,hs:c.hs,gl:c.gl,pat:c.pat2,cap:c.cap})}</g>
<g id="kcb${c.id}" style="display:none" transform="translate(0 -30)"><path d="M-8 0L0 9L8 0Z" fill="#fff"/><rect x="-60" y="-42" width="120" height="43" rx="11" fill="#fff" stroke="#e3c79a" stroke-width="2"/>
${c.r?KDISH.g(c.r.id,-57,-40,31):""}<text x="-24" y="-20" font-size="9.5" font-weight="800" fill="#2b1a12" font-family="system-ui">${c.r?esc(nm):""}</text>
<rect x="-24" y="-11" width="78" height="5" rx="2.5" fill="#e6d3b3"/><rect id="kcp${c.id}" x="-24" y="-11" width="78" height="5" rx="2.5" fill="#3cb371"/></g></g>`;
  }
  function waiter(x,y){
    return `<g class="waiter" id="kWaiter" style="transform:translate(${x}px,${y}px)"><g transform="scale(1.1)">${person({skin:"#e8b88f",hair:"#3a2418",shirt:"#fbfbfb",pants:"#23262c",hs:0,noArms:true})}
<path d="M-19 36L-7 24L0 34L7 24L19 36V64H-19Z" fill="#2b2f36"/><path d="M-6 22L0 30L6 22Z" fill="#fbfbfb"/><path d="M-6 25L0 28L6 25L4 31H-4Z" fill="#d93a2f"/>
<rect x="-27" y="25" width="10" height="32" rx="5" fill="#fbfbfb"/><circle cx="-22" cy="59" r="5.5" fill="#e8b88f"/>
<path d="M17 30L35 36" stroke="#fbfbfb" stroke-width="9" stroke-linecap="round"/><circle cx="36" cy="37" r="5" fill="#e8b88f"/><ellipse cx="38" cy="41" rx="17" ry="3.2" fill="#c9cfd5" stroke="#8a97a4" stroke-width="1"/><g id="kTrayE" transform="translate(26 12)"></g></g></g>`;
  }
  function cashier(x,y){
    return `<g class="cash" id="kCash" data-a="idle" transform="translate(${x} ${y}) scale(.86)"><g class="bob"><g transform="translate(0 -44)">${person({skin:"#e8b88f",hair:"#6b3a1e",shirt:"#2f6db5",hs:1,noArms:true,pants:"#2a2f3a"})}
<path d="M-7 22L0 31L7 22L4 30H-4Z" fill="#f4d03f"/><rect x="-18" y="40" width="14" height="8" rx="1.5" fill="#fff"/><rect x="-16" y="43" width="10" height="1.4" fill="#2f6db5"/>
<rect x="-27" y="25" width="10" height="32" rx="5" fill="#2f6db5"/><circle cx="-22" cy="59" r="5.5" fill="#e8b88f"/>
<g class="arm armR"><rect x="17" y="25" width="10" height="32" rx="5" fill="#2f6db5"/><circle cx="22" cy="59" r="5.5" fill="#e8b88f"/></g></g></g></g>`;
  }
  function chef(x,y){
    const skin="#f1c9a5";
    return `<g class="chef" id="kChef" data-a="idle" transform="translate(${x} ${y}) scale(.8)">
<g class="bob">
<rect x="-40" y="-12" width="80" height="116" rx="28" fill="#fff"/><rect x="14" y="-8" width="26" height="110" rx="14" fill="rgba(0,0,0,.08)"/>
<path d="M-40 44Q0 62 40 44V104H-40Z" fill="#ededed"/>
<path d="M-14 -10L0 16L14 -10Z" fill="#d93a2f"/><path d="M-14 -10L0 4L14 -10L8 -12L0 -4L-8 -12Z" fill="#b92c22"/>
<path d="M0 16V102" stroke="#d9d9d9" stroke-width="2"/>
<g fill="#cfd2d6"><circle cx="-12" cy="28" r="3"/><circle cx="-12" cy="46" r="3"/><circle cx="-12" cy="64" r="3"/><circle cx="12" cy="28" r="3"/><circle cx="12" cy="46" r="3"/><circle cx="12" cy="64" r="3"/></g>
<rect x="-34" y="26" width="16" height="16" rx="3" fill="#f6f6f6" stroke="#d9d9d9"/><rect x="-30" y="22" width="3" height="12" rx="1.5" fill="#3b82c4"/>
<g class="arm armL"><rect x="-56" y="-4" width="24" height="60" rx="12" fill="#fff"/><rect x="-56" y="40" width="24" height="9" rx="4" fill="#ededed"/><circle class="hand" cx="-44" cy="60" r="11" fill="${skin}"/></g>
<g class="arm armR"><rect x="32" y="-4" width="24" height="60" rx="12" fill="#fff"/><rect x="32" y="40" width="24" height="9" rx="4" fill="#ededed"/><circle class="hand" cx="44" cy="60" r="11" fill="${skin}"/>
<g class="tool t-knife" transform="translate(44 60)"><rect x="-3" y="-6" width="6" height="16" rx="2" fill="#6a432d"/><path d="M-3 -6L-3 -36Q5 -32 5 -6Z" fill="#dfe4e8" stroke="#9aa3ab" stroke-width="1"/></g>
<g class="tool t-spoon" transform="translate(44 60)"><rect x="-2.5" y="-4" width="5" height="36" rx="2" fill="#6a432d"/><ellipse cx="0" cy="-8" rx="9" ry="12" fill="#c98f4b" stroke="#8a5a2b" stroke-width="1.5"/></g></g>
<rect x="-6" y="-22" width="12" height="12" fill="#d9a98a"/>
<circle cx="-27" cy="-38" r="5" fill="${skin}"/><circle cx="27" cy="-38" r="5" fill="${skin}"/><circle cx="0" cy="-38" r="27" fill="${skin}"/>
<path d="M12 -58Q30 -40 12 -14Q22 -36 12 -58Z" fill="rgba(0,0,0,.07)"/>
<ellipse cx="-10" cy="-40" rx="4.2" ry="4.8" fill="#fff"/><ellipse cx="10" cy="-40" rx="4.2" ry="4.8" fill="#fff"/><circle cx="-9.6" cy="-39" r="2.7" fill="#2b1a12"/><circle cx="10.4" cy="-39" r="2.7" fill="#2b1a12"/><circle cx="-8.7" cy="-40" r=".9" fill="#fff"/><circle cx="11.3" cy="-40" r=".9" fill="#fff"/>
<path d="M-16 -48Q-10 -52 -4 -49M4 -49Q10 -52 16 -48" stroke="#5a3420" stroke-width="2.6" fill="none" stroke-linecap="round"/>
<path d="M0 -37Q4 -31 0 -29" stroke="#c9967a" stroke-width="1.8" fill="none" stroke-linecap="round"/>
<path d="M-13 -23Q-7 -29 0 -25Q7 -29 13 -23Q7 -19 0 -22Q-7 -19 -13 -23Z" fill="#5a3420"/>
<path d="M-8 -17Q0 -11 8 -17" stroke="#7a2e2e" fill="none" stroke-width="2.4" stroke-linecap="round"/>
<circle cx="-17" cy="-28" r="5" fill="#f2a28a" opacity=".5"/><circle cx="17" cy="-28" r="5" fill="#f2a28a" opacity=".5"/>
<path d="M-29 -52C-48 -62 -40 -96 -16 -90C-10 -108 10 -108 16 -90C40 -96 48 -62 29 -52Z" fill="#fff" stroke="#e2e2e2" stroke-width="1.5"/>
<path d="M-12 -90Q-14 -70 -12 -56M0 -96V-56M12 -90Q14 -70 12 -56" stroke="#ececec" stroke-width="2" fill="none"/>
<rect x="-29" y="-58" width="58" height="11" rx="3" fill="#f4f4f4" stroke="#e0e0e0"/>
</g></g>`;
  }
  /* osiem światów = osiem wyglądów restauracji */
  const WORLDS=[
    {id:"podstawy",wall:["#8f3d2d","#6a281f"],line:"rgba(255,225,190,.13)",wain:"#4d2c1a",rail:"#7a4c2e",floor:["#a4723f","#6a4425"],cloth:["#e0574a","#fbf8f2"],rug:"#7a2d2d",tile:"#ece4d2",grout:"#cdc2ac",cab:"#8f979f",sign:"#2e8b57",deco:"plants"},
    {id:"zupy",wall:["#2f5d50","#1f3f37"],line:"rgba(255,255,255,.10)",wain:"#3b2a1c",rail:"#6a4a2a",floor:["#9a7448","#6a4a28"],cloth:["#3a6ea5","#fbf8f2"],rug:"#2a4d6b",tile:"#e3ece9",grout:"#bccbc6",cab:"#7f9a99",sign:"#2a7f6b",deco:"shelf"},
    {id:"obiady",wall:["#5a4a42","#3a2f2a"],line:"rgba(255,255,255,.08)",wain:"#2c2420",rail:"#5a4636",floor:["#7a5b3c","#4d3924"],cloth:["#c9b04a","#44474c"],rug:"#3a3d42",tile:"#d9d3c5",grout:"#b5ae9d",cab:"#6f767c",sign:"#b8860b",deco:"mine"},
    {id:"bar",wall:["#1f7a8c","#16525e"],line:"rgba(255,255,255,.10)",wain:"#0f3b45",rail:"#e0b25a",floor:["#cfd3d6","#9aa0a5"],cloth:["#d94a3a","#ffffff"],rug:"#222a2e",tile:"#f1f4f6",grout:"#c9d0d4",cab:"#c0392b",sign:"#d9463a",deco:"neon"},
    {id:"wypieki",wall:["#e8a6b8","#c97c93"],line:"rgba(255,255,255,.18)",wain:"#f7d9e1",rail:"#fff3f6",floor:["#e9d3b5","#cdb08a"],cloth:["#f48fb1","#ffffff"],rug:"#e57ba0",tile:"#fdf1f4",grout:"#ecd0d8",cab:"#f3c4d1",sign:"#d9467a",deco:"bunting"},
    {id:"pizza",wall:["#b84a2a","#8a3318"],line:"rgba(255,235,200,.14)",wain:"#3b2218",rail:"#6a432d",floor:["#b08a5a","#7a5b36"],cloth:["#2e8b3d","#ffffff"],rug:"#8a1f1f",tile:"#f3e9d6",grout:"#d5c7aa",cab:"#7a2d2d",sign:"#2e8b3d",deco:"flags"},
    {id:"azja",wall:["#a82020","#701414"],line:"rgba(255,215,120,.14)",wain:"#2a1410",rail:"#d9a441",floor:["#7a4a2a","#4a2a14"],cloth:["#1d1d1d","#d9463a"],rug:"#1a1a1a",tile:"#f5ecd9",grout:"#d9c9a0",cab:"#3a3a3a",sign:"#d9a441",deco:"lanterns"},
    {id:"wege",wall:["#6f9a5a","#4a7040"],line:"rgba(255,255,255,.12)",wain:"#5a4a2a",rail:"#8a7440",floor:["#c9a46b","#9a7a48"],cloth:["#9acd6b","#fffaf0"],rug:"#4a7040",tile:"#f2f6ea",grout:"#cfd9bc",cab:"#8aa87a",sign:"#3f8f4a",deco:"plants2"}
  ];
  function deco(W,j,n){
    const d=W.deco;let s="";
    const bunt=(cols,y0)=>{let t=`<path d="M0 ${y0} Q320 ${y0+16} 640 ${y0}" stroke="#2a1a10" stroke-width="1.2" fill="none"/>`;for(let x=6,i=0;x<634;x+=26,i++){const yy=y0+16*Math.sin(Math.PI*x/640)*.95;t+=`<path d="M${x} ${yy.toFixed(1)}L${x+13} ${(yy+15).toFixed(1)}L${x+26} ${yy.toFixed(1)}Z" fill="${cols[i%cols.length]}"/>`;}return t;};
    const plant=(x,y,sc)=>`<g transform="translate(${x} ${y}) scale(${sc})"><path d="M-10 0h20l-3 16h-14z" fill="#b5651d"/><rect x="-12" y="-3" width="24" height="5" rx="2" fill="#c97a2e"/><ellipse cx="-6" cy="-12" rx="5" ry="14" fill="#3f8f4a" transform="rotate(-28 -6 -12)"/><ellipse cx="0" cy="-16" rx="5" ry="15" fill="#4fa85a"/><ellipse cx="6" cy="-12" rx="5" ry="14" fill="#3f8f4a" transform="rotate(28 6 -12)"/></g>`;
    if(d==="plants"){if(j>=3)s+=plant(600,184,1);}
    if(d==="shelf"){s+=`<g><rect x="190" y="46" width="100" height="5" rx="2" fill="#6a432d"/><ellipse cx="208" cy="40" rx="11" ry="8" fill="#9aa3ab"/><rect x="198" y="30" width="20" height="4" rx="2" fill="#6f7a83"/><ellipse cx="240" cy="39" rx="9" ry="9" fill="#c0504a"/><ellipse cx="270" cy="40" rx="11" ry="8" fill="#d9a441"/></g>`;}
    if(d==="mine"){s+=`<g><rect x="326" y="16" width="44" height="40" rx="2" fill="#7a5a3a"/><rect x="330" y="20" width="36" height="32" fill="#b8c7d4"/><path d="M338 52V30M358 52V30M338 30L348 22L358 30M348 22V52" stroke="#2f2f2f" stroke-width="2" fill="none"/><circle cx="348" cy="30" r="4" fill="none" stroke="#2f2f2f" stroke-width="2"/></g><g stroke="#8a97a4" stroke-width="3" stroke-linecap="round"><path d="M520 26L548 52M548 26L520 52"/></g><g><ellipse cx="206" cy="30" rx="8" ry="6" fill="#ffd25e"/><rect x="199" y="30" width="14" height="8" rx="2" fill="#6f7a83"/></g>`;}
    if(d==="neon"){s+=`<g font-family="system-ui" font-weight="900" font-size="26" text-anchor="middle"><text x="330" y="44" fill="none" stroke="#ff4d9d" stroke-width="7" opacity=".28">BAR</text><text x="330" y="44" fill="none" stroke="#ff4d9d" stroke-width="3" opacity=".6">BAR</text><text x="330" y="44" fill="#ffe3f1">BAR</text></g><rect y="184" width="640" height="6" fill="#111"/><path d="M0 187H640" stroke="#fff" stroke-width="3" stroke-dasharray="10 10"/>`;}
    if(d==="bunting"){s+=bunt(["#f48fb1","#fff3f6","#ffd25e","#9ad0f5"],14);s+=`<g><ellipse cx="198" cy="125" rx="16" ry="4" fill="#f3e1c8"/><rect x="188" y="108" width="20" height="16" rx="3" fill="#f6b8c8"/><path d="M186 108Q198 96 210 108Z" fill="#fff"/><circle cx="198" cy="98" r="3" fill="#d9463a"/></g>`;}
    if(d==="flags"){s+=bunt(["#2e8b3d","#ffffff","#d9463a"],14);}
    if(d==="lanterns"){for(const x of [200,330,450]){s+=`<g><path d="M${x} 0V16" stroke="#2a1a10" stroke-width="1.5"/><ellipse cx="${x}" cy="34" rx="16" ry="19" fill="#d9302a"/><rect x="${x-9}" y="13" width="18" height="4" rx="2" fill="#d9a441"/><rect x="${x-9}" y="51" width="18" height="4" rx="2" fill="#d9a441"/><path d="M${x-9} 22Q${x} 34 ${x-9} 46M${x+9} 22Q${x} 34 ${x+9} 46" stroke="#a81c18" fill="none"/><path d="M${x} 55v10" stroke="#d9a441" stroke-width="2"/><circle cx="${x}" cy="34" r="30" fill="url(#kl)"/></g>`;}}
    if(d==="plants2"){for(const x of [184,300,470,560])s+=`<g><path d="M${x} 0V18" stroke="#3f8f4a" stroke-width="2"/><ellipse cx="${x}" cy="26" rx="14" ry="9" fill="#9a6a3a"/><path d="M${x-12} 30Q${x-18} 52 ${x-10} 62M${x} 32Q${x+2} 56 ${x-2} 70M${x+12} 30Q${x+18} 50 ${x+10} 60" stroke="#4fa85a" stroke-width="4" fill="none" stroke-linecap="round"/></g>`;s+=plant(150,184,.9);}
    return s;
  }
  function pizzaOven(){return `<path d="M318 362V334Q318 292 410 292Q502 292 502 334V362Z" fill="#a5472a" stroke="#6f2f1a" stroke-width="3"/><path d="M360 362V344Q360 322 410 322Q460 322 460 344V362Z" fill="#1d1210"/><ellipse cx="410" cy="352" rx="34" ry="9" fill="#ff8a2a" opacity=".7"/><path d="M340 306H480M330 324H490" stroke="#8a3318" stroke-width="2"/>`;}
  function scene(o){
    const T=o.T,tbl=o.tbl,W=o.W||WORLDS[0],j=o.j||0,n=o.n||0;
    const pf=mx(W.wain,"#ffffff",.1),ps=mx(W.wain,"#000000",.4),cabd=mx(W.cab,"#000000",.3),cabb=mx(W.cab,"#000000",.12);
    let lines="",br="";
    for(let y=0,r=0;y<74;y+=14,r++){lines+=`<path d="M0 ${y}H640" stroke="${T.brick}" stroke-width="1"/>`;for(let x=(r%2)*17-17;x<640;x+=34){lines+=`<path d="M${x} ${y}v14" stroke="${T.brick}" stroke-width="1"/>`;const k=Math.abs(x*7+y*3)%5;br+=`<rect x="${x+1}" y="${y+1}" width="32" height="12" rx="1.5" fill="${k===0?"rgba(0,0,0,.12)":k===1?"rgba(255,255,255,.06)":"rgba(0,0,0,.02)"}"/>`;}}
    let panels="";for(let x=0;x<640;x+=40)panels+=`<rect x="${x+4}" y="81" width="32" height="24" rx="2" fill="${pf}" stroke="${ps}"/>`;
    let planks="";for(let x=0;x<640;x+=40)planks+=`<rect x="${x}" y="110" width="20" height="82" fill="rgba(0,0,0,.045)"/>`;
    let tiles="";for(let x=0;x<640;x+=32)tiles+=`<path d="M${x} 216V1000" stroke="${W.grout}" stroke-width="1.2"/>`;for(let y=216;y<1000;y+=26)tiles+=`<path d="M0 ${y}H640" stroke="${W.grout}" stroke-width="1.2"/>`;
    const chairs=tbl.map(t=>`<rect x="${t.x-18}" y="150" width="4" height="30" fill="#4a2a18"/><rect x="${t.x+14}" y="150" width="4" height="30" fill="#4a2a18"/><rect x="${t.x-18}" y="98" width="36" height="48" rx="7" fill="#5a3420"/><path d="M${t.x-12} 104V138M${t.x-4} 104V138M${t.x+4} 104V138M${t.x+12} 104V138" stroke="#3a2012" stroke-width="2"/><rect x="${t.x-18}" y="98" width="36" height="6" rx="3" fill="#7a4c2e"/>`).join("");
    const tables=tbl.map((t,i)=>`<g><path d="M${t.x-40} 152Q${t.x-40} 170 ${t.x-30} 172L${t.x+30} 172Q${t.x+40} 170 ${t.x+40} 152Z" fill="#f4efe6"/><path d="M${t.x-36} 164H${t.x+36}" stroke="#d9463a" stroke-width="2"/><ellipse cx="${t.x}" cy="152" rx="41" ry="13.5" fill="url(#kchk)" stroke="#cfc6b4" stroke-width="1.5"/><rect x="${t.x+17}" y="143" width="5" height="9" rx="2" fill="#e6e9ec" stroke="#aeb6be" stroke-width=".8"/><circle cx="${t.x-24}" cy="149" r="3" fill="#f4d03f"/><g id="kTP${i}" transform="translate(${t.x-13} 132)"></g></g>`).join("");
    const lamp=x=>`<path d="M${x} 0V10" stroke="#2a1a10" stroke-width="1.5"/><path d="M${x-15} 26L${x-8} 10H${x+8}L${x+15} 26Z" fill="#d9a441" stroke="#a87a1f"/><ellipse cx="${x}" cy="26" rx="10" ry="3" fill="#fff3c4"/><circle cx="${x}" cy="30" r="52" fill="url(#kl)"/>`;
    return `<svg id="kSvg" viewBox="0 0 640 416" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
<defs><linearGradient id="kw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${T.wall[0]}"/><stop offset="1" stop-color="${T.wall[1]}"/></linearGradient>
<linearGradient id="kf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${T.floor[0]}"/><stop offset="1" stop-color="${T.floor[1]}"/></linearGradient>
<linearGradient id="kc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8bb7a"/><stop offset="1" stop-color="#b8793a"/></linearGradient>
<linearGradient id="ksteel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#aeb7bf"/><stop offset=".35" stop-color="#e3e8ec"/><stop offset=".6" stop-color="#c3cbd2"/><stop offset="1" stop-color="#97a1aa"/></linearGradient>
<linearGradient id="ktop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f2f5f7"/><stop offset="1" stop-color="#b3bcc4"/></linearGradient>
<linearGradient id="kts" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(0,0,0,.35)"/><stop offset="1" stop-color="rgba(0,0,0,0)"/></linearGradient>
<linearGradient id="ktg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="rgba(255,255,255,.28)"/><stop offset=".5" stop-color="rgba(255,255,255,0)"/><stop offset="1" stop-color="rgba(0,0,0,.08)"/></linearGradient>
<radialGradient id="kl" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffd68c" stop-opacity=".55"/><stop offset="1" stop-color="#ffd68c" stop-opacity="0"/></radialGradient>
<radialGradient id="kv" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="rgba(0,0,0,0)"/><stop offset="1" stop-color="rgba(0,0,0,.32)"/></radialGradient>
<pattern id="kchk" width="12" height="12" patternUnits="userSpaceOnUse"><rect width="12" height="12" fill="${W.cloth[1]}"/><rect width="6" height="6" fill="${W.cloth[0]}"/><rect x="6" y="6" width="6" height="6" fill="${W.cloth[0]}"/></pattern><pattern id="kfc" width="20" height="20" patternUnits="userSpaceOnUse"><rect width="20" height="20" fill="#f2f2f2"/><rect width="10" height="10" fill="#222"/><rect x="10" y="10" width="10" height="10" fill="#222"/></pattern></defs>
<g id="kHall"><g style="filter:hue-rotate(${(j-4)*5}deg)"><rect width="640" height="110" fill="url(#kw)"/>${br}${lines}</g>
<g style="filter:hue-rotate(${(j-4)*5}deg)"><rect y="72" width="640" height="38" fill="${W.wain}"/>${panels}<rect y="70" width="640" height="6" fill="${W.rail}"/><rect y="70" width="640" height="2" fill="rgba(255,255,255,.25)"/><rect y="106" width="640" height="5" fill="${ps}"/></g>
<rect y="110" width="640" height="82" fill="url(#kf)"/>${planks}
${W.deco==="neon"?`<rect y="110" width="640" height="82" fill="url(#kfc)" opacity=".5"/>`:""}<rect x="206" y="148" width="372" height="40" rx="10" fill="${W.rug}"/><rect x="212" y="153" width="360" height="30" rx="7" fill="none" stroke="#e0b25a" stroke-width="2"/>
<g><rect x="6" y="20" width="60" height="164" rx="3" fill="#2f1b12"/><rect id="kSky" x="12" y="28" width="48" height="68" fill="#bfe3ff"/><path d="M36 28V96M12 62H60" stroke="#2f1b12" stroke-width="2"/><path d="M12 28L60 96" stroke="rgba(255,255,255,.35)" stroke-width="5"/><rect x="14" y="104" width="44" height="16" rx="3" fill="#d84a3a"/><text x="36" y="116" font-size="9" font-weight="800" text-anchor="middle" fill="#fff" font-family="system-ui">OTWARTE</text><circle cx="56" cy="140" r="3" fill="#e0b25a"/><rect x="8" y="180" width="56" height="8" rx="2" fill="#26211d"/></g>
<g><path d="M92 0V16M128 0V16" stroke="#2a1a10" stroke-width="1.5"/><rect x="74" y="16" width="72" height="26" rx="6" fill="${W.sign}" stroke="#fff" stroke-width="2"/><text x="110" y="34" font-size="13" font-weight="900" text-anchor="middle" fill="#fff" font-family="system-ui">KASA</text></g>
${(W.deco==="plants"||W.deco==="plants2"||W.deco==="shelf")?`<g><rect x="268" y="16" width="40" height="32" rx="2" fill="#7a4c2e"/><rect x="272" y="20" width="32" height="24" fill="#cfe9f5"/><path d="M272 44L283 31L291 39L297 33L304 44Z" fill="#5f9e62"/><circle cx="295" cy="27" r="3" fill="#ffd25e"/></g>`:""}
${(n%2===0&&W.deco!=="lanterns"&&W.deco!=="neon"&&W.deco!=="bunting"&&W.deco!=="flags")?`<g><rect x="464" y="18" width="38" height="30" rx="2" fill="#7a4c2e"/><rect x="468" y="22" width="30" height="22" fill="#f1e2c0"/><circle cx="483" cy="33" r="8" fill="#d9463a"/><path d="M483 25q3-4 6-3" stroke="#3f8f4a" stroke-width="2" fill="none"/></g>`:""}
${deco(W,j,n)}
<g><rect x="570" y="8" width="66" height="68" rx="5" fill="#7a4c2e"/><rect x="575" y="13" width="56" height="58" fill="#1f2d27"/>
<text id="kMeal" x="603" y="27" font-size="10" font-weight="900" text-anchor="middle" fill="#f3efe2" font-family="Georgia,serif">MENU</text>
<text id="kMenu1" x="603" y="41" font-size="8.5" text-anchor="middle" fill="#ffd25e" font-family="Georgia,serif"></text>
<text id="kMenu2" x="603" y="53" font-size="8.5" text-anchor="middle" fill="#cfe9d8" font-family="Georgia,serif"></text>
<text id="kMenu3" x="603" y="65" font-size="8.5" text-anchor="middle" fill="#ffd25e" font-family="Georgia,serif"></text></g>
<g>${lamp(236)}${lamp(410)}</g>
<g><path d="M158 168h22l-3 16h-16z" fill="#b5651d"/><rect x="156" y="165" width="26" height="5" rx="2" fill="#c97a2e"/><ellipse cx="164" cy="152" rx="5" ry="14" fill="#3f8f4a" transform="rotate(-28 164 152)"/><ellipse cx="170" cy="148" rx="5" ry="15" fill="#4fa85a"/><ellipse cx="176" cy="152" rx="5" ry="14" fill="#3f8f4a" transform="rotate(28 176 152)"/><ellipse cx="170" cy="156" rx="4" ry="10" fill="#5cb866" transform="rotate(12 170 156)"/></g>
${cashier(104,134)}
<g><rect x="60" y="126" width="100" height="9" rx="3" fill="url(#kc)"/><rect x="62" y="135" width="96" height="57" fill="#8a5a2b"/><rect x="68" y="141" width="40" height="44" rx="3" fill="none" stroke="#6a432d" stroke-width="2"/><rect x="112" y="141" width="40" height="44" rx="3" fill="none" stroke="#6a432d" stroke-width="2"/>
<g id="kKasa"><g transform="translate(30 0)"><rect x="88" y="104" width="46" height="23" rx="4" fill="#d3d8dd" stroke="#5f676e" stroke-width="2"/><rect x="93" y="107" width="28" height="9" rx="2" fill="#1b2a22"/><text id="kKasaD" x="107" y="114.5" font-size="6.5" text-anchor="middle" fill="#7dffb0" font-family="monospace">0,00</text><g fill="#8a97a4"><rect x="125" y="108" width="4" height="4"/><rect x="125" y="115" width="4" height="4"/><rect x="118" y="119" width="6" height="4"/></g><rect x="122" y="96" width="8" height="10" fill="#fff" stroke="#ddd" stroke-width=".6"/></g></g>
</g>
<g id="kChairs">${chairs}</g>
<g id="kSeat"></g>
<g id="kTables">${tables}</g>
<g id="kCust"></g>
${waiter(o.wx,o.wy)}
<rect y="190" width="640" height="12" fill="url(#kc)"/><rect y="202" width="640" height="14" fill="#8a5a2b"/><path d="M0 209H640" stroke="rgba(0,0,0,.22)" stroke-width="1.5"/><rect y="190" width="640" height="2" fill="rgba(255,255,255,.35)"/>
<g id="kPass"><ellipse cx="590" cy="194" rx="48" ry="9" fill="url(#kl)"/><rect x="548" y="168" width="84" height="5" rx="2" fill="#c0392b"/><path d="M560 173v9M620 173v9" stroke="#8a97a4" stroke-width="2"/><rect x="552" y="190" width="76" height="6" rx="2" fill="#ffe08a"/><rect x="552" y="206" width="76" height="9" rx="3" fill="#2f6db5"/><text x="590" y="214" font-size="8" font-weight="900" text-anchor="middle" fill="#fff" font-family="system-ui">WYDAWKA</text></g>
<g id="kFx"></g></g>
<g id="kBack"><rect y="216" width="640" height="900" fill="${W.tile}"/>${tiles}<rect y="216" width="640" height="900" fill="url(#ktg)"/><rect y="216" width="640" height="26" fill="url(#kts)"/></g>
<g id="kK" transform="translate(0 0)">
<g><rect x="12" y="232" width="78" height="130" rx="6" fill="url(#ksteel)" stroke="#6f7a83" stroke-width="2"/><path d="M12 288H90" stroke="#6f7a83" stroke-width="2"/><rect x="76" y="248" width="4" height="28" rx="2" fill="#5f676e"/><rect x="76" y="298" width="4" height="42" rx="2" fill="#5f676e"/><rect x="30" y="256" width="12" height="12" rx="2" fill="#f4d03f"/><rect x="46" y="260" width="12" height="12" rx="2" fill="#e0574a"/></g>
<g><rect x="104" y="240" width="126" height="4" rx="2" fill="#8a5a2b"/><path d="M122 244v12M152 244v12M182 244v12M212 244v12" stroke="#8a5a2b" stroke-width="2"/>
<path d="M122 256v22" stroke="#9aa3ab" stroke-width="3"/><ellipse cx="122" cy="284" rx="9" ry="7" fill="#c98f4b" stroke="#8a5a2b" stroke-width="1.5"/>
<ellipse cx="152" cy="274" rx="8" ry="14" fill="none" stroke="#aab4bd" stroke-width="2"/><path d="M152 260v-4" stroke="#aab4bd" stroke-width="3"/>
<rect x="178" y="256" width="9" height="28" rx="2" fill="#c9cfd5" stroke="#8a97a4"/><circle cx="212" cy="274" r="14" fill="#2e3136" stroke="#17191c" stroke-width="2"/><path d="M212 260v-4" stroke="#6a432d" stroke-width="4"/></g>
<g><path d="M330 226h160l22 50H308z" fill="url(#ksteel)" stroke="#6f7a83" stroke-width="3"/><rect x="316" y="276" width="188" height="9" rx="3" fill="#8e979f"/><path d="M345 285v10M375 285v10M405 285v10M435 285v10M465 285v10" stroke="#8e979f" stroke-width="3"/></g>
<g><rect x="484" y="262" width="142" height="6" rx="2" fill="#8a5a2b"/><rect x="494" y="238" width="18" height="24" rx="3" fill="#d9a441"/><rect x="494" y="234" width="18" height="5" rx="2" fill="#6a432d"/><rect x="520" y="232" width="18" height="30" rx="3" fill="#c0504a"/><rect x="520" y="228" width="18" height="5" rx="2" fill="#6a432d"/><rect x="546" y="240" width="18" height="22" rx="3" fill="#7bb661"/><rect x="546" y="236" width="18" height="5" rx="2" fill="#6a432d"/><rect x="572" y="236" width="18" height="26" rx="3" fill="#e8dcb8"/><rect x="572" y="232" width="18" height="5" rx="2" fill="#6a432d"/><rect x="598" y="242" width="18" height="20" rx="3" fill="#a56b3a"/><rect x="598" y="238" width="18" height="5" rx="2" fill="#6a432d"/></g>
${W.deco==="flags"?pizzaOven():""}<rect x="326" y="322" width="168" height="40" rx="4" fill="#2e3237"/><g fill="#aab4bd"><circle cx="346" cy="334" r="4"/><circle cx="372" cy="334" r="4"/><circle cx="398" cy="334" r="4"/><circle cx="424" cy="334" r="4"/><circle cx="450" cy="334" r="4"/><circle cx="476" cy="334" r="4"/></g><rect x="338" y="342" width="144" height="16" rx="3" fill="#3a4047"/>
<g id="kWorkB"></g>${chef(255,306)}
<rect y="360" width="640" height="12" fill="url(#ktop)"/><rect y="360" width="640" height="2" fill="#fff"/><rect y="372" width="640" height="3" fill="rgba(0,0,0,.25)"/>
<rect y="372" width="640" height="400" fill="${cabb}"/>
${[0,1,2,3,4].map(i=>`<rect x="${i*128+8}" y="384" width="112" height="116" rx="4" fill="${W.cab}" stroke="${cabd}" stroke-width="2"/><rect x="${i*128+54}" y="394" width="20" height="4" rx="2" fill="#dfe4e8"/>`).join("")}
<g><rect x="104" y="352" width="78" height="8" rx="3" fill="#c98f4b"/><circle cx="124" cy="346" r="7" fill="#d9463a"/><circle cx="142" cy="347" r="6" fill="#e0574a"/><path d="M156 348l24-5" stroke="#dfe4e8" stroke-width="3" stroke-linecap="round"/></g>
<g><rect x="540" y="332" width="12" height="28" rx="4" fill="#e8c250"/><rect x="543" y="324" width="6" height="10" fill="#e8c250"/><rect x="570" y="340" width="28" height="20" rx="3" fill="#fff" stroke="#ddd"/><path d="M570 346H598M570 352H598" stroke="#d9463a" stroke-width="3"/></g>
<g id="kWork" transform="translate(410 360)"></g><g id="kFx2"></g>
</g>
<rect x="0" y="0" width="640" height="560" fill="url(#kv)" pointer-events="none"/>
</svg>`;
  }
  return {scene,cust,person,WORLDS};
})();
