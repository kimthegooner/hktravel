'use strict';
/* 여행 플래너 화면. 홍콩(index.html)과 상하이(shanghai/index.html)가 함께 쓴다. 저장 형식은 planner.js 참고. */
const I={
  nav:'<path d="M3 11l18-8-8 18-2-8-8-2z"/>',check:'<path d="M5 12.5l4.5 4.5L19 7"/>',plus:'<path d="M12 5v14M5 12h14"/>',
  search:'<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',today:'<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  cal:'<rect x="3.5" y="5" width="17" height="15.5" rx="1.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',more:'<path d="M5 12h.01M12 12h.01M19 12h.01"/>',back:'<path d="M15 5l-7 7 7 7"/>',
  loc:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/><circle cx="12" cy="12" r="7"/>',down:'<path d="M6 9l6 6 6-6"/>',
  map:'<path d="M9 4L3 6.5v13.5L9 17.5l6 2.5 6-2.5V4l-6 2.5L9 4z"/><path d="M9 4v13.5M15 6.5V20"/>',share:'<path d="M12 3v12M7 8l5-5 5 5"/><path d="M5 13v7h14v-7"/>',
  ext:'<path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/>',grip:'<path d="M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01"/>',
  undo:'<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/>',expand:'<path d="M4 9V4h5M20 15v5h-5M4 4l6 6M20 20l-6-6"/>',
  train:'<rect x="5" y="3" width="14" height="13" rx="3"/><path d="M5 10h14M8 20l-2 2M16 20l2 2M9 13h.01M15 13h.01"/>',
  food:'<path d="M5 3v6a3 3 0 0 0 6 0V3M8 3v18M18 3c-2 2-3 5-3 9h4V3h-1ZM19 12v9"/>',photo:'<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M21 17l-5-5-9 7"/>'
};
const ic=n=>`<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${I[n]||''}</svg>`;
const FOOD_ICON=ic('food');
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const C=globalThis.TRAVEL_CONFIG||{}, FRIEND=C.friend||'희수', MAP_LABEL=C.mapLabel||'구글지도', REGIONS=C.regions||['홍콩섬','구룡','근교','마카오'];
const KEY=C.storageKey||'hkmo_planner_v2';
// 화면 상태(마지막에 본 날, 담을 날, 시트 높이)는 여행 데이터와 섞지 않고 따로 둔다.
const VIEW_KEY=KEY.replace(/_v\d+$/,'')+'_view_v1';
const located=p=>p&&Number.isFinite(p.lat)&&Number.isFinite(p.lng);
const available=p=>located(p)&&!p.unavailable;
const region=p=>p.region||C.defaultRegion||(p.lat<22.22&&p.lng<113.6?'마카오':p.color==='#27ae60'?'근교':p.lat>=22.292?'구룡':'홍콩섬');
const YOON=globalThis.YOONHWAN_RESTAURANTS||[];
const catalog=[...BASE_SPOTS.map(p=>({...p,id:String(p.id),region:region(p)})),...(C.restaurants||HEESU_RESTAURANTS),...YOON];
const FRIEND_RESTAURANTS=C.restaurants||HEESU_RESTAURANTS;
const MODES=[['transit','대중교통'],['walking','도보'],['driving','차량']];
const WEEK=['일','월','화','수','목','금','토'];

// 날짜 흉내(?today=YYYY-MM-DD, ?now=HH:MM)는 화면 확인용. 저장 데이터에는 영향이 없다.
const QS=new URLSearchParams(location.search);
const pad=n=>String(n).padStart(2,'0');
const TODAY=(()=>{const q=QS.get('today');if(/^\d{4}-\d{2}-\d{2}$/.test(q||''))return q;const d=new Date();return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;})();
const nowText=()=>{const q=QS.get('now');if(/^([01]\d|2[0-3]):[0-5]\d$/.test(q||''))return q;const d=new Date();return pad(d.getHours())+':'+pad(d.getMinutes());};

let db={version:2,active:'',trips:[]},current=0,pickDay=0,tab='today',detailId=null,filter='전체',friend='all',recOnly=false,query='',undo=[],showDone=false,openRow=null,findOpen=false,myPos=null,
  map,markerLayer,routeLayer,transitLayer,locationLayer,markers=new Map(),transit=false,toastTimer,view={days:{},pick:{},sheet:{}},sheetState={};
const isPC=()=>matchMedia('(min-width:901px)').matches;

/* ── 저장 ── */
function loadView(){try{const v=JSON.parse(localStorage.getItem(VIEW_KEY));if(v&&typeof v==='object')view={days:v.days||{},pick:v.pick||{},sheet:v.sheet||{},tab:v.tab};}catch{}}
function saveView(){try{localStorage.setItem(VIEW_KEY,JSON.stringify(view));}catch{}}
function rememberDay(){const t=trip();view.days[t.id]=current;view.pick[t.id]=pickDay;saveView();}
function toast(message,action){const el=$('#toast');el.replaceChildren(document.createTextNode(message));if(action){const b=document.createElement('button');b.textContent=action.label;b.onclick=()=>{el.classList.remove('show');action.fn();};el.append(b);}el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),action?6000:3500);}
function trip(){return db.trips.find(t=>t.id===db.active)||db.trips[0];}
function places(){return [...catalog,...trip().custom];}
function getPlace(id){return places().find(p=>p.id===id);}
function dayOf(id){return trip().days.findIndex(d=>d.stops.some(s=>s.id===id));}
function stopOf(id){const i=dayOf(id);return i<0?null:{day:i,stop:trip().days[i].stops.find(s=>s.id===id)};}
function save(){try{localStorage.setItem(KEY,JSON.stringify(db));$$('.save-status').forEach(e=>e.textContent='이 기기에 저장됨');}catch(e){$$('.save-status').forEach(e=>e.textContent='저장 실패 · 백업 필요');toast('기기에 저장하지 못했어요. 더보기에서 백업을 내려받아 주세요.');}}
function mutate(fn){undo.push(JSON.stringify(trip()));if(undo.length>30)undo.shift();fn();save();render();}
function undoLast(){if(!undo.length)return;const restored=JSON.parse(undo.pop());db.trips[db.trips.findIndex(t=>t.id===db.active)]=restored;save();render();toast('이전 상태로 되돌렸어요.');}
const undoAction={label:'되돌리기',fn:undoLast};
function todayIdx(){const t=trip();return Planner.todayIndex(t.start,t.days.length,TODAY);}
function pickStartDay(){const t=trip(),i=todayIdx(),saved=Number(view.days[t.id]);current=i>=0?i:Number.isInteger(saved)&&saved>=0&&saved<t.days.length?saved:0;const sp=Number(view.pick[t.id]);pickDay=i>=0?i:Number.isInteger(sp)&&sp>=0&&sp<t.days.length?sp:current;}
function initState(){
  try{const raw=JSON.parse(localStorage.getItem(KEY));if(raw?.version===2&&Array.isArray(raw.trips)){
    db.trips=raw.trips.flatMap(t=>{try{return [Planner.normalize(t,catalog)];}catch{return [];}});db.active=raw.active;
  }}catch{toast('저장 데이터를 읽지 못했어요. 백업 파일이 있으면 복원해 주세요.');}
  if(!db.trips.length){let t;try{const old=C.city?null:JSON.parse(localStorage.getItem('hkmo_planner_v1'));if(old?.assignment)t=Planner.legacy(old,catalog);}catch{}
    if(!t){t=Planner.fresh();if(C.initialStops){C.initialStops.forEach((ids,i)=>t.days[i].stops=ids.map(id=>({id})));}else{t.days[0].stops=['9','2','1','10'].map(id=>({id}));t.days[2].stops=['28','27','35'].map(id=>({id}));}t=Planner.normalize(t,catalog);}db.trips=[t];db.active=t.id;
  }
  if(!db.trips.some(t=>t.id===db.active))db.active=db.trips[0].id;
  importHash();save();loadView();pickStartDay();
  tab=todayIdx()>=0?'today':['today','plan','find','more'].includes(view.tab)?view.tab:'today';
  sheetState={...view.sheet};
}
function importHash(){if(!location.hash)return;try{
  const t=Planner.fromHash(location.hash,catalog);if(!t)return;
  const key=location.hash;
  let existing;try{existing=sessionStorage.getItem(KEY+'_shared_'+key);}catch{}
  if(existing&&db.trips.some(x=>x.id===existing)){db.active=existing;return;}
  t.id=Planner.id();t.name+=' · 공유받음';db.trips.push(t);db.active=t.id;
  try{sessionStorage.setItem(KEY+'_shared_'+key,t.id);}catch{}
  try{history.replaceState(null,'',location.pathname+location.search);}catch{}
  toast('공유 일정을 별도 여행으로 열었어요.');
}catch{toast('공유 링크를 읽지 못했어요. 기존 일정은 유지됩니다.');}}

/* ── 거리·길찾기·날짜 ── */
const google=p=>p.googleUrl|| (C.placeLink?C.placeLink(p):'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(p.address?`${p.englishName||p.name} ${p.address}`:`${p.lat},${p.lng}`));
// a가 없으면 출발지를 비워 둔다 → 구글지도·고덕지도가 지금 위치에서 출발한다.
function directions(a,b,mode='transit'){if(C.directions)return C.directions(a,b,mode);const params=new URLSearchParams({api:'1',destination:b.address?`${b.englishName||b.name} ${b.address}`:`${b.lat},${b.lng}`,travelmode:mode});if(a)params.set('origin',`${a.lat},${a.lng}`);return 'https://www.google.com/maps/dir/?'+params;}
const external=(url,label,cls='')=>`<a class="${cls}" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${label}</a>`;
function km(a,b){if(!located(a)||!located(b))return NaN;const R=6371,r=x=>x*Math.PI/180,dl=r(b.lat-a.lat),dg=r(b.lng-a.lng);const h=Math.sin(dl/2)**2+Math.cos(r(a.lat))*Math.cos(r(b.lat))*Math.sin(dg/2)**2;return 2*R*Math.asin(Math.sqrt(h));}
const kmTxt=d=>!Number.isFinite(d)?'':d<0.01?'바로 옆':d<1?Math.round(d*100)*10+'m':d.toFixed(1)+'km';
const walkMin=d=>Math.max(2,Math.round(d*1.3/4.5*60));
function legText(a,b,mode){const d=km(a,b);if(!Number.isFinite(d))return MODES.find(m=>m[0]===mode)?.[1]||'';if(mode==='walking')return `도보 ≈${walkMin(d)}분 · ${kmTxt(d)}`;return `${mode==='driving'?'차량':'대중교통'} · ${kmTxt(d)}`;}
function dateParts(start,i){if(!start)return null;const d=new Date(start+'T12:00:00');d.setDate(d.getDate()+i);return {md:`${d.getMonth()+1}.${d.getDate()}`,dd:String(d.getDate()),w:WEEK[d.getDay()]};}
function daySub(i){const d=trip().days[i];if(i===todayIdx())return '오늘';const t=d.title||'';const m=/도착\s*(\d{1,2}:\d{2})/.exec(t);if(m&&!C.city)return '공항 도착 '+m[1];if(!C.city&&/→/.test(t))return '페리';return t;}
function dayShort(i){const p=dateParts(trip().start,i);return `D${i+1}${p?` · ${p.md} ${p.w}`:''}`;}
function dayLong(i){const d=trip().days[i];return `${dayShort(i)} ${d.title?'· '+d.title:''}`.trim();}
function thumb(p,cls='thumb'){return p.img?`<img class="${cls}" src="${esc(p.img)}" alt="" loading="lazy" referrerpolicy="no-referrer">`:`<span class="${cls}">${p.heesu?(p.menus?.[0]?esc(p.menus[0].split(' · ')[0]):FOOD_ICON):ic('photo')}</span>`;}
function fixImages(root){root.querySelectorAll('img').forEach(img=>img.onerror=()=>{const el=document.createElement('span');el.className=img.className;el.innerHTML=ic('photo');img.replaceWith(el);});}
const timeCell=t=>t?`<span class="t mono">${esc(t)}</span>`:'<span class="t untimed">미정</span>';
function dayStops(i=current){return trip().days[i].stops.map(s=>({s,p:getPlace(s.id)})).filter(x=>x.p);}

/* ── 담기 · 빼기 · 옮기기 ── */
function addTo(id,day,before=null){const p=getPlace(id);if(!available(p))return toast('지점과 영업 여부를 먼저 확인해 주세요.');
  const from=dayOf(id);if(from===day)return toast(`이미 D${day+1}에 담겨 있어요.`);
  mutate(()=>Planner.assign(trip(),id,day,before));
  toast(from>=0?`D${from+1} → D${day+1}로 옮겼어요.`:`D${day+1}에 담았어요.`,undoAction);}
function removeStop(id){const from=dayOf(id);if(from<0)return;mutate(()=>Planner.move(trip(),id,null));toast(`D${from+1}에서 뺐어요 · 찾기에 그대로 있어요.`,undoAction);}
function toggleVisited(id){const x=stopOf(id);if(!x)return;const was=x.stop.visited;mutate(()=>{stopOf(id).stop.visited=!was;});toast(was?'방문 체크를 지웠어요.':`${getPlace(id).name} 다녀왔어요.`,undoAction);}
function confirmBox(title,text,okLabel,onOk){openDialog(title,`<p>${esc(text)}</p><div class="confirm-actions"><button type="button" id="confirm-no">취소</button><button type="button" class="primary" id="confirm-ok">${esc(okLabel)}</button></div>`);$('#confirm-no').onclick=close;$('#confirm-ok').onclick=()=>{close();onOk();};}
function askMove(id,to){const from=dayOf(id);confirmBox('다른 날에 담긴 곳이에요',`${getPlace(id).name}은(는) 지금 D${from+1}에 있어요. D${to+1}로 옮길까요?`,`D${to+1}로 옮기기`,()=>addTo(id,to));}

/* ── 지도 ── */
function initMap(){if(!window.L){$('#map-fallback').hidden=false;document.body.classList.add('no-map');return;}
  map=L.map('map',{zoomControl:true,zoomAnimation:false,fadeAnimation:false,markerZoomAnimation:false}).setView(C.center||[22.29,114.165],13);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map);
  markerLayer=L.layerGroup().addTo(map);routeLayer=L.layerGroup().addTo(map);transitLayer=L.layerGroup();locationLayer=L.layerGroup().addTo(map);
  Object.values(mtrLines).forEach(line=>{L.polyline(line.stations.map(s=>[s.lat,s.lng]),{color:line.color,weight:4,opacity:.45}).addTo(transitLayer);line.stations.forEach(s=>L.circleMarker([s.lat,s.lng],{radius:3,color:line.color,fillColor:'#fff',fillOpacity:1,weight:2}).bindTooltip(esc(s.name)).addTo(transitLayer));});
  [ferryRoute,macauFerryRoute].filter(p=>p.length).forEach(p=>L.polyline(p,{color:'#569caa',weight:3,dashArray:'7 7'}).bindTooltip('페리 항로 참고').addTo(transitLayer));
  new ResizeObserver(()=>map.invalidateSize()).observe($('#map-panel'));
  map.on('zoomend moveend resize',layoutFoodLabels);
}
const cssVar=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const pinIcon=(cls,label='')=>L.divIcon({className:'',html:`<div class="pin ${cls}">${esc(label)}</div>`,iconSize:null});
function foodMode(){return filter==='친구 맛집';}
function mapMode(){return (tab==='find'&&!isPC())||(isPC()&&findOpen)?'find':'day';}
function nextStop(i=current){return dayStops(i).find(x=>!x.s.visited)||null;}
function drawMap(fit=false){if(!map)return;markerLayer.clearLayers();routeLayer.clearLayers();markers.clear();const bounds=[];
  if(mapMode()==='find'){
    findList().forEach((p,i)=>{if(!located(p))return;const added=dayOf(p.id)===pickDay;if(filter!=='근처'||i<12)bounds.push([p.lat,p.lng]);
      const m=L.marker([p.lat,p.lng],{icon:pinIcon(foodMode()?'food':added?'added':'cand',foodMode()?String(i+1):''),zIndexOffset:added?200:0}).addTo(markerLayer).bindPopup(()=>popup(p),{maxWidth:280});markers.set(p.id,m);
      if(foodMode())m.bindTooltip(`<b>${i+1}. ${esc(p.name)}</b><small>${esc((p.menus||[]).join(' · '))}</small>`,{permanent:true,direction:'top',offset:[0,-16],opacity:1,className:'food-label',interactive:true});});
  }else{
    const d=trip().days[current],list=dayStops(),nx=nextStop(),line=[];
    if(d.hotel){line.push([d.hotel.lat,d.hotel.lng]);L.marker([d.hotel.lat,d.hotel.lng],{icon:pinIcon('hotel','⌂')}).bindPopup(esc(d.hotel.name)).addTo(markerLayer);}
    list.forEach(({s,p},i)=>{if(!located(p))return;line.push([p.lat,p.lng]);const isNext=nx&&nx.s.id===s.id;
      const m=L.marker([p.lat,p.lng],{icon:pinIcon(isNext?'label':s.visited?'done':'',isNext?`${s.time?s.time+' ':''}${p.name}`:s.visited?'':String(i+1)),zIndexOffset:isNext?1000:s.visited?-100:0}).addTo(markerLayer).bindPopup(()=>popup(p),{maxWidth:280});markers.set(p.id,m);});
    if(line.length>1)L.polyline(d.hotel?[...line,line[0]]:line,{color:cssVar('--route')||'#0e5d5f',weight:4,opacity:.9}).addTo(routeLayer);
    bounds.push(...line);
  }
  if(detailId){const p=getPlace(detailId);if(located(p)){markers.get(p.id)?.remove();const m=L.marker([p.lat,p.lng],{icon:pinIcon('label',p.name),zIndexOffset:2000}).addTo(markerLayer).bindPopup(()=>popup(p),{maxWidth:280});markers.set(p.id,m);}}
  if(fit&&!detailId&&bounds.length)fitTo(bounds);
  requestAnimationFrame(layoutFoodLabels);
}
function mapPadding(){if(isPC())return {tl:[440,90],br:[150,40]};const h=innerHeight-sheetTop();return {tl:[24,76],br:[24,Math.min(h,innerHeight*.6)+16]};}
function fitTo(bounds){if(!map||$('#map-panel').offsetWidth===0)return;const pd=mapPadding();map.invalidateSize();map.fitBounds(L.latLngBounds(bounds),{paddingTopLeft:pd.tl,paddingBottomRight:pd.br,maxZoom:15,animate:false});}
// 지도 위 보이는 영역(시트·패널 밖) 가운데로 장소를 옮긴다.
function centerOn(p,zoom=16){if(!map||!located(p))return;map.invalidateSize();map.setView([p.lat,p.lng],zoom,{animate:false});const size=map.getSize();
  if(isPC()){const left=detailId||findOpen?840:410;map.panBy([-(left+(size.x-left)/2-size.x/2),0],{animate:false});}
  else{const top=sheetTop();map.panBy([0,size.y/2-Math.max(60,top/2)],{animate:false});}}
// 시트가 움직이는 중에도 «도착할» 높이로 계산한다.
function sheetTop(){const s=activeSheet();if(!s)return innerHeight;const hs=sheetHeights(),st=sheetState[sheetKey()]||defaultState(),bar=detailId?0:($('.tabbar').offsetHeight||64);return innerHeight-bar-(hs[st]||hs.half);}
function popup(p){const div=document.createElement('div');div.className='popup-body';
  div.innerHTML=`<strong class="popup-title">${esc(p.name)}</strong><span class="popup-meta">${esc(region(p))}${p.heesu?' · '+esc(p.recommender||FRIEND)+'의 '+esc(p.verdict||'추천'):p.must?' · 필수':''}</span>${p.status?`<p class="place-status">${esc(p.status)}</p>`:''}${p.menus?.length?`<p><b>주요 메뉴</b><br>${esc(p.menus.join(' · '))}</p>`:''}${p.address?`<p class="help">${esc(p.address)}</p>`:''}${p.branchNote?`<p class="help">${esc(p.branchNote)}</p>`:''}<p>${external(google(p),esc(MAP_LABEL)+'에서 보기 ↗')}</p>${p.source?`<p class="help">${external(p.source,'주소 출처 ↗')}</p>`:''}`;
  const neighbors=catalog.filter(x=>x.id!==p.id&&located(x)&&x.lat===p.lat&&x.lng===p.lng);if(neighbors.length){const group=document.createElement('p');group.className='help';group.textContent='같은 건물의 추천: ';neighbors.forEach(x=>{const b=document.createElement('button');b.textContent=x.name;b.onclick=()=>openDetail(x.id);group.append(b);});div.append(group);}
  const from=dayOf(p.id),day=pickDay,state=document.createElement('span'),acts=document.createElement('div');state.className='popup-state';acts.className='popup-actions';
  const btn=(label,fn,cls='')=>{const b=document.createElement('button');b.textContent=label;if(cls)b.className=cls;b.onclick=()=>{map?.closePopup();fn();};acts.append(b);return b;};
  if(!available(p)){state.textContent=p.unavailable?'영업 확인 후 방문':'지점 위치 확인 필요';}
  else if(from===day){state.textContent=`D${day+1}에 담김 ✓`;btn('빼기',()=>removeStop(p.id));btn('다른 날로',()=>moveDialog(p.id));}
  else if(from>=0){state.textContent=`D${from+1}에 담겨 있어요`;btn(`D${day+1}로 옮기기`,()=>addTo(p.id,day),'go');btn('다른 날로',()=>moveDialog(p.id));}
  else btn(`D${day+1}에 담기`,()=>addTo(p.id,day),'go');
  btn('자세히',()=>openDetail(p.id));
  div.append(state,acts);return div;}
function layoutFoodLabels(){
  if(!map||!foodMode()||mapMode()!=='find')return;
  const used=[],size=map.getSize(),topSafe=isPC()?20:80;
  markers.forEach(marker=>{
    const tip=marker.getTooltip(),el=tip?.getElement();if(!el)return;
    const point=map.latLngToContainerPoint(marker.getLatLng());
    const width=el.offsetWidth,height=el.offsetHeight;
    if(point.x<0||point.y<0||point.x>size.x||point.y>size.y){el.style.visibility='hidden';return;}
    const positions=[[0,-20],[-width/2-22,-10],[width/2+22,-10],[0,height+27],[-width/2-22,-height-18],[width/2+22,-height-18]];
    let chosen=null;
    for(const [dx,dy] of positions){
      const box={x:point.x+dx-width/2,y:point.y+dy-height,w:width,h:height};
      if(box.x<8||box.y<topSafe||box.x+width>size.x-8||box.y+height>size.y-45)continue;
      if(!used.some(b=>box.x<b.x+b.w+5&&box.x+box.w+5>b.x&&box.y<b.y+b.h+5&&box.y+box.h+5>b.y)){chosen={box,dx,dy};break;}
    }
    el.style.visibility=chosen?'visible':'hidden';
    if(chosen){used.push(chosen.box);tip.options.offset=L.point(chosen.dx,chosen.dy);tip.setLatLng(marker.getLatLng());}
  });
}

/* ── ① 오늘 ── */
function nearRef(){if(myPos)return {point:myPos,label:'내 위치 기준'};const nx=nextStop();if(nx&&located(nx.p))return {point:nx.p,label:`다음 장소(${nx.p.name}) 기준`};const h=trip().days[current].hotel;if(h)return {point:h,label:'숙소 기준'};return null;}
function nearbyPlaces(n=30){const ref=nearRef();if(!ref)return [];const inDay=new Set(trip().days[current].stops.map(s=>s.id));return places().filter(p=>available(p)&&!inDay.has(p.id)).map(p=>({p,d:km(ref.point,p)})).filter(x=>Number.isFinite(x.d)).sort((a,b)=>a.d-b.d).slice(0,n);}
function renderToday(){const t=trip(),d=t.days[current],list=dayStops(),nx=list.find(x=>!x.s.visited)||null,ti=todayIdx(),isToday=ti===current,done=list.filter(x=>x.s.visited);let h='';
  const ph=Planner.phase(t.start,t.days.length,TODAY);h+=`<div class="days pc-only" aria-label="여행 날짜">${dayTabs()}</div>`;
  if(ti<0&&ph==='before'){const days=Math.round((Date.parse(t.start)-Date.parse(TODAY))/864e5);h+=`<p class="before-trip">여행까지 ${days}일 · 지금은 D${current+1} 일정을 미리 보고 있어요</p>`;}
  if(nx){const i=list.indexOf(nx),prev=i?list[i-1].p:d.hotel;
    h+=`<div class="next"><div class="kicker">${nx.s.time?`<b class="mono">${esc(nx.s.time)}</b>`:''}<span>다음 장소${isToday?' · 지금 '+nowText():''}</span>${nx.s.note?`<span class="memo">메모: ${esc(nx.s.note)}</span>`:''}</div>
    <button class="next-row" data-open="${esc(nx.p.id)}">${thumb(nx.p)}<div><h2>${esc(nx.p.name)}</h2><p>${esc([prev?legText(prev,nx.p,nx.s.mode):'',nx.s.duration?nx.s.duration+'분 머물기':''].filter(Boolean).join(' · ')||region(nx.p))}</p></div></button>
    <div class="acts">${external(directions(null,nx.p,nx.s.mode),ic('nav')+'내 위치에서 길찾기','btn pri')}<button class="btn" data-visit="${esc(nx.p.id)}">${ic('check')}다녀왔어요</button></div></div>`;
  }else if(list.length){h+=`<div class="next-empty"><div class="kicker"><span>D${current+1} · ${list.length}곳 모두 다녀왔어요</span></div><h2>오늘 일정 끝</h2><p>${d.hotel?esc(d.hotel.name)+'(으)로 돌아갈 시간이에요.':'수고했어요.'}</p><div class="acts">${d.hotel?external(directions(null,d.hotel),ic('nav')+'숙소로 길찾기','btn pri'):''}<button class="btn" data-go="find">${ic('search')}더 갈 곳 찾기</button></div></div>`;}
  else{h+=`<div class="next-empty"><div class="kicker"><span>D${current+1}${d.title?' · '+esc(d.title):''}</span></div><h2>아직 담긴 곳이 없어요</h2><p>찾기에서 가고 싶은 곳을 담아 보세요.</p><div class="acts"><button class="btn" data-go="find">${ic('search')}장소 찾기</button><button class="btn" data-go="plan">${ic('cal')}일정 보기</button></div></div>`;}
  if(list.length)h+=`<div class="progress"><span>${isToday?'오늘':'D'+(current+1)} ${list.length}곳 · <b>${done.length}곳</b> 다녀옴</span><div class="bar" aria-hidden="true">${list.map(x=>`<i class="${x.s.visited?'on':x===nx?'nx':''}"></i>`).join('')}</div></div>`;
  const near=nearbyPlaces(2);if(near.length)h+=`<button class="nearby" data-go="near"><span>근처 갈 만한 곳</span><span class="mono">${near.map(x=>esc(x.p.name)+' '+kmTxt(x.d)).join(' · ')}</span>${ic('back')}</button>`;
  let rows='';const ni=nx?list.indexOf(nx):list.length;
  list.slice(ni+1).forEach((x,k)=>{if(x.s.visited)return;const prev=list[ni+k].p;rows+=`<li>${timeCell(x.s.time)}<button class="open" data-open="${esc(x.p.id)}">${esc(x.p.name)}<span class="sub">${esc([region(x.p),legText(prev,x.p,x.s.mode)].filter(Boolean).join(' · '))}</span></button><button class="chk" data-visit="${esc(x.p.id)}" aria-pressed="false" aria-label="${esc(x.p.name)} 다녀왔어요"><span>${ic('check')}</span></button></li>`;});
  if(done.length){rows+=`<li class="done"><span class="t">다녀옴</span><button class="open" data-toggle-done aria-expanded="${showDone}">${esc(done.map(x=>x.p.name).join(' · '))}<span class="sub">${done.length}곳 ${showDone?'펼쳐 둠 · 접기':'접어 둠 · 펼치기'}</span></button><span class="chk" aria-hidden="true" style="color:var(--route)"><span style="background:var(--soft);border-color:transparent">${ic('check')}</span></span></li>`;
    if(showDone)done.forEach(x=>{rows+=`<li class="done">${timeCell(x.s.time)}<button class="open" data-open="${esc(x.p.id)}">${esc(x.p.name)}<span class="sub">${esc(region(x.p))}</span></button><button class="chk" data-visit="${esc(x.p.id)}" aria-pressed="true" aria-label="${esc(x.p.name)} 방문 체크 지우기"><span>${ic('check')}</span></button></li>`;});}
  if(list.length&&d.hotel)rows+=`<li class="home"><span class="t">숙소</span><span class="open" style="cursor:default">${esc(d.hotel.name)}<span class="sub">돌아가기</span></span>${external(directions(null,d.hotel),'길찾기 ↗')}</li>`;
  if(rows)h+=`<ol class="rows">${rows}</ol>`;
  $('#view-today').innerHTML=h;fixImages($('#view-today'));}

/* ── ② 일정 ── */
function dayTabs(){const t=trip();return t.days.map((d,i)=>{const p=dateParts(t.start,i);return `<button data-day="${i}" aria-current="${current===i}" title="${esc(d.title)}"><b>${p?esc(p.dd+' '+p.w):'D'+(i+1)}</b>${esc(daySub(i)||'D'+(i+1))}</button>`;}).join('');}
function renderPlan(){const t=trip(),d=t.days[current],list=dayStops();
  $('#day-tabs').innerHTML=dayTabs();
  let h=`<div class="plan-head"><div><h3>${esc(d.title||'D'+(current+1))}</h3><p>${d.hotel?'숙소 '+esc(d.hotel.name)+' · ':''}${list.length}곳 · ${list.filter(x=>x.s.visited).length}곳 다녀옴</p></div><button class="text-btn" id="day-edit">숙소·날짜 설정</button></div><ol class="plist">`;
  h+=`<li class="hotel-row-wrap"><div class="hotel-row"><span class="h">⌂</span><span>${esc(d.hotel?.name||'숙소를 정해 주세요')}<small>출발</small></span><button class="text-btn" id="hotel-edit">변경</button></div></li>`;
  list.forEach(({s,p},i)=>{const prev=i?list[i-1].p:d.hotel,open=openRow===s.id;
    h+=`<li class="${s.visited?'visited':''}${open?' open':''}${detailId===s.id?' sel':''}" data-id="${esc(s.id)}"><div class="prow" data-row>
    <button class="handle" data-drag aria-label="${esc(p.name)} 끌어서 순서 바꾸기">${ic('grip')}</button>${timeCell(s.time)}${thumb(p)}
    <div style="min-width:0"><span class="nm">${esc(p.name)}</span><span class="sub">${s.visited?'<span>다녀옴</span>':''}${prev?`<select data-mode="${esc(s.id)}" aria-label="${esc(p.name)}까지 이동수단">${MODES.map(([v,l])=>`<option value="${v}" ${s.mode===v?'selected':''}>${l}</option>`).join('')}</select>${external(directions(prev,p,s.mode),'길찾기 ↗')}<span class="mono">${esc(kmTxt(km(prev,p)))}</span>`:''}</span></div>
    <span class="dur mono">${s.duration?s.duration+'분':''}</span></div>
    ${open?`<div class="row-tools">${s.note?`<p class="note">${esc(s.note)}</p>`:''}<button data-act="edit">시간·메모</button><button data-act="up" aria-label="위로" ${i===0?'disabled':''}>↑</button><button data-act="down" aria-label="아래로" ${i===list.length-1?'disabled':''}>↓</button><button data-act="move">다른 날로</button><button data-act="visited" aria-pressed="${s.visited}">${s.visited?'✓ 다녀옴':'방문 체크'}</button><button data-act="detail">자세히</button>${external(google(p),esc(MAP_LABEL)+' ↗')}<button data-act="remove" class="warn">빼기</button></div>`:''}</li>`;});
  if(list.length&&d.hotel)h+=`<li class="hotel-row-wrap"><div class="hotel-row"><span class="h">⌂</span><span>숙소로 돌아가기<small>${esc(d.hotel.name)}</small></span>${external(directions(list[list.length-1].p,d.hotel),'길찾기 ↗')}</div></li>`;
  h+='</ol>';
  if(!list.length)h+=`<div class="empty"><h3>비워 둔 하루, 어디로 갈까요?</h3><p>찾기에서 가고 싶은 곳을 담아 보세요.</p><button class="btn" data-go="find">${ic('search')}장소 찾기</button></div>`;
  $('#plan-list').innerHTML=h;fixImages($('#plan-list'));}

/* ── ③ 찾기 ── */
function filterTabs(){return ['전체','근처',...(C.exploreFilters||[]),...REGIONS.filter(r=>r!=='지점 미정'),'친구 맛집','먹거리','필수',...(C.city?[]:['아이 동반'])];}
function findList(){let all=places();
  if(foodMode())all=all.filter(p=>p.heesu&&(friend==='all'||(friend==='yoonhwan'?p.recommender==='윤환':p.recommender!=='윤환'))&&(!recOnly||(!p.unavailable&&p.verdict!=='취향 아님'&&p.verdict!=='참고')));
  else if(filter!=='전체'&&filter!=='근처')all=all.filter(p=>region(p)===filter||p.tags?.includes(filter)||(filter==='필수'&&p.must)||(filter==='먹거리'&&(p.heesu||p.tags?.includes('먹거리')))||(filter==='아이 동반'&&p.tags?.some(t=>/아이★{4}/.test(t))));
  const q=query.trim().toLowerCase();if(q)all=all.filter(p=>[p.name,p.englishName,p.desc,p.address,region(p),...(p.tags||[]),...(p.menus||[])].join(' ').toLowerCase().includes(q));
  if(filter==='근처'){const ref=nearRef(),inDay=new Set(trip().days[current].stops.map(s=>s.id));if(ref)all=all.filter(p=>located(p)&&!inDay.has(p.id)).map(p=>({p,d:km(ref.point,p)})).sort((a,b)=>a.d-b.d).map(x=>x.p);}
  return all;}
function addButton(p){if(!available(p))return `<button class="add off" disabled aria-label="${esc(p.name)}: ${p.unavailable?'영업':'지점'} 확인 필요">확인<br>필요</button>`;
  const from=dayOf(p.id);if(from===pickDay)return `<button class="add on" data-add="${esc(p.id)}" aria-label="D${pickDay+1}에 담김, 누르면 빼기">D${pickDay+1}<br>✓</button>`;
  if(from>=0)return `<button class="add other" data-add="${esc(p.id)}" aria-label="D${from+1}에 담김, D${pickDay+1}로 옮기기">D${from+1}</button>`;
  return `<button class="add" data-add="${esc(p.id)}" aria-label="D${pickDay+1}에 담기">${ic('plus')}</button>`;}
function renderFind(){const t=trip(),list=findList(),friends=places().filter(p=>p.heesu);
  $('#pick-label').textContent=dayLong(pickDay);
  $('#pick-days').innerHTML=t.days.map((d,i)=>{const p=dateParts(t.start,i);return `<button data-pick="${i}" aria-pressed="${pickDay===i}"><b>D${i+1}</b>${esc(p?p.md+' '+p.w:d.title)}</button>`;}).join('');
  $('#filters').innerHTML=filterTabs().map(f=>`<button role="tab" data-filter="${esc(f)}" aria-selected="${filter===f}">${esc(f)}${f==='전체'?`<small>${places().length}</small>`:f==='친구 맛집'?`<small>${friends.length}</small>`:''}</button>`).join('');
  $('#friend-switch').hidden=!foodMode();$('#friend-all').hidden=!YOON.length;
  $('#friend-all').setAttribute('aria-pressed',friend==='all');$('#heesu-btn').setAttribute('aria-pressed',friend==='heesu'||(!YOON.length&&foodMode()));$('#rec-only').setAttribute('aria-pressed',recOnly);
  $('.heesu-count').textContent=FRIEND_RESTAURANTS.length;if($('#yoonhwan-btn')){$('#yoonhwan-btn').setAttribute('aria-pressed',friend==='yoonhwan');$('#yoonhwan-count').textContent=YOON.length;}
  const ref=filter==='근처'?nearRef():null;
  $('#list-heading').innerHTML=filter==='근처'?`<span>${esc(ref?ref.label:'기준 위치 없음')} · 가까운 순</span>${myPos?'':'<button data-locate>내 위치로 보기</button>'}`:`<span>${foodMode()?(friend==='yoonhwan'?'윤환':friend==='heesu'||!YOON.length?FRIEND:'친구')+'의 맛집':'여행 후보지'} ${list.length}곳</span><span>＋를 누르면 D${pickDay+1}에 담겨요</span>`;
  const rows=list.map(p=>{const dist=ref?kmTxt(km(ref.point,p)):'';const who=p.heesu?`<span class="who">${esc(p.recommender||FRIEND)} 추천</span> · `:'';
    return `<li><button class="open" data-open="${esc(p.id)}">${thumb(p)}<div style="min-width:0"><div class="nm"><span>${esc(p.name)}</span>${p.must?'<em>필수</em>':''}</div><p>${dist?`<span class="mono">${esc(dist)}</span> · `:''}${who}${esc(p.status||(p.menus?.length?p.menus.join(' · '):p.desc)||region(p))}</p></div></button>${addButton(p)}</li>`;}).join('');
  $('#place-list').innerHTML=rows||`<li class="empty" style="display:block;border:0"><h3>${foodMode()&&!FRIEND_RESTAURANTS.length?esc(FRIEND)+'의 맛집을 기다리고 있어요':'찾는 장소가 없어요'}</h3><p>다른 검색어나 분류를 골라 보세요.</p></li>`;
  fixImages($('#place-list'));
  $('#find').classList.toggle('open',findOpen||!isPC());$('#find-toggle').setAttribute('aria-expanded',findOpen);$('#find-toggle').textContent=findOpen?'접기':'목록';}

/* ── ⑤ 상세 ── */
function renderDetail(){const el=$('#detail-body');if(!detailId){el.innerHTML='';return;}const p=getPlace(detailId);if(!p){detailId=null;return;}
  const x=stopOf(p.id),credit=/wikimedia/.test(p.img||'')?'<small>사진 Wikimedia Commons</small>':'';
  const meta=[esc(region(p)),p.must?'<em>필수</em>':'',p.heesu?esc((p.recommender||FRIEND)+'의 '+(p.verdict||'추천')):'',...(p.tags||[]).filter(t=>!/추천$/.test(t)).slice(0,3).map(esc)].filter(Boolean).join(' · ');
  let add;if(!available(p))add=`<button class="btn" disabled>${p.unavailable?'영업 확인':'지점 확인'}</button>`;else if(x)add=`<button class="btn" data-act="move" aria-label="D${x.day+1}에 담김, 다른 날로">D${x.day+1} ✓</button>`;else add=`<button class="btn" data-act="add">${ic('plus')}D${pickDay+1}</button>`;
  const third=x?`<button class="btn" data-act="visited" aria-pressed="${x.stop.visited}">${ic('check')}${x.stop.visited?'다녀옴':'체크'}</button>`:`<button class="btn" data-act="map">${ic('map')}지도</button>`;
  const near=places().filter(q=>q.id!==p.id&&located(q)).map(q=>({q,d:km(p,q)})).filter(o=>o.d<5).sort((a,b)=>a.d-b.d).slice(0,3);
  let h=`<div class="photo">${p.img?`<img src="${esc(p.img)}" alt="${esc(p.name)}" referrerpolicy="no-referrer"><button data-act="photo" aria-label="사진 크게 보기"></button>`:`<span class="thumb">${p.heesu?FOOD_ICON:ic('photo')}</span>`}${credit}</div>
  <div class="dh"><h2>${esc(p.name)}</h2><p>${meta}</p></div>
  <div class="acts3">${external(directions(null,p,x?.stop.mode||'transit'),ic('nav')+'길찾기','btn pri')}${add}${third}</div>`;
  if(x)h+=`<div class="info"><div><span>담긴 날</span><span class="day-acts"><b style="align-self:center">${esc(dayLong(x.day))}</b></span></div><div><span></span><span class="day-acts"><button data-act="move">다른 날로</button><button data-act="remove">빼기</button></span></div><button data-act="edit"><span>도착</span><b class="mono">${esc(x.stop.time||'시간 미정')}${x.stop.duration?' · '+x.stop.duration+'분':''}</b></button><button data-act="edit"><span>메모</span><b>${esc(x.stop.note||'메모 쓰기')}</b></button></div>`;
  if(p.status)h+=`<p class="desc place-status">${esc(p.status)}</p>`;
  if(p.desc)h+=`<p class="desc">${esc(p.desc)}</p>`;
  const facts=[p.menus?.length?['주요 메뉴',esc(p.menus.join(' · '))]:null,p.address?['주소',esc(p.address)]:null,p.branchNote?['지점 안내',esc(p.branchNote)]:null,p.coordinateNote?['위치 참고',esc(p.coordinateNote)]:null,p.source?['출처',external(p.source,'주소 출처 ↗')]:null].filter(Boolean);
  if(facts.length)h+=`<dl class="facts">${facts.map(([k,v])=>`<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>`;
  h+=`<div class="links">${external(google(p),ic('ext')+esc(MAP_LABEL)+'에서 보기')}${located(p)?`<button data-act="map">${ic('map')}지도에서 보기</button>`:''}</div>`;
  const same=catalog.filter(q=>q.id!==p.id&&located(q)&&q.lat===p.lat&&q.lng===p.lng);
  if(near.length)h+=`<div class="near">${same.length?'같은 건물·':''}가까운 후보 · ${near.map(o=>`<button data-open="${esc(o.q.id)}">${esc(o.q.name)}</button> <span class="mono">${esc(kmTxt(o.d))}</span>`).join(' · ')}</div>`;
  else h+='<div class="near"></div>';
  el.innerHTML=h;fixImages(el);}
let detailReturn=null;
function openDetail(id){const p=getPlace(id);if(!p)return;const scroller=activeSheet()?.querySelector('.sheet-body');detailReturn={tab,scroll:scroller?scroller.scrollTop:0};detailId=id;map?.closePopup();render();$('#detail-body').scrollTop=0;if(located(p))requestAnimationFrame(()=>centerOn(p));}
function closeDetail(){detailId=null;render();if(detailReturn){const s=activeSheet()?.querySelector('.sheet-body');if(s)s.scrollTop=detailReturn.scroll;}}
function showOnMap(id){const p=getPlace(id);if(!p||!located(p)||!map)return toast('지도를 쓸 수 없는 장소예요.');
  if(!isPC()){detailId=null;setSheet('peek',false);render();}
  requestAnimationFrame(()=>{centerOn(p);let m=markers.get(id);if(!m){m=L.marker([p.lat,p.lng],{icon:pinIcon('label',p.name),zIndexOffset:2000}).addTo(markerLayer).bindPopup(()=>popup(p),{maxWidth:280});markers.set(id,m);}m.openPopup();});}

/* ── ④ 더보기 ── */
function cityLinks(){return $$('.city-switch a').map(a=>`<a href="${esc(a.getAttribute('href'))}" ${a.getAttribute('aria-current')?'aria-current="page"':''}>${esc(a.textContent)}</a>`).join('');}
function renderMore(){const t=trip();
  $('#view-more').innerHTML=`<div class="more">
  <h4>여행</h4><div class="more-list"><label><span>지금 여행</span><select data-more="trip" aria-label="여행 고르기">${db.trips.map(x=>`<option value="${esc(x.id)}" ${x.id===t.id?'selected':''}>${esc(x.name)}</option>`).join('')}</select></label>
  <button data-more="settings"><span>여행 설정</span><small>${esc(t.start?dateParts(t.start,0).md+' 출발 · ':'')}${t.days.length}일</small></button><button data-more="new"><span>새 여행 만들기</span><small>＋</small></button><button data-more="dup"><span>지금 여행 복제</span></button></div>
  <h4>도시</h4><div class="more-list"><div><span>도시 바꾸기</span><span class="seg">${cityLinks()}</span></div></div>
  <h4>공유·보관</h4><div class="more-list"><button data-more="share"><span>공유 링크 복사</span><small>시간·메모 포함</small></button><button data-more="text"><span>텍스트로 저장</span></button><button data-more="backup"><span>모든 여행 백업 내려받기</span><small>.json</small></button><label><span>백업 파일 가져오기</span><small>기존 여행은 그대로</small><input type="file" data-more="import" accept=".json,application/json"></label><button data-more="print"><span>고른 날 인쇄</span></button></div>
  <h4>장소</h4><div class="more-list"><button data-more="add"><span>장소 직접 추가</span><small>D${current+1}에 담겨요</small></button><button data-more="undo" ${undo.length?'':'disabled'}><span>되돌리기</span><small>${undo.length}단계</small></button></div>
  <span class="save-status" role="status">이 기기에 저장됨</span></div>`;}

/* ── 위쪽 · 탭 · 시트 ── */
function renderTop(){const t=trip(),ti=todayIdx(),p=dateParts(t.start,current),d=t.days[current];
  $('#day-btn').innerHTML=`<span class="d ${ti===current?'':'plain'}">D${current+1}${ti===current?' 오늘':''}</span>${p?esc(p.md+' '+p.w):''}<small>${esc(d.title&&!/^Day \d+$/.test(d.title)?d.title.replace(/\s*\d{1,2}:\d{2}$/,''):'')}</small>${ic('down')}`;
  $('#day-btn').setAttribute('aria-label',`${dayLong(current)} · 날짜 바꾸기`);
  $('#trip-select').innerHTML=db.trips.map(x=>`<option value="${esc(x.id)}" ${x.id===t.id?'selected':''}>${esc(x.name)}</option>`).join('');
  $$('.tabbar [data-tab]').forEach(b=>{if(b.dataset.tab===tab)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
  document.body.dataset.tab=tab;if(detailId)document.body.dataset.detail='';else delete document.body.dataset.detail;
  $('#detail').hidden=!detailId;$('#detail-back').hidden=!detailId;$('#undo-btn').disabled=!undo.length;}
function activeSheet(){if(isPC())return null;if(detailId)return $('#detail');return tab==='find'?$('#find'):$('#sheet');}
const sheetKey=()=>detailId?'detail':tab;
function sheetHeights(){const H=innerHeight,bar=$('.tabbar').offsetHeight||64,det=!!detailId,full=H-150-(det?0:bar);
  return {peek:Math.min(120,full),half:Math.min(tab==='find'&&!det?H-250-bar:452,full),full};}
function defaultState(){return detailId?'full':{today:'half',plan:'full',find:'half',more:'full'}[tab];}
function setSheet(state,persist=true){const k=sheetKey();sheetState[k]=state;if(persist&&k!=='detail'){view.sheet[k]=state;saveView();}layoutSheet();}
function layoutSheet(){['#sheet','#find','#detail'].forEach(s=>{const el=$(s);if(isPC()||document.body.classList.contains('no-map')){el.style.height='';el.style.top='';return;}});
  const el=activeSheet();if(!el||document.body.classList.contains('no-map'))return;const hs=sheetHeights(),st=sheetState[sheetKey()]||defaultState();el.style.top='auto';el.style.height=(hs[st]||hs.half)+'px';el.dataset.state=st;}
function setupSheetDrag(){$$('[data-grip]').forEach(g=>{let y0,h0,el,moved=false;
  g.addEventListener('pointerdown',e=>{if(isPC())return;el=g.closest('.sheet');y0=e.clientY;h0=el.offsetHeight;moved=false;el.classList.add('dragging');g.setPointerCapture(e.pointerId);});
  g.addEventListener('pointermove',e=>{if(!el)return;const dy=e.clientY-y0;if(Math.abs(dy)>4)moved=true;const hs=sheetHeights();el.style.height=Math.max(hs.peek,Math.min(hs.full,h0-dy))+'px';});
  const end=()=>{if(!el)return;el.classList.remove('dragging');const hs=sheetHeights(),h=el.offsetHeight;let st;
    if(!moved){const cur=sheetState[sheetKey()]||defaultState();st=cur==='full'?'half':cur==='half'?'full':'half';}
    else st=Object.entries(hs).sort((a,b)=>Math.abs(a[1]-h)-Math.abs(b[1]-h))[0][0];
    el=null;setSheet(st);};
  g.addEventListener('pointerup',end);g.addEventListener('pointercancel',end);});}
const scrollMemo={};
function setTab(next){if(next===tab&&!detailId){if(!isPC()){const cur=sheetState[tab]||defaultState();if(cur==='peek')setSheet(defaultState());}return;}
  const sc=detailId?null:activeSheet()?.querySelector('.sheet-body');if(sc)scrollMemo[tab]=sc.scrollTop;
  tab=next;detailId=null;view.tab=tab;saveView();render(true);
  const s2=activeSheet()?.querySelector('.sheet-body');if(s2)s2.scrollTop=scrollMemo[tab]||0;}
function setDay(i){current=i;pickDay=i;openRow=null;rememberDay();render(true);}
function render(fit=false){const t=trip();current=Math.min(current,t.days.length-1);pickDay=Math.min(pickDay,t.days.length-1);
  if(isPC()&&(tab==='find'||tab==='more'))tab='plan';
  const sc=activeSheet()?.querySelector('.sheet-body'),keep=sc?sc.scrollTop:0;
  renderTop();renderToday();renderPlan();renderFind();renderMore();renderDetail();layoutSheet();
  const sc2=activeSheet()?.querySelector('.sheet-body');if(sc2&&sc2===sc)sc2.scrollTop=keep;
  drawMap(fit);}

/* ── 대화창 ── */
function openDialog(title,content){$('#dialog-title').textContent=title;$('#dialog-body').replaceChildren();if(typeof content==='string')$('#dialog-body').innerHTML=content;else $('#dialog-body').append(content);if(!$('#editor').open)$('#editor').showModal();}
const close=()=>$('#editor').close();
function form(title,html,onSubmit){openDialog(title,`<form id="edit-form"><div class="form-grid">${html}</div><div class="form-actions"><button type="button" id="cancel-form">취소</button><button type="submit" class="primary">저장</button></div></form>`);$('#cancel-form').onclick=close;$('#edit-form').onsubmit=e=>{e.preventDefault();try{onSubmit(Object.fromEntries(new FormData(e.target)));close();}catch(error){toast(error.message);}};}
function editStop(id){const x=stopOf(id);if(!x)return;const s=x.stop;form('시간과 메모',`<label>방문 시간<input name="time" type="time" value="${esc(s.time)}"></label><label>머무는 시간 (분)<input name="duration" type="number" min="0" max="1440" value="${s.duration}"></label><label class="wide">나의 메모<textarea name="note" maxlength="2000" placeholder="예약 번호, 주문할 메뉴, 준비물…">${esc(s.note)}</textarea></label>`,v=>mutate(()=>{const y=stopOf(id);Object.assign(y.stop,{time:v.time,duration:Number(v.duration),note:v.note});}));}
function moveDialog(id){const assigned=dayOf(id);form('날짜 이동',`<label class="wide">이 장소를 언제 방문할까요?<select name="day"><option value="pool">일정에서 빼기 · 후보지에 보관</option>${trip().days.map((d,i)=>`<option value="${i}" ${assigned===i?'selected':''}>${esc(dayLong(i))}</option>`).join('')}</select></label>`,v=>{const to=v.day==='pool'?null:Number(v.day);if(to===assigned)return;mutate(()=>Planner.move(trip(),id,to));toast(to===null?'일정에서 뺐어요.':assigned>=0?`D${assigned+1} → D${to+1}로 옮겼어요.`:`D${to+1}에 담았어요.`,undoAction);});}
function dayPicker(){const t=trip(),ti=todayIdx();openDialog('날짜 고르기',`<div class="day-choices">${t.days.map((d,i)=>{const p=dateParts(t.start,i);return `<button data-choose="${i}" aria-current="${i===current}"><b>D${i+1}</b><span>${p?esc(p.md+' '+p.w)+' · ':''}${esc(d.title)}${i===ti?' · 오늘':''}</span><small>${d.stops.length}곳</small></button>`;}).join('')}</div>`);
  $('#dialog-body').onclick=e=>{const b=e.target.closest('[data-choose]');if(!b)return;$('#dialog-body').onclick=null;close();setDay(Number(b.dataset.choose));};}
function settings(){const t=trip();form('여행 설정',`<label class="wide">여행 이름<input name="name" required maxlength="100" value="${esc(t.name)}"></label><label>출발 날짜<input type="date" name="start" value="${esc(t.start)}"></label><label>여행 일수<input type="number" name="count" min="1" max="30" required value="${t.days.length}"></label><p class="help wide">줄어드는 날짜에 담긴 장소는 찾기에서 다시 찾을 수 있어요. 시간·메모는 되돌리기로 복구할 수 있습니다.</p>`,v=>mutate(()=>{t.name=v.name.trim()||'나의 여행';t.start=v.start;const n=Number(v.count);while(t.days.length<n)t.days.push(Planner.day(t.days.length));t.days.length=n;}));}
function enteredPoint(v){let lat=Number(v.lat),lng=Number(v.lng);if(C.city==='shanghai'&&v.coordType==='gcj02'){[lng,lat]=coordtransform.gcj02towgs84(lng,lat);}return {lat,lng};}
const coordinateField=()=>C.city==='shanghai'?'<label class="wide">입력 좌표계<select name="coordType"><option value="wgs84">WGS84 · 일반 GPS / OpenStreetMap</option><option value="gcj02">GCJ-02 · 고덕지도 좌표</option></select></label>':'';
function hotelSettings(){const d=trip().days[current],h=d.hotel;form(`D${current+1} 숙소와 제목`, `<label class="wide">하루 제목<input name="title" maxlength="50" required value="${esc(d.title)}"></label><label class="wide">숙소 이름<input name="name" maxlength="300" value="${esc(h?.name||'')}" placeholder="예약한 숙소 이름"></label><label>위도<input type="number" step="any" min="-90" max="90" name="lat" value="${h?.lat??''}"></label><label>경도<input type="number" step="any" min="-180" max="180" name="lng" value="${h?.lng??''}"></label>${coordinateField()}<p class="help wide">${esc(C.coordinateHelp||'구글지도에서 위치를 길게 누르거나 우클릭하면 좌표를 확인할 수 있어요.')} 이름을 비우면 숙소를 지웁니다.</p>`,v=>{if(v.name&&(!v.lat||!v.lng))throw Error('숙소의 위도와 경도를 함께 입력해 주세요.');mutate(()=>{d.title=v.title;d.hotel=v.name?{name:v.name,...enteredPoint(v)}:null;});drawMap(true);});}
function addCustom(){form('나만의 장소 추가',`<label class="wide">장소 이름<input name="name" required maxlength="300"></label><label class="wide">주소<input name="address" maxlength="500" placeholder="${esc(MAP_LABEL)}에 나온 주소"></label><label>위도<input name="lat" type="number" step="any" min="-90" max="90" required placeholder="${C.center?.[0]||22.28}…"></label><label>경도<input name="lng" type="number" step="any" min="-180" max="180" required placeholder="${C.center?.[1]||114.15}…"></label><label>지역<select name="region">${REGIONS.map(x=>`<option>${esc(x)}</option>`).join('')}</select></label><label>주요 메뉴<input name="menus" maxlength="300" placeholder="쉼표로 구분"></label><label class="wide">메모<textarea name="desc" maxlength="2000"></textarea></label>${coordinateField()}<p class="help wide">${esc(C.coordinateHelp||'구글지도에서 위치를 길게 누르거나 우클릭해 좌표를 복사하세요.')} 추가한 장소는 D${current+1}에 담깁니다.</p>`,v=>{const p=Planner.place({...v,id:'custom-'+Planner.id(),...enteredPoint(v),menus:v.menus.split(',').map(s=>s.trim()).filter(Boolean)});if(!p)throw Error('장소 이름과 좌표를 확인해 주세요.');mutate(()=>{trip().custom.push(p);Planner.move(trip(),p.id,current);});toast(`새 장소를 D${current+1}에 담았어요.`,undoAction);});}
function download(name,content,type){const url=URL.createObjectURL(new Blob([content],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function exportText(){const t=trip();const lines=[t.name,t.start||'날짜 미정',''];t.days.forEach((d,i)=>{lines.push(`Day ${i+1} ${Planner.date(t.start,i)} · ${d.title}`,`숙소: ${d.hotel?.name||'미정'}`);d.stops.forEach((s,j)=>{const p=getPlace(s.id);if(!p)return;lines.push(`${j+1}. ${s.time||'시간 미정'} ${p.name}${s.visited?' [방문 완료]':''}`,p.address||'',p.menus?.length?'메뉴: '+p.menus.join(', '):'',s.note||'',google(p));});lines.push('');});download((C.cityLabel||'홍콩')+'-여행일정.txt',lines.join('\n'),'text/plain;charset=utf-8');}
function downloadBackup(){download((C.cityLabel||'홍콩')+'-여행-백업.json',JSON.stringify(db,null,2),'application/json');}
function duplicateTrip(){const t=structuredClone(trip());t.id=Planner.id();t.name+=' · 복사';db.trips.push(t);db.active=t.id;undo=[];save();render(true);toast('지금 여행을 복제했어요.');}
function newTrip(){const t=Planner.fresh();t.name='새 '+(C.tripName||'홍콩·마카오 여행');db.trips.push(t);db.active=t.id;undo=[];pickStartDay();save();render(true);settings();}
function switchTrip(id){db.active=id;undo=[];openRow=null;detailId=null;pickStartDay();save();render(true);}
async function importBackup(f){if(!f)return;try{if(f.size>5000000)throw Error('5MB 이하의 백업을 선택해 주세요.');const raw=JSON.parse(await f.text());if(raw.version!==2||!Array.isArray(raw.trips)||!raw.trips.length||raw.trips.length>50)throw Error('올바른 여행 백업 파일이 아닙니다.');const imported=raw.trips.map(t=>{const x=Planner.normalize(t,catalog);x.id=Planner.id();return x;});db.trips.push(...imported);db.active=imported[0].id;undo=[];pickStartDay();save();render(true);close();toast('기존 여행을 유지하고 백업을 추가했어요.');}catch(err){toast('가져오기 실패: '+err.message);}}
function backup(){openDialog('여행 보관함',`<p class="help">일정은 이 브라우저에 저장돼요. 휴대폰으로 옮길 때는 공유 링크나 백업 파일을 사용하세요.</p><div class="backup-actions"><button id="backup-download">모든 여행 백업 다운로드 (.json)</button><button id="text-download">현재 여행을 텍스트로 저장</button><label>백업 파일 가져오기<input type="file" id="import-file" accept=".json,application/json"></label><button id="mobile-settings">여행 이름·날짜·일수 설정</button><button id="duplicate-trip">현재 여행 복제</button><button id="print-plan">고른 날 인쇄</button></div>`);$('#backup-download').onclick=downloadBackup;$('#text-download').onclick=exportText;$('#mobile-settings').onclick=settings;$('#duplicate-trip').onclick=()=>{duplicateTrip();close();};$('#print-plan').onclick=()=>{close();printPlan();};$('#import-file').onchange=e=>importBackup(e.target.files[0]);}
function printPlan(){const prev=tab;tab='plan';render();setTimeout(()=>{window.print();tab=prev;render();},50);}
async function share(){const url=location.href.split('#')[0].split('?')[0]+'#'+Planner.hash(trip());try{await navigator.clipboard.writeText(url);toast('일정 공유 링크를 복사했어요.');}catch{openDialog('일정 공유 링크',`<p class="help">링크를 복사해 다른 기기에서 열어보세요.</p><textarea id="share-text" readonly>${esc(url)}</textarea>`);$('#share-text').select();}if(location.protocol==='file:')toast('파일로 열었어요. 다른 기기에서는 사이트 주소로 접속하거나 백업 파일을 사용해 주세요.');}

/* ── 내 위치 ── */
function locate(center=true){if(!navigator.geolocation)return toast('현재 위치를 사용할 수 없어요.');navigator.geolocation.getCurrentPosition(pos=>{myPos={lat:pos.coords.latitude,lng:pos.coords.longitude};if(map){locationLayer.clearLayers();L.marker([myPos.lat,myPos.lng],{icon:L.divIcon({className:'',html:'<div class="loc-dot" style="transform:translate(-50%,-50%)"></div>',iconSize:null}),zIndexOffset:500}).addTo(locationLayer).bindTooltip('내 위치');if(center)map.setView([myPos.lat,myPos.lng],15);}render();},()=>{if(center)toast('위치 권한이나 연결 상태를 확인해 주세요.');},{enableHighAccuracy:true,timeout:10000,maximumAge:60000});}

/* ── 플랜 끌기(마우스·터치 공통) ── */
function setupPlanDrag(){const list=$('#plan-list');let drag=null;
  list.addEventListener('pointerdown',e=>{const h=e.target.closest('[data-drag]');if(!h)return;e.preventDefault();const li=h.closest('li[data-id]');drag={id:li.dataset.id,li,target:null,after:false};li.classList.add('dragging');h.setPointerCapture(e.pointerId);});
  list.addEventListener('pointermove',e=>{if(!drag)return;$$('.drop-before,.drop-after').forEach(x=>x.classList.remove('drop-before','drop-after'));const el=document.elementFromPoint(e.clientX,e.clientY)?.closest('#plan-list li[data-id]');
    const sc=list.closest('.sheet-body'),r=sc.getBoundingClientRect();if(e.clientY<r.top+40)sc.scrollTop-=12;else if(e.clientY>r.bottom-40)sc.scrollTop+=12;
    if(!el||el===drag.li){drag.target=null;return;}const b=el.getBoundingClientRect();drag.target=el.dataset.id;drag.after=e.clientY>b.top+b.height/2;el.classList.add(drag.after?'drop-after':'drop-before');});
  const end=()=>{if(!drag)return;const {id,target,after}=drag;drag.li.classList.remove('dragging');$$('.drop-before,.drop-after').forEach(x=>x.classList.remove('drop-before','drop-after'));drag=null;if(!target)return;
    const stops=trip().days[current].stops,ti=stops.findIndex(s=>s.id===target);let before=after?stops[ti+1]?.id??null:target;if(before===id)return;
    const cur=stops.findIndex(s=>s.id===id);if((after&&ti===cur-1)||(!after&&ti===cur+1))return;mutate(()=>Planner.move(trip(),id,current,before));};
  list.addEventListener('pointerup',end);list.addEventListener('pointercancel',end);}

/* ── 이벤트 ── */
function onListClick(e){const open=e.target.closest('[data-open]');if(open){openDetail(open.dataset.open);return true;}
  const v=e.target.closest('[data-visit]');if(v){toggleVisited(v.dataset.visit);return true;}
  const go=e.target.closest('[data-go]');if(go){const g=go.dataset.go;if(g==='near'){filter='근처';query='';$('#search').value='';findOpen=true;setTab(isPC()?tab:'find');render(true);}else setTab(g==='find'&&isPC()?(findOpen=true,tab):g);if(g==='find'&&isPC())render(true);return true;}
  return false;}
$('#view-today').onclick=e=>{const dd=e.target.closest('[data-day]');if(dd)return setDay(Number(dd.dataset.day));if(onListClick(e))return;if(e.target.closest('[data-toggle-done]')){showDone=!showDone;renderToday();}};
$('#plan-list').onclick=e=>{if(e.target.closest('#hotel-edit')||e.target.closest('#day-edit'))return hotelSettings();if(onListClick(e))return;
  const li=e.target.closest('li[data-id]');if(!li)return;const id=li.dataset.id,b=e.target.closest('[data-act]');
  if(!b){if(e.target.closest('a,select,button,input'))return;openRow=openRow===id?null:id;renderPlan();$(`#plan-list li[data-id="${CSS.escape(id)}"]`)?.scrollIntoView({block:'nearest'});return;}
  const act=b.dataset.act;if(act==='edit')editStop(id);if(act==='move')moveDialog(id);if(act==='remove')removeStop(id);if(act==='visited')toggleVisited(id);if(act==='detail')openDetail(id);
  if(act==='up'||act==='down')mutate(()=>{const stops=trip().days[current].stops,i=stops.findIndex(s=>s.id===id),j=i+(act==='up'?-1:1);if(j>=0&&j<stops.length)[stops[i],stops[j]]=[stops[j],stops[i]];});};
$('#plan-list').onchange=e=>{if(e.target.dataset.mode){const id=e.target.dataset.mode,value=e.target.value;mutate(()=>{trip().days[current].stops.find(s=>s.id===id).mode=value;});}};
$('#day-tabs').onclick=e=>{const b=e.target.closest('[data-day]');if(b)setDay(Number(b.dataset.day));};
$('#place-list').onclick=e=>{const a=e.target.closest('[data-add]');if(a){const id=a.dataset.add,from=dayOf(id);if(from===pickDay)removeStop(id);else if(from>=0)askMove(id,pickDay);else{const nx=filter==='근처'&&pickDay===current?nextStop():null;addTo(id,pickDay,nx?nx.s.id:null);if(nx)toast(`다음 장소(${nx.p.name}) 앞에 넣었어요.`,undoAction);}return;}onListClick(e);};
$('#list-heading').onclick=e=>{if(e.target.closest('[data-locate]'))locate(false);};
$('#detail-body').onclick=e=>{if(e.target.closest('[data-open]'))return openDetail(e.target.closest('[data-open]').dataset.open);const b=e.target.closest('[data-act]');if(!b)return;const id=detailId,act=b.dataset.act,p=getPlace(id);
  if(act==='add')addTo(id,pickDay);if(act==='move')moveDialog(id);if(act==='remove')removeStop(id);if(act==='visited')toggleVisited(id);if(act==='edit')editStop(id);if(act==='map')showOnMap(id);
  if(act==='photo'&&p.img)openDialog(p.name,`<img src="${esc(p.img.replace('width=400','width=1000'))}" alt="${esc(p.name)}" referrerpolicy="no-referrer">`);};
$('#detail-back').onclick=closeDetail;
$('#filters').onclick=e=>{const b=e.target.closest('[data-filter]');if(!b)return;filter=b.dataset.filter;if(foodMode()&&!YOON.length)friend='heesu';render(true);};
$('#friend-all').onclick=()=>{friend='all';render(true);};
$('#heesu-btn').onclick=()=>{filter='친구 맛집';friend=friend==='heesu'&&YOON.length?'all':'heesu';findOpen=true;if(!isPC()&&tab!=='find')tab='find';render(true);};
if($('#yoonhwan-btn'))$('#yoonhwan-btn').onclick=()=>{filter='친구 맛집';friend=friend==='yoonhwan'?'all':'yoonhwan';findOpen=true;render(true);};
$('#rec-only').onclick=()=>{recOnly=!recOnly;render(true);};
$('#search').oninput=e=>{query=e.target.value;if(isPC()&&query)findOpen=true;render(true);};
$('#search').onfocus=()=>{if(isPC()&&!findOpen){findOpen=true;render(true);}};
$('#find-toggle').onclick=()=>{findOpen=!findOpen;render(true);};
$('#pick-change').onclick=()=>{const el=$('#pick-days');el.hidden=!el.hidden;$('#pick-change').setAttribute('aria-expanded',!el.hidden);};
$('#pick-days').onclick=e=>{const b=e.target.closest('[data-pick]');if(!b)return;pickDay=Number(b.dataset.pick);rememberDay();$('#pick-days').hidden=true;$('#pick-change').setAttribute('aria-expanded',false);render();};
$('#tabbar').onclick=e=>{const b=e.target.closest('[data-tab]');if(b)setTab(b.dataset.tab);};
$('#day-btn').onclick=dayPicker;
$('#view-more').onclick=e=>{const b=e.target.closest('button[data-more]');if(!b)return;const a=b.dataset.more;({settings,new:newTrip,dup:duplicateTrip,share,text:exportText,backup:downloadBackup,print:printPlan,add:addCustom,undo:undoLast})[a]?.();};
$('#view-more').onchange=e=>{const m=e.target.dataset.more;if(m==='trip')switchTrip(e.target.value);if(m==='import')importBackup(e.target.files[0]);};
$('#trip-select').onchange=e=>switchTrip(e.target.value);
$('#new-trip').onclick=newTrip;$('#settings-btn').onclick=settings;$('#share-btn').onclick=share;$('#backup-btn').onclick=backup;$('#add-btn').onclick=addCustom;$('#undo-btn').onclick=undoLast;
$('#close-dialog').onclick=close;$('#editor').onclick=e=>{if(e.target===$('#editor')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close();}};
$('#fit-btn').onclick=()=>{if(!map)return toast('지도를 먼저 불러와 주세요.');detailId?closeDetail():null;drawMap(true);};
$('#transit-btn').onclick=()=>{if(!map)return toast('지도를 먼저 불러와 주세요.');transit=!transit;if(transit)transitLayer.addTo(map);else map.removeLayer(transitLayer);$('#transit-btn').setAttribute('aria-pressed',transit);$('#transit-btn').setAttribute('aria-label',transit?'노선 숨기기':'노선 보기');};
$('#location-btn').onclick=()=>{if(!map)return toast('지도를 먼저 불러와 주세요.');locate(true);};
$('.brand').onclick=e=>{e.preventDefault();detailId=null;setTab(todayIdx()>=0?'today':'plan');};
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&detailId&&!$('#editor').open)closeDetail();});
window.addEventListener('hashchange',()=>{importHash();undo=[];pickStartDay();save();render(true);});
let lastPC=isPC();addEventListener('resize',()=>{const pc=isPC();if(pc!==lastPC){lastPC=pc;render(true);}else layoutSheet();});
matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change',()=>drawMap());

$$('[data-ico]').forEach(el=>el.insertAdjacentHTML('afterbegin',ic(el.dataset.ico)));
if(!Object.keys(mtrLines).length&&!ferryRoute.length)$('#transit-btn').hidden=true;
initState();initMap();setupSheetDrag();setupPlanDrag();render(true);
if(map)setTimeout(()=>{map.invalidateSize();drawMap(true);},60);
// 위치 권한을 이미 준 기기에서만 조용히 위치를 읽는다(처음부터 권한을 묻지 않는다).
navigator.permissions?.query({name:'geolocation'}).then(r=>{if(r.state==='granted')locate(false);}).catch(()=>{});
