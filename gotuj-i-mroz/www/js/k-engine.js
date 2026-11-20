/* Gotuj i Mroź 3.0 – silnik gotowania krok po kroku (czysta logika, bez DOM, w pełni testowalna). */
"use strict";
const KE=(()=>{
  const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
  const TITLES={setup:"Przygotuj stanowisko",wash:"Higiena",gather:"Przygotuj składniki",chop:"Praca na desce",tap:"Dodawanie",mix:"Mieszanie",balance:"Utrzymaj temperaturę",seq:"Kolejność",heat:"Obróbka cieplna",rest:"Odpoczynek",serve:"Podanie"};
  const SPEED={low:.6,med:1,high:1.5};
  const ingName=id=>(typeof K_ING!=="undefined"&&K_ING[id])?K_ING[id].n:id;

  function newRun(recipe,mode,opts){
    const run={r:recipe,mode:mode||"learn",opts:opts||null,hints:0,quizOk:0,quizBad:0,i:0,st:null,scores:[],weights:[],mistakes:[],finished:false,result:null};
    begin(run);return run;
  }
  /* im wyższa plansza, tym węższe okna i krótszy czas: trzeba lepiej wyczuć moment */
  function adjust(s,o){
    if(!o||!o.tight)return s;
    if(s.type==="heat"){const m=(s.window[0]+s.window[1])/2,half=(s.window[1]-s.window[0])/2*(1-o.tight);return Object.assign({},s,{window:[m-half,m+half],dur:s.dur/(1+(o.speed||0))});}
    if(s.type==="balance"){const m=(s.zone[0]+s.zone[1])/2,half=(s.zone[1]-s.zone[0])/2*(1-o.tight*.8);return Object.assign({},s,{zone:[m-half,m+half]});}
    return s;
  }
  function stepOf(run){return run.r.steps[run.i];}
  function begin(run){
    const s=adjust(stepOf(run),run.opts),st={type:s.type,s,ok:false,errs:0};
    switch(s.type){
      case "wash":case "mix":st.held=0;st.holding=false;break;
      case "gather":st.picked=[];break;
      case "chop":case "tap":st.count=0;break;
      case "balance":st.level=.2;st.inZone=0;st.out=0;st.t=0;st.holding=false;break;
      case "setup":case "seq":st.pos=0;break;
      case "heat":st.temp=null;st.started=false;st.p=0;st.burnt=false;st.taken=false;st.flipsLeft=(s.flips||[]).slice();st.flipMiss=0;st.flipOk=0;break;
      case "rest":st.t=0;break;
      case "serve":st.ok=false;break;
    }
    run.st=st;
  }
  function mistake(run,msg,why){run.st.errs++;run.mistakes.push({step:run.i,msg,why:why||stepOf(run).why||""});}

  function act(run,a,v){
    const st=run.st,s=st.s;if(!st||run.finished)return false;
    switch(a){
      case "prepare": {
        if(st.type!=="setup"||st.ok||s.tasks.slice(0,st.pos).some(task=>task.id===v))return false;
        const task=s.tasks[st.pos];
        if(task.id!==v){mistake(run,"Najpierw: "+task.label.toLowerCase()+".");return false;}
        st.pos++;
        st.ok=st.pos===s.tasks.length;
        return true;
      }
      case "item":{
        if(st.type==="gather"){
          if(st.picked.includes(v))return false;
          if(s.items.includes(v)){st.picked.push(v);if(st.picked.length===s.items.length)st.ok=true;return true;}
          mistake(run,"„"+ingName(v)+"” nie jest potrzebny w tym przepisie.","Czytaj przepis: używamy tylko wymienionych składników.");return false;
        }
        if(st.type==="seq"){
          if(st.ok)return false;
          if(v===s.order[st.pos]){st.pos++;if(st.pos>=s.order.length)st.ok=true;return true;}
          mistake(run,"Zła kolejność: teraz miało być „"+ingName(s.order[st.pos])+"”, a nie „"+ingName(v)+"”.");return false;
        }
        return false;
      }
      case "hit":if((st.type==="chop"||st.type==="tap")&&!st.ok){st.count++;if(st.count>=s.n)st.ok=true;return true;}return false;
      case "hold":if(["wash","mix","balance"].includes(st.type)&&!st.ok){st.holding=!!v;return true;}return false;
      case "temp":if(st.type==="heat"&&!st.started&&!st.taken){st.temp=v;return true;}return false;
      case "start":if(st.type==="heat"&&!st.started&&!st.taken&&st.temp){st.started=true;return true;}
        if(st.type==="heat"&&!st.started&&!st.temp){mistake(run,"Najpierw wybierz temperaturę.","Zawsze ustaw właściwą temperaturę, zanim zaczniesz gotować, smażyć lub piec.");}
        return false;
      case "flip":{
        if(st.type!=="heat"||!st.started||st.taken)return false;
        if(!st.flipsLeft.length){mistake(run,"Obracanie teraz nie jest potrzebne.","Obracaj mięso tylko wtedy, gdy spód jest już zrumieniony.");return false;}
        const f=st.flipsLeft[0];
        if(Math.abs(st.p-f)<=.12){st.flipsLeft.shift();st.flipOk++;return true;}
        st.flipsLeft.shift();st.flipMiss++;mistake(run,st.p<f?"Obrócono za wcześnie: spód nie zdążył się zrumienić.":"Obrócono za późno: spód mógł się przypalić.","Mięso obracamy w połowie smażenia, gdy spód jest już złoty.");return false;}
      case "take":{
        if(st.type!=="heat")return false;
        if(!st.started){mistake(run,"Nic jeszcze nie włożono.","");return false;}
        if(st.taken)return false;
        takeOut(run);return true;}
      case "skip":if(st.type==="rest"&&!st.ok){st.t=s.dur;st.ok=true;return true;}return false;
      case "serve":if(st.type==="serve"){st.ok=true;return true;}return false;
    }
    return false;
  }

  function takeOut(run){
    const st=run.st,s=st.s,[w0,w1]=s.window,p=st.p;let score;
    if(p<w0)score=.35+.5*(p/w0);
    else if(p<=w1){const mid=(w0+w1)/2,half=(w1-w0)/2;score=1-.15*Math.abs(p-mid)/half;}
    else score=Math.max(.2,.8-.6*(p-w1)/Math.max(.05,s.burn-w1));
    if(p<w0)run.mistakes.push({step:run.i,msg:s.reheat?"Wyjęto za wcześnie: potrawa nie zdążyła się podgrzać.":"Wyjęto za wcześnie: danie jest niedogotowane.",why:s.why});
    else if(p>w1)run.mistakes.push({step:run.i,msg:s.reheat?"Podgrzewano za długo: potrawa zaczęła wysychać.":"Wyjęto za późno: danie jest przegotowane lub przypieczone.",why:s.why});
    if(st.temp!==s.good){score*=.6;run.mistakes.push({step:run.i,msg:"Zła temperatura. Tutaj najlepsza jest: "+tempLabel(s,s.good)+".",why:s.why});}
    score*=Math.pow(.85,st.flipMiss)*(st.flipsLeft.length?Math.pow(.85,st.flipsLeft.length):1);
    if(st.flipsLeft.length)run.mistakes.push({step:run.i,msg:"Zapomniano obrócić.",why:"Mięso obracamy w połowie smażenia."});
    st.taken=true;st.ok=true;st.score=clamp(score,0,1);
  }
  function tempLabel(s,id){const t=(s.temps||[]).find(x=>x[0]===id);return t?t[1]:id;}

  function tick(run,dt){
    const st=run.st;if(!st||run.finished||st.ok)return;
    const s=st.s;
    switch(st.type){
      case "wash":case "mix":if(st.holding){st.held+=dt;if(st.held>=(s.need||s.dur)){st.held=(s.need||s.dur);st.ok=true;}}break;
      case "balance":{
        st.t+=dt;st.level=clamp(st.level+(st.holding?s.rise:-s.fall)*dt,0,1);
        if(st.level>=s.zone[0]&&st.level<=s.zone[1])st.inZone+=dt;else st.out+=dt;
        if(st.inZone>=s.need||st.t>=s.need*2.6){st.ok=true;}
        break;}
      case "heat":{
        if(!st.started||st.taken)break;
        st.p+=dt*(SPEED[st.temp]||1)/s.dur;
        if(st.p>=s.burn){st.p=s.burn;st.burnt=true;st.taken=true;st.ok=true;st.score=.15;run.mistakes.push({step:run.i,msg:"Przypalone! Danie spaliło się.",why:s.why});}
        break;}
      case "rest":st.t+=dt;if(st.t>=s.dur){st.t=s.dur;st.ok=true;}break;
    }
  }

  function stepScore(run){
    const st=run.st,s=st.s;
    switch(st.type){
      case "gather":return Math.max(.4,1-.15*st.errs);
      case "setup":case "seq":return Math.max(.3,1-.2*st.errs);
      case "balance":{const tot=st.inZone+st.out,ratio=tot?st.inZone/Math.max(st.inZone+st.out,s.need):0,sc=clamp(ratio*1.1,0,1);
        if(sc<.6)run.mistakes.push({step:run.i,msg:"Nie utrzymano właściwej temperatury (zważyło się lub zmąciło).",why:s.why});return sc;}
      case "heat":return st.score==null?.5:st.score;
      default:return 1;
    }
  }
  function weight(type){return type==="heat"||type==="balance"?2:type==="seq"||type==="gather"?1.2:1;}

  function next(run){
    if(run.finished||!run.st||!run.st.ok)return false;
    run.scores.push(stepScore(run));run.weights.push(weight(run.st.type));
    run.i++;
    if(run.i>=run.r.steps.length){finish(run);return true;}
    begin(run);return true;
  }
  function finish(run){
    const tw=run.weights.reduce((a,b)=>a+b,0);let pct=tw?run.scores.reduce((a,v,i)=>a+v*run.weights[i],0)/tw:0;
    /* zepsucie kluczowego etapu (obróbka cieplna, utrzymanie temperatury) psuje całe danie */
    const crit=run.scores.filter((v,i)=>run.weights[i]===2);if(crit.length)pct=Math.min(pct,Math.min(...crit)+.3);
    pct=clamp(pct-.04*(run.hints||0)+.03*(run.quizOk||0)-.05*(run.quizBad||0),0,1);
    const stars=pct>=.88?3:pct>=.7?2:pct>=.5?1:0;
    run.finished=true;
    const seen=new Set(),notes=[];
    for(const m of run.mistakes){const k=m.msg;if(seen.has(k))continue;seen.add(k);notes.push(m);}
    run.result={pct,stars,notes:notes.slice(0,5),payout:Math.round(run.r.price*(.5+.5*pct)*(stars===3?1.25:stars===2?1.1:1))};
  }
  function progress(run){const st=run.st,s=st.s;
    switch(st.type){
      case "wash":return st.held/s.need;case "mix":return st.held/s.dur;
      case "gather":return st.picked.length/s.items.length;
      case "chop":case "tap":return st.count/s.n;
      case "balance":return Math.min(1,st.inZone/s.need);
      case "setup":return st.pos/s.tasks.length;
      case "seq":return st.pos/s.order.length;
      case "heat":return clamp(st.p/s.burn,0,1);
      case "rest":return st.t/s.dur;
    }return st.ok?1:0;}
  /* podpowiedź kosztuje ułamek oceny, ale uczy: zwraca wskazówkę dla bieżącego etapu */
  function hint(run){
    if(!run||run.finished||!run.st||run.st.ok)return null;
    const st=run.st,s=st.s;let h=null;
    if(st.type==="gather"){const id=s.items.find(i=>!st.picked.includes(i));if(id)h={type:"item",id,why:s.why};}
    else if(st.type==="seq"){const id=s.order[st.pos];if(id)h={type:"item",id,why:s.why};}
    else if(st.type==="heat")h={type:"heat",temp:s.good,window:s.window,why:s.why};
    else if(st.type==="balance")h={type:"balance",zone:s.zone,why:s.why};
    if(h)run.hints=(run.hints||0)+1;
    return h;
  }
  /* pytanie szefa: dobra odpowiedź lekko podnosi ocenę, zła obniża i trafia do „czego się nauczyć” */
  function quiz(run,ok,msg,why){
    if(ok)run.quizOk=(run.quizOk||0)+1;else{run.quizBad=(run.quizBad||0)+1;run.mistakes.push({step:run.i,msg:msg||"Błędna odpowiedź na pytanie szefa.",why:why||""});}
  }
  return {newRun,act,tick,next,progress,TITLES,SPEED,tempLabel,ingName,stepOf,hint,quiz};
})();
