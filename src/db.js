import { uid, TAG_COLORS } from "./utils";

const EMPTY_DATA = {
  activities: [],
  tags: [],
  templates: [],
  processes: [],
  issues: [],
};

export function createDB() {
  let data = { ...EMPTY_DATA };

  const save = () => {
    try {
      localStorage.setItem("flowtrack_db", JSON.stringify(data));
    } catch (e) {
      /* quota exceeded or unavailable */
    }
  };

  const load = () => {
    try {
      const stored = localStorage.getItem("flowtrack_db");
      if (stored) {
        const parsed = JSON.parse(stored);
        data = { ...EMPTY_DATA, ...parsed };
      }
    } catch (e) {
      /* corrupt data, start fresh */
    }
  };

  load();

  return {
    getData: () => data,

    // ── Activities ──
    getActivities: () => data.activities,
    getActivity: (id) => data.activities.find((a) => a.id === id),
    addActivity: (a) => {
      data.activities.push(a);
      save();
      return a;
    },
    updateActivity: (id, upd) => {
      const i = data.activities.findIndex((a) => a.id === id);
      if (i >= 0) {
        data.activities[i] = { ...data.activities[i], ...upd };
        save();
      }
      return data.activities[i];
    },
    deleteActivity: (id) => {
      data.activities = data.activities.filter((a) => a.id !== id);
      data.tags.forEach((t) => {
        t.activityList = t.activityList.filter((aid) => aid !== id);
      });
      save();
    },
    getChildren: (pid) =>
      data.activities.filter(
        (a) => a.parentId === pid && a.parentType === "activity"
      ),

    // ── Tags ──
    getTags: () => data.tags,
    getTag: (id) => data.tags.find((t) => t.id === id),
    addTag: (t) => {
      data.tags.push(t);
      save();
      return t;
    },
    updateTag: (id, upd) => {
      const i = data.tags.findIndex((t) => t.id === id);
      if (i >= 0) {
        data.tags[i] = { ...data.tags[i], ...upd };
        save();
      }
      return data.tags[i];
    },
    findOrCreateTag: (name) => {
      const existing = data.tags.find(
        (t) => t.name.toLowerCase() === name.toLowerCase()
      );
      if (existing) return existing;
      const t = {
        id: uid(),
        name,
        color: TAG_COLORS[data.tags.length % TAG_COLORS.length],
        activityList: [],
      };
      data.tags.push(t);
      save();
      return t;
    },

    // ── Templates ──
    getTemplates: () => data.templates,
    addTemplate: (t) => {
      data.templates.push(t);
      save();
      return t;
    },
    deleteTemplate: (id) => {
      data.templates = data.templates.filter((t) => t.id !== id);
      save();
    },

    // ── Issues ──
    getIssues: () => data.issues,
    getIssue: (id) => data.issues.find((i) => i.id === id),
    addIssue: (i) => {
      data.issues.push(i);
      save();
      return i;
    },
    updateIssue: (id, upd) => {
      const i = data.issues.findIndex((x) => x.id === id);
      if (i >= 0) {
        data.issues[i] = { ...data.issues[i], ...upd };
        save();
      }
      return data.issues[i];
    },
    deleteIssue: (id) => {
      data.issues = data.issues.filter((i) => i.id !== id);
      save();
    },

    // ── Export / Import ──
    exportJSON: () => JSON.stringify(data, null, 2),
    importJSON: (json) => {
      try {
        data = { ...EMPTY_DATA, ...JSON.parse(json) };
        save();
        return true;
      } catch (e) {
        return false;
      }
    },
  };
}
