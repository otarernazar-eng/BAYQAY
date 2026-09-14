module.exports = (req, res) => {
  const { indicator = 'pH', startDate = '2026-01-01', endDate = '2026-12-31' } = req.query;

  function generateData(count, base, variance) {
    const data = [];
    const start = new Date(startDate).getTime() || new Date('2026-01-01').getTime();
    const end = new Date(endDate).getTime() || new Date('2026-12-31').getTime();
    const step = (end - start) / Math.max(1, count - 1);
    
    for (let i = 0; i < count; i++) {
      const date = new Date(start + step * i);
      const val = base + (Math.random() - 0.5) * variance;
      const isAnomaly = Math.random() > 0.95;
      const finalVal = isAnomaly ? val + variance * 2 : val;
      
      data.push({
        date: date.toISOString().split('T')[0],
        value: finalVal.toFixed(2),
        isAnomaly
      });
    }
    return data;
  }

  let base = 8, variance = 2;
  
  if (indicator.includes('Температура')) { base = 15; variance = 12; }
  else if (indicator.includes('pH')) { base = 8.1; variance = 0.5; }
  else if (indicator.includes('оттегі')) { base = 7; variance = 2; }
  else if (indicator.includes('Нитрат')) { base = 3; variance = 2; }
  else if (indicator.includes('Фосфат')) { base = 0.5; variance = 0.4; }
  else if (indicator.includes('Мұнай')) { base = 0.02; variance = 0.03; }

  const count = 30;

  res.json({
    indicator,
    group1: generateData(count, base, variance),
    group2: generateData(count, base * 1.1, variance * 1.2)
  });
};
