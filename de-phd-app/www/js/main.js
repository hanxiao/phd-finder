function renderWhenReady() {
    loadPositions(allPositionUrl);
    setupEventListener();
}

function setupEventListener() {
    $('.popup-detail').on('open', function () {
        $('#detail-content').scrollTop(0);
    });

    $('.popup-news').on('open', function () {
        $('#detail-news').scrollTop(0);
    });

    $(document).on('click', '.message-avatar', function (e) {
        myApp.popover('.popover-about', $(this))
    });

    $(document).on('click', 'a[href^=http], a[href^=https]', function (e) {

        e.preventDefault();
        var $this = $(this);
        var target = '_blank';

        window.open($this.attr('href'), target, 'location=no');
    });

    $('#chat-view').on('show', function () {
        initChat();
    });

    // Pull to refresh content
    var ptrContent = $('.pull-to-refresh-content');

    ptrContent.on('refresh', function (e) {
        setTimeout(function () {
            vm.updateData();
        }, 100);
    });

    ptrContent.on('pullstart', function(e) {
       showToast("下拉以刷新职位信息");
    });

    document.addEventListener("backbutton", onBackKeyDown, false);
}

function onBackKeyDown() {
    if ($('.popup.popup-detail.modal-in').length) {
        myApp.closeModal('.popup.popup-detail.modal-in');
    } else if ($('.popup.popup-news.modal-in').length) {
        myApp.closeModal('.popup.popup-news.modal-in');
    } else if ($('.page-on-center[data-page="faqpage"]')) {
        settingView.router.back()
    } else {
        navigator.app.exitApp();
        navigator.Backbutton.goBack(function() {
            console.log('success back to previous app');
        }, function() {
            navigator.Backbutton.goHome(function() {
                console.log('success');
            }, function() {
                console.log('fail to go home');
            });
        });
    }
}

function setupPush() {
    var push = PushNotification.init({
        "android": {
            "senderID": "400618008797"
        },
        "ios": {
            "sound": true,
            "alert": true,
            "badge": true,
            "clearBadge": true
        },
        "windows": {}
    });

    push.on('registration', function (data) {
        console.log("registration event: " + data.registrationId);
        var oldRegId = window.localStorage.getItem('registrationId');
        if (oldRegId !== data.registrationId) {
            // Save new registration ID
            window.localStorage.setItem('registrationId', data.registrationId);
            registerDeviceNotification(data.registrationId, 1, []);
            // Post registrationId to your app server as the value has changed
        }
        console.log(window.localStorage.getItem('registrationId'));
    });

    push.on('error', function (e) {
        console.log("push error = " + e.message);
    });

    push.on('notification', function (data) {
        console.log('notification event');
        navigator.notification.alert(
            data.message,         // message
            null,                 // callback
            data.title,           // title
            '知道了'                  // buttonName
        );

        push.finish(function () {
            console.log('success');
        }, function () {
            console.log('error');
        });
    });
}


function registerDeviceNotification(pushId, intVal, favTag) {
    var userInfo = {
        deviceId: pushId,
        deviceOS: myApp.device.os,
        timezone: moment().format("Z"),
        sysLang: window.navigator.userLanguage || window.navigator.language,
        enablePush: intVal,
        favTopic: favTag
    };

    //$.ajax({
    //    url: "https://script.google.com/macros/s/AKfycbyk1CWl4Ltx4hQOd7yiJ9ZG2wxBOOYOs7jYv4xg_Pn0cvPD4g/exec",
    //    type: "post",
    //    data: $.param(userInfo),
    //    success: function (data) {
    //        console.log('register google doc success');
    //    },
    //    error: function (data) {
    //        console.log('can not register on google');
    //    }
    //});

    $.ajax({
        url: nodejsServer + "/add",
        type: "post",
        data: userInfo,
        success: function (data) {
            console.log('success');
        },
        error: function (data) {
            console.log('can not register on aws');
        }
    });
}

function showHan() {
    onBackKeyDown();
    myApp.showTab('#chat-view');
    sendQuery("我想咨询一下申请的问题");
}

function tellFriend() {
    if (vm.hasWechat) {
        Wechat.share({
            message: {
                title: "给想去德国深造的亲们推荐「找德到」app, 德国硕士,博士,博士后,教授,实习,毕设,奖学金通通能找到!",
                description: "德国深造,就用「找德到」! 再也不愁找不到德国职位了!",
                thumb: "www/img/log128.png",
                mediaTagName: "de-phd",
                messageExt: "找德到分享",
                messageAction: "<action>dotalist</action>",
                media: {
                    type: Wechat.Type.WEBPAGE,
                    webpageUrl: "http://phd.ojins.com/app.html"
                }
            },
            scene: Wechat.Scene.TIMELINE   // share to Timeline
        }, function () {
            showToast("感谢你的支持, 相信你的朋友也会喜欢的");
            window.localStorage.setItem('showAds', false);
        }, function (reason) {
            showToast("额, 分享失败了");
        });
    } else {
        window.plugins.socialsharing.share("给想去德国深造的亲们推荐这个app, 「找德到」让德国教职找到你",
            "找德到 - 帮你你找到德国的大学职位!",
            "http://phd.ojins.com/img/log128.png",
            'http://phd.ojins.com/app.html');
    }
}

app.initialize();