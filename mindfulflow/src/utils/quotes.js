/**
 * Sbírka českých motivačních citátů pro MindfulFlow
 */
export const CZECH_QUOTES = [
  "Každý nový den je nová šance změnit svůj život.",
  "Nezáleží na tom, jak pomalu jdeš, dokud nezastavíš.",
  "Jediný způsob, jak dělat skvělou práci, je milovat to, co děláš.",
  "Věř, že to dokážeš, a jsi už v polovině cesty.",
  "Štěstí není něco hotového. Pochází z tvých vlastních činů.",
  "Neúspěch je prostě příležitost začít znovu, tentokrát o něco chytřeji.",
  "Když procházíš peklem, nezastavuj se.",
  "Buď změnou, kterou chceš vidět ve světě.",
  "Tvoje nálada určuje tvou realitu.",
  "Klidná mysl přináší vnitřní sílu a sebedůvěru.",
  "Dělej to, co můžeš, s tím, co máš, tam, kde jsi.",
  "Život je 10 % to, co se ti stane, a 90 % to, jak na to reaguješ.",
  "Klid není o tom, co se děje kolem tebe, ale v tobě.",
  "Všechno, co si dokážeš představit, je skutečné.",
  "Radost není ve věcech, je v nás.",
];

/**
 * Vrátí citát pro dnešní den
 * Používá datum jako seed pro výběr, aby byl citát celý den stejný
 */
export const getDailyQuote = () => {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const index = seed % CZECH_QUOTES.length;
  return CZECH_QUOTES[index];
};
