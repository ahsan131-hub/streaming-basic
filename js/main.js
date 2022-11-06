console.log("Hello World...")

let mediaStreams = null;
let mediaTrack = null;
let mediaRecorder = null
let recordedChunks = null
let blob = null


let tracksBtn = document.getElementById("trackBtn")
let stopBtn = document.getElementById("stopBtn")
let muteBtn = document.getElementById("muteBtn")

let recordBtn = document.getElementById("startRec")
let pauseRecBtn = document.getElementById("pauseRec")
let stopRecBtn = document.getElementById("stopRec")
let resumeRecBtn = document.getElementById("resumeRec")
let downloadRec = document.getElementById("downloadRec")

function initiateRecording(mediaStreams) {
    recordedChunks = []
    mediaRecorder = new MediaRecorder(mediaStreams, {mimeType: "video/webm; codecs=vp8,opus"})

    mediaRecorder.ondataavailable = (e) => {
        console.log("recording chunks size ", e.data.size)
        if (e.data.size > 0) {
            recordedChunks.push(e.data);
        }

    }

    mediaRecorder.onstart = async () => {
        console.log("recording started")

        downloadRec.disabled = true
        resumeRecBtn.disabled = true
        pauseRecBtn.disabled = false
        stopRecBtn.disabled = false
    }

    mediaRecorder.onpause = async () => {
        pauseRecBtn.disabled = true
        resumeRecBtn.disabled = false
    }
    mediaRecorder.onresume = async () => {
        resumeRecBtn.disabled = true
        pauseRecBtn.disabled = false
        stopRecBtn.disabled = false
    }
    mediaRecorder.onstop = async () => {
        console.log("on stop is called")
        downloadRec.disabled = false
        blob = new Blob(recordedChunks, {type: "video/webm"})
        const url = window.URL.createObjectURL(blob)


        var videoRecPlayer = document.getElementById('demoVideoControl');
        videoRecPlayer.srcObject = null;
        videoRecPlayer.load();
        videoRecPlayer.src = url;
        videoRecPlayer.play();
        videoRecPlayer.style.display = "block"


        console.log(blob)
        downloadRec.setAttribute("href", url)
        downloadRec.setAttribute("download", "test.weba")

        resumeRecBtn.disabled = true
        pauseRecBtn.disabled = true
        stopRecBtn.disabled = true
    }

}

pauseRecBtn.onclick = () => {
    if (mediaRecorder) {
        mediaRecorder.pause()
    }
}
resumeRecBtn.onclick = () => {
    if (mediaRecorder) {
        mediaRecorder.resume()
    }
}
stopRecBtn.onclick = () => {
    if (mediaRecorder) {
        mediaRecorder.stop()
    }
}


downloadRec.onclick = () => {
    // if (mediaRecorder) {
    //     mediaRecorder.start()
    // }
}

recordBtn.onclick = (event) => {
    recordBtn.disabled = true
    initiateRecording(mediaStreams)
    mediaRecorder.start(1000)

}


muteBtn.onclick = (event) => {
    if (!mediaTrack) return

    if (muteBtn.innerText === "mute") {
        mediaTrack.enabled = true
        muteBtn.innerText = "unmute"
    } else {
        mediaTrack.enabled = false
        muteBtn.innerText = "mute"
    }
    console.log(mediaTrack);
}

function showBtns() {
    startButton.disabled = true
    muteBtn.style.display = "block"
    stopBtn.style.display = "block"
    tracksBtn.style.display = "block"
}

async function startCall() {
    try {
        mediaStreams = await navigator.mediaDevices.getUserMedia(
            {video: true, audio: true});

    } catch (e) {
        console.log(e);
    }

    document.getElementById("mediaControl").srcObject = mediaStreams
    showBtns()

    mediaTrack = mediaStreams.getAudioTracks()[0]


    mediaTrack.onmute = () => {
        console.log(
            "audio media stream is muted."
        )
    }

    mediaTrack.onunmute = () => {
        console.log(
            "audio media stream is un muted."
        )
    }

    mediaStreams.getTracks().forEach(track => {
        console.log(track)
    })
}

stopBtn.onclick = (e) => {
    mediaStreams.getAudioTracks()[0].enabled = false
    mediaStreams.getVideoTracks()[0].enabled = false

}
document.getElementById("startButton").onclick = async () => {
    await startCall()
}
