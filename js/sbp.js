function crc16Ccitt(str) {
  let crc = 0xffff;

  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) : (crc << 1);
      crc &= 0xffff;
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function buildDynamicSbpUrl(amountRub) {
  const sumKopecks = Math.round(amountRub * 100);
  const base =
    `https://qr.nspk.ru/${SBP.qrId}?type=02&bank=${SBP.bankId}` +
    `&sum=${sumKopecks}&cur=RUB`;

  return `${base}&crc=${crc16Ccitt(base)}`;
}
