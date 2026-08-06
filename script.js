// ===== Carrosséis (setas de rolagem) =====
document.querySelectorAll('.carousel').forEach((carousel) => {
  const track = carousel.querySelector('.cards');
  const btnLeft = carousel.querySelector('.arrow-left');
  const btnRight = carousel.querySelector('.arrow-right');
  if (!track) return;

  const getStep = () => {
    const firstCard = track.querySelector(':scope > *');
    if (!firstCard) return track.clientWidth * 0.8;
    const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 22;
    return firstCard.getBoundingClientRect().width + gap;
  };

  const updateArrows = () => {
    const maxScroll = track.scrollWidth - track.clientWidth - 2;
    if (btnLeft) btnLeft.disabled = track.scrollLeft <= 0;
    if (btnRight) btnRight.disabled = track.scrollLeft >= maxScroll;
  };

  btnLeft && btnLeft.addEventListener('click', () => {
    track.scrollBy({ left: -getStep(), behavior: 'smooth' });
  });
  btnRight && btnRight.addEventListener('click', () => {
    track.scrollBy({ left: getStep(), behavior: 'smooth' });
  });

  track.addEventListener('scroll', updateArrows);
  window.addEventListener('resize', updateArrows);
  updateArrows();

  // Sincroniza os "dots" (bolinhas), se existirem para este carrossel
  const dotsWrap = carousel.parentElement.querySelector('.dots');
  if (dotsWrap) {
    const dots = Array.from(dotsWrap.querySelectorAll('.dot'));
    track.addEventListener('scroll', () => {
      const maxScroll = track.scrollWidth - track.clientWidth || 1;
      const progress = track.scrollLeft / maxScroll;
      const index = Math.min(dots.length - 1, Math.round(progress * (dots.length - 1)));
      dots.forEach((d, i) => d.classList.toggle('active', i === index));
    });
  }
});

// ===== Seleção de plano =====
const WHATSAPP_NUMBER = '5511975967226';
const planCards = document.querySelectorAll('.plan[data-plan]');
const planosNote = document.getElementById('planosNote');
const planosActions = document.getElementById('planosActions');
const ctaPlano = document.getElementById('ctaPlano');
const ctaAula = document.getElementById('ctaAula');

planCards.forEach((plan) => {
  const select = () => {
    planCards.forEach((p) => {
      p.classList.remove('selected');
      p.setAttribute('aria-pressed', 'false');
    });
    plan.classList.add('selected');
    plan.setAttribute('aria-pressed', 'true');

    const nome = plan.dataset.plan;
    planosNote.innerHTML = `Plano selecionado: <strong>${nome}</strong>. Escolha como falar com a gente:`;

    const msgPlano = encodeURIComponent(`Olá! Quero o plano ${nome} do São Jorge Training Club.`);
    const msgAula = encodeURIComponent(`Olá! Vi o plano ${nome} e quero agendar uma aula experimental no São Jorge Training Club.`);
    ctaPlano.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${msgPlano}`;
    ctaAula.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${msgAula}`;
    planosActions.hidden = false;
  };

  plan.addEventListener('click', (e) => {
    if (e.target.closest('a')) return; // deixa o botão seguir para o WhatsApp normalmente
    select();
  });
  plan.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      select();
    }
  });
});
