const CAMPAIGN = {
  goal: null,
  collected: 0,
  supporters: 0,
  comments: 0,
  currency: '₽',
  showGoal: false,
};

const SBP = {
  qrId: 'AD10002CP9O84B6O9R5HHT8A12U7B01N',
  bankId: '100000000111',
  bankName: 'СберБанк',
  purpose: 'Поддержка мечты',
  staticQrPath: 'assets/sbp-qr.png',
  phoneNumber: '89268117299',
};

function formatPhoneNumber(phone) {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 11 && (digits[0] === '7' || digits[0] === '8')) {
    const local = digits.slice(1);
    return `8 (${local.slice(0, 3)}) ${local.slice(3, 6)}-${local.slice(6, 8)}-${local.slice(8)}`;
  }
  return phone;
}

function formatAmount(amount) {
  return amount.toLocaleString('ru-RU') + ' ' + CAMPAIGN.currency;
}
