import { uid, TAG_COLORS } from "./utils";

const EMPTY_DATA = {
  activities: [],
  tags: [],
  tagLists: [],
  templates: [],
  processes: [],
  issues: [],
  ideas: [],
};

export function createDB() {
  let data = { ...EMPTY_DATA };

  const save = () => {
    try {
      localStorage.setItem("flowtrack_db", JSON.stringify(data));
    } catch (e) {}
  };

  const load = () => {
    try {
      const stored = localStorage.getItem("flowtrack_db");
      if (stored) {
        const parsed = JSON.parse(stored);
        data = { ...EMPTY_DATA, ...parsed };
        if (!data.tagLists) data.tagLists = [];
        if (!data.ideas) data.ideas = [];
      }
    } catch (e) {}
  };

  load();

  // ── TagList helpers ──
  const getTagList = (tagId, type) =>
    data.tagLists.find((tl) => tl.tagId === tagId && tl.type === type);

  const addToTagList = (tagId, type, entityId) => {
    let tl = getTagList(tagId, type);
    if (!tl) {
      tl = { tagId, type, list: [] };
      data.tagLists.push(tl);
    }
    if (!tl.list.includes(entityId)) {
      tl.list.push(entityId);
    }
    save();
  };

  const removeFromTagList = (tagId, type, entityId) => {
    const tl = getTagList(tagId, type);
    if (tl) {
      tl.list = tl.list.filter((id) => id !== entityId);
      save();
    }
  };

  const removeEntityFromAllTagLists = (entityId, type) => {
    data.tagLists.forEach((tl) => {
      if (tl.type === type) {
        tl.list = tl.list.filter((id) => id !== entityId);
      }
    });
    save();
  };

  // Sync tags to tagLists for an entity
  const syncTagLists = (tagIds, type, entityId) => {
    tagIds.forEach((tid) => addToTagList(tid, type, entityId));
  };

  return {
    getData: () => data,

    // ── Activities ──
    getActivities: () => data.activities,
    getActivity: (id) => data.activities.find((a) => a.id === id),
    addActivity: (a) => {
      data.activities.push(a);
      syncTagLists(a.tags, "activity", a.id);
      save();
      return a;
    },
    updateActivity: (id, upd) => {
      const i = data.activities.findIndex((a) => a.id === id);
      if (i >= 0) {
        data.activities[i] = { ...data.activities[i], ...upd };
        if (upd.tags) {
          removeEntityFromAllTagLists(id, "activity");
          syncTagLists(upd.tags, "activity", id);
        }
        save();
      }
      return data.activities[i];
    },
    deleteActivity: (id) => {
      removeEntityFromAllTagLists(id, "activity");
      data.activities = data.activities.filter((a) => a.id !== id);
      save();
    },
    getChildren: (pid) =>
      data.activities.filter((a) => a.parentId === pid && a.parentType === "activity"),

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
      };
      data.tags.push(t);
      save();
      return t;
    },

    // ── TagLists ──
    getTagLists: () => data.tagLists,
    getTagList,
    getEntitiesByTag: (tagId, type) => {
      const tl = getTagList(tagId, type);
      return tl ? tl.list : [];
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
      syncTagLists(i.tags, "issue", i.id);
      save();
      return i;
    },
    updateIssue: (id, upd) => {
      const i = data.issues.findIndex((x) => x.id === id);
      if (i >= 0) {
        data.issues[i] = { ...data.issues[i], ...upd };
        if (upd.tags) {
          removeEntityFromAllTagLists(id, "issue");
          syncTagLists(upd.tags, "issue", id);
        }
        save();
      }
      return data.issues[i];
    },
    deleteIssue: (id) => {
      removeEntityFromAllTagLists(id, "issue");
      data.issues = data.issues.filter((i) => i.id !== id);
      save();
    },

    // ── Ideas ──
    getIdeas: () => data.ideas,
    getIdea: (id) => data.ideas.find((i) => i.id === id),
    addIdea: (i) => {
      data.ideas.push(i);
      syncTagLists(i.tags, "idea", i.id);
      save();
      return i;
    },
    updateIdea: (id, upd) => {
      const i = data.ideas.findIndex((x) => x.id === id);
      if (i >= 0) {
        data.ideas[i] = { ...data.ideas[i], ...upd };
        if (upd.tags) {
          removeEntityFromAllTagLists(id, "idea");
          syncTagLists(upd.tags, "idea", id);
        }
        save();
      }
      return data.ideas[i];
    },
    deleteIdea: (id) => {
      removeEntityFromAllTagLists(id, "idea");
      // Remove idea from issues that reference it
      data.issues.forEach((issue) => {
        if (issue.linkedIdeas && issue.linkedIdeas.includes(id)) {
          issue.linkedIdeas = issue.linkedIdeas.filter((iid) => iid !== id);
        }
      });
      data.ideas = data.ideas.filter((i) => i.id !== id);
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