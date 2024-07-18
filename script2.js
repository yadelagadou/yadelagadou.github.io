document.addEventListener('DOMContentLoaded', () => {
    const results = document.getElementById('search-results');
    const marqueeMessage = document.getElementById('marquee-message');
    const videoPlayerContainer = document.querySelector('.video-player');
    const exitFullscreenButton = document.getElementById('exit-fullscreen');
    const form = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    const navbar = document.querySelector('.navbar.burger-menu');
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const navbarLinks = document.querySelectorAll('.burger-menu a');
    const randomVideoPlayer = document.getElementById('random-video-player');

    // Détecter si l'utilisateur est sur un appareil Android
    const isAndroid = /Android/i.test(navigator.userAgent);
    if (isAndroid) {
        document.body.classList.add('android');
    }

    let currentVideoIndex = 0;
    let videoIds = [];
    let player;

    // Charger les vidéos de zap.json
    fetch('zap.json')
        .then(response => response.json())
        .then(data => {
            videoIds = data.videos.map(video => video.id);
            shuffleVideos();
            loadRandomVideo();
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
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        } else {
            onYouTubeIframeAPIReady();
        }
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

    function loadRandomVideo() {
        const randomIndex = Math.floor(Math.random() * videoIds.length);
        const randomVideo = videoIds[randomIndex];
        randomVideoPlayer.innerHTML = `
            <h2>Vidéo aléatoire</h2>
            <iframe width="560" height="315" src="https://www.youtube.com/embed/${randomVideo}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        `;
    }

    document.getElementById('zaping-link').addEventListener('click', function() {
        player.loadVideoById(videoIds[0]);
        currentVideoIndex = 0;
        enterFullScreen(videoPlayerContainer);
    });

    document.getElementById('zaping-link-mobile').addEventListener('click', function() {
        player.loadVideoById(videoIds[0]);
        currentVideoIndex = 0;
        enterFullScreen(videoPlayerContainer);
        navbar.classList.remove('active'); // Ferme le menu burger après avoir cliqué sur un lien
    });

    fetch('videos.json')
        .then(response => response.json())
        .then(videos => {
            results.innerHTML = ''; // Clear previous results
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

    // Ajoutez l'écouteur d'événements pour le formulaire de contact
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        emailjs.sendForm('service_4qj60a9', 'template_l3s4mge', form)
            .then(function(response) {
                form.reset();
                formMessage.style.display = 'block';
                formMessage.textContent = 'Merci! Votre message a été envoyé.';
                formMessage.classList.remove('error');
                formMessage.classList.add('success');
            }, function(error) {
                formMessage.style.display = 'block';
                formMessage.textContent = 'Erreur! Votre message n\'a pas pu être envoyé.';
                formMessage.classList.remove('success');
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
            results.innerHTML = ''; // Clear previous results

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
    } else if (element.webkitEnterFullscreen) { // iOS Safari
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
