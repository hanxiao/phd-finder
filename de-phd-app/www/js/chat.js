/**
 * Created by hxiao on 2016/10/25.
 */

// Init Messages
var myMessages = myApp.messages('.messages', {
    autoLayout: true
});

// Init Messagebar


function sendQuery(messageText) {
    // Exit if empy message
    if (messageText.length === 0) return;

    // Empty messagebar
    try {
        myApp.messagebar('.messagebar').clear();
    } catch (ignored) {}


    // Random message type
    addMessage(messageText, 'sent', false, function() {
        var max_score = 0;
        var max_key = '';
        var low_msg = messageText.toLowerCase();
        Object.keys(logic).forEach(function(key) {
            if ("keyword" in logic[key]) {
                var score = 0;
                logic[key].keyword.forEach(function(kw) {
                    if (low_msg.indexOf(kw.toLowerCase()) >= 0) {score ++;}
                });
                //score /= logic[key].keyword.length;
                if (score > max_score) {
                    max_score = score;
                    max_key = key;
                }
            }
        });
        if ((Date.now() - lastChatTime) > 60000) {
            conversationStarted = false;
        }
        if (max_key.length > 0) {
            vm.chatState = logic[max_key];
        } else {
            vm.chatState = logic["unknown"];
        }
    });
}

function addMessage(messageText, messageType, simulateTyping, cb) {
    // Avatar and name for received message
    var avatar, name;
    if (messageType === 'received') {
        avatar = 'img/chat-avatar.png';
        name = '肖涵 - 德国博士咨询';
    } else {
        name = '我';
    }

    if (simulateTyping && messageText.match('<a|<img') == null) {
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
                        addMessageDone();
                        if (cb) {cb();}
                    }
                }, waitTime[i]);
            })(i);
        }
    } else {
        setTimeout(function () {
            addMessageInner(messageText, messageType, avatar, name);
            if (messageType == "received") {
                addMessageDone();
            }
            if (cb) {
                cb();
            }
        }, messageType == 'sent'? 0: 1000);
    }
}

function addMessageDone() {
    vm.isWaitingChat = false;
    vm.messageHistory = $('.messages').html();
    vm.saveState();
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

function initChat() {
    if (!vm.chatState) {
        vm.chatState=logic['welcome']
    }
    setTimeout(function(){
        myMessages.scrollMessages();
    }, 200);
}