/* Motoryn: native page navigation, decorative motion, and browser-local examples. */
'use strict';
(() => {
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const readPreference = key => { try { return sessionStorage.getItem(key); } catch { return null; } };
  const writePreference = (key, value) => { try { sessionStorage.setItem(key, value); } catch { /* Optional display preferences only. */ } };
  let motion = false;
  const setMotion = requested => {
    motion = requested && !reduced.matches;
    root.dataset.motion = motion ? 'on' : 'off';
    document.querySelectorAll('[data-motion-toggle]').forEach(button => {
      button.setAttribute('aria-pressed', String(!motion));
      button.setAttribute('aria-label', reduced.matches ? 'Animations paused by your reduced-motion preference' : 'Pause animations');
      button.disabled = reduced.matches;
      button.querySelector('[data-motion-label]').textContent = reduced.matches ? 'Reduced motion' : motion ? 'Motion on' : 'Motion off';
    });
    if (!motion) {
      root.style.setProperty('--pointer-x', '0');
      root.style.setProperty('--pointer-y', '0');
      document.querySelectorAll('[data-reveal]').forEach(el => { el.dataset.reveal = 'visible'; });
    }
  };
  const setScene = scene => {
    const safeScene = scene === 'ember' ? 'ember' : 'cobalt';
    root.dataset.scene = safeScene;
    document.querySelectorAll('[data-scene]').forEach(button => {
      if (button.tagName === 'BUTTON') button.setAttribute('aria-pressed', String(button.dataset.scene === safeScene));
    });
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = safeScene === 'ember' ? '#84224c' : '#1628cf';
  };
  document.querySelectorAll('[data-motion-toggle]').forEach(button => button.addEventListener('click', () => {
    const next = !motion;
    writePreference('motoryn-motion', next ? 'on' : 'off');
    setMotion(next);
  }));
  reduced.addEventListener('change', () => setMotion(readPreference('motoryn-motion') !== 'off'));
  document.querySelectorAll('button[data-scene]').forEach(button => button.addEventListener('click', () => {
    setScene(button.dataset.scene);
    writePreference('motoryn-scene', button.dataset.scene);
  }));
  setMotion(readPreference('motoryn-motion') !== 'off');
  setScene(readPreference('motoryn-scene'));

  const menu = document.getElementById('site-menu');
  const menuButton = document.querySelector('[data-menu-open]');
  const openers = new WeakMap();
  const openDialog = (dialog, opener) => {
    if (!dialog || dialog.open) return;
    openers.set(dialog, opener || document.activeElement);
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    dialog.querySelector('[data-close-dialog]')?.focus({ preventScroll: true });
  };
  const closeDialog = dialog => {
    if (!dialog) return;
    if (typeof dialog.close === 'function') dialog.close();
    else { dialog.removeAttribute('open'); openers.get(dialog)?.focus({ preventScroll: true }); }
  };
  menuButton?.addEventListener('click', () => {
    openDialog(menu, menuButton);
    menuButton.setAttribute('aria-expanded', 'true');
  });
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.querySelectorAll('[data-close-dialog]').forEach(button => button.addEventListener('click', () => closeDialog(dialog)));
    dialog.addEventListener('close', () => {
      if (dialog === menu) menuButton?.setAttribute('aria-expanded', 'false');
      openers.get(dialog)?.focus({ preventScroll: true });
    });
    dialog.addEventListener('click', event => { if (event.target === dialog && dialog !== menu) closeDialog(dialog); });
  });
  menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeDialog(menu)));

  const gallery = document.getElementById('image-dialog');
  const galleryImages = {
    'wheel-study': { path: '/assets/wheel-study-1600.webp', alt: 'AI-generated concept detail of a graphite wagon’s wheel and bodywork', caption: 'Original Motoryn AI concept image. Fictional vehicle; not inspected equipment, available inventory, or a real facility.' },
  };
  document.querySelectorAll('[data-gallery]').forEach(button => button.addEventListener('click', () => {
    const item = galleryImages[button.dataset.gallery];
    if (!item || !gallery) return;
    const image = gallery.querySelector('#gallery-image');
    image.src = item.path;
    image.alt = item.alt;
    gallery.querySelector('#gallery-caption').textContent = item.caption;
    openDialog(gallery, button);
  }));

  const recordData = {
  "documented": {
    "label": "DOCUMENTED",
    "source": "Sample invoice",
    "date": "JUN 2024",
    "mileage": "24,000 mi",
    "item": "Oil service",
    "heading": "A record you can point to.",
    "copy": "This fictional file includes an invoice for an oil service. A source belongs with the entry; it does not establish the vehicle\u2019s current condition.",
    "question": "Which manufacturer guidance applies to this vehicle and its use? Review the available record before agreeing the next scope.",
    "modal": "The example invoice supports one dated entry. It is not a complete service history or proof of the car\u2019s current condition."
  },
  "noted": {
    "label": "OWNER NOTE",
    "source": "Owner recollection",
    "date": "APR 2025",
    "mileage": "31,000 mi",
    "item": "Tire rotation",
    "heading": "Useful context. Still a note.",
    "copy": "The fictional owner remembers a tire rotation, but there is no invoice in this sample. Keep the recollection visible without turning it into documented work.",
    "question": "Can the previous provider supply a record? Which details can the technician verify, and what remains unknown?",
    "modal": "An owner recollection can help a conversation, but it should stay visibly distinct from a dated source document."
  },
  "unknown": {
    "label": "UNKNOWN",
    "source": "No supporting record",
    "date": "DATE UNKNOWN",
    "mileage": "Mileage unknown",
    "item": "Brake-fluid history",
    "heading": "Unknown can stay unknown.",
    "copy": "No brake-fluid service record appears in the fictional file. That alone does not establish an overdue item, a fault, or a required repair.",
    "question": "Please review the correct manufacturer guidance, the available history, and the vehicle itself before explaining any proposed inspection or work.",
    "modal": "A gap is a question to discuss. This example does not diagnose a mechanical issue or recommend a service interval."
  }
};
  let selectedRecord = 'documented';
  const recordPanel = document.getElementById('evidence-panel');
  const selectRecord = key => {
    if (!Object.hasOwn(recordData, key) || !recordPanel) return;
    selectedRecord = key;
    const item = recordData[key];
    document.querySelectorAll('[data-record]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.record === key)));
    const fields = { 'record-date': item.date, 'record-mileage': item.mileage, 'evidence-source': 'SOURCE / ' + item.source.toUpperCase(), 'evidence-heading': item.heading, 'evidence-copy': item.copy, 'shop-question': item.question };
    for (const [id, value] of Object.entries(fields)) document.getElementById(id).textContent = value;
    if (motion && typeof recordPanel.animate === 'function') recordPanel.animate([{ opacity: .35, transform: 'translateY(9px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 260, easing: 'ease-out' });
  };
  document.querySelectorAll('[data-record]').forEach(button => { button.addEventListener('click', () => selectRecord(button.dataset.record)); button.disabled = false; });
  const recordDialog = document.getElementById('record-dialog');
  document.querySelector('[data-inspect-record]')?.addEventListener('click', event => {
    const item = recordData[selectedRecord];
    const fields = { 'record-dialog-label': item.label, 'record-dialog-title': item.item, 'record-dialog-date': item.date, 'record-dialog-mileage': item.mileage, 'record-dialog-source': item.source, 'record-dialog-copy': item.modal };
    for (const [id, value] of Object.entries(fields)) document.getElementById(id).textContent = value;
    openDialog(recordDialog, event.currentTarget);
  });

  const briefViews = {
    owner: ['Keep your part of the conversation clear.', 'Bring what you have, mark what you remember, and ask for an explanation before agreeing to work.'],
    workshop: ['A clearer starting point for the conversation.', 'A prepared record can make the owner’s questions easier to understand. The workshop independently reviews the vehicle, relevant guidance, inspection scope, and estimate.'],
  };
  document.querySelectorAll('[data-brief-view]').forEach(button => { button.disabled = false; button.addEventListener('click', () => {
    const key = button.dataset.briefView;
    if (!Object.hasOwn(briefViews, key)) return;
    document.querySelectorAll('[data-brief-view]').forEach(el => el.setAttribute('aria-pressed', String(el === button)));
    document.getElementById('brief-view-title').textContent = briefViews[key][0];
    document.getElementById('brief-view-copy').textContent = briefViews[key][1];
  }); });
  document.querySelector('[data-open-brief]')?.addEventListener('click', event => openDialog(document.getElementById('brief-dialog'), event.currentTarget));

  const form = document.querySelector('[data-note-builder]');
  if (form) {
    const steps = [...form.querySelectorAll('[data-step]')];
    const result = document.getElementById('note-result');
    const area = document.getElementById('draft-note');
    const email = document.getElementById('email-note');
    const status = document.getElementById('note-status');
    let step = 0;
    const labels = ['THE RECORD YOU HAVE', 'THE CONVERSATION YOU WANT', 'A LITTLE CONTEXT'];
    const headings = ['EVERY STORY\nSTARTS SOMEWHERE.', 'A CLEARER\nSTARTING POINT.', 'MAKE THE FIRST\nNOTE YOURS.'];
    const showStep = (next, moveFocus = true) => {
      step = Math.max(0, Math.min(steps.length - 1, next));
      steps.forEach((el, index) => { el.hidden = index !== step; });
      form.querySelectorAll('[data-step-marker]').forEach((el, index) => {
        el.classList.toggle('active', index === step);
        if (index === step) el.setAttribute('aria-current', 'step'); else el.removeAttribute('aria-current');
      });
      const number = document.querySelector('.builder-number');
      number.replaceChildren(document.createTextNode(String(step + 1).padStart(2, '0')));
      const total = document.createElement('span'); total.textContent = '/03'; number.append(total);
      document.getElementById('builder-step-label').textContent = labels[step];
      const heading = document.getElementById('builder-step-title');
      heading.textContent = headings[step]; heading.style.whiteSpace = 'pre-line';
      if (moveFocus) {
        const legend = steps[step].querySelector('legend'); legend.tabIndex = -1; legend.focus({ preventScroll: true });
        form.scrollIntoView({ block: 'start', behavior: motion ? 'smooth' : 'auto' });
      }
    };
    const coverageNotes = {
      'Mostly complete records': 'Start with the sources you have. A source belongs with each dated entry.',
      'Scattered receipts and gaps': 'Keep documented work and recollection separate. Leave the gaps visible.',
      'Little or no service history': 'A missing history does not establish condition. Start with the questions you want to clarify.',
    };
    form.querySelectorAll('[name="coverage"]').forEach(input => input.addEventListener('change', () => {
      if (input.checked) document.getElementById('coverage-note').textContent = coverageNotes[input.value] || '';
    }));
    form.querySelectorAll('[data-next-step]').forEach(button => button.addEventListener('click', () => showStep(step + 1)));
    form.querySelectorAll('[data-previous-step]').forEach(button => button.addEventListener('click', () => showStep(step - 1)));
    const updateEmail = () => { email.href = 'mailto:josephjilovec@pm.me?subject=' + encodeURIComponent('Motoryn — ownership-planning interest') + '&body=' + encodeURIComponent(area.value); };
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (step < steps.length - 1) { showStep(step + 1); return; }
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      area.value = 'Motoryn — my ownership-planning note\n\n' +
        'Record coverage: ' + data.get('coverage') + '\n' +
        'Planning goal: ' + data.get('goal') + '\n' +
        'General vehicle description: ' + (String(data.get('vehicle') || '').trim() || 'To discuss') + '\n' +
        'Ownership question: ' + (String(data.get('context') || '').trim() || 'To discuss') + '\n\n' +
        'I am interested in the Motoryn vehicle-record planning concept. I would like to understand whether a suitable engagement is available and agree the scope first. This is not an inspection, diagnosis, repair authorization, or booking request.';
      updateEmail();
      form.hidden = true; result.hidden = false;
      status.textContent = 'Draft created in this browser. Nothing has been sent.';
      document.getElementById('note-result-title').focus({ preventScroll: true });
      result.scrollIntoView({ block: 'start', behavior: motion ? 'smooth' : 'auto' });
    });
    area.addEventListener('input', updateEmail);
    document.querySelector('[data-copy-note]').addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(area.value); status.textContent = 'Copied. You choose where to paste and send it.'; }
      catch { area.focus(); area.select(); status.textContent = 'Select and copy the draft above using your device’s copy command.'; }
    });
    document.querySelector('[data-download-note]').addEventListener('click', () => {
      const blob = new Blob([area.value], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob); const link = document.createElement('a');
      link.href = url; link.download = 'motoryn-ownership-note.txt'; document.body.append(link); link.click(); link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      status.textContent = 'Text file prepared for download. Nothing has been submitted to Motoryn.';
    });
    document.querySelector('[data-edit-note]').addEventListener('click', () => { result.hidden = true; form.hidden = false; showStep(0); });
    const goal = form.querySelector('[name="goal"]');
    if (location.hash === '#workshop') goal.value = 'A conversation with my chosen workshop';
    if (location.hash === '#record') goal.value = 'An organized service timeline';
    showStep(0, false);
    form.querySelector('[type="submit"]').disabled = false;
  }

  let scrollPending = false;
  const updateScroll = () => {
    const height = root.scrollHeight - window.innerHeight;
    root.style.setProperty('--scroll', String(height > 0 ? Math.max(0, Math.min(1, window.scrollY / height)) : 0));
    scrollPending = false;
  };
  window.addEventListener('scroll', () => { if (!scrollPending) { scrollPending = true; requestAnimationFrame(updateScroll); } }, { passive: true });
  window.addEventListener('resize', updateScroll, { passive: true });
  updateScroll();
  const hero = document.querySelector('[data-parallax]');
  if (hero && window.matchMedia('(pointer: fine)').matches) {
    let pointerPending = false, pointerX = 0, pointerY = 0;
    hero.addEventListener('pointermove', event => {
      if (!motion) return;
      const rect = hero.getBoundingClientRect(); pointerX = (event.clientX - rect.left) / rect.width - .5; pointerY = (event.clientY - rect.top) / rect.height - .5;
      if (!pointerPending) { pointerPending = true; requestAnimationFrame(() => { root.style.setProperty('--pointer-x', String(pointerX)); root.style.setProperty('--pointer-y', String(pointerY)); pointerPending = false; }); }
    }, { passive: true });
    hero.addEventListener('pointerleave', () => { root.style.setProperty('--pointer-x', '0'); root.style.setProperty('--pointer-y', '0'); });
  }
  if (motion && 'IntersectionObserver' in window) {
    const items = document.querySelectorAll('.manifesto-copy,.section-heading,.garage-tile,.road-copy,.final-call>div,.about-story>div');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.dataset.reveal = 'visible'; observer.unobserve(entry.target); } });
    }, { threshold: .08 });
    items.forEach(item => { item.dataset.reveal = 'waiting'; observer.observe(item); });
    root.classList.add('motion-ready');
  }
  root.classList.add('js');
})();
