var SUPABASE_URL = "https://mmoeonimjmqvolnziohh.supabase.co";
var SUPABASE_ANON_KEY = "sb_publishable_1V964BMrpUImTi8wN3QF3w__7hynZIN";
var GALLERY_TABLE = "gallery_items";

var supabaseClient = null;
if (window.supabase && SUPABASE_URL.indexOf("GANTI_DENGAN") === -1) {
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

function showSection(id) {
  document.querySelectorAll('section').forEach(function (s) {
    s.classList.remove('active', 'visible');
  });
  document.querySelectorAll('nav button').forEach(function (b) {
    b.classList.remove('active-nav');
  });

  var sec = document.getElementById(id);
  sec.classList.add('active');
  document.getElementById('nav-' + id).classList.add('active-nav');

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      sec.classList.add('visible');
      if (id === 'galeri') observeItems();
    });
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

requestAnimationFrame(function () {
  requestAnimationFrame(function () {
    document.getElementById('profil').classList.add('visible');
  });
});

var lightbox = document.getElementById('lightbox');
var lightboxImg = document.getElementById('lightbox-img');

function openLightbox(src, alt) {
  lightboxImg.src = src;
  lightboxImg.alt = alt || '';
  lightbox.classList.add('open');
}

function closeLightbox() {
  lightbox.classList.remove('open');
}

lightbox.addEventListener('click', function (e) {
  if (e.target === e.currentTarget) closeLightbox();
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeLightbox();
});

var observer = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry, i) {
    if (entry.isIntersecting) {
      setTimeout(function () {
        entry.target.classList.add('show');
      }, i * 70);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

function observeItems() {
  document.querySelectorAll('.gallery-item').forEach(function (el) {
    observer.observe(el);
  });
}

var searchIconSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="10.4" cy="10.4" r="6.1"/><line x1="15.1" y1="15.1" x2="20" y2="20"/></svg>';

function renderGallery(items) {
  var grid = document.getElementById('gallery-grid');
  grid.innerHTML = '';

  if (!items || items.length === 0) {
    grid.innerHTML = '<div class="gallery-empty">Belum ada karya yang ditambahkan.</div>';
    return;
  }

  items.forEach(function (item) {
    var wrap = document.createElement('div');
    wrap.className = 'gallery-item';

    if (item.width && item.height) {
      wrap.style.aspectRatio = item.width + ' / ' + item.height;
    }

    var inner = document.createElement('div');
    inner.className = 'frame-inner';

    var img = document.createElement('img');
    img.src = item.image_url;
    img.alt = item.alt || 'Karya GFX';
    img.loading = 'lazy';

    var overlay = document.createElement('div');
    overlay.className = 'overlay-icon';
    overlay.innerHTML = searchIconSvg;

    inner.appendChild(img);
    inner.appendChild(overlay);
    wrap.appendChild(inner);

    wrap.addEventListener('click', function () {
      openLightbox(item.image_url, item.alt || '');
    });

    grid.appendChild(wrap);
  });

  observeItems();
}

function loadGallery() {
  var grid = document.getElementById('gallery-grid');

  if (!supabaseClient) {
    grid.innerHTML = '<div class="gallery-empty">Belum ada karya yang ditambahkan.</div>';
    return;
  }

  supabaseClient
    .from(GALLERY_TABLE)
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })
    .then(function (res) {
      if (res.error) {
        grid.innerHTML = '<div class="gallery-empty">Gagal memuat galeri.</div>';
        return;
      }
      renderGallery(res.data);
    });
}

loadGallery();

var audio = document.getElementById('bg-music');
var playBtn = document.getElementById('play-btn');
var skipBtn = document.getElementById('skip-btn');
var prevBtn = document.getElementById('prev-btn');
var trackName = document.getElementById('track-name');
var progressBar = document.getElementById('progress-bar');
var navbar = document.getElementById('navbar');
var musicPlayer = document.getElementById('music-player');

var playlist = [
  { name: 'Lagu 1', src: 'https://files.catbox.moe/2y4b33.mp3' },
  { name: 'Lagu 2', src: 'https://files.catbox.moe/7i316x.mp3' },
  { name: 'Lagu 3', src: 'https://files.catbox.moe/ugod62.mp3' },
  { name: 'Lagu 4', src: 'https://files.catbox.moe/xmxuhj.mp3' }
];

var currentTrack = 0;
var isPlaying = false;

function loadTrack(idx) {
  audio.src = playlist[idx].src;
  trackName.textContent = playlist[idx].name;
}

function playTrack() {
  audio.play();
  isPlaying = true;
  document.getElementById('icon-play').style.display = 'none';
  document.getElementById('icon-pause').style.display = 'block';
}

function pauseTrack() {
  audio.pause();
  isPlaying = false;
  document.getElementById('icon-play').style.display = 'block';
  document.getElementById('icon-pause').style.display = 'none';
}

loadTrack(0);

playBtn.addEventListener('click', function () {
  if (isPlaying) pauseTrack(); else playTrack();
});

skipBtn.addEventListener('click', function () {
  currentTrack = (currentTrack + 1) % playlist.length;
  loadTrack(currentTrack);
  if (isPlaying) playTrack();
});

prevBtn.addEventListener('click', function () {
  currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
  loadTrack(currentTrack);
  if (isPlaying) playTrack();
});

audio.addEventListener('ended', function () {
  currentTrack = (currentTrack + 1) % playlist.length;
  loadTrack(currentTrack);
  playTrack();
});

audio.addEventListener('timeupdate', function () {
  if (audio.duration) {
    progressBar.style.width = (audio.currentTime / audio.duration * 100) + '%';
  }
});

window.addEventListener('scroll', function () {
  var galeriActive = document.getElementById('galeri').classList.contains('active');
  if (galeriActive && window.scrollY > 60) {
    navbar.classList.add('hidden');
    musicPlayer.classList.add('hidden');
  } else {
    navbar.classList.remove('hidden');
    musicPlayer.classList.remove('hidden');
  }
});