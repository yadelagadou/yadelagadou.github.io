let videos = [];

// Fonction pour afficher toutes les vidéos
function displayVideos() {
    const results = document.getElementById('search-results');
    results.innerHTML = '';
    console.log('Displaying all videos:', videos);

    videos.forEach(video => {
        const videoItem = document.createElement('div');
        videoItem.classList.add('video-item');
        videoItem.setAttribute('data-video-id', video.id);
        videoItem.innerHTML = `<h3>${video.title}</h3>`;
        videoItem.addEventListener('click', function() {
            document.getElementById('youtube-video').src = `https://www.youtube.com/embed/${video.id}`;
        });
        results.appendChild(videoItem);
    });
}

// Charger les vidéos à partir du fichier JSON
fetch('videos.json')
    .then(response => response.json())
    .then(data => {
        videos = data;
        console.log('Videos loaded:', videos);
        displayVideos();
    })
    .catch(error => console.error('Erreur lors du chargement des vidéos :', error));

// Fonction de recherche de vidéos
function searchVideos() {
    const query = document.getElementById('search-query').value.trim().toLowerCase();
    console.log('Search query:', query);

    const results = document.getElementById('search-results');
    results.innerHTML = '';

    const filteredVideos = videos.filter(video => video.title.toLowerCase().includes(query));
    console.log('Filtered videos:', filteredVideos);

    filteredVideos.forEach(video => {
        const videoItem = document.createElement('div');
        videoItem.classList.add('video-item');
        videoItem.setAttribute('data-video-id', video.id);
        videoItem.innerHTML = `<h3>${video.title}</h3>`;
        videoItem.addEventListener('click', function() {
            document.getElementById('youtube-video').src = `https://www.youtube.com/embed/${video.id}`;
        });
        results.appendChild(videoItem);
    });

    // Si aucune vidéo ne correspond à la recherche, afficher un message
    if (filteredVideos.length === 0) {
        results.innerHTML = '<p>Aucune vidéo trouvée.</p>';
    }
}
document.getElementById('youtube-video').addEventListener('load', function() {
    const iframe = this.contentWindow;
    iframe.postMessage('{"event":"command","func":"addEventListener","args":["onStateChange"]}', '*');

    window.addEventListener('message', function(event) {
        const data = JSON.parse(event.data);
        if (data.event === 'onStateChange') {
            if (data.info === 1) { // 1 is for PLAYING state
                enterFullScreen();
            } else if (data.info === 2 || data.info === 0) { // 2 is for PAUSED state, 0 is for ENDED state
                exitFullScreen();
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
