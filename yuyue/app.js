(() => {
  'use strict';

  const settings = window.LOVE_LETTER;
  const fillName = (text) => String(text).replaceAll('{name}', settings.recipientName);
  const views = ['intro', 'challenge', 'finale'];
  const dialog = document.getElementById('confirmation');
  const answer = document.getElementById('answer');
  const error = document.getElementById('answer-error');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let finished = false;

  for (const element of document.querySelectorAll('[data-copy]')) {
    const value = settings.copy[element.dataset.copy];
    if (value !== undefined) element.textContent = fillName(value);
  }
  document.title = fillName(settings.copy.pageTitle);
  answer.placeholder = settings.copy.inputPlaceholder;
  document.getElementById('close-confirmation').setAttribute('aria-label', settings.copy.closeDialog);
  document.getElementById('love-title').textContent = settings.finalMessage;
  document.getElementById('signature').textContent = settings.signature;
  for (const [key, value] of Object.entries(settings.theme || {})) {
    const names = { background: '--paper', ink: '--ink', accent: '--rose', accentDark: '--rose-dark' };
    if (names[key]) document.documentElement.style.setProperty(names[key], value);
  }

  function showView(name) {
    views.forEach((id) => { document.getElementById(id).hidden = id !== name; });
    document.body.dataset.view = name;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  document.getElementById('open-letter').addEventListener('click', () => dialog.showModal());
  document.getElementById('close-confirmation').addEventListener('click', () => dialog.close());
  document.getElementById('confirm-yes').addEventListener('click', () => {
    dialog.close();
    showView('challenge');
    document.getElementById('question-title').focus({ preventScroll: true });
  });

  function normalize(value) {
    return String(value).normalize('NFKC').trim().toLocaleLowerCase('en-US');
  }

  function showError(message) {
    error.textContent = message;
    answer.setAttribute('aria-invalid', 'true');
    const form = document.getElementById('answer-form');
    form.classList.remove('shake');
    void form.offsetWidth;
    form.classList.add('shake');
    answer.focus({ preventScroll: true });
  }

  answer.addEventListener('input', () => {
    error.textContent = '';
    answer.removeAttribute('aria-invalid');
  });

  document.getElementById('answer-form').addEventListener('submit', (event) => {
    event.preventDefault();
    if (finished) return;
    if (!normalize(answer.value)) return showError(settings.copy.emptyAnswer);
    if (normalize(answer.value) !== normalize(settings.correctAnswer)) return showError(settings.copy.wrongAnswer);
    finished = true;
    answer.blur();
    showView('finale');
    document.title = settings.finalMessage;
    document.getElementById('love-title').focus({ preventScroll: true });
    if (!motion.matches) rainHearts();
  });

  function rainHearts() {
    const canvas = document.getElementById('heart-rain');
    const context = canvas.getContext('2d');
    if (!context) return;
    const duration = Math.max(1500, Number(settings.hearts.durationMs) || 10000);
    const count = Math.min(200, Math.max(1, Number(settings.hearts.count) || 96));
    const colors = settings.hearts.colors?.length ? settings.hearts.colors : ['#c64d6e', '#e78ba3'];
    const start = performance.now();
    let width = 0;
    let height = 0;
    let frame;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);
    const hearts = Array.from({ length: count }, (_, i) => ({
      x: Math.random(),
      size: 7 + Math.random() * 15,
      delay: i < 14 ? Math.random() * 400 : Math.random() * duration * .43,
      life: duration * (.43 + Math.random() * .13),
      drift: 12 + Math.random() * 33,
      phase: Math.random() * Math.PI * 2,
      spin: (Math.random() - .5) * 1.3,
      color: colors[Math.floor(Math.random() * colors.length)],
      outline: Math.random() > .62,
    }));

    function draw(now) {
      const elapsed = now - start;
      context.clearRect(0, 0, width, height);
      for (const heart of hearts) {
        const progress = (elapsed - heart.delay) / heart.life;
        if (progress < 0 || progress > 1) continue;
        const x = heart.x * width + Math.sin(progress * 5 + heart.phase) * heart.drift;
        const y = -heart.size * 2 + progress * (height + heart.size * 4);
        context.save();
        context.translate(x, y);
        context.rotate(heart.spin * progress * 3 + Math.sin(progress * 4 + heart.phase) * .2);
        context.scale(heart.size, heart.size);
        context.globalAlpha = Math.min(1, (1 - progress) * 4) * .78;
        context.beginPath();
        context.moveTo(0, .55);
        context.bezierCurveTo(-1.2, -.2, -.65, -1.1, 0, -.42);
        context.bezierCurveTo(.65, -1.1, 1.2, -.2, 0, .55);
        context.closePath();
        if (heart.outline) {
          context.lineWidth = .085;
          context.strokeStyle = heart.color;
          context.stroke();
        } else {
          context.fillStyle = heart.color;
          context.fill();
        }
        context.restore();
      }
      if (elapsed < duration && !motion.matches) frame = requestAnimationFrame(draw);
      else finish();
    }

    function finish() {
      cancelAnimationFrame(frame);
      context.clearRect(0, 0, width, height);
      window.removeEventListener('resize', resize);
      motion.removeEventListener('change', finish);
    }
    motion.addEventListener('change', finish);
    frame = requestAnimationFrame(draw);
  }
})();
