let videos = [];

fetch('videos.json')
    .then(response => response.json())
    .then(data => {
        videos = data;
        displayVideos();
    })
    .catch(error => console.error('Erreur lors du chargement des vidéos :', error));

function displayVideos() {
    const results = document.getElementById('search-results');
    results.innerHTML = '';

    videos.forEach(video => {
        const videoItem = document.createElement('div');
        videoItem.classList.add('video-item');
        videoItem.setAttribute('data-video-id', video.id);
        videoItem.innerHTML = `<h3>${video.title}</h3>`;
        videoItem.addEventListener('click', function() {
            const iframe = document.getElementById('youtube-video');
            iframe.src = `https://www.youtube.com/embed/${video.id}?enablejsapi=1`;
            iframe.classList.remove('full-screen-video');
        });
        results.appendChild(videoItem);
    });
}

function searchVideos() {
    const query = document.getElementById('search-query').value.trim().toLowerCase();
    const results = document.getElementById('search-results');
    results.innerHTML = '';

    const filteredVideos = videos.filter(video => video.title.toLowerCase().includes(query));
    filteredVideos.forEach(video => {
        const videoItem = document.createElement('div');
        videoItem.classList.add('video-item');
        videoItem.setAttribute('data-video-id', video.id);
        videoItem.innerHTML = `<h3>${video.title}</h3>`;
        videoItem.addEventListener('click', function() {
            const iframe = document.getElementById('youtube-video');
            iframe.src = `https://www.youtube.com/embed/${video.id}?enablejsapi=1`;
            iframe.classList.remove('full-screen-video');
        });
        results.appendChild(videoItem);
    });

    if (filteredVideos.length === 0) {
        results.innerHTML = '<p>Aucune vidéo trouvée.</p>';
    }
}

// Add event listener to the iframe when it loads
document.getElementById('youtube-video').addEventListener('load', function() {
    const iframe = this.contentWindow;
    iframe.postMessage('{"event":"command","func":"addEventListener","args":["onStateChange"]}', '*');

    window.addEventListener('message', function(event) {
        if (typeof event.data === 'string') {
            const data = JSON.parse(event.data);
            if (data.event === 'onStateChange') {
                if (data.info === 1) { // 1 is for PLAYING state
                    enterFullScreen();
                } else if (data.info === 2 || data.info === 0) { // 2 is for PAUSED state, 0 is for ENDED state
                    exitFullScreen();
                }
            }
        }
    });
});

function enterFullScreen() {
    const iframe = document.getElementById('youtube-video');
    iframe.classList.add('full-screen-video');
}

function exitFullScreen() {
    const iframe = document.getElementById('youtube-video');
    iframe.classList.remove('full-screen-video');
}
