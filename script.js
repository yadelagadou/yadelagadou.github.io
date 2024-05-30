let videos = [];

fetch('videos.json')
    .then(response => response.json())
    .then(data => {
        videos = data;
        displayVideos();
    })
    .catch(error => console.error('Erreur lors du chargement des vidéos :', error));

function searchVideos() {
    const query = document.getElementById('search-query').value.toLowerCase();
    const results = document.getElementById('search-results');
    results.innerHTML = '';

    const filteredVideos = videos.filter(video => video.title.toLowerCase().includes(query));
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
    // Si une seule vidéo est trouvée, mettez-la automatiquement en lecture
    if (filteredVideos.length === 1) {
        document.getElementById('youtube-video').src = `https://www.youtube.com/embed/${filteredVideos[0].id}`;
    }
}
