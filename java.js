document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('audio');
    const playPauseBtn = document.getElementById('play-pause');
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');
    const trackTitleElem = document.getElementById('track-title');
    const trackDescriptionElem = document.getElementById('track-description');
    const slider = document.getElementById('slider');
    const currentTimeElem = document.getElementById('current-time');
    const remainingTimeElem = document.getElementById('remaining-time');
    const playlistElem = document.getElementById('playlist');

    const tracks = [
        { title: 'Vintage Funk Preview', description: 'A groovy preview of vintage funk tunes.', src: '/Music/test.wav' },
        { title: 'Smooth Jazz Vibes', description: 'Relax with smooth jazz vibes.', src: '/Music/eikeli.wav' },
        { title: 'Classic Rock Anthem', description: 'Energetic classic rock track.', src: '/Music/fett.wav' },     
        { title: 'QC Ruler', description: 'skaru ha bibbe.', src: '/Music/qc.wav' }, 
    ];

    let currentTrackIndex = 0;

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    }

    function updateTrackInfo(index) {
        if (index >= 0 && index < tracks.length) {
            const track = tracks[index];
            trackTitleElem.textContent = track.title;
            trackDescriptionElem.textContent = track.description;
            audio.src = track.src;
            audio.load(); // Reload audio
            audio.currentTime = 0; // Set to start of track
            slider.value = 0;
            slider.style.background = 'linear-gradient(to right, #007bff 0%, #ddd 0%, #ddd 100%)';
            currentTimeElem.textContent = '00:00';
            remainingTimeElem.textContent = `-${formatTime(audio.duration)}`;
            currentTrackIndex = index;
            updatePlayPauseButton(audio.paused);
            updatePlaylistButtons();
        }
    }

    function updatePlayPauseButton(isPlaying) {
        if (isPlaying) {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        } else {
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        }
    }

    function updatePlaylistButtons() {
        const items = playlistElem.querySelectorAll('.playlist-item');
        items.forEach((item, i) => {
            const btn = item.querySelector('.play-pause-btn');
            if (i === currentTrackIndex) {
                btn.innerHTML = audio.paused ? '<i class="fas fa-play"></i>' : '<i class="fas fa-pause"></i>';
            } else {
                btn.innerHTML = '<i class="fas fa-play"></i>';
            }
        });
    }

    function initializeTrackInfo() {
        if (tracks.length > 0) {
            updateTrackInfo(0);
            updatePlayPauseButton(false); // Since audio is not playing, show play icon
        }
    }

    function populatePlaylist() {
        tracks.forEach((track, index) => {
            const listItem = document.createElement('li');
            listItem.className = 'playlist-item';

            const playPauseBtn = document.createElement('button');
            playPauseBtn.className = 'play-pause-btn';
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            playPauseBtn.addEventListener('click', () => {
                if (currentTrackIndex === index) {
                    if (audio.paused) {
                        audio.play();
                        updatePlayPauseButton(true);
                        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                    } else {
                        audio.pause();
                        updatePlayPauseButton(false);
                        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                    }
                } else {
                    updateTrackInfo(index);
                    audio.play();
                }
            });
            listItem.appendChild(playPauseBtn);

            const title = document.createElement('span');
            title.className = 'track-title';
            title.textContent = track.title;
            listItem.appendChild(title);

            playlistElem.appendChild(listItem);
        });
    }

    populatePlaylist();
    initializeTrackInfo();

    playPauseBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            updatePlayPauseButton(true);
        } else {
            audio.pause();
            updatePlayPauseButton(false);
        }
        updatePlaylistButtons();
    });

    audio.addEventListener('loadeddata', () => {
        audio.currentTime = 0;
        slider.value = 0;
        currentTimeElem.textContent = '00:00';
        remainingTimeElem.textContent = `-${formatTime(audio.duration)}`;
    });

    audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
            const currentTime = audio.currentTime;
            const duration = audio.duration;
            const value = (currentTime / duration) * 100;
            slider.value = value;
            slider.style.background = `linear-gradient(to right, #007bff ${value}%, #ddd ${value}%, #ddd 100%)`;
            currentTimeElem.textContent = formatTime(currentTime);
            remainingTimeElem.textContent = `-${formatTime(duration - currentTime)}`;
        }
    });

    slider.addEventListener('input', () => {
        const percentage = slider.value / 100;
        audio.currentTime = percentage * audio.duration;
    });

    document.getElementById('next').addEventListener('click', () => {
        currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
        updateTrackInfo(currentTrackIndex);
        audio.play();
    });

    document.getElementById('prev').addEventListener('click', () => {
        currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
        updateTrackInfo(currentTrackIndex);
        audio.play();
    });

    audio.addEventListener('play', () => {
        updatePlayPauseButton(true);
        updatePlaylistButtons();
    });

    audio.addEventListener('pause', () => {
        updatePlayPauseButton(false);
        updatePlaylistButtons();
    });
});
