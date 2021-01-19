import { createObjective, PlayerScore } from "sandstone/variables";
import { createLabel } from "sandstone-label";

const namespace = { full: 'player', short: 'plyr' };

/**
 * Creates a new label
 * @param label Label/tag name
 */
export function newLabel (label: string) {
  return createLabel(`${namespace.full}.${label}`);
}

/**
 * Returns an optionally initialized PlayerScore for a namespaced Objective that defaults to dummy
 * @param name Objective name
 * @param initialize Whether to initialize the score with a value
 * @param type Objective type
 */
export function newScore (name: string, initialize: number | PlayerScore | false = false, type = 'dummy') {

  const score = createObjective(`${namespace.short}.${name}`, type).ScoreHolder('@s');

  if (initialize) score.set(initialize as any); // TypeScript moment :keuch:

  return score;
}

export function readScore(score: PlayerScore) { return { objective: score.objective.name, name: score.target }; }

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * Parses an id into a header (capitalizes and spaces)
 * @param s id to parse
 */
export function parse_id (s: string) {
  let strings: String[] | boolean = false;
  
  if (s.includes('_')) {
    strings = [];
    for (const str of s.split('_')) {
      strings.push(capitalize(str));
    };
  }
  return strings ? strings.join(' ') : capitalize(s);
}