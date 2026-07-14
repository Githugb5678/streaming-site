(function () {
  const mockVideos = [
    {
      id: 'v1',
      title: 'City Lights Timelapse',
      category: 'Travel',
      duration: '04:12',
      views: 182304,
      premium: false,
      thumbnail: 'https://picsum.photos/id/1011/640/360',
      description: 'Night drive and skyline timelapse.',
      src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
      qualities: {
        '360p': 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
        '720p': 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'
      }
    },
    {
      id: 'v2',
      title: 'Strength Training Basics',
      category: 'Fitness',
      duration: '08:31',
      views: 98322,
      premium: true,
      thumbnail: 'https://picsum.photos/id/1005/640/360',
      description: 'Simple workout routine for beginners.',
      src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
      qualities: {
        '360p': 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
        '1080p': 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'
      }
    },
    {
      id: 'v3',
      title: 'JavaScript in 15 Minutes',
      category: 'Education',
      duration: '15:00',
      views: 405402,
      premium: false,
      thumbnail: 'https://picsum.photos/id/24/640/360',
      description: 'Fast-track JS fundamentals.',
      src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm',
      qualities: {
        '480p': 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm',
        '720p': 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm'
      }
    },
    {
      id: 'v4',
      title: 'Lo-fi Focus Session',
      category: 'Music',
      duration: '21:22',
      views: 75244,
      premium: false,
      thumbnail: 'https://picsum.photos/id/1080/640/360',
      description: 'Ambient background to study and work.',
      src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
      qualities: {
        '360p': 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
        '720p': 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'
      }
    }
  ];

  window.VideoDB = {
    getAll() {
      return [...mockVideos, ...StorageManager.getUploads()];
    },
    getById(id) {
      return this.getAll().find((video) => video.id === id) || null;
    },
    getCategories() {
      return [...new Set(this.getAll().map((video) => video.category))];
    },
    getRecommendations() {
      const history = StorageManager.getHistory();
      if (!history.length) return this.getAll().slice(0, 4);
      const watched = history
        .map((entry) => this.getById(entry.videoId))
        .filter(Boolean)
        .map((video) => video.category);
      const favorite = watched.sort((a, b) => watched.filter((v) => v === b).length - watched.filter((v) => v === a).length)[0];
      return this.getAll().filter((video) => video.category === favorite).slice(0, 4);
    }
  };
})();
