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

// Mettre la vidéo en plein écran lors du clic
document.getElementById('youtube-video').addEventListener('click', function () {
    console.log("Clic sur la vidéo"); // Ajout du console.log pour le débogage
    const video = this;
    if (video.requestFullscreen) {
        video.requestFullscreen();
    } else if (video.mozRequestFullScreen) { // Firefox
        video.mozRequestFullScreen();
    } else if (video.webkitRequestFullscreen) { // Chrome, Safari et Opera
        video.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) { // IE/Edge
        video.msRequestFullscreen();
    }
});

// Écouter les événements de fin de lecture pour sortir du mode plein écran
document.getElementById('youtube-video').addEventListener('pause', exitFullScreen);
document.getElementById('youtube-video').addEventListener('ended', exitFullScreen);

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
