/**
 * Created by hxiao on 2016/10/18.
 */

function isValidUrl(x) {
    if (x.indexOf("file:") > 0) {
        return false;
    }
    return true;
}

function imgError(x) {
    x.onerror = null;
    $(x).parent('.uni-logo').remove();
}

function imgErrorHide(x) {
    x.onerror = null;
    $(x).hide();
    $(x).css('visibility', 'hidden');
}

function imgLoadShow(x) {
    $(x).show();
    $(x).css('visibility', 'visible');
}

function renderValue(x, type) {
    switch (type) {
        case "cur":
            return accounting.formatMoney(x);
        case "pct":
            return accounting.formatNumber(x, 2) + '%';
        case "num":
            return accounting.formatNumber(x, 2);
        case "day":
            return x + (x > 1 ? " days" : " day");
        case "date":
            var tmpDate = new Date(x);
            return moment(tmpDate).fromNow();
        case "fulldate":
            tmpDate = new Date(x);
            return moment(tmpDate).format('MMMM Do YYYY, h:mm:ss a');
        default:
            return x;
    }
}

function setSuccess(obj) {
    console.log("storage success");
}

function setError(error) {
    console.log("storage wrong:" + error.code);
    if (error.exception !== "") console.log(error.exception);
}

function getSuccess(obj) {
    console.log("get storage success");
}

function getError(error) {
    console.log("storage wrong:" + error.code);
    if (error.exception !== "") console.log(error.exception);
}

function removeSuccess() {
    console.log("Removed");
}

function removeError(error) {
    console.log(error.code);
    if (error.exception !== "") console.log(error.exception);
}


function checkIntersect(x, y) {
    var result = false;
    for (var i = 0; i < x.length; i++) {
        for (var z = 0; z < y.length; z++) {
            if (x[i] == y[z]) {
                result = true;
                break;
            }
        }
    }
    return result;
}


function showToast(x, y) {
    window.plugins.toast.showWithOptions({
        message: x,
        duration: y ? y : 'short', // 2000 ms
        position: "bottom",
        styling: {
            opacity: 1.0, // 0.0 (transparent) to 1.0 (opaque). Default 0.8
            textColor: '#FFFFFF', // Ditto. Default #FFFFFF
            backgroundColor: '#554D8C' // make sure you use #RRGGBB. Default #333333
        }
    });
}

function openShareSheet(isPos) {
    var cbPos = function (buttonIndex) {
        switch (buttonIndex) {
            case 1:
                vm.shareWechat(vm.focusPosition, false);
                break;
            case 2:
                vm.shareWechat(vm.focusPosition, true);
                break;
            case 3:
                vm.shareTo(vm.focusPosition);
                break;
        }
    };

    var cbNews = function (buttonIndex) {
        switch (buttonIndex) {
            case 1:
                vm.shareNewsWechat(vm.focusNews, false);
                break;
            case 2:
                vm.shareNewsWechat(vm.focusNews, true);
                break;
            case 3:
                vm.shareNewsTo(vm.focusPosition);
                break;
        }
    };

    var options = {
        title: '你想分享到哪里?',
        subtitle: '若发送到Email,记事本或浏览器请选择"发送到其它程序"', // supported on iOS only
        buttonLabels: ['微信好友', '微信朋友圈', '发送到其它程序'],
        androidEnableCancelButton: true, // default false
        winphoneEnableCancelButton: true, // default false
        addCancelButtonWithLabel: '取消'
    };
    // Depending on the buttonIndex, you can now call shareViaFacebook or shareViaTwitter
    // of the SocialSharing plugin (https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin)
    window.plugins.actionsheet.show(options, isPos ? cbPos : cbNews);
}

function openRoutingSheet(canCancel, retry) {
    var options = {
        title: !retry? '根据您所在的位置, 选择距离最近的服务器': '访问速度过慢, 换个其他服务器试试?',
        subtitle: '中国大陆用户如果选择在海外可能会无法载入职位列表', // supported on iOS only
        buttonLabels: ['我在中国大陆', '我在海外'],
        androidEnableCancelButton: canCancel, // default false
        winphoneEnableCancelButton: canCancel, // default false
        addCancelButtonWithLabel: canCancel ? (retry? '继续等待': '取消')  : undefined
    };
    // Depending on the buttonIndex, you can now call shareViaFacebook or shareViaTwitter
    // of the SocialSharing plugin (https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin)
    window.plugins.actionsheet.show(options, function (idx) {
        if (idx ==1 || idx == 2) {
            allPositionUrl = idx == 1 ? allPositionUrlCN : allPositionUrlWO;
            allNewsUrl = idx == 1 ? allNewsCN : allNewsWO;
            window.localStorage.setItem('allPositionUrl', allPositionUrl);
            window.localStorage.setItem('firstSelectUrl', false);
            if (canCancel) {
                navigator.splashscreen.show();
                location.reload();
            } else {
                renderWhenReady();
            }
        } else if (idx==3 && retry) {
            waitUntilTimeout();
        }
    });
}

function randSent(sents) {
    return sents[Math.floor(Math.random() * sents.length)]
}