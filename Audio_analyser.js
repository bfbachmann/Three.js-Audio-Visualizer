var audioContext, audioBuffer;
var url = 'Assets/audio/Yamborghini High (CDQ).mp3';


window.addEventListener('load', init, false);


// Initialize the audio context
function init() {

	try {
		// Fix up for prefixing
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		audioContext = new AudioContext();
  	} catch(e) {
    	alert('Web Audio API is not supported in this browser');
  	}

  	loadAudio(url);
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

	// Create the audio source
	var audioSource = audioContext.createBufferSource();

	// Wait for audio to finish buffering, then tell the source to play sound from the audioBuffer
	audioSource.buffer = audioBuffer;

	// Connect the audio source to the destination
	audioSource.connect(audioContext.destination);

	// Start playing the sounds from the beginning
	audioSource.start(0);
}


function onError() {
	console.log('ERROR: Failed to decode audio data');
}