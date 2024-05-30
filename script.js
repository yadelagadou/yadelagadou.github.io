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
// Mettre la vidéo en plein écran lors du clic
document.getElementById('youtube-video').addEventListener('click', function () {
    const iframe = this;
    iframe.classList.toggle('full-screen-video');
});

// Écouter les événements de fin de lecture pour sortir du mode plein écran
document.getElementById('youtube-video').addEventListener('ended', function () {
    const iframe = this;
    iframe.classList.remove('full-screen-video');
});
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

document.getElementById('youtube-video').addEventListener('load', function () {
    const iframe = this;
    const player = iframe.contentWindow;

    // Écouter les événements de la vidéo
    player.addEventListener('message', function (event) {
        const data = JSON.parse(event.data);
        if (data.event === 'onStateChange' && data.info === 1) { // 1 signifie que la vidéo a commencé à jouer
            enterFullScreen(iframe);
        } else if (data.event === 'onStateChange' && (data.info === 0 || data.info === 2)) { // 0: vidéo terminée, 2: vidéo en pause
            exitFullScreen();
        }
    });

    // Envoyer une demande de notification d'état à la vidéo
    player.postMessage('{"event":"listening","id":1,"session":"CLIENT-NON_RELIÉ"}', '*');
});

// Redimensionner l'iframe pour remplir l'écran
window.addEventListener('resize', function () {
    const iframe = document.getElementById('youtube-video');
    if (iframe.classList.contains('full-screen-video')) {
        iframe.style.width = window.innerWidth + 'px';
        iframe.style.height = window.innerHeight + 'px';
    }
});


