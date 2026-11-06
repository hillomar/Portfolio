/* ==========================================================
   Omar — Cybersecurity Portfolio
   Layer 1: portfolio UX + "alive" motion
   Layer 2: Tech Detective ARG (clues -> console -> riddles -> reveal)
   ========================================================== */
(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  /** Lowercase + strip everything except letters/digits so "Trust-No-One" and "trust no one" both match. */
  const normalize = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  /* ========================================================
     GAME CONFIG — edit the passcode, riddles and answers here
     ======================================================== */
  const CONFIG = {
    fragments: ['TRUST', 'NO', 'ONE'],              // printed one per clue
    passcodeDisplay: 'TRUST-NO-ONE',
    passcodeAccepted: ['trustnoone'],
    riddles: [
      {
        question: 'I am a wall that is not made of bricks. I judge every packet that knocks and decide who gets in. What am I?',
        hint: 'Hint: look at the Blue Team row in Skills, at the card about network defence.',
        answers: ['firewall', 'afirewall', 'thefirewall']
      },
      {
        question: 'In AWS I decide who can do what. Put one careless wildcard star inside me and the whole account is in trouble. Which three letters are my name?',
        hint: 'Hint: the first card in the Cloud Security row talks about me, with a long name.',
        answers: ['iam', 'awsiam', 'identityandaccessmanagement']
      },
      {
        question: "I turn a login box into a confession booth. Feed me ' OR 1=1 -- and I may let you in as admin. Which attack am I?",
        hint: 'Hint: the first project card promises to break a login box with one of me, someday. (The abbreviation is fine.)',
        answers: ['sqli', 'sqlinjection', 'sql', 'sqlinjectionattack']
      }
    ],
    roles: ['TryHackMe student', 'future Penetration Tester', 'future Blue Team Analyst', 'future Cloud Security Engineer', '2x shot put champion (true story)']
  };

  /* ========================================================
     LAYER 1 — PORTFOLIO UX
     ======================================================== */

  // Mobile nav
  const navToggle = $('#nav-toggle');
  const mobileMenu = $('#mobile-menu');
  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('hidden') === false;
      navToggle.setAttribute('aria-expanded', String(open));
    });
    $$('a', mobileMenu).forEach((a) =>
      a.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        navToggle.setAttribute('aria-expanded', 'false');
      })
    );
  }

  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Scroll-reveal
  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // Skill cards: cursor glow + tap/Enter to toggle (for touch devices)
  $$('.skill-card').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
    const toggle = () => card.classList.toggle('open');
    card.addEventListener('click', toggle);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });

  /* ========================================================
     "ALIVE" MOTION
     ======================================================== */

  // 1) Desynchronised gentle floating: every .float gets its own timing so nothing moves in lockstep.
  $$('.float').forEach((el) => {
    el.style.setProperty('--d', `${-(Math.random() * 8).toFixed(2)}s`);
    el.style.setProperty('--dur', `${(6 + Math.random() * 4).toFixed(2)}s`);
    if (!el.style.getPropertyValue('--amp')) {
      el.style.setProperty('--amp', `${(3 + Math.random() * 4).toFixed(1)}px`);
    }
  });

  // 2) Typewriter role line in the hero
  const typedEl = $('#typed');
  if (typedEl) {
    const roles = CONFIG.roles;
    if (reduceMotion) {
      typedEl.textContent = roles[0];
    } else {
      let roleIdx = 0;
      let charIdx = 0;
      let deleting = false;
      const tick = () => {
        const word = roles[roleIdx];
        typedEl.textContent = word.slice(0, charIdx);
        if (!deleting) {
          if (charIdx < word.length) { charIdx += 1; setTimeout(tick, 70); }
          else { deleting = true; setTimeout(tick, 1700); }
        } else if (charIdx > 0) {
          charIdx -= 1; setTimeout(tick, 32);
        } else {
          deleting = false;
          roleIdx = (roleIdx + 1) % roles.length;
          setTimeout(tick, 350);
        }
      };
      tick();
    }
  }

  // 3) Mouse parallax for background orbs + a lazy spotlight that follows the cursor
  if (!reduceMotion && finePointer) {
    const root = document.documentElement;
    const glow = $('#cursor-glow');
    let targetX = 0, targetY = 0;      // -0.5 .. 0.5
    let curX = 0, curY = 0;
    let px = window.innerWidth / 2, py = window.innerHeight / 2;
    let gx = px, gy = py;
    let rafId = null;

    const frame = () => {
      curX += (targetX - curX) * 0.06;
      curY += (targetY - curY) * 0.06;
      gx += (px - gx) * 0.12;
      gy += (py - gy) * 0.12;
      root.style.setProperty('--px', curX.toFixed(4));
      root.style.setProperty('--py', curY.toFixed(4));
      if (glow) glow.style.transform = `translate3d(${gx.toFixed(1)}px, ${gy.toFixed(1)}px, 0)`;

      const settled = Math.abs(targetX - curX) < 0.0005 && Math.abs(targetY - curY) < 0.0005 &&
                      Math.abs(px - gx) < 0.4 && Math.abs(py - gy) < 0.4;
      rafId = settled ? null : requestAnimationFrame(frame);
    };

    window.addEventListener('pointermove', (e) => {
      targetX = e.clientX / window.innerWidth - 0.5;
      targetY = e.clientY / window.innerHeight - 0.5;
      px = e.clientX;
      py = e.clientY;
      if (glow) glow.classList.add('on');
      if (rafId === null) rafId = requestAnimationFrame(frame);
    }, { passive: true });
  }

  // 4) Soft 3D tilt on cards that follow the pointer
  if (!reduceMotion && finePointer) {
    $$('[data-tilt]').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(800px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg) translateY(-5px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  /* ========================================================
     LAYER 2A — CLUE TRACKER (state manager)
     ======================================================== */
  const DevLog = (() => {
    const panel = $('#dev-log');
    const body = $('#dev-log-body');
    const toggleBtn = $('#dev-log-toggle');

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const collapsed = panel.classList.toggle('collapsed');
        toggleBtn.textContent = collapsed ? 'show' : 'hide';
        toggleBtn.setAttribute('aria-expanded', String(!collapsed));
      });
    }

    return {
      show() { panel.hidden = false; },
      print(text, cls = '') {
        const p = document.createElement('p');
        if (cls) p.className = cls;
        p.textContent = text;
        body.appendChild(p);
        body.scrollTop = body.scrollHeight;
      }
    };
  })();

  const ClueTracker = (() => {
    const clues = $$('.clue[data-clue]');
    const total = CONFIG.fragments.length;
    let progress = 0; // number of clues found in the correct order

    function reset() {
      progress = 0;
      clues.forEach((c) => c.classList.remove('found'));
    }

    function nudge(el) {
      el.classList.remove('nudge');
      void el.offsetWidth; // restart animation
      el.classList.add('nudge');
    }

    function handle(el) {
      const id = Number(el.dataset.clue);
      if (id <= progress) return; // already found

      if (id === progress + 1) {
        progress += 1;
        el.classList.add('found');
        DevLog.show();
        DevLog.print(`[trace ${progress}/${total}] fragment recovered: ${CONFIG.fragments[progress - 1]}`, 'ok');

        if (progress === total) {
          DevLog.print('trace complete. passcode assembled:', 'ok');
          DevLog.print(CONFIG.passcodeDisplay, 'pass');
          DevLog.print('hint: the footer console is waiting for this key.');
        }
        return;
      }

      // Wrong order
      nudge(el);
      if (progress > 0) {
        DevLog.print('!! sequence broken. trace reset. start again from the first clue.', 'err');
        reset();
      }
    }

    clues.forEach((el) => el.addEventListener('click', () => handle(el)));
    return { reset };
  })();

  /* ========================================================
     LAYER 2B — FOOTER CONSOLE
     ======================================================== */
  const consoleForm = $('#console-form');
  const consoleInput = $('#console-input');
  const consoleStatus = $('#console-status');
  let consoleTimer = null;

  function setConsoleStatus(text, cls) {
    consoleStatus.textContent = text;
    consoleStatus.className = `console-status ${cls || ''}`;
  }

  consoleForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const entered = normalize(consoleInput.value);
    if (!entered) {
      setConsoleStatus('> no key entered.', 'err');
      return;
    }

    if (CONFIG.passcodeAccepted.includes(entered)) {
      setConsoleStatus('> authorization accepted. opening dossier...', 'ok');
      consoleInput.value = '';
      clearTimeout(consoleTimer);
      consoleTimer = setTimeout(() => {
        Dossier.open();
        setConsoleStatus('', '');
      }, 700);
    } else {
      setConsoleStatus('> ACCESS DENIED. invalid authorization key.', 'err');
      consoleForm.classList.remove('shake');
      void consoleForm.offsetWidth;
      consoleForm.classList.add('shake');
    }
  });

  /* ========================================================
     LAYER 2C — DETECTIVE DOSSIER OVERLAY
     ======================================================== */
  const Dossier = (() => {
    const overlay = $('#dossier');
    const stages = {
      intro: $('#stage-intro'),
      riddles: $('#stage-riddles'),
      granted: $('#stage-granted'),
      reveal: $('#stage-reveal')
    };
    const exitBtn = $('#exit-console');
    const beginBtn = $('#begin-btn');
    const riddleForm = $('#riddle-form');
    const riddleInput = $('#riddle-input');
    const riddleQuestion = $('#riddle-question');
    const riddleHint = $('#riddle-hint');
    const riddleCounter = $('#riddle-counter');
    const riddleFeedback = $('#riddle-feedback');
    const dots = $$('#riddle-dots .dot-step');
    const confettiBox = $('#confetti');
    const revealExit = $('#reveal-exit');
    const revealReplay = $('#reveal-replay');

    let current = 0;
    let isOpen = false;
    let lastFocus = null;
    let timers = [];

    const later = (fn, ms) => {
      const t = setTimeout(fn, ms);
      timers.push(t);
      return t;
    };
    const clearTimers = () => {
      timers.forEach(clearTimeout);
      timers = [];
    };

    function showStage(name) {
      Object.entries(stages).forEach(([key, el]) => { el.hidden = key !== name; });
    }

    function renderRiddle() {
      const r = CONFIG.riddles[current];
      riddleCounter.textContent = `RIDDLE ${current + 1} / ${CONFIG.riddles.length}`;
      riddleQuestion.textContent = r.question;
      riddleHint.textContent = r.hint;
      riddleFeedback.textContent = '';
      riddleFeedback.className = 'mt-3 font-mono text-sm min-h-[1.5rem]';
      riddleInput.value = '';
      riddleInput.classList.remove('wrong');
      dots.forEach((d, i) => {
        d.classList.toggle('done', i < current);
        d.classList.toggle('active', i === current);
      });
      riddleInput.focus();
    }

    function confetti() {
      if (reduceMotion) return;
      const icons = ['🔒', '🛡️', '🔑', '✨', '☕', '🐛'];
      confettiBox.innerHTML = '';
      for (let i = 0; i < 36; i++) {
        const s = document.createElement('span');
        s.textContent = icons[Math.floor(Math.random() * icons.length)];
        s.style.left = `${Math.random() * 100}%`;
        s.style.fontSize = `${14 + Math.random() * 18}px`;
        s.style.animationDuration = `${3 + Math.random() * 3}s`;
        s.style.animationDelay = `${Math.random() * 1.2}s`;
        confettiBox.appendChild(s);
      }
    }

    function grant() {
      showStage('granted');
      dots.forEach((d) => { d.classList.add('done'); d.classList.remove('active'); });
      later(() => {
        showStage('reveal');
        confetti();
        revealExit.focus();
      }, 2600);
    }

    function startRiddles() {
      current = 0;
      showStage('riddles');
      renderRiddle();
    }

    function reset() {
      clearTimers();
      current = 0;
      riddleInput.disabled = false;
      confettiBox.innerHTML = '';
      showStage('intro');
    }

    function open() {
      if (isOpen) return;
      isOpen = true;
      lastFocus = document.activeElement;
      reset();
      overlay.hidden = false;
      document.body.classList.add('no-scroll');
      beginBtn.focus();
    }

    function close() {
      if (!isOpen) return;
      isOpen = false;
      clearTimers();
      overlay.hidden = true;
      document.body.classList.remove('no-scroll');
      if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    }

    beginBtn.addEventListener('click', startRiddles);
    exitBtn.addEventListener('click', close);
    revealExit.addEventListener('click', close);
    revealReplay.addEventListener('click', () => { reset(); beginBtn.focus(); });

    riddleForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const answer = normalize(riddleInput.value);
      if (!answer) {
        riddleFeedback.textContent = '> type an answer first, analyst.';
        riddleFeedback.className = 'mt-3 font-mono text-sm min-h-[1.5rem] err';
        return;
      }

      if (CONFIG.riddles[current].answers.includes(answer)) {
        riddleFeedback.textContent = '> CORRECT. lock disengaged.';
        riddleFeedback.className = 'mt-3 font-mono text-sm min-h-[1.5rem] ok';
        dots[current].classList.add('done');
        dots[current].classList.remove('active');
        riddleInput.disabled = true;
        later(() => {
          riddleInput.disabled = false;
          current += 1;
          if (current >= CONFIG.riddles.length) grant();
          else renderRiddle();
        }, 900);
      } else {
        riddleFeedback.textContent = '> incorrect. the lock holds. check the hint and try again.';
        riddleFeedback.className = 'mt-3 font-mono text-sm min-h-[1.5rem] err';
        riddleInput.classList.remove('wrong');
        void riddleInput.offsetWidth;
        riddleInput.classList.add('wrong');
        riddleInput.select();
      }
    });

    // Keyboard: Esc exits, Tab stays inside the overlay
    document.addEventListener('keydown', (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === 'Tab') {
        const focusables = $$('button, input, a[href]', overlay).filter(
          (el) => !el.disabled && el.offsetParent !== null
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    return { open, close };
  })();
})();
