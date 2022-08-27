const socket = io('/');

const videoGrid = document.getElementById('video-grid');

const myPeer = new Peer(undefined);


myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
});


const myVideo = document.createElement('video');
myVideo.muted = true;
myVideo.className = 'local_video';
const peers = {};
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
addVideoStream(myVideo, stream);
socket.on('user-connected', userId => {
    connectToNewUser(userId, stream);
})
myPeer.on('call', call => {
    call.answer(stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    });
});
})

function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    
    videoGrid.append(video);
    }

socket.on('user-disconnected', userId => {
if(peers[userId]) peers[userId].close();
})

function connectToNewUser(userId, stream){
    const call = myPeer.call(userId,stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    });
    call.on('close', () => {
        video.remove();
    })

    peers[userId] = call;
}

socket.on('user-connected', userId => {
    console.log('UserID', userId);
});

function addVideoStream(video, stream) {
video.srcObject = stream;
video.addEventListener('loadedmetadata', () => {
    video.play();
})

videoGrid.append(video);
}


let zoomBtn = document.getElementById('zoom');
if(zoomBtn){
zoomBtn.addEventListener('click', function(){
    let local_video = document.querySelector('.local_video');
    if(zoomBtn.textContent === 'Zoom Out [ - ]') {
        zoomBtn.textContent = 'Zoom In [ + ]';
        if( local_video.classList.contains('zoom_in')) {
            local_video.classList.remove('zoom_in');
        }
        local_video.classList.add('zoom_out');
    } else {
        zoomBtn.textContent = 'Zoom Out [ - ]';
        if( local_video.classList.contains('zoom_out')) {
            local_video.classList.remove('zoom_out');
        }
        local_video.classList.add('zoom_in');
    }
})}