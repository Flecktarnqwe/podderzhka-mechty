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
};

function formatAmount(amount) {
  return amount.toLocaleString('ru-RU') + ' ' + CAMPAIGN.currency;
}
