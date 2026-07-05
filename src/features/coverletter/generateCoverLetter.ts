import type { CoverLetterTone, Match } from '@/types/domain';

function topStrengths(match: Match, n: number): string[] {
  return match.evidence
    .filter((e) => e.group === 'must_have' && e.verdict === 'met')
    .slice(0, n)
    .map((e) => e.criterion.toLowerCase());
}

export function generateCoverLetter(match: Match, tone: CoverLetterTone): string {
  const { company, title } = match.posting;
  const strengths = topStrengths(match, 2);
  const strengthLine = strengths.length
    ? `In particular, my experience with ${strengths.join(' and ')} lines up closely with what you are looking for.`
    : 'My background lines up closely with what you are looking for.';

  if (tone === 'formal') {
    return [
      `Dear Hiring Team at ${company},`,
      '',
      `I am writing to express my interest in the ${title} role. After reviewing the posting, I believe my background makes me a strong candidate.`,
      '',
      strengthLine,
      '',
      `I would welcome the opportunity to discuss how I can contribute to ${company}. Thank you for your consideration.`,
      '',
      'Sincerely,',
      'Alex Rivera',
    ].join('\n');
  }

  return [
    `Dear Hiring Team at ${company},`,
    '',
    `The moment I read your ${title} posting it felt like the perfect cup — it is exactly the kind of work I have been pouring myself into.`,
    '',
    strengthLine,
    '',
    `I would love to bring that same care and energy to ${company}. Thank you for considering me — I would be thrilled to talk.`,
    '',
    'Warmly,',
    'Alex Rivera',
  ].join('\n');
}

export function makeItLandTips(match: Match): string[] {
  const tips: string[] = [];
  const topStrength = match.evidence.find(
    (e) => e.group === 'must_have' && e.verdict === 'met',
  );
  const gaps = match.evidence.filter((e) => e.verdict !== 'met');
  const topGap = gaps.find((e) => e.group === 'must_have') ?? gaps[0];

  if (topStrength) {
    tips.push(`Lead with your ${topStrength.criterion.toLowerCase()} match.`);
  }
  if (topGap) {
    tips.push(`Name the ${topGap.criterion.toLowerCase()} gap and your appetite to close it.`);
  }
  tips.push('Keep it under 250 words.');
  return tips;
}
