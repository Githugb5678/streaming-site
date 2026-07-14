(function () {
  const user = StorageManager.getCurrentUser();

  const authLink = document.getElementById('authLink') || document.getElementById('profileAuthLink');
  if (authLink && user) {
    authLink.textContent = user.name;
    authLink.href = 'profile.html';
  }

  const tierLabel = document.getElementById('tierLabel');
  if (tierLabel) tierLabel.textContent = `Current tier: ${StorageManager.getSubscription()}`;

  const videoGrid = document.getElementById('videoGrid');
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');

  const renderVideoCard = (video) => {
    const paywall = video.premium && StorageManager.getSubscription() === 'Free';
    return `
      <article class="video-card">
        <a href="${paywall ? 'profile.html' : `video-player.html?id=${video.id}`}">
          <div class="video-thumb" style="background-image:url('${video.thumbnail}')">
            <span class="badge">${video.duration}</span>
          </div>
          <div class="video-body">
            <h4>${Utils.escapeHtml(video.title)}</h4>
            <div class="meta-line">${Utils.escapeHtml(video.category)} • ${Utils.formatViews(video.views || 0)}</div>
            ${paywall ? '<p class="small">🔒 Premium</p>' : ''}
          </div>
        </a>
      </article>
    `;
  };

  const renderVideos = () => {
    if (!videoGrid) return;
    const text = (searchInput?.value || '').trim().toLowerCase();
    const category = categoryFilter?.value || 'all';
    const videos = VideoDB.getAll().filter((video) => {
      const matchesText = !text || [video.title, video.category, video.description].join(' ').toLowerCase().includes(text);
      const matchesCategory = category === 'all' || video.category === category;
      return matchesText && matchesCategory;
    });

    videoGrid.innerHTML = videos.map(renderVideoCard).join('') || '<p class="subtle">No videos found.</p>';
  };

  if (categoryFilter) {
    VideoDB.getCategories().forEach((category) => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });
    categoryFilter.addEventListener('change', renderVideos);
  }
  if (searchInput) searchInput.addEventListener('input', renderVideos);
  renderVideos();

  const recommendations = document.getElementById('recommendations');
  if (recommendations) {
    recommendations.innerHTML = VideoDB.getRecommendations().map((video) => `
      <a class="card" href="video-player.html?id=${video.id}">
        <strong>${Utils.escapeHtml(video.title)}</strong>
        <div class="small subtle">${Utils.escapeHtml(video.category)}</div>
      </a>
    `).join('');
  }

  const tiers = document.getElementById('tiers');
  if (tiers) {
    const plans = [
      { name: 'Free', price: '$0', perk: 'Ads + standard library' },
      { name: 'Premium', price: '$9.99', perk: 'No ads + premium content' },
      { name: 'Pro', price: '$19.99', perk: 'Offline + early access' }
    ];
    const currentTier = StorageManager.getSubscription();

    tiers.innerHTML = plans.map((plan) => `
      <article class="tier ${plan.name === currentTier ? 'active' : ''}">
        <h4>${plan.name}</h4>
        <p>${plan.price}/mo</p>
        <p class="small subtle">${plan.perk}</p>
        <button data-tier="${plan.name}">${plan.name === currentTier ? 'Current Plan' : 'Select'}</button>
      </article>
    `).join('');

    Utils.qsa('button[data-tier]', tiers).forEach((button) => {
      button.addEventListener('click', () => {
        StorageManager.setSubscription(button.dataset.tier);
        window.location.reload();
      });
    });
  }

  const historyContainer = document.getElementById('history');
  if (historyContainer) {
    const history = StorageManager.getHistory();
    historyContainer.innerHTML = history.map((entry) => {
      const video = VideoDB.getById(entry.videoId);
      if (!video) return '';
      return `<a class="card" href="video-player.html?id=${video.id}"><strong>${Utils.escapeHtml(video.title)}</strong><div class="small subtle">${new Date(entry.watchedAt).toLocaleString()}</div></a>`;
    }).join('') || '<p class="subtle">No watch history yet.</p>';
  }

  const logoutBtn = document.getElementById('logoutBtn');
  const profileName = document.getElementById('profileName');
  if (profileName && user) profileName.textContent = `${user.name} (${user.email})`;
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      StorageManager.logout();
      window.location.href = 'index.html';
    });
  }

  const uploadForm = document.getElementById('uploadForm');
  if (uploadForm) {
    const progress = document.getElementById('uploadProgress');
    const status = document.getElementById('uploadStatus');
    const uploadsList = document.getElementById('uploadsList');

    const renderUploads = () => {
      const uploads = StorageManager.getUploads();
      uploadsList.innerHTML = uploads.map((video) => `
        <div class="card"><strong>${Utils.escapeHtml(video.title)}</strong><div class="small subtle">${Utils.escapeHtml(video.category)} • ${Utils.escapeHtml(video.duration)}</div></div>
      `).join('') || '<p class="subtle">No uploads yet.</p>';
    };

    renderUploads();
    uploadForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const title = document.getElementById('uploadTitle').value.trim();
      const category = document.getElementById('uploadCategory').value.trim();
      const duration = document.getElementById('uploadDuration').value.trim();
      const file = document.getElementById('uploadFile').files[0];
      let value = 0;
      status.textContent = 'Uploading...';
      progress.style.width = '0%';

      const timer = setInterval(() => {
        value += 20;
        progress.style.width = `${Math.min(value, 100)}%`;
        if (value >= 100) {
          clearInterval(timer);
          const uploadSrc = file ? URL.createObjectURL(file) : 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
          StorageManager.addUpload({
            id: `u_${Date.now()}`,
            title,
            category,
            duration,
            views: 0,
            premium: false,
            thumbnail: 'https://picsum.photos/640/360',
            description: 'User uploaded video',
            src: uploadSrc,
            qualities: { '720p': uploadSrc },
            createdAt: Utils.now()
          });
          status.textContent = 'Upload complete.';
          uploadForm.reset();
          renderUploads();
        }
      }, 250);
    });
  }
})();
