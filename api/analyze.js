module.exports = (req, res) => {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Accept POST requests
  let data = req.body;
  if (typeof data === 'string') {
    try { data = JSON.parse(data); } catch(e){}
  }
  
  if (!data || !data.indicator) {
    // Try query params just in case (fallback)
    data = req.query;
  }

  const indicator = (data.indicator || "").toLowerCase();
  const mean = parseFloat(data.mean || 0);
  const anomaliesCount = parseInt(data.anomaliesCount || 0);
  const totalCount = parseInt(data.totalCount || 1);
  const max = parseFloat(data.max || 0);

  let riskLevel = 'төмен'; // low
  let message = 'Экологиялық көрсеткіштер қалыпты деңгейде. Айтарлықтай қауіп төніп тұрған жоқ.';

  if (anomaliesCount > totalCount * 0.1) {
    riskLevel = 'орташа';
    message = 'Деректерде ауытқулар (аномалиялар) байқалды. Мониторингті күшейту ұсынылады.';
  }

  // Specific AI logic per indicator
  if (indicator.includes('температура') || indicator.includes('temp')) {
    if (mean > 25 || max > 28) {
      riskLevel = 'жоғары';
      message = 'Температура өте жоғары. Судың жылынуы фитопланктондардың гүлденуіне (эвтрофикация) және оттегінің төмендеуіне әкеп соғуы мүмкін.';
    }
  } else if (indicator.includes('оттегі') || indicator.includes('кислород') || indicator.includes('o2')) {
    if (mean < 5) {
      riskLevel = 'жоғары';
      message = 'Еріген оттегінің деңгейі критикалық шектен төмен! Балықтардың қырылу (замор) қаупі өте жоғары. Шұғыл шаралар қабылдау қажет.';
    } else if (mean < 6.5) {
      riskLevel = 'орташа';
      message = 'Оттегі деңгейі төмендеп жатыр. Гипоксия қаупі бар.';
    }
  } else if (indicator.includes('ph')) {
    if (mean > 8.5 || max > 9.0) {
      riskLevel = 'орташа';
      message = 'Судың сілтілігі артқан. Бұл химиялық ластанудың немесе ағынды сулардың түсуінің белгісі болуы мүмкін.';
    } else if (mean < 7.0) {
      riskLevel = 'жоғары';
      message = 'Судың қышқылдығы (pH) күрт төмендеген. Қышқылды ластану қаупі бар.';
    }
  } else if (indicator.includes('нитрат') || indicator.includes('фосфат')) {
    if (mean > 2.0) {
      riskLevel = 'жоғары';
      message = 'Биогенді заттардың (нитрат/фосфат) концентрациясы өте жоғары. Ауылшаруашылық немесе тұрмыстық қалдықтардың түсуі ықтимал. Судың гүлденуі күтілуде.';
    }
  } else if (indicator.includes('мұнай') || indicator.includes('нефть')) {
    if (mean > 0.05) {
      riskLevel = 'жоғары';
      message = 'Мұнай өнімдерінің шекті рұқсат етілген концентрациясынан (ШРК) асып кетуі байқалды. Мұнайдың төгілуі немесе порттық ластану қаупі бар.';
    }
  }

  res.status(200).json({ riskLevel, message });
};
