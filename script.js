// ===== Menu mobile (hambúrguer) =====
(() => {
  const toggle = document.getElementById('menuToggle');
  const menu = document.getElementById('siteMenu');
  const overlay = document.getElementById('menuOverlay');
  if (!toggle || !menu) return;

  const closeMenu = () => {
    menu.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    overlay && overlay.classList.remove('active');
    document.body.classList.remove('menu-locked');
  };
  const openMenu = () => {
    menu.classList.add('open');
    toggle.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    overlay && overlay.classList.add('active');
    document.body.classList.add('menu-locked');
  };

  toggle.addEventListener('click', () => {
    menu.classList.contains('open') ? closeMenu() : openMenu();
  });
  overlay && overlay.addEventListener('click', closeMenu);
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1300) closeMenu();
  });
})();

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

let planoAtualSelecionado = '';

planCards.forEach((plan) => {
  const select = () => {
    planCards.forEach((p) => {
      p.classList.remove('selected');
      p.setAttribute('aria-pressed', 'false');
    });
    plan.classList.add('selected');
    plan.setAttribute('aria-pressed', 'true');

    planoAtualSelecionado = plan.dataset.plan;
    planosNote.innerHTML = `Plano selecionado: <strong>${planoAtualSelecionado}</strong>. Escolha como falar com a gente:`;
    planosActions.hidden = false;
  };

  plan.addEventListener('click', (e) => {
    if (e.target.closest('button, a')) return;
    select();
  });
  plan.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      select();
    }
  });
});

// ===== Modal: formulário de plano / aula (nome do aluno + data) =====
const planModalOverlay = document.getElementById('planModalOverlay');
const planModalClose = document.getElementById('planModalClose');
const planModalEyebrow = document.getElementById('planModalEyebrow');
const planModalTitle = document.getElementById('planModalTitle');
const planModalDesc = document.getElementById('planModalDesc');
const planForm = document.getElementById('planForm');
const planFormFeedback = document.getElementById('planFormFeedback');

let planFormIntent = 'plano'; // 'plano' ou 'aula'

const openPlanModal = (intent) => {
  if (!planModalOverlay) return;
  planFormIntent = intent;

  if (intent === 'aula') {
    planModalEyebrow.textContent = 'AULA EXPERIMENTAL';
    planModalTitle.textContent = planoAtualSelecionado
      ? `Agendar aula experimental — ${planoAtualSelecionado}`
      : 'Agendar aula experimental';
    planModalDesc.textContent = 'Preencha seus dados e escolha o dia que você quer experimentar. Vamos abrir o WhatsApp com a mensagem pronta.';
  } else {
    planModalEyebrow.textContent = 'PLANO SELECIONADO';
    planModalTitle.textContent = `Contratar plano ${planoAtualSelecionado}`;
    planModalDesc.textContent = 'Preencha seus dados e o dia que pretende começar. Vamos abrir o WhatsApp com a mensagem pronta.';
  }

  if (planFormFeedback) planFormFeedback.hidden = true;
  if (planForm) planForm.reset();

  planModalOverlay.classList.add('active');
  document.body.classList.add('menu-locked');
  const firstInput = document.getElementById('planAlunoNome');
  firstInput && firstInput.focus();
};

const closePlanModal = () => {
  if (!planModalOverlay) return;
  planModalOverlay.classList.remove('active');
  document.body.classList.remove('menu-locked');
};

// Botões do cabeçalho / menu mobile: agendamento de aula sem plano específico
const headerCtaAula = document.getElementById('headerCtaAula');
const menuCtaAula = document.getElementById('menuCtaAula');
const openGeneralAulaModal = () => {
  planoAtualSelecionado = '';
  openPlanModal('aula');
};
headerCtaAula && headerCtaAula.addEventListener('click', openGeneralAulaModal);
menuCtaAula && menuCtaAula.addEventListener('click', openGeneralAulaModal);

ctaPlano && ctaPlano.addEventListener('click', () => openPlanModal('plano'));
ctaAula && ctaAula.addEventListener('click', () => openPlanModal('aula'));
planModalClose && planModalClose.addEventListener('click', closePlanModal);
planModalOverlay && planModalOverlay.addEventListener('click', (e) => {
  if (e.target === planModalOverlay) closePlanModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && planModalOverlay && planModalOverlay.classList.contains('active')) {
    closePlanModal();
  }
});

planForm && planForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const nomeAluno = document.getElementById('planAlunoNome').value.trim();
  const dataInicioRaw = document.getElementById('planDataInicio').value;
  const telefone = document.getElementById('planTelefone').value.trim();

  if (!nomeAluno || !dataInicioRaw) {
    if (planFormFeedback) {
      planFormFeedback.textContent = 'Preencha o nome do aluno e o dia que pretende começar.';
      planFormFeedback.hidden = false;
    }
    return;
  }

  const dataInicio = new Date(dataInicioRaw + 'T00:00:00');
  const dataFormatada = dataInicio.toLocaleDateString('pt-BR');

  let texto = '';
  if (planFormIntent === 'aula') {
    texto = `Olá! Quero agendar uma aula experimental no São Jorge Training Club.\n\n`;
    if (planoAtualSelecionado) texto += `*Plano de interesse:* ${planoAtualSelecionado}\n`;
    texto += `*Nome do aluno:* ${nomeAluno}\n`;
    texto += `*Dia que pretende começar:* ${dataFormatada}\n`;
  } else {
    texto = `Olá! Quero contratar o plano ${planoAtualSelecionado} do São Jorge Training Club.\n\n`;
    texto += `*Nome do aluno:* ${nomeAluno}\n`;
    texto += `*Dia que pretende começar:* ${dataFormatada}\n`;
  }
  if (telefone) texto += `*Telefone:* ${telefone}\n`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;
  window.open(url, '_blank', 'noopener');
  closePlanModal();
});

// ===== Formulário "Seja um patrocinador" -> envia para WhatsApp =====
const sponsorForm = document.getElementById('sponsorForm');
if (sponsorForm) {
  sponsorForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = document.getElementById('spNome').value.trim();
    const empresa = document.getElementById('spEmpresa').value.trim();
    const telefone = document.getElementById('spTelefone').value.trim();
    const email = document.getElementById('spEmail').value.trim();
    const cota = document.getElementById('spCota').value;
    const mensagem = document.getElementById('spMensagem').value.trim();

    if (!nome || !empresa || !telefone) {
      const feedback = document.getElementById('sponsorFeedback');
      if (feedback) {
        feedback.textContent = 'Preencha nome, empresa e telefone para continuar.';
        feedback.hidden = false;
      }
      return;
    }

    let texto = `Olá! Quero ser patrocinador do São Jorge Training Club.\n\n`;
    texto += `*Nome:* ${nome}\n`;
    texto += `*Empresa:* ${empresa}\n`;
    texto += `*Telefone:* ${telefone}\n`;
    if (email) texto += `*E-mail:* ${email}\n`;
    if (cota) texto += `*Cota de interesse:* ${cota}\n`;
    if (mensagem) texto += `*Mensagem:* ${mensagem}\n`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank', 'noopener');
  });
}
