import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { progressAPI, assessAPI } from '../lib/api';
import { CURRICULUM } from '../data/curriculum';
import { useAuth } from './useAuth';

const ProgressCtx = createContext(null);

function initProgress() {
  const p = {};
  CURRICULUM.forEach(tr => tr.modules.forEach(m => {
    p[m.id] = { sections:{}, quizPassed:false, quizScore:0, hookDone:false, hookResponse:'',
                assessed:false, assessScore:0, assessPassed:false, notes:'', timeSpent:0 };
    m.sections?.forEach(s => { p[m.id].sections[s.id] = false; });
  }));
  return p;
}

export function ProgressProvider({ children }) {
  const { user } = useAuth();
  const [progress, setProgress] = useState(initProgress);
  const [bookmarks, setBookmarks] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [spacedDue, setSpacedDue] = useState([]);
  const [syncing, setSyncing] = useState(false);

  // Load all progress when user logs in
  useEffect(() => {
    if (!user) { setProgress(initProgress()); return; }
    Promise.all([
      progressAPI.getAll(),
      progressAPI.getBookmarks(),
      assessAPI.getPortfolio(),
      progressAPI.getSpaced(),
    ]).then(([prog, bk, port, spaced]) => {
      setProgress(p => ({ ...initProgress(), ...prog }));
      setBookmarks(bk);
      setPortfolio(port.entries || []);
      setSpacedDue(spaced);
    }).catch(console.error);
  }, [user?.id]);

  const pendingUpdates = useRef({});

  // Persist module changes to server (debounced per module)
  const syncModule = useCallback((moduleId, trackId, patch) => {
    setProgress(p => {
      const updated = { ...p, [moduleId]: { ...p[moduleId], ...patch } };
      clearTimeout(pendingUpdates.current[moduleId]);
      pendingUpdates.current[moduleId] = setTimeout(() => {
        progressAPI.update(moduleId, { trackId, ...patch }).catch(console.error);
      }, 600);
      return updated;
    });
  }, []);

  const markSection = useCallback((moduleId, trackId, sectionId) => {
    setProgress(p => {
      const currentSections = p[moduleId]?.sections || {};
      if (currentSections[sectionId]) return p; // already marked, no-op
      const patch = { sections: { ...currentSections, [sectionId]: true } };
      clearTimeout(pendingUpdates.current[moduleId]);
      pendingUpdates.current[moduleId] = setTimeout(() => {
        progressAPI.update(moduleId, { trackId, ...patch }).catch(console.error);
      }, 600);
      return { ...p, [moduleId]: { ...p[moduleId], ...patch } };
    });
  }, []);

  const passQuiz = useCallback((moduleId, trackId, score) => {
    syncModule(moduleId, trackId, { quizPassed: true, quizScore: score });
  }, [syncModule]);

  const saveHookResponse = useCallback((moduleId, trackId, response) => {
    syncModule(moduleId, trackId, { hookDone: true, hookResponse: response });
  }, [syncModule]);

  const saveNotes = useCallback((moduleId, trackId, notes) => {
    syncModule(moduleId, trackId, { notes });
  }, [syncModule]);

  const toggleBookmark = useCallback(async (sopId) => {
    const has = bookmarks.includes(sopId);
    setBookmarks(b => has ? b.filter(x => x !== sopId) : [...b, sopId]);
    has ? progressAPI.removeBookmark(sopId) : progressAPI.addBookmark(sopId);
  }, [bookmarks]);

  const flagSpaced = useCallback(async (moduleId, qIdx, questionText) => {
    await progressAPI.flagSpaced({ moduleId, questionIdx: qIdx, questionText, intervalDays: 7 });
    const spaced = await progressAPI.getSpaced();
    setSpacedDue(spaced);
  }, []);

  const resolveSpaced = useCallback(async (id, knew) => {
    await progressAPI.resolveSpaced(id, { correct: knew });
    setSpacedDue(s => s.filter(x => x.id !== id));
  }, []);

  // Computed values
  const trackPct = useCallback((track) => {
    const done = track.modules.filter(m => {
      const p = progress[m.id];
      return p?.sections && Object.values(p.sections).some(Boolean);
    }).length;
    return Math.round(done / track.modules.length * 100);
  }, [progress]);

  const calcXP = useCallback(() => {
    return Object.values(progress).reduce((xp, mp) => {
      const secs = mp.sections ? Object.values(mp.sections).filter(Boolean).length : 0;
      return xp + secs * 25 + (mp.quizPassed ? 100 + (mp.quizScore === 100 ? 50 : 0) : 0)
        + (mp.assessPassed ? 300 : 0) + (mp.hookDone ? 15 : 0);
    }, 0);
  }, [progress]);

  return (
    <ProgressCtx.Provider value={{
      progress, bookmarks, portfolio, spacedDue, syncing,
      markSection, passQuiz, saveHookResponse, saveNotes,
      toggleBookmark, flagSpaced, resolveSpaced,
      trackPct, calcXP,
    }}>
      {children}
    </ProgressCtx.Provider>
  );
}

export const useProgress = () => useContext(ProgressCtx);
