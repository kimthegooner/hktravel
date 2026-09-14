/* Pure state helpers; also used by the regression tests. */
(function(root){
  const config = root.TRAVEL_CONFIG || {};
  const city = config.city || 'hongkong';
  const regions = config.regions || ['홍콩섬','구룡','근교','마카오'];
  const text = (v,n=300) => typeof v==='string' ? v.slice(0,n) : '';
  const coord = (v,max) => typeof v==='number' && Number.isFinite(v) && Math.abs(v)<=max;
  const id = () => 't-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8);
  function place(p){
    if(!p || !text(p.name) || !coord(p.lat,90) || !coord(p.lng,180)) return null;
    return {id:String(p.id).slice(0,80),name:text(p.name),lat:p.lat,lng:p.lng,desc:text(p.desc,2000),address:text(p.address,500),menus:Array.isArray(p.menus)?p.menus.map(x=>text(x,100)).filter(Boolean).slice(0,20):[],tags:Array.isArray(p.tags)?p.tags.map(x=>text(x,80)).slice(0,10):[],region:regions.includes(p.region)?p.region:regions[0],heesu:!!p.heesu,custom:true};
  }
  function day(i){if(config.city==='shanghai')return {title:'상하이',hotel:null,stops:[]};return {title:i<2?'홍콩':'마카오',hotel:i<2?{name:'침사추이 숙소 (미정)',lat:22.298,lng:114.172}:{name:'마카오 숙소 (미정)',lat:22.148,lng:113.559},stops:[]};}
  function fresh(){return {id:id(),city,name:config.tripName||'홍콩·마카오 여행',start:'',days:Array.from({length:4},(_,i)=>day(i)),custom:[]};}
  function normalize(input,base){
    if(input && (input.city||'hongkong')!==city)throw Error('다른 도시의 여행입니다. 해당 도시 화면에서 열어 주세요.');
    if(!input || !Array.isArray(input.days) || input.days.length<1 || input.days.length>30) throw Error('여행 일수는 1~30일이어야 합니다.');
    const custom=(Array.isArray(input.custom)?input.custom:[]).slice(0,500).map(place).filter(Boolean);
    const baseIds=new Set(base.map(p=>String(p.id))), unique=new Set();
    const clean=custom.filter(p=>!baseIds.has(p.id)&&!unique.has(p.id)&&unique.add(p.id));
    const valid=new Set([...baseIds,...clean.map(p=>p.id)]), seen=new Set();
    const days=input.days.map((d,i)=>({title:text(d?.title,50)||'Day '+(i+1),hotel:d?.hotel&&coord(d.hotel.lat,90)&&coord(d.hotel.lng,180)?{name:text(d.hotel.name)||'숙소',lat:d.hotel.lat,lng:d.hotel.lng}:null,stops:(Array.isArray(d?.stops)?d.stops:[]).flatMap(s=>{
      const sid=String(s?.id); if(!valid.has(sid)||seen.has(sid))return []; seen.add(sid);
      return [{id:sid,time:/^([01]\d|2[0-3]):[0-5]\d$/.test(s.time)?s.time:'',duration:Math.max(0,Math.min(1440,Number(s.duration)||0)),note:text(s.note,2000),visited:!!s.visited,mode:['walking','transit','driving'].includes(s.mode)?s.mode:'transit'}];
    })}));
    const start=text(input.start,10), dt=new Date(start+'T12:00:00Z');
    return {id:text(input.id,100)||id(),city,name:text(input.name,100)||'나의 여행',start:/^\d{4}-\d{2}-\d{2}$/.test(start)&&!isNaN(dt)&&dt.toISOString().slice(0,10)===start?start:'',days,custom:clean};
  }
  function legacy(saved,base){
    const t=fresh(), valid=new Set(base.map(p=>String(p.id)));
    t.days.forEach((d,i)=>{
      const key=String(i+1), order=Array.isArray(saved?.order?.[key])?saved.order[key].map(String):[];
      const assigned=Object.keys(saved?.assignment||{}).filter(k=>String(saved.assignment[k])===key && valid.has(k));
      const ids=[...new Set([...order.filter(k=>assigned.includes(k)),...assigned])];
      d.stops=ids.map(id=>({id}));
    });
    return normalize(t,base);
  }
  function fromHash(hash,base){
    const params=new URLSearchParams(hash.replace(/^#/,''));
    if(params.has('trip')){
      const raw=JSON.parse(decodeURIComponent(escape(atob(params.get('trip')))));
      if(raw.version!==2)throw Error('지원하지 않는 공유 형식입니다.');
      return normalize(raw.trip,base);
    }
    if(!['p','d1','d2','d3','d4'].some(k=>params.has(k)))return null;
    if(city!=='hongkong')throw Error('이 공유 링크는 홍콩 여행 화면에서 열어 주세요.');
    const t=fresh();t.days.forEach((d,i)=>d.stops=(params.get('d'+(i+1))||'').split('.').filter(Boolean).map(id=>({id})));
    return normalize(t,base);
  }
  function hash(trip){return 'trip='+encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify({version:2,trip})))));}
  function move(trip,sid,to,before=null){
    sid=String(sid);let stop={id:sid,time:'',duration:0,note:'',visited:false,mode:'transit'};
    trip.days.forEach(d=>{const old=d.stops.find(s=>s.id===sid);if(old)stop=old;d.stops=d.stops.filter(s=>s.id!==sid);});
    if(to===null)return;
    const list=trip.days[to].stops, pos=list.findIndex(s=>s.id===before);list.splice(pos<0?list.length:pos,0,stop);
  }
  function date(start,i){if(!start)return '';const d=new Date(start+'T12:00:00');d.setDate(d.getDate()+i);return `${d.getMonth()+1}.${d.getDate()} (${['일','월','화','수','목','금','토'][d.getDay()]})`;}
  root.Planner={id,day,fresh,normalize,legacy,fromHash,hash,move,date,place};
  if(typeof module!=='undefined')module.exports=root.Planner;
})(globalThis);
