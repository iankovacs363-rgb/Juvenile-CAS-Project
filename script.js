// Valid codes
const validCodes = ['SQD77J3', '6OM37QJ', '6BZJ8DP', 'Q2B7UN6', 'F9BJ2HW','M8X0AJ7','DWL3GC6','KWN5SDF','XLIKQSF','I8YMBIH','OS3KUNW','Y5TIQ2Z','J2Y6W31','SZ6364Z','AXIZKT8','VOZPSE8','Z9NKEMD','SQJMDQ5','KU8BL55','9VYA4ZM','Q07QN2O','5I7WGDU','F1LLSBY','V8NWC9I','','','','','','','','','','','','','','','','',''];

// Elements
const codeInput = document.getElementById('codeInput');
const submitBtn = document.getElementById('submitBtn');
const requestBtn = document.getElementById('requestBtn');
const okBtn = document.getElementById('okBtn');
const popup = document.getElementById('popup')
const errorMessage = document.getElementById('errorMessage');
const lockedState = document.getElementById('lockedState');
const trackList = document.getElementById('trackList');
const glitchText = document.getElementById('glitchText');

// Glitch text animation
const glitchTexts = ['ENTER ACCESS CODE', 'REDEEM YOUR KEY', 'UNLOCK AUDIO'];
const glitchChars = '!<>-_\\/[]{}—=+*^?#________';
let currentGlitchIndex = 0;

setInterval(() => {
    if (Math.random() > 0.95) {
        const randomText = glitchTexts[Math.floor(Math.random() * glitchTexts.length)];
        let glitched = '';
        for (let i = 0; i < randomText.length; i++) {
            if (Math.random() > 0.7) {
                glitched += glitchChars[Math.floor(Math.random() * glitchChars.length)];
            } else {
                glitched += randomText[i];
            }
        }
        glitchText.textContent = glitched;
        setTimeout(() => {
            glitchText.textContent = glitchTexts[currentGlitchIndex];
            currentGlitchIndex = (currentGlitchIndex + 1) % glitchTexts.length;
        }, 50);
    }
}, 100);

// Auto uppercase input
codeInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.toUpperCase();
});

// Submit code
function submitCode() {
    const code = codeInput.value.trim().toUpperCase();
    errorMessage.style.display = 'none';

    if (validCodes.includes(code)) {
        // Success - show tracks
        lockedState.style.display = 'none';
        trackList.classList.add('active');
    } else {
        // Error
        errorMessage.textContent = 'ACCESS DENIED';
        errorMessage.style.display = 'block';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 2000);
    }
}

// Event listeners
submitBtn.addEventListener('click', submitCode);

codeInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        submitCode();
    }
});

requestBtn.addEventListener('click', () => {
    popup.classList.add("open-popup");
});

okBtn.addEventListener('click', () => {
    popup.classList.remove("open-popup");
});

// Play/Pause functionality
let currentlyPlaying = null;

function togglePlay(button, trackNumber) {
    const audio = document.getElementById(`audio-${trackNumber}`);
    const allButtons = document.querySelectorAll('.play-btn');
    
    // Stop any currently playing track
    if (currentlyPlaying && currentlyPlaying !== audio) {
        currentlyPlaying.pause();
        currentlyPlaying.currentTime = 0;
        // Reset the button of the previously playing track
        allButtons.forEach(btn => {
            btn.textContent = '▶';
            btn.classList.remove('playing');
        });
    }
    
    // Toggle play/pause for the clicked track
    if (audio.paused) {
        audio.play();
        button.textContent = '⏸';
        button.classList.add('playing');
        currentlyPlaying = audio;
        
        // Reset button when track ends
        audio.onended = function() {
            button.textContent = '▶';
            button.classList.remove('playing');
            currentlyPlaying = null;
        };
    } else {
        audio.pause();
        button.textContent = '▶';
        button.classList.remove('playing');
        currentlyPlaying = null;
    }
}

// Download track function
function downloadTrack(trackNumber) {
    const trackUrls = {
        1: 'tracks/01-CP-17.m4a',
        2: 'tracks/02-CHRISTMAS-CAROL.m4a',
        3: 'tracks/03-SNEAKY.m4a',
        4: 'tracks/04-STARDUST.m4a',
        5: 'tracks/05-IM-LOVIN-IT.m4a',
        6: 'tracks/06-TRES-CALIENTES.m4a',
        7: 'tracks/07-SIDE-UP.m4a',
        8: 'tracks/08-VETEMENTS.m4a',
        9: 'tracks/09-DISINGENIOUS.m4a',
        10: 'tracks/10-TOK-TO-ME.m4a'
    };

    const trackNames = {
        1: '01-CP-17.m4a',
        2: '02-CHRISTMAS-CAROL.m4a',
        3: '03-SNEAKY.m4a',
        4: '04-STARDUST.m4a',
        5: '05-IM-LOVIN-IT.m4a',
        6: '06-TRES-CALIENTES.m4a',
        7: '07-SIDE-UP.m4a',
        8: '08-VETEMENTS.m4a',
        9: '09-DISINGENIOUS.m4a',
        10: '10-TOK-TO-ME.m4a'
    };

    const url = trackUrls[trackNumber];
    const filename = trackNames[trackNumber];

    // Fetch the file and force download as blob
    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('File not found');
            return response.blob();
        })
        .then(blob => {
            // Create a blob URL
            const blobUrl = window.URL.createObjectURL(blob);
            
            // Create a temporary link and trigger download
            const link = document.createElement('a');
            link.style.display = 'none';
            link.href = blobUrl;
            link.download = filename;
            
            // Add to document, click, and remove
            document.body.appendChild(link);
            link.click();
            
            // Clean up
            setTimeout(() => {
                document.body.removeChild(link);
                window.URL.revokeObjectURL(blobUrl);
            }, 100);
        })
        .catch(error => {
            console.error('Download failed:', error);
            alert('Could not download track. Make sure the file exists in the tracks folder.');
        });
}
