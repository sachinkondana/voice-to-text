# Voice to Text Application 🎙️

A modern, responsive web application that converts speech to text instantly using the Web Speech API. This application is designed to be simple, efficient, and accessible, featuring a clean UI with a real-time audio visualizer.

## 🔗 Live Demo
[**Launch App**](https://v2t-sk.netlify.app/)

## ✨ Features

- **Real-time Speech Recognition**: Converts voice to text as you speak.
- **Visualizer**: Dynamic audio wave animation that reacts to recording state.
- **PWA Support**: Installable as a native-like app on mobile and desktop devices.
- **Offline Capability**: Works offline once installed (cached resources).
- **Clipboard Integration**: One-click copy functionality.
- **Responsive Design**: Optimized for both desktop and mobile screens.

## 🛠️ Technologies Used

- **HTML5**: Semantic structure.
- **CSS3**: Modern styling with flexbox, animations, and responsive media queries.
- **JavaScript (ES6+)**: Core logic and DOM manipulation.
- **Web Speech API**: Native browser API for speech recognition.
- **Service Workers**: For PWA offline functionality.

## 🚀 Getting Started

To run this project locally:

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   ```

2. **Navigate to the project directory**
   ```bash
   cd html_voice_to_text
   ```

3. **Serve the application**
   Since this project uses Service Workers and modern APIs, it's best to run it on a local server (e.g., Live Server, Python SimpleHTTPServer).
   
   ```bash
   # Python 3
   python3 -m http.server 8000
   ```

4. **Open in Browser**
   Visit `http://localhost:8000` in Google Chrome or Microsoft Edge (browsers with Web Speech API support).

## 📱 PWA Installation

1. Open the application in your browser.
2. Click on the "Install" icon in the address bar (Desktop) or "Add to Home Screen" in the browser menu (Mobile).
3. The app will be installed and can be launched directly from your device.

## 📝 Usage

1. Click the **Start Recording** button (🎙️).
2. Allow microphone access when prompted.
3. Speak clearly into your microphone.
4. Watch the text appear in real-time.
5. Click **Stop Recording** (⏹️) when finished.
6. Use the **Copy** button to copy the text or **Clear** to reset.

## ⚠️ Browser Support

This application relies on the **Web Speech API**. Currently, the best support is provided by:
- Google Chrome (Desktop & Android)
- Microsoft Edge
- Safari (Partial support)

---
*Created by Sachin Kondana*
