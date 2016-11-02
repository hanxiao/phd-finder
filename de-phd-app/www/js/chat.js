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

    if (simulateTyping && messageText.indexOf("http") < 0) {
        var breakText = messageText.match(/[^\.,!\?]+[\.,!\?]*/g);
        var waitTime = [1000];
        for (var i = 1; i < breakText.length; i++) {
            waitTime[i] = waitTime[i - 1] + Math.min(1500, breakText[i - 1].length * 150);
        }

        for (i = 0; i < breakText.length; i++) {
            (function (index) {
                setTimeout(function () {
                    addMessageInner(breakText[index], messageType, avatar, name);
                    if ((messageType == "received") && (index == breakText.length - 1)) {
                        vm.isWaitingChat = false;
                        vm.messageHistory = $('.messages').html();
                    }
                }, waitTime[i]);
            })(i);
        }
    } else {
        addMessageInner(messageText, messageType, avatar, name);
        if (messageType == "received") {
            vm.isWaitingChat = false;
            vm.messageHistory = $('.messages').html();
            vm.saveState();
        }
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
        day: !conversationStarted ? moment().format('LL') : false,
        time: !conversationStarted ? moment().format('LT') : false
    });
    // Update conversation flag
    conversationStarted = true;
    lastChatTime = Date.now();
}