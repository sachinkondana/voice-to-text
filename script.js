document.addEventListener('DOMContentLoaded', () => {
    const recordBtn = document.getElementById('recordBtn');
    const transcriptArea = document.getElementById('transcript');
    const visualizer = document.getElementById('visualizer');
    const copyBtn = document.getElementById('copyBtn');
    const clearBtn = document.getElementById('clearBtn');
    const btnText = recordBtn.querySelector('.text');
    const btnIcon = recordBtn.querySelector('.icon');

    let recognition;
    let isRecording = false;

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
            updateUIState(false);
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
                // Add space if needed
                const separator = currentText.length > 0 && !currentText.endsWith(' ') ? ' ' : '';
                transcriptArea.value = currentText + separator + finalTranscript;
                transcriptArea.scrollTop = transcriptArea.scrollHeight;
            }
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            stopRecording();
        };
    } else {
        alert('Your browser does not support the Web Speech API. Please use Google Chrome or Microsoft Edge.');
        recordBtn.disabled = true;
    }

    // Toggle Recording
    recordBtn.addEventListener('click', () => {
        if (!recognition) return;

        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    });

    function startRecording() {
        try {
            recognition.start();
        } catch (error) {
            console.error('Error starting recognition:', error);
        }
    }

    function stopRecording() {
        try {
            recognition.stop();
        } catch (error) {
            console.error('Error stopping recognition:', error);
        }
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
