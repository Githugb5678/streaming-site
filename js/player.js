(function () {
  const videoId = Utils.getQueryParam('id');
  const video = VideoDB.getById(videoId);
  const videoElement = document.getElementById('videoElement');

  if (!video || !videoElement) {
    const title = document.getElementById('videoTitle');
    if (title) title.textContent = 'Video not found';
    return;
  }

  const subscription = StorageManager.getSubscription();
  if (video.premium && subscription === 'Free') {
    window.location.href = 'profile.html';
    return;
  }

  const title = document.getElementById('videoTitle');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const timeline = document.getElementById('timeline');
  const volume = document.getElementById('volume');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  const quality = document.getElementById('quality');
  const likeBtn = document.getElementById('likeBtn');
  const dislikeBtn = document.getElementById('dislikeBtn');

  title.textContent = video.title;
  videoElement.src = video.src;
  videoElement.volume = 1;

  Object.entries(video.qualities || {}).forEach(([label, source]) => {
    const option = document.createElement('option');
    option.value = label;
    option.textContent = label;
    if (source === video.src) option.selected = true;
    quality.appendChild(option);
  });

  quality.addEventListener('change', () => {
    const wasPlaying = !videoElement.paused;
    const currentTime = videoElement.currentTime;
    const nextSource = video.qualities?.[quality.value];
    if (!nextSource) return;
    videoElement.src = nextSource;
    videoElement.currentTime = currentTime;
    if (wasPlaying) videoElement.play();
  });

  playPauseBtn.addEventListener('click', () => {
    if (videoElement.paused) {
      videoElement.play();
      playPauseBtn.textContent = 'Pause';
      StorageManager.addHistory(video.id);
    } else {
      videoElement.pause();
      playPauseBtn.textContent = 'Play';
    }
  });

  videoElement.addEventListener('timeupdate', () => {
    timeline.value = ((videoElement.currentTime / (videoElement.duration || 1)) * 100).toString();
  });

  timeline.addEventListener('input', () => {
    videoElement.currentTime = (Number(timeline.value) / 100) * (videoElement.duration || 0);
  });

  volume.addEventListener('input', () => {
    videoElement.volume = Number(volume.value);
  });

  fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) videoElement.requestFullscreen();
    else document.exitFullscreen();
  });

  const likesStore = StorageManager.getLikes();
  const reactions = likesStore[video.id] || {};
  const counts = {
    like: Object.values(reactions).filter((v) => v === 'like').length,
    dislike: Object.values(reactions).filter((v) => v === 'dislike').length
  };

  const likeCount = document.getElementById('likeCount');
  const dislikeCount = document.getElementById('dislikeCount');
  const renderCounts = () => {
    likeCount.textContent = counts.like;
    dislikeCount.textContent = counts.dislike;
  };
  renderCounts();

  const react = (type) => {
    StorageManager.setLike(video.id, type);
    const next = StorageManager.getLikes()[video.id] || {};
    counts.like = Object.values(next).filter((v) => v === 'like').length;
    counts.dislike = Object.values(next).filter((v) => v === 'dislike').length;
    renderCounts();
  };
  likeBtn.addEventListener('click', () => react('like'));
  dislikeBtn.addEventListener('click', () => react('dislike'));

  const commentsList = document.getElementById('commentsList');
  const commentForm = document.getElementById('commentForm');
  const commentText = document.getElementById('commentText');

  const renderComments = () => {
    const comments = StorageManager.getComments()[video.id] || [];
    const roots = comments.filter((c) => !c.parentId);

    const renderNode = (comment, indent = 0) => {
      const replies = comments.filter((c) => c.parentId === comment.id);
      return `
        <div class="card" style="margin-left:${indent}px">
          <div><strong>${Utils.escapeHtml(comment.user)}</strong> <span class="small subtle">${comment.createdAt}</span></div>
          <p>${Utils.escapeHtml(comment.text)}</p>
          <button class="small" data-reply="${comment.id}">Reply</button>
          <div class="stack">${replies.map((reply) => renderNode(reply, indent + 16)).join('')}</div>
        </div>
      `;
    };

    commentsList.innerHTML = roots.map((comment) => renderNode(comment)).join('') || '<p class="subtle">No comments yet.</p>';

    commentsList.querySelectorAll('[data-reply]').forEach((button) => {
      button.addEventListener('click', () => {
        const text = prompt('Reply:');
        if (!text) return;
        StorageManager.addComment(video.id, text.trim(), button.dataset.reply);
        renderComments();
      });
    });
  };

  commentForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const value = commentText.value.trim();
    if (!value) return;
    StorageManager.addComment(video.id, value);
    commentText.value = '';
    renderComments();
  });
  renderComments();

  const upNext = document.getElementById('upNext');
  if (upNext) {
    upNext.innerHTML = VideoDB.getAll().filter((v) => v.id !== video.id).slice(0, 6).map((item) => `
      <a class="card" href="video-player.html?id=${item.id}">
        <strong>${Utils.escapeHtml(item.title)}</strong>
        <div class="small subtle">${Utils.escapeHtml(item.category)}</div>
      </a>
    `).join('');
  }
})();
