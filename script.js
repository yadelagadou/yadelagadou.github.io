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

function searchVideos() {
    const query = document.getElementById('search-query').value.toLowerCase();
    const filteredVideos = videos.filter(video => video.title.toLowerCase().includes(query));

    const results = document.getElementById('search-results');
    results.innerHTML = '';

    filteredVideos.forEach(video => {
        const videoItem = document.createElement('div');
        videoItem.classList.add('video-item');
        videoItem.setAttribute('data-video-id', video.id);
        videoItem.innerHTML = `<h3>${video.title}</h3>`;
        videoItem.addEventListener('click', function() {
            const iframe = document.getElementById('youtube-video');
            iframe.src = `https://www.youtube.com/embed/${video.id}`;
            
            const player = document.querySelector('.video-player');
            player.classList.add('full-screen-video');

            const exitButton = document.getElementById('exit-fullscreen');
            exitButton.style.display = 'block';
        });

        results.appendChild(videoItem);
    });
}

function exitFullScreen() {
    const player = document.querySelector('.video-player');
    player.classList.remove('full-screen-video');

    const exitButton = document.getElementById('exit-fullscreen');
    exitButton.style.display = 'none';
}
