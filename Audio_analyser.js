var audioContext, audioBuffer;
var url = 'Assets/audio/Southside Against the Clock Instrumental.mp3';
var audioSource;
var playing;
var analyzer, audioData;


window.addEventListener('load', initAudio, false);


// Initialize the audio context
function initAudio() {

	try {
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		audioContext = new AudioContext();
  	} catch(e) {
    	alert('Web Audio API is not supported in this browser');
  	}

  	loadAudio(url);
}


// Create and initialise the analyzer for this audio context 
function initAnalyzer() {

	// Create the analyzer and connect it to the audio source and destination
	analyzer = audioContext.createAnalyser();
	audioSource.connect(analyzer);
	analyzer.connect(audioContext.destination);

	// Start audio analysis loop
	analyzeAudio();
}


// Get an array of frequancies and amplitudes
function analyzeAudio() {
	
	window.requestAnimationFrame(analyzeAudio);

	audioData = new Uint8Array(analyzer.frequencyBinCount);
	analyzer.getByteFrequencyData(audioData);
	detectBeats(audioData);
}


// Get the aplitude of the sound emitted at the given frequency
function getFrequencyValue(frequency) {

	if (!(audioData === undefined)) {
		var nyquist = audioContext.sampleRate/2;
		var index = Math.round(frequency/nyquist * audioData.length);
		return audioData[index];
	}
	return null;
}


// Load the audio form the specified url
function loadAudio(url) {

	var request = new XMLHttpRequest();

	request.open('GET', url, true);
	request.responseType = 'arraybuffer';

	// Decode asynchronously
	request.onload = function() {
		audioContext.decodeAudioData(request.response, function(buffer) {
			audioBuffer = buffer;
			playAudio(audioBuffer);
		}, onError);
	}

	request.send();
}


// Play the audio
function playAudio(audioBuffer) {

	playing = true;

	// Create the audio source
	audioSource = audioContext.createBufferSource();

	// Wait for audio to finish buffering, then tell the source to play sound from the audioBuffer
	audioSource.buffer = audioBuffer;

	// Connect the audio source to the destination and initialize the analyzer
	initAnalyzer();

	// Start playing the sounds from the beginning
	audioSource.start();
}


function onError() {
	console.log('ERROR: Failed to decode audio data');
}


// Toggle audio playback
function toggleAudio() {

	if (playing === false) {
		playing = true;
		playAudio(audioBuffer);
	} else {
		playing = false;
		audioSource.stop();
	}
}


function isPlaying() {
	return playing;
}


function detectBeats(audioData) {

	for (var i = 0; i < audioData.length/2; i++) {
		if (audioData[i] > 250) {
			console.log('beat');
			return;
		}
	}
}