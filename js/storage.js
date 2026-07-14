(function () {
  const KEYS = {
    USERS: 'streamspace_users',
    CURRENT: 'streamspace_current_user',
    LIKES: 'streamspace_likes',
    COMMENTS: 'streamspace_comments',
    HISTORY: 'streamspace_history',
    SUBS: 'streamspace_subscriptions',
    UPLOADS: 'streamspace_uploads'
  };

  const read = (key, fallback) => {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  };

  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

  const Storage = {
    getUsers: () => read(KEYS.USERS, []),
    saveUser: (user) => {
      const users = Storage.getUsers();
      const { password, ...safeUser } = user;
      users.push(safeUser);
      write(KEYS.USERS, users);
    },
    setCurrentUser: (email) => localStorage.setItem(KEYS.CURRENT, email),
    getCurrentUserEmail: () => localStorage.getItem(KEYS.CURRENT),
    getCurrentUser: () => Storage.getUsers().find((u) => u.email === Storage.getCurrentUserEmail()) || null,
    logout: () => localStorage.removeItem(KEYS.CURRENT),

    getLikes: () => read(KEYS.LIKES, {}),
    setLike: (videoId, kind) => {
      const current = Storage.getCurrentUserEmail() || 'guest';
      const likes = Storage.getLikes();
      likes[videoId] = likes[videoId] || {};
      likes[videoId][current] = kind;
      write(KEYS.LIKES, likes);
    },

    getComments: () => read(KEYS.COMMENTS, {}),
    addComment: (videoId, text, parentId = null) => {
      const comments = Storage.getComments();
      comments[videoId] = comments[videoId] || [];
      comments[videoId].push({
        id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
        user: Storage.getCurrentUserEmail() || 'guest',
        text,
        parentId,
        createdAt: new Date().toLocaleString()
      });
      write(KEYS.COMMENTS, comments);
    },

    getHistory: () => read(KEYS.HISTORY, []),
    addHistory: (videoId) => {
      const history = Storage.getHistory().filter((entry) => entry.videoId !== videoId);
      history.unshift({ videoId, watchedAt: Date.now() });
      write(KEYS.HISTORY, history.slice(0, 30));
    },

    getSubscriptions: () => read(KEYS.SUBS, {}),
    setSubscription: (tier) => {
      const subs = Storage.getSubscriptions();
      const key = Storage.getCurrentUserEmail() || 'guest';
      subs[key] = tier;
      write(KEYS.SUBS, subs);
    },
    getSubscription: () => {
      const key = Storage.getCurrentUserEmail() || 'guest';
      return Storage.getSubscriptions()[key] || 'Free';
    },

    getUploads: () => read(KEYS.UPLOADS, []),
    addUpload: (upload) => {
      const uploads = Storage.getUploads();
      uploads.unshift(upload);
      write(KEYS.UPLOADS, uploads);
    }
  };

  window.StorageManager = Storage;
})();
