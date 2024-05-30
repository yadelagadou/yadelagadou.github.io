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
            iframe.src = `https://www.youtube.com/embed/${video.id}`;
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
            iframe.src = `https://www.youtube.com/embed/${video.id}`;
            iframe.classList.remove('full-screen-video');
        });
        results.appendChild(videoItem);
    });

    if (filteredVideos.length === 0) {
        results.innerHTML = '<p>Aucune vidéo trouvée.</p>';
    }
}

// Fonction pour entrer en plein écran
function enterFullScreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) { // Firefox
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) { // Chrome, Safari et Opera
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) { // IE/Edge
        element.msRequestFullscreen();
    }
}

// Fonction pour sortir du plein écran
function exitFullScreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { // Firefox
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { // Chrome, Safari et Opera
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { // IE/Edge
        document.msExitFullscreen();
    }
}

// Événements pour détecter le début et la fin de la vidéo
document.getElementById('youtube-video').addEventListener('load', function () {
    const iframe = this;
    iframe.contentWindow.addEventListener('message', function (event) {
        if (event.data === "play") {
            enterFullScreen(iframe);
        } else if (event.data === "pause" || event.data === "ended") {
            exitFullScreen();
        }
    });
});

// Ajouter des événements pour détecter quand la vidéo commence et s'arrête
document.getElementById('youtube-video').addEventListener('load', function () {
    const iframe = this;
    iframe.contentWindow.addEventListener('play', function () {
        iframe.classList.add('full-screen-video');
        enterFullScreen(iframe);
    });
    iframe.contentWindow.addEventListener('pause', function () {
        iframe.classList.remove('full-screen-video');
        exitFullScreen();
    });
    iframe.contentWindow.addEventListener('ended', function () {
        iframe.classList.remove('full-screen-video');
        exitFullScreen();
    });
});
