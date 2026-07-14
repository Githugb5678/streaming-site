window.Utils = {
  qs: (selector, root = document) => root.querySelector(selector),
  qsa: (selector, root = document) => [...root.querySelectorAll(selector)],
  getQueryParam: (key) => new URLSearchParams(window.location.search).get(key),
  formatViews: (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M views`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K views`;
    return `${count} views`;
  },
  now: () => new Date().toISOString(),
  escapeHtml: (value) => value.replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]))
};
