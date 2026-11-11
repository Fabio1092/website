type Part = string | { b: string } | { a: string; href: string };
type ParagraphBlock = { type: "p"; parts: Part[] };

const isParagraph = (block: { type: string }): block is ParagraphBlock =>
  block.type === "p" && Array.isArray((block as Partial<ParagraphBlock>).parts);

const partText = (part: Part) => (typeof part === "string" ? part : "b" in part ? part.b : part.a);

const wordCount = (parts: Part[]) => parts.map(partText).join("").trim().split(/\s+/).length;

const isLinkOnly = (parts: Part[]) => parts.every((part) => (typeof part === "string" ? !part.trim() : "href" in part));

/** Short punch lines stay with the paragraph they belong to instead of starting a new one. */
const SHORT_SENTENCE_WORDS = 6;

/**
 * The articles are authored one sentence per paragraph. For reading, consecutive
 * sentences are joined into paragraphs of up to `maxSentences` sentences.
 */
export function bundleParagraphs<T extends { type: string }>(blocks: T[], maxWords = 60, maxSentences = 3): T[] {
  const out: T[] = [];
  let sentences = 0;

  for (const block of blocks) {
    const previous = out[out.length - 1];
    const canJoin =
      previous !== undefined &&
      isParagraph(block) &&
      isParagraph(previous) &&
      (sentences < maxSentences || wordCount(block.parts) <= SHORT_SENTENCE_WORDS) &&
      !isLinkOnly(block.parts) &&
      !isLinkOnly(previous.parts) &&
      wordCount(previous.parts) + wordCount(block.parts) <= maxWords;

    if (canJoin) {
      out[out.length - 1] = { ...previous, parts: [...previous.parts, " ", ...block.parts] };
      sentences += 1;
    } else {
      out.push(block);
      sentences = 1;
    }
  }

  return out;
}
