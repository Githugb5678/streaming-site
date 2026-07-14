# streaming-site

Frontend-only video streaming website built with HTML, CSS, and JavaScript.

## Pages
- `/index.html`: Home, search, browse, recommendations
- `/video-player.html`: Custom video player, comments, likes/dislikes, quality selector
- `/login.html`: Login and signup (localStorage auth)
- `/profile.html`: Account dashboard, subscription tiers, watch history
- `/upload.html`: Upload simulation interface

## Structure
```
/
├── index.html
├── video-player.html
├── login.html
├── profile.html
├── upload.html
├── css/
│   ├── main.css
│   ├── player.css
│   ├── auth.css
│   └── responsive.css
└── js/
    ├── app.js
    ├── player.js
    ├── auth.js
    ├── storage.js
    ├── videos.js
    └── utils.js
```

## Features
- HTML5 player with timeline, volume, fullscreen, and quality selection
- localStorage authentication and profile persistence
- Search and category filter with real-time updates
- Recommendations based on watch history categories
- Likes/dislikes and threaded comments with persistence
- Simulated uploads with progress UI and uploaded videos in the catalog
- Subscription tiers and premium content gating
- Responsive design for mobile and desktop

## Run
Open `/index.html` in a browser.
