// Computed helpers
import { CURRICULUM } from './curriculum';

export const ALL_MODULES = CURRICULUM.flatMap(t => t.modules);

export function initProgress() {
  const p = {};
  ALL_MODULES.forEach(m => {
    p[m.id] = { sections:{}, quizPassed:false, quizScore:0, hookDone:false, hookResponse:'',
                assessed:false, assessScore:0, assessPassed:false, notes:'', timeSpent:0 };
    if (m.sections) m.sections.forEach(s => { p[m.id].sections[s.id] = false; });
  });
  return p;
}

export function calcXP(progress) {
  return Object.values(progress).reduce((xp, mp) => {
    const s = mp.sections ? Object.values(mp.sections).filter(Boolean).length : 0;
    return xp + s*25 + (mp.quizPassed ? 100 + (mp.quizScore===100 ? 50:0):0)
      + (mp.assessPassed ? 300:0) + (mp.hookDone ? 15:0);
  }, 0);
}
