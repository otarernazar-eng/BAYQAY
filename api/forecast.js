module.exports = (req, res) => {
  const { location = 'Порт' } = req.query;
  const risks = ['low', 'medium', 'high'];
  const risk = risks[Math.floor(Math.random() * risks.length)];
  
  let msg = 'Экологиялық көрсеткіштер қалыпты деңгейде.';
  if (risk === 'medium') msg = 'Кейбір параметрлерде ауытқулар байқалады. Мониторинг күшейтілуі тиіс.';
  if (risk === 'high') msg = 'Критикалық деңгей! Судың сапасы күрт төмендеген, эвтрофикация қаупі бар.';

  res.json({ riskLevel: risk, message: msg });
};
