/**
 * Created by hxiao on 2016/10/25.
 */

// Init Messages
var myMessages = myApp.messages('.messages', {
    autoLayout: true
});

// Init Messagebar
var myMessagebar = myApp.messagebar('.messagebar');

// Handle message
$('.messagebar .link').on('click', function () {
    // Message text
    var messageText = myMessagebar.value().trim();
    // Exit if empy message
    if (messageText.length === 0) return;

    // Empty messagebar
    myMessagebar.clear();

    // Random message type
    var messageType = (['sent', 'received'])[Math.round(Math.random())];

});

function addMessage(messageText, messageType, simulateTyping) {
    // Avatar and name for received message
    var avatar, name;
    if (messageType === 'received') {
        avatar = 'img/chat-avatar.png';
        name = '肖涵 - 德国博士咨询';
    } else {
        name = '我';
    }

    if (simulateTyping) {
        var breakText = messageText.match(/[^\.,!\?]+[\.,!\?]*/g);
        var waitTime = [1000];
        for (var i = 1; i < breakText.length; i++) {
            waitTime[i] = waitTime[i-1] + Math.min(1500, breakText[i-1].length * 150);
        }

        for (i = 0; i < breakText.length; i++) {
            (function (index) {
                setTimeout(function () {
                    addMessageInner(breakText[index], messageType, avatar, name);
                    if ((messageType == "received") && (index == breakText.length - 1)) {
                        vm.isWaitingChat = false;

                    }
                }, waitTime[i]);
            })(i);
        }
    } else {
        addMessageInner(messageText, messageType, avatar, name);
    }
}

function addMessageInner(messageText, messageType, avatar, name) {
    // Add message
    myMessages.addMessage({
        // Message text
        text: messageText,
        // Random message type
        type: messageType,
        // Avatar and name:
        avatar: avatar,
        name: name,
        // Day
        day: !conversationStarted ? '今天' : false,
        time: !conversationStarted ? (new Date()).getHours() + ':' + (new Date()).getMinutes() : false
    });
    // Update conversation flag
    conversationStarted = true;
}