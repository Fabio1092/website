const SHY = String.fromCharCode(0xad);

// Break opportunities for long German compounds. Browsers only break at a soft
// hyphen when the word does not fit, so short lines are unaffected.
const RULES: RegExp[] = [
  // Linking elements: Versicherungs|makler, Gesundheits|fragen, Berufsunfähigkeits|versicherung
  /(?<=(?:ungs|heits|keits|schafts|tions|täts))(?=\p{Ll}{4})/gu,
  /(?<=\p{L}{4})(?=kranken(?:versicherung|kasse|tagegeld))/giu,
  // Second components that follow a stem of at least four letters
  /(?<=\p{L}{4})(?=(?:versicherung|versicherer|unfähigkeit|haftpflicht|voranfrage|situation|entwicklung|erhöhung|planung|rücktritt|zuschuss|vergleich|beteiligung|erkrankung|anwärter|setzungen|schaden|gebäude|zusatz|tagegeld|dynamik|bedingung|versichern|grenze)(?:\p{Ll}*))/giu,
  /(?<=\p{L}{5})(?=schutz)/giu,
  /(?<=\bSelbst)(?=ständig|behalt)/gu,
  /(?<=\bRisiko)(?=lebens)/gu,
  /(?<=\bJahres)(?=arbeits)/gu,
];

export function softHyphenate(text: string): string {
  let out = text;
  for (const rule of RULES) out = out.replace(rule, SHY);
  return out;
}

const HEADING = /<(h[1-4])(\s[^>]*)?>([\s\S]*?)<\/\1>/g;
const ISLAND = /(<astro-island[\s\S]*?<\/astro-island>)/;

/** Adds soft hyphens to the text of h1–h4 elements, leaving hydrated islands untouched. */
export function softHyphenateHeadings(html: string): string {
  return html
    .split(ISLAND)
    .map((chunk, index) =>
      index % 2 === 1
        ? chunk
        : chunk.replace(HEADING, (_match, tag: string, attrs: string | undefined, inner: string) => {
            const hyphenated = inner.replace(/(^|>)([^<]+)/g, (_m, lead: string, text: string) => lead + softHyphenate(text));
            return `<${tag}${attrs ?? ""}>${hyphenated}</${tag}>`;
          }),
    )
    .join("");
}
