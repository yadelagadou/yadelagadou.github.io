document.addEventListener('DOMContentLoaded', () => {
    const results = document.getElementById('search-results');
    const marqueeMessage = document.getElementById('marquee-message');
    const videoPlayer = document.querySelector('.video-player');
    const exitFullscreenButton = document.getElementById('exit-fullscreen');
    const form = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    const navbar = document.querySelector('.navbar');
    const hamburgerIcon = document.querySelector('.hamburger-icon');
    const navbarLinks = document.querySelectorAll('.navbar a');

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

    // Load videos from JSON file
    fetch('videos.json')
        .then(response => response.json())
        .then(videos => {
            videos.forEach(video => {
                const videoItem = document.createElement('div');
                videoItem.classList.add('video-item');
                videoItem.setAttribute('data-video-id', video.id);
                videoItem.innerHTML = `<h3>${video.title}</h3>`;
                videoItem.addEventListener('click', function() {
                    const iframe = document.getElementById('youtube-video');
                    iframe.src = `https://www.youtube.com/embed/${video.id}`;
                    enterFullScreen(iframe);
                });

                results.appendChild(videoItem);
            });
        })
        .catch(error => {
            console.error('Error loading videos:', error);
        });

    exitFullscreenButton.addEventListener('click', function() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    });

    document.addEventListener('fullscreenchange', function() {
        if (document.fullscreenElement) {
            videoPlayer.classList.add('full-screen-video');
            exitFullscreenButton.style.display = 'block';
        } else {
            videoPlayer.classList.remove('full-screen-video');
            exitFullscreenButton.style.display = 'none';
        }
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Empêcher la soumission par défaut du formulaire

        emailjs.sendForm('service_0fe252g', 'template_16kaikr', form)
            .then(function(response) {
                form.reset();
                formMessage.style.display = 'block';
                formMessage.textContent = 'Merci! Votre message a été envoyé.';
                formMessage.classList.remove('error');
            }, function(error) {
                formMessage.style.display = 'block';
                formMessage.textContent = 'Erreur! Votre message n\'a pas pu être envoyé.';
                formMessage.classList.add('error');
            });
    });

    hamburgerIcon.addEventListener('click', function() {
        navbar.classList.toggle('active');
    });

    navbarLinks.forEach(link => {
        link.addEventListener('click', function() {
            navbar.classList.remove('active');
        });
    });
});

function searchVideos() {
    const query = document.getElementById('search-query').value.toLowerCase();

    fetch('videos.json')
        .then(response => response.json())
        .then(videos => {
            const results = document.getElementById('search-results');
            results.innerHTML = '';

            videos
                .filter(video => video.title.toLowerCase().includes(query))
                .forEach(video => {
                    const videoItem = document.createElement('div');
                    videoItem.classList.add('video-item');
                    videoItem.setAttribute('data-video-id', video.id);
                    videoItem.innerHTML = `<h3>${video.title}</h3>`;
                    videoItem.addEventListener('click', function() {
                        const iframe = document.getElementById('youtube-video');
                        iframe.src = `https://www.youtube.com/embed/${video.id}`;
                        enterFullScreen(iframe);
                    });

                    results.appendChild(videoItem);
                });
        })
        .catch(error => {
            console.error('Error searching videos:', error);
        });
}

function enterFullScreen(iframe) {
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
