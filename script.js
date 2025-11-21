document.addEventListener('DOMContentLoaded', () => {
    const recordBtn = document.getElementById('recordBtn');
    const transcriptArea = document.getElementById('transcript');
    const visualizer = document.getElementById('visualizer');
    const copyBtn = document.getElementById('copyBtn');
    const clearBtn = document.getElementById('clearBtn');
    const btnText = recordBtn.querySelector('.text');
    const btnIcon = recordBtn.querySelector('.icon');

    // Check if running in iOS PWA standalone mode
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

    if (isIOS && isStandalone) {
        alert('Voice recognition is not supported in installed apps on iOS due to Apple restrictions. Please open this app in the Safari browser to use voice features.');
        recordBtn.disabled = true;
        btnText.textContent = 'Not Supported in App';
        return;
    }

    let recognition;
    let isRecording = false;
    let shouldBeRecording = false; // Flag to handle auto-restart on Safari

    // Check for browser support
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            isRecording = true;
            updateUIState(true);
        };

        recognition.onend = () => {
            isRecording = false;
            // Auto-restart logic for Safari/Chrome if we didn't explicitly stop
            if (shouldBeRecording) {
                try {
                    recognition.start();
                } catch (e) {
                    console.log('Restarting recognition...');
                }
            } else {
                updateUIState(false);
            }
        };

        recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            // Append final transcript to existing text
            if (finalTranscript) {
                const currentText = transcriptArea.value;
                const separator = currentText.length > 0 && !currentText.endsWith(' ') ? ' ' : '';
                transcriptArea.value = currentText + separator + finalTranscript;
                transcriptArea.scrollTop = transcriptArea.scrollHeight;
            }
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            if (event.error === 'not-allowed') {
                alert('Microphone access denied. Please allow microphone access in your browser settings.');
                shouldBeRecording = false;
                updateUIState(false);
            } else if (event.error === 'network') {
                // Brave often throws network error for speech recognition
                let isBrave = false;
                if (navigator.brave) {
                    isBrave = true;
                } else if (/Brave/.test(navigator.userAgent)) {
                    isBrave = true;
                }

                if (isBrave) {
                    alert('Brave browser disables voice recognition for privacy reasons. Please use Chrome, Edge, or Safari.');
                } else {
                    alert('Network error occurred. Please check your connection.');
                }
                shouldBeRecording = false;
                updateUIState(false);
            }
        };
    } else {
        // Specific messages for known unsupported browsers
        const isFirefox = /firefox/i.test(navigator.userAgent);
        if (isFirefox) {
            alert('Firefox does not support voice recognition by default. Please use Google Chrome, Edge, or Safari.');
        } else {
            alert('Your browser does not support the Web Speech API. Please use Google Chrome, Edge, or Safari.');
        }
        recordBtn.disabled = true;
        btnText.textContent = 'Not Supported';
    }

    // Toggle Recording
    recordBtn.addEventListener('click', () => {
        if (!recognition) return;

        if (shouldBeRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    });

    function startRecording() {
        shouldBeRecording = true;
        try {
            recognition.start();
        } catch (error) {
            console.error('Error starting recognition:', error);
            shouldBeRecording = false;
        }
    }

    function stopRecording() {
        shouldBeRecording = false;
        try {
            recognition.stop();
        } catch (error) {
            console.error('Error stopping recognition:', error);
        }
        updateUIState(false);
    }

    function updateUIState(recording) {
        if (recording) {
            recordBtn.classList.add('recording');
            visualizer.classList.add('active');
            btnText.textContent = 'Stop Recording';
            btnIcon.textContent = '⏹️';
        } else {
            recordBtn.classList.remove('recording');
            visualizer.classList.remove('active');
            btnText.textContent = 'Start Recording';
            btnIcon.textContent = '🎙️';
        }
    }

    // Copy Functionality
    copyBtn.addEventListener('click', () => {
        if (!transcriptArea.value) return;

        navigator.clipboard.writeText(transcriptArea.value).then(() => {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<span class="icon">✅</span> Copied!';
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    });

    // Clear Functionality
    clearBtn.addEventListener('click', () => {
        transcriptArea.value = '';
    });
});
