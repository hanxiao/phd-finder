function renderWhenReady() {
    loadPositions(allPositionUrl);
    setupEventListener();
}

function setupEventListener() {
    $('.popup-detail').on('open', function () {
        $('#detail-content').scrollTop(0);
    });

    $(document).on('click', 'a[href^=http], a[href^=https]', function(e){

        e.preventDefault();
        var $this = $(this);
        var target = '_blank';

        window.open($this.attr('href'), target, 'location=no');
    });
}

function setupPush() {
    var push = PushNotification.init({
        "android": {
            "senderID": "400618008797"
        },
        "ios": {
            "sound": true,
            "alert": true,
            "badge": true
        },
        "windows": {}
    });

    push.on('registration', function(data) {
        console.log("registration event: " + data.registrationId);
        var oldRegId = localStorage.getItem('registrationId');
        if (oldRegId !== data.registrationId) {
            // Save new registration ID
            localStorage.setItem('registrationId', data.registrationId);
            registerDeviceNotification(data.registrationId);
            // Post registrationId to your app server as the value has changed
        }
        console.log(localStorage.getItem('registrationId'));
    });

    push.on('error', function(e) {
        console.log("push error = " + e.message);
    });

    push.on('notification', function(data) {
        console.log('notification event');
        navigator.notification.alert(
            data.message,         // message
            null,                 // callback
            data.title,           // title
            '知道了'                  // buttonName
        );

        push.finish(function() {
            console.log('success');
        }, function() {
            console.log('error');
        });
    });
}


function registerDeviceNotification(pushId) {
    var userInfo =  {
        deviceId : pushId,
        deviceOS : myApp.device.os,
        timezone: moment().format("Z"),
        sysLang: window.navigator.userLanguage || window.navigator.language,
        pushInterval: window.localStorage.getItem('pushInterval') || "3",
        favTopic: window.localStorage.getItem('favTopic') || 'all'
    };

    $.ajax({
        url: "https://script.google.com/macros/s/AKfycbyk1CWl4Ltx4hQOd7yiJ9ZG2wxBOOYOs7jYv4xg_Pn0cvPD4g/exec",
        type: "post",
        data: $.param(userInfo),
        success: function(data) {
            console.log('register google doc success');
        },
        error: function(data) {
            console.log('can not register on google');
        }
    });

    $.ajax({
        url: nodejsServer + "/add",
        type: "post",
        data: JSON.stringify(userInfo),
        success: function(data) {
            myApp.addNotification({
                title: '2号推送服务器注册成功!',
                media: '<i class="fa fa-check-circle"></i>',
                hold: 2000,
                closeIcon: false
            });
            console.log('success');
        },
        error: function(data) {
            myApp.addNotification({
                title: '2号推送服务器注册失败!',
                media: '<i class="fa fa-exclamation-triangle"></i>',
                hold: 2000,
                closeIcon: false
            });
            console.log('can not register on aws');
        }
    });
}


function checkWechat() {
    if (typeof Wechat == "undefined") {
        return false;
    } else {
        Wechat.isInstalled(function (installed) {
            return true;
        }, function (reason) {
            return false;
        });
    }
}

function tellFriend() {
    if (vm.hasWechat) {

    } else {
        window.plugins.socialsharing.share("想去德国读博, 做实习? 快用「找德到」! 免费App, 让职位找到你",
            "找德到 - 帮你你找到德国的大学职位!",
            "http://phd.ojins.com/img/log128.png",
            'http://phd.ojins.com/');
    }
}

app.initialize();

