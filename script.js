let videos = [];

fetch('videos.json')
    .then(response => response.json())
    .then(data => {
        videos = data;
        displayVideos();
    })
    .catch(error => console.error('Erreur lors du chargement des vidéos :', error));
	
	document.addEventListener('DOMContentLoaded', () => {
    const results = document.getElementById('search-results');
    const marqueeMessage = document.getElementById('marquee-message');

    // Load marquee message from a text file
    fetch('marquee.txt')
        .then(response => response.text())
        .then(data => {
            marqueeMessage.innerHTML = data;
        })
        .catch(error => {
            console.error('Error loading marquee message:', error);
            marqueeMessage.innerHTML = 'Bienvenue sur YADELAGADOU TV! 🌟 Profitez de nos vidéos!';
        });

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
            
            // Mettre en plein écran
            if (iframe.requestFullscreen) {
                iframe.requestFullscreen();
            } else if (iframe.mozRequestFullScreen) { // Firefox
                iframe.mozRequestFullScreen();
            } else if (iframe.webkitRequestFullscreen) { // Chrome, Safari et Opera
                iframe.webkitRequestFullscreen();
            } else if (iframe.msRequestFullscreen) { // IE/Edge
                iframe.msRequestFullscreen();
            }
            //////////////////////////////////////////////
   // Afficher le bouton de sortie
            document.getElementById('exit-fullscreen').style.display = 'block';
        });
        results.appendChild(videoItem);
    });
    /////////////////////////////////////////////////////
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
            
            // Mettre en plein écran
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
        results.appendChild(videoItem);
    });

    if (filteredVideos.length === 0) {
        results.innerHTML = '<p>Aucune vidéo trouvée.</p>';
    }
}
/////////////////////////////////////////////
function exitFullScreen() {
    if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { // Firefox
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { // Chrome, Safari et Opera
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // IE/Edge
            document.msExitFullscreen();
        }

        // Cacher le bouton de sortie
        document.getElementById('exit-fullscreen').style.display = 'none';
    }
}
/////////////////////////////////////////////////////////////
