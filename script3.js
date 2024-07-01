document.addEventListener('DOMContentLoaded', () => {
    const results = document.getElementById('search-results');
    const marqueeMessage = document.getElementById('marquee-message');
    const videoPlayerContainer = document.querySelector('.video-player');
    const exitFullscreenButton = document.getElementById('exit-fullscreen');
    const form = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    const navbar = document.querySelector('.navbar');
    const hamburgerIcon = document.querySelector('.hamburger-icon');
    const navbarLinks = document.querySelectorAll('.navbar a');

    let currentVideoIndex = 0;
    let videoIds = [];
    let player;

    fetch('zap.json')
        .then(response => response.json())
        .then(data => {
            videoIds = data.videos.map(video => video.id);
            shuffleVideos();
            loadYouTubeAPI();
        })
        .catch(error => {
            console.error('Error loading videos:', error);
        });

    fetch('marquee.txt')
        .then(response => response.text())
        .then(data => {
            marqueeMessage.innerHTML = data;
        })
        .catch(error => {
            console.error('Error loading marquee message:', error);
            marqueeMessage.innerHTML = 'Bienvenue sur YADELAGADOU TV! 🌟 Profitez de nos vidéos!';
        });

    function loadYouTubeAPI() {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    window.onYouTubeIframeAPIReady = function() {
        player = new YT.Player('player', {
            videoId: videoIds[0],
            playerVars: { 'autoplay': 1, 'controls': 1 },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    }

    function onPlayerReady(event) {
        event.target.playVideo();
    }

    function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.ENDED) {
            currentVideoIndex = (currentVideoIndex + 1) % videoIds.length;
            player.loadVideoById(videoIds[currentVideoIndex]);
        }
    }

    function shuffleVideos() {
        for (let i = videoIds.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [videoIds[i], videoIds[j]] = [videoIds[j], videoIds[i]];
        }
    }

    document.getElementById('zaping-link').addEventListener('click', function() {
        player.loadVideoById(videoIds[0]);
        currentVideoIndex = 0;
        enterFullScreen(videoPlayerContainer);
    });

    fetch('videos.json')
        .then(response => response.json())
        .then(videos => {
            videos.forEach(video => {
                const videoItem = document.createElement('div');
                videoItem.classList.add('video-item');
                videoItem.setAttribute('data-video-id', video.id);
                videoItem.innerHTML = `<h3>${video.title}</h3>`;
                videoItem.addEventListener('click', function() {
                    player.loadVideoById(video.id);
                    enterFullScreen(videoPlayerContainer);
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
            videoPlayerContainer.classList.add('full-screen-video');
            exitFullscreenButton.style.display = 'block';
        } else {
            videoPlayerContainer.classList.remove('full-screen-video');
            exitFullscreenButton.style.display = 'none';
        }
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault();

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
                        player.loadVideoById(video.id);
                        enterFullScreen(document.querySelector('.video-player'));
                    });

                    results.appendChild(videoItem);
                });
        })
        .catch(error => {
            console.error('Error searching videos:', error);
        });
}

function enterFullScreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) { // Firefox
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) { // Chrome, Safari and Opera
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) { // IE/Edge
        element.msRequestFullscreen();
    } else if (element.webkitEnterFullscreen) { // Safari for iPhone
        element.webkitEnterFullscreen();
    }
}

function exitFullScreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { // Firefox
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { // IE/Edge
        document.msExitFullscreen();
    }
}
