const tg = window.Telegram?.WebApp;
if (tg) { tg.ready(); tg.expand(); }

const key = 'barber_empire_demo';
let state = JSON.parse(localStorage.getItem(key) || 'null') || {coins:500,served:0,chairs:1,level:1};
let busy = false;
const $ = id => document.getElementById(id);

function save(){ localStorage.setItem(key, JSON.stringify(state)); }
function render(){
  $('coins').textContent = state.coins;
  $('served').textContent = state.served;
  $('chairs').textContent = state.chairs;
  $('level').textContent = state.level;
  $('upgradeBtn').textContent = `💺 Купить кресло — ${state.chairs*300} 🪙`;
}
function message(text, emoji='🙂'){ $('status').textContent=text; $('bubble').textContent=text; $('client').textContent=emoji; }

$('cutBtn').addEventListener('click',()=>{
  if(busy) return;
  busy=true; $('cutBtn').disabled=true; $('progressBar').style.width='0%';
  message('Стрижка началась…','😐');
  let progress=0;
  const timer=setInterval(()=>{
    progress+=10; $('progressBar').style.width=progress+'%';
    if(progress>=100){
      clearInterval(timer); busy=false; $('cutBtn').disabled=false;
      const reward=50+state.level*10;
      state.coins+=reward; state.served++;
      if(state.served%5===0) state.level++;
      save(); render(); message(`Клиент доволен! +${reward} монет`,'😎');
    }
  },120);
});

$('upgradeBtn').addEventListener('click',()=>{
  const price=state.chairs*300;
  if(state.coins<price){message(`Не хватает монет. Нужно ещё ${price-state.coins}.`,'😅');return;}
  state.coins-=price;state.chairs++;save();render();message('Новое кресло установлено!','🤩');
});

$('resetBtn').addEventListener('click',()=>{
  if(confirm('Сбросить тестовый прогресс?')){state={coins:500,served:0,chairs:1,level:1};save();render();message('Прогресс сброшен.','🙂');}
});

$('bookingBtn').addEventListener('click',()=>{
  if(tg?.close){
    tg.close();
  } else {
    message('Кнопку записи подключим к твоему боту на следующем этапе.','📅');
  }
});
render();
