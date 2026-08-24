function initStats() {
  const percent = CAMPAIGN.goal
    ? Math.round((CAMPAIGN.collected / CAMPAIGN.goal) * 100)
    : 0;

  document.getElementById('supporters-count').textContent = CAMPAIGN.supporters.toLocaleString('ru-RU');
  document.getElementById('comments-count').textContent = CAMPAIGN.comments.toLocaleString('ru-RU');

  if (CAMPAIGN.showGoal && CAMPAIGN.goal) {
    const remaining = CAMPAIGN.goal - CAMPAIGN.collected;
    document.getElementById('goal-amount').textContent = formatAmount(CAMPAIGN.goal);
    document.getElementById('remaining-amount').textContent = formatAmount(remaining);
    document.getElementById('progress-fill').style.width = percent + '%';
    document.getElementById('progress-percent').textContent = percent + '%';
  } else {
    document.querySelector('.stats-goal').hidden = true;
    document.querySelector('.stats-progress').hidden = true;
  }
}

function initDonateModal() {
  const modal = document.getElementById('donate-modal');
  const donateForm = document.getElementById('donate-form');
  const paymentPanel = document.getElementById('payment-panel');
  const customInput = document.getElementById('custom-amount');
  const submitBtn = document.getElementById('submit-donation');
  const presetBtns = document.querySelectorAll('.amount-btn');
  const qrCanvas = document.getElementById('qr-canvas');
  const qrImage = document.getElementById('qr-image');
  const qrHint = document.getElementById('qr-hint');
  const paymentNote = document.getElementById('payment-note');
  let selectedAmount = null;

  function openModal() {
    resetForm();
    modal.showModal();
  }

  function closeModal() {
    modal.close();
    resetForm();
  }

  function resetForm() {
    selectedAmount = null;
    customInput.value = '';
    document.getElementById('donor-name').value = '';
    presetBtns.forEach((btn) => btn.classList.remove('selected'));
    submitBtn.disabled = true;
    donateForm.hidden = false;
    paymentPanel.hidden = true;
    qrCanvas.hidden = true;
    qrImage.hidden = true;
  }

  function getSelectedAmount() {
    const custom = parseInt(customInput.value, 10);
    return custom > 0 ? custom : selectedAmount;
  }

  function updateSubmitState() {
    const amount = getSelectedAmount();
    submitBtn.disabled = !amount || amount <= 0;
  }

  function showStaticQr(amount) {
    qrCanvas.hidden = true;
    qrImage.hidden = false;
    qrImage.src = SBP.staticQrPath;
    qrHint.textContent = `Отсканируйте QR-код в ${SBP.bankName} и укажите сумму ${formatAmount(amount)}`;
    paymentNote.textContent = `Назначение платежа: ${SBP.purpose}`;
  }

  async function renderDynamicQr(amount) {
    const paymentUrl = buildDynamicSbpUrl(amount);

    if (typeof QRCode !== 'undefined') {
      qrImage.hidden = true;
      qrCanvas.hidden = false;
      await QRCode.toCanvas(qrCanvas, paymentUrl, {
        width: 220,
        margin: 2,
        color: { dark: '#1f2937', light: '#ffffff' },
      });
      qrHint.textContent = `Отсканируйте QR-код в ${SBP.bankName} — сумма ${formatAmount(amount)} уже указана`;
      paymentNote.textContent = `Назначение платежа: ${SBP.purpose}`;
      return;
    }

    showStaticQr(amount);
  }

  async function showPaymentPanel(amount) {
    donateForm.hidden = true;
    paymentPanel.hidden = false;
    document.getElementById('payment-amount').textContent = formatAmount(amount);

    try {
      await renderDynamicQr(amount);
    } catch {
      showStaticQr(amount);
    }
  }

  document.querySelectorAll('[data-action="donate"]').forEach((btn) => {
    btn.addEventListener('click', openModal);
  });

  modal.querySelector('.modal-close').addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  presetBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      presetBtns.forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedAmount = parseInt(btn.dataset.amount, 10);
      customInput.value = '';
      updateSubmitState();
    });
  });

  customInput.addEventListener('input', () => {
    presetBtns.forEach((b) => b.classList.remove('selected'));
    selectedAmount = null;
    updateSubmitState();
  });

  submitBtn.addEventListener('click', () => {
    const amount = getSelectedAmount();
    if (amount > 0) showPaymentPanel(amount);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initStats();
  initDonateModal();
});
