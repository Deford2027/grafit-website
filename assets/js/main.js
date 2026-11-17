document.getElementById('menuOpen').addEventListener('click', function() {
  document.getElementById('mobileNav').classList.add('open');
});
document.getElementById('menuClose').addEventListener('click', function() {
  document.getElementById('mobileNav').classList.remove('open');
});
document.querySelectorAll('.mobile-nav a').forEach(function(a) {
  a.addEventListener('click', function() {
    document.getElementById('mobileNav').classList.remove('open');
  });
});

var observer = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-up').forEach(function(el) {
  observer.observe(el);
});

var track = document.getElementById('casesTrack');
if (track) (function(){
var prev = document.getElementById('casesPrev');
var next = document.getElementById('casesNext');
function step() {
  var card = track.querySelector('.case-card');
  return card.getBoundingClientRect().width + 15;
}
function updateArrows() {
  prev.disabled = track.scrollLeft <= 2;
  next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
}
prev.addEventListener('click', function() { track.scrollBy({ left: -step() }); });
next.addEventListener('click', function() { track.scrollBy({ left: step() }); });
track.addEventListener('scroll', updateArrows, { passive: true });
window.addEventListener('resize', updateArrows);
updateArrows();
})();

var toItems = document.querySelectorAll('#toList li');
var toImgs = document.querySelectorAll('#toPhotos img');
function showToPhoto(li) {
  toItems.forEach(function(el) { el.classList.toggle('active', el === li); });
  toImgs.forEach(function(img, i) { img.classList.toggle('active', i === +li.dataset.photo); });
}
toItems.forEach(function(li) {
  li.addEventListener('mouseenter', function() { showToPhoto(li); });
  li.addEventListener('focus', function() { showToPhoto(li); });
  li.addEventListener('click', function() { showToPhoto(li); });
});
window.addEventListener('load', function() {
  toImgs.forEach(function(img) { img.loading = 'eager'; });
});

// Booking form validation (works for the page form and the popup copy)
function bindBookingForm(form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var phone = form.querySelector('input[type="tel"]');
    var brand = form.querySelector('select');
    var consent = form.querySelector('input[type="checkbox"]');
    var ok = true;
    [phone, brand].forEach(function(el) {
      var bad = el === phone ? phone.value.replace(/\D/g, '').length < 10 : !el.value;
      el.style.borderColor = bad ? '#fc8535' : '';
      if (bad) ok = false;
    });
    consent.parentElement.style.color = consent.checked ? '' : '#fc8535';
    if (!consent.checked) ok = false;
    if (ok) form.classList.add('sent');
  });
}
var form = document.getElementById('bookingForm');
if (form) bindBookingForm(form);

// Booking popup: every link to #contact opens it instead of scrolling down
(function() {
  if (!form) return;
  var card = form.closest('.form-card');
  var modal = document.createElement('div');
  modal.className = 'modal';
  modal.id = 'bookingModal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', 'Заявка на запись');
  modal.hidden = true;
  var box = document.createElement('div');
  box.className = 'modal-box form-card';
  box.innerHTML = '<button type="button" class="modal-close" aria-label="Закрыть"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>';
  var h = card.querySelector('h2');
  if (h) { var t = document.createElement('h2'); t.className = 'modal-title'; t.innerHTML = h.innerHTML; box.appendChild(t); }
  card.querySelectorAll(':scope > p').forEach(function(p) { var c = p.cloneNode(true); c.className = 'modal-lead'; box.appendChild(c); });
  var mform = form.cloneNode(true);
  mform.id = 'bookingFormModal';
  mform.classList.remove('sent');
  mform.querySelectorAll('[id]').forEach(function(el) { el.id = 'm' + el.id; });
  mform.querySelectorAll('label[for]').forEach(function(l) { l.htmlFor = 'm' + l.htmlFor; });
  box.appendChild(mform);
  modal.appendChild(box);
  document.body.appendChild(modal);
  bindBookingForm(mform);
  var msel = mform.querySelector('select');
  var lastFocus = null;

  function open(brand) {
    lastFocus = document.activeElement;
    mform.classList.remove('sent');
    if (brand && msel) msel.value = brand;
    var nav = document.getElementById('mobileNav');
    if (nav) nav.classList.remove('open');
    modal.hidden = false;
    document.documentElement.classList.add('modal-open');
    requestAnimationFrame(function() { modal.classList.add('show'); });
    setTimeout(function() { var i = mform.querySelector('input[type="tel"]'); if (i) i.focus({ preventScroll: true }); }, 250);
  }
  function close() {
    modal.classList.remove('show');
    document.documentElement.classList.remove('modal-open');
    setTimeout(function() { modal.hidden = true; }, 300);
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }
  document.addEventListener('click', function(e) {
    var a = e.target.closest('a[href="#contact"]');
    if (!a) return;
    e.preventDefault();
    open(a.dataset.brand);
  });
  modal.addEventListener('click', function(e) { if (e.target === modal || e.target.closest('.modal-close')) close(); });
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape' && !modal.hidden) close(); });
})();

  (function(){
    var tabs=document.getElementById('vcTabs'); if(!tabs) return;
    var btns=tabs.querySelectorAll('button'),pill=tabs.querySelector('.vc-pill');
    var panes=document.querySelectorAll('.vc-pane'),imgs=document.querySelectorAll('.vc-photos img');
    function place(b){pill.style.left=b.offsetLeft+'px';pill.style.width=b.offsetWidth+'px';pill.style.top=b.offsetTop+'px';pill.style.height=b.offsetHeight+'px';pill.style.bottom='auto'}
    btns.forEach(function(b){b.addEventListener('click',function(){
      var i=+b.dataset.i;
      btns.forEach(function(x){x.classList.toggle('on',x===b);x.setAttribute('aria-selected',x===b)});
      panes.forEach(function(p,j){p.classList.toggle('on',j===i)});
      imgs.forEach(function(m,j){m.classList.toggle('on',j===i)});
      place(b);
    })});
    function re(){place(tabs.querySelector('.on'))}
    window.addEventListener('load',function(){re();imgs.forEach(function(m){m.loading='eager'})});
    window.addEventListener('resize',re); re();
    if(document.fonts) document.fonts.ready.then(re);
  })();

// Yandex map of GRAFIT tech centers (same API key and markers as grafit-service.ru)
  if (window.ymaps) ymaps.ready(function(){
    var el=document.getElementById('grafitMap'),reset=document.getElementById('mapReset');
    if(!el) return;
    var centers=[
      {ll:[55.811351,37.652382],t:'GRAFIT, Москва, Маломосковская ул., 22, стр. 2',d:'Техцентр работает Пн-пт, с 10-00 до 20-00.',main:true},
      {ll:[44.568263,33.514778],t:'GRAFIT, г. Севастополь, Промышленная, 9',d:'Техцентр работает Пн-пт, с 09-00 до 17-00.'},
      {ll:[42.917163,47.603119],t:'GRAFIT, г. Махачкала, пр-т Насрутдинова, 252Б',d:'Техцентр работает Пн-пт, с 10-00 до 19-00.'},
      {ll:[54.750058,56.023514],t:'GRAFIT, г. Уфа, 50 лет СССР, 39, корп.11',d:'Техцентр работает Пн-пт, с 09-00 до 20-00.'},
      {ll:[45.071548,38.989686],t:'GRAFIT, г. Краснодар, Солнечная, 4Б',d:'Техцентр работает Пн-пт, с 10-00 до 20-00.'},
      {ll:[56.85807,60.566285],t:'GRAFIT, г. Екатеринбург, ул. Черепанова, 23Б',d:'Техцентр работает Пн-пт, с 10-00 до 19-00.'}
    ];
    var map=new ymaps.Map(el,{center:[55.751979,37.617499],zoom:4,controls:['zoomControl','fullscreenControl']},{suppressMapOpenBlock:true});
    map.behaviors.disable('scrollZoom');
    el.addEventListener('click',function(){map.behaviors.enable('scrollZoom')});
    el.addEventListener('mouseleave',function(){map.behaviors.disable('scrollZoom')});
    var markers={},col=new ymaps.GeoObjectCollection();
    centers.forEach(function(c){
      var pm=new ymaps.Placemark(c.ll,{balloonContentHeader:c.t,balloonContentBody:c.d,hintContent:c.t},
        {preset:c.main?'islands#blackDotIcon':'islands#orangeDotIcon',iconColor:c.main?'#1e1e1e':'#fc8535'});
      markers[c.ll.join(',')]=pm; col.add(pm);
    });
    map.geoObjects.add(col);
    function showAll(){map.setBounds(col.getBounds(),{checkZoomRange:true,zoomMargin:40})}
    showAll();
    var links=document.querySelectorAll('#contacts [data-ll]');
    links.forEach(function(a){a.addEventListener('click',function(e){
      if(e.metaKey||e.ctrlKey||e.shiftKey) return;
      e.preventDefault();
      var p=a.dataset.ll.split(','),ll=[+p[1],+p[0]],m=markers[ll.join(',')];
      map.setCenter(ll,15,{duration:600}).then(function(){if(m) m.balloon.open()});
      links.forEach(function(x){x.classList.toggle('on-map',x===a)});
      reset.hidden=false;
      if(window.innerWidth<=900) el.scrollIntoView({behavior:'smooth',block:'center'});
    })});
    reset.addEventListener('click',function(){
      map.balloon.close(); showAll(); reset.hidden=true;
      links.forEach(function(x){x.classList.remove('on-map')});
    });
    window.addEventListener('load',function(){map.container.fitToViewport();showAll()});
  });
