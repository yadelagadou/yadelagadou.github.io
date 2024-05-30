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
        });
        results.appendChild(videoItem);
    });

    if (filteredVideos.length === 0) {
        results.innerHTML = '<p>Aucune vidéo trouvée.</p>';
    }
}

// Mettre la vidéo en plein écran lors du clic sur l'iframe
document.getElementById('youtube-video').addEventListener('click', function () {
    const iframe = this;
    if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
    } else if (iframe.mozRequestFullScreen) { // Firefox
        iframe.mozRequestFullScreen();
    } else if (iframe.webkitRequestFullscreen) { // Chrome, Safari et Opera
        iframe.webkitRequestFullscreen();
    } else if (iframe.msRequestFullscreen) { // IE/Edge
        iframe.msRequestFullscreen();
    }
});

// Écouter les événements de fin de lecture pour sortir du mode plein écran
document.getElementById('youtube-video').addEventListener('pause', exitFullScreen);
document.getElementById('youtube-video').addEventListener('ended', exitFullScreen);

function exitFullScreen() {
    const iframe = document.getElementById('youtube-video');
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

let isVideoFullScreen = false;

// Fonction pour mettre la vidéo en plein écran
function requestFullScreen() {
    const iframe = document.getElementById('youtube-video');
    if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
    } else if (iframe.mozRequestFullScreen) { // Firefox
        iframe.mozRequestFullScreen();
    } else if (iframe.webkitRequestFullscreen) { // Chrome, Safari et Opera
        iframe.webkitRequestFullscreen();
    } else if (iframe.msRequestFullscreen) { // IE/Edge
        iframe.msRequestFullscreen();
    }
}

// Fonction pour sortir du mode plein écran
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

// Événement de clic sur la vidéo
document.getElementById('youtube-video').addEventListener('click', function () {
    // Vérifier si la vidéo est déjà en mode plein écran
    if (!isVideoFullScreen) {
        // Mettre la vidéo en plein écran
        requestFullScreen();
        isVideoFullScreen = true;
    } else {
        // Si la vidéo est déjà en mode plein écran, la mettre en pause ou effectuer d'autres actions si nécessaire
    }
});

// Écouter les événements de fin de lecture pour sortir du mode plein écran
document.getElementById('youtube-video').addEventListener('pause', function () {
    // Sortir du mode plein écran si la vidéo est en mode plein écran
    if (isVideoFullScreen) {
        exitFullScreen();
        isVideoFullScreen = false;
    }
});
document.getElementById('youtube-video').addEventListener('ended', function () {
    // Sortir du mode plein écran si la vidéo est en mode plein écran
    if (isVideoFullScreen) {
        exitFullScreen();
        isVideoFullScreen = false;
    }
});
