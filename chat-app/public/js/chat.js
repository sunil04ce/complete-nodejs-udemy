const socket = io()

//Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');

const $sendLocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTempate = document.querySelector('#location-template').innerHTML;

socket.on('message', (message) => {
    console.log(message);
    const html = Mustache.render(messageTemplate, {
        message
    });
    $messages.insertAdjacentHTML('beforeend', html);
})

socket.on('locationMessage', (url) => {
    console.log("URL : ", url);
    const html = Mustache.render(locationTempate, {
        url
    });
    $messages.insertAdjacentHTML('beforeend', html);
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // disable
    $messageFormButton.setAttribute('disabled', 'disabled');

    const message = e.target.elements.messageInput.value;

    socket.emit('sendMessage', message, (error) => {

        // enable
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();

        if (error) {
            return console.log(error);
        }
        console.log('Message delivered!');
    });
});

$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.');
    }

    // disable
    $sendLocationButton.setAttribute('disabled', 'disabled');

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            console.log('Location shared!');
            // enable
            $sendLocationButton.removeAttribute('disabled');
        });
    })
});

// socket.on('countUpdated', (count) => {
//     console.log('The count has been updated!', count)
// });

// document.querySelector('#increment').addEventListener('click', () => {
//     console.log('Clicked');
//     socket.emit('increment')
// })

