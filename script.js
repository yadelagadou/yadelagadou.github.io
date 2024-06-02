const videos = [
    { id: 'nMsJ0zgy_As', title: 'YADELAGADOU TV - Présentation' },
    { id: 'abcd1234', title: 'Visite de la Normandie' },
    { id: 'efgh5678', title: 'Cuisine Normande' },
    { id: 'ijkl9012', title: 'Histoire de la Normandie' }
];

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

    videos.forEach(video => {
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
});

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
