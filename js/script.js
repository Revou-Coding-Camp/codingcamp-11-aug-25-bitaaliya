const $  = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => [...p.querySelectorAll(s)];

(() => { $$("#year").forEach(el => el.textContent = new Date().getFullYear()); })();

(() => {
  const btn = $("#navToggle");
  const menu = $("#navMenu");
  if (!btn || !menu) return;

  btn.addEventListener("click", () => menu.classList.toggle("open"));
  $$("#navMenu a[data-scroll]").forEach(a => {
    a.addEventListener("click", () => menu.classList.remove("open"));
  });
})();

(() => {
  const links = $$('a[data-scroll]');
  const header = $(".navbar");
  const headerH = () => header?.offsetHeight || 0;

  links.forEach(link => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (!id?.startsWith("#")) return;
      const target = $(id);
      if (!target) return;

      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - (headerH() - 1);
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
})();

(() => {
  const sections = ["#home","#profile","#portfolio","#message"].map(id => $(id)).filter(Boolean);
  const linkMap = new Map();
  $$("#navMenu a[data-scroll]").forEach(a => linkMap.set(a.getAttribute("href"), a));

  const setActive = (id) => {
    $$("#navMenu a").forEach(a => a.classList.remove("active"));
    const l = linkMap.get(id);
    if (l) l.classList.add("active");
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        setActive("#" + entry.target.id);
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px", threshold: 0 });

  sections.forEach(sec => observer.observe(sec));
})();

(() => {
  const nameSpan = $("#username");
  if (!nameSpan) return;

  const KEY = "nds_username";
  const store = window.sessionStorage;

  let userName = store.getItem(KEY);
  if (!userName){
    userName = window.prompt("Hai! Masukkan nama Anda untuk sapaan di Home:", "") || "Guest";
    userName = userName.trim() || "Guest";
    store.setItem(KEY, userName);
  }
  nameSpan.textContent = userName;
})();

(() => {
  const form = $("#contactForm");
  if (!form) return;

  const nameField = $("#name");
  const email = $("#email");
  const phone = $("#phone");
  const message = $("#messageText");

  const errName = $("#err-name");
  const errEmail = $("#err-email");
  const errPhone = $("#err-phone");
  const errMessage = $("#err-message");
  const resultBox = $("#resultBox");
  const currentTime = $("#currentTime");

  function updateTime(){
    const now = new Date();
    const opts = { weekday:'short', year:'numeric', month:'short', day:'2-digit',
      hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false, timeZoneName:'short' };
    currentTime.textContent = now.toLocaleString('id-ID', opts);
  }
  updateTime();
  setInterval(updateTime, 1000);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  const phoneRegex = /^08\d{8,11}$/;

  const setError = (el, msg="") => { el.textContent = msg; };

  function validate(){
    let ok = true;

    if (!nameField.value.trim() || nameField.value.trim().length < 2){
      setError(errName, "Nama minimal 2 karakter."); ok = false;
    } else setError(errName);

    if (!emailRegex.test(email.value.trim())){
      setError(errEmail, "Alamat email tidak valid."); ok = false;
    } else setError(errEmail);

    const digits = phone.value.replace(/\D/g,"");
    if (!phoneRegex.test(digits)){
      setError(errPhone, "Nomor telepon format lokal 08xxxxxxxxxx (10–13 digit)."); ok = false;
    } else setError(errPhone);

    if (!message.value.trim() || message.value.trim().length < 10){
      setError(errMessage, "Pesan minimal 10 karakter."); ok = false;
    } else setError(errMessage);

    return ok;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validate()) return;

    const cleanPhone = phone.value.replace(/\D/g,"");
    resultBox.innerHTML = `
      <div class="result-item"><b>Nama</b>: ${escapeHtml(nameField.value.trim())}</div>
      <div class="result-item"><b>Email</b>: ${escapeHtml(email.value.trim())}</div>
      <div class="result-item"><b>No. Telepon</b>: ${escapeHtml(cleanPhone)}</div>
      <div class="result-item"><b>Pesan</b>: ${escapeHtml(message.value.trim())}</div>
    `;

    sessionStorage.setItem("nds_username", nameField.value.trim());

    const hello = $("#username");
    if (hello) hello.textContent = nameField.value.trim();

    form.reset();
  });

  function escapeHtml(str){
    return str
      .replace(/&/g,"&amp;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;")
      .replace(/'/g,"&#039;");
  }
})();
