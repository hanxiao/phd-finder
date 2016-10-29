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

    $(document).on('click', 'a[href^=http], a[href^=https]', function (e) {

        e.preventDefault();
        var $this = $(this);
        var target = '_blank';

        window.open($this.attr('href'), target, 'location=no');
    });

    document.addEventListener("backbutton", onBackKeyDown, false);
}

function onBackKeyDown() {
    myApp.closeModal('.popup.popup-detail.modal-in');
    myApp.closeModal('.popup.popup-news.modal-in');
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
    var modal = myApp.modal({
        title: '我来为你的答疑解惑',
        text: '请截屏保存下面的二维码, 然后在微信中使用扫一扫添加我',
        afterText:  '<img id="myqr" src="img/qrcode.png" width="60%">',
        buttons: [
            {
                text: '你是谁?',
                onClick: function () {
                    window.open('http://phd.ojins.com', '_blank');
                }
            },
            {
                text: '我已截屏',
                bold: true
            }
        ]
    });
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
            myApp.confirm('十分感谢你的推荐! 不过在未融到资前, 广告是支持此app发展的唯一经济来源, 你是否确定要关闭广告呢?',
                function () {
                    myApp.alert('下次启动时将不再显示广告');
                    window.localStorage.setItem('showAds', false);
                },
                function () {
                    myApp.alert('十分感谢你的推荐继续支持, 我们会加倍努力!');
                }
            );
        }, function (reason) {
            myApp.alert('额...分享失败了');
        });
    } else {
        window.plugins.socialsharing.share("给想去德国深造的亲们推荐这个app, 「找德到」让德国教职找到你",
            "找德到 - 帮你你找到德国的大学职位!",
            "http://phd.ojins.com/img/log128.png",
            'http://phd.ojins.com/app.html');
    }
}

app.initialize();