var myApp = new Framework7({
    modalTitle: '找德到',
    tapHold: true, //enable tap hold events
    modalButtonOk: '好',
    modalButtonCancel: '取消',
    // If it is webapp, we can enable hash navigation:
    pushState: true,
    actionsCloseByOutside: false,
    smartSelectBackTemplate: '<div class="left sliding">' +
    '<a href="#" class="back link">' +
    '<i class="fa fa-chevron-left"></i><span></span> 返回</a></div>'
});

// Add views
myApp.addView('#port-view', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

myApp.addView('#invest-view', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

myApp.addView('#news-view', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});


myApp.addView('#chat-view', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

var settingView = myApp.addView('#profile-view', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true,
    // Enable Dom Cache so we can use all inline pages
    domCache: true
});


var locationBtns = [
    {
        text: '选择您所在的位置, 将为你选择最稳定的服务器.',
        label: true
    },
    {
        text: '我在中国大陆',
        onClick: function () {
            allPositionUrl = allPositionUrlCN;
            allNewsUrl = allNewsCN;
            window.localStorage.setItem('allPositionUrl', allPositionUrl);
            window.localStorage.setItem('firstSelectUrl', false);
            renderWhenReady();
        }
    },
    {
        text: '我在海外',
        onClick: function () {
            allPositionUrl = allPositionUrlWO;
            allNewsUrl = allNewsWO;
            window.localStorage.setItem('allPositionUrl', allPositionUrl);
            window.localStorage.setItem('firstSelectUrl', false);
            renderWhenReady();
        }
    }
];

var curPositions;

var localeData = {id: 'de'};

var translateTags = {
    "wimi": {
        "short": "研究员",
        "long": "和大学或研究所签订工作合同的研究员",
        "type": "position"
    },
    "phd": {
        "short": "博士生",
        "long": "面向硕士的3到5年的博士研究生",
        "type": "position"
    },
    "hiwi": {
        "short": "学生助理",
        "long": "和大学或研究所签订工作合同的本科或硕士在读生",
        "type": "position"
    },
    "postdoc": {
        "short": "博士后",
        "long": "面向博士的1到3年的教职工作",
        "type": "position"
    },
    "prof": {
        "short": "教授",
        "long": "",
        "type": "position"
    },
    "juniorprof": {
        "short": "青年教授",
        "long": "部分德国大学改制后面向优秀青年学者的教授职位",
        "type": "position"
    },
    "mthesis": {
        "short": "硕士毕设",
        "long": "面向硕士生的3-6个月的毕业设计(论文)",
        "type": "position"
    },
    "practical": {
        "short": "实习",
        "long": "",
        "type": "position"
    },
    "scholarship": {
        "short": "奖学金",
        "long": "",
        "type": "position"
    },
    "lifescience": {
        "short": "生命科学",
        "long": "",
        "type": "subject"
    },
    "biologie": {
        "short": "生物",
        "long": "",
        "type": "subject"
    },
    "chemie": {
        "short": "化学",
        "long": "",
        "type": "subject"
    },
    "physic": {
        "short": "物理",
        "long": "",
        "type": "subject"
    },
    "medizin": {
        "short": "医药",
        "long": "",
        "type": "subject"
    },
    "psychologie": {
        "short": "心理学",
        "long": "",
        "type": "subject"
    },
    "mathematik": {
        "short": "数学",
        "long": "",
        "type": "subject"
    },
    "informatik": {
        "short": "计算机",
        "long": "",
        "type": "subject"
    },
    "engineer": {
        "short": "工科",
        "long": "",
        "type": "subject"
    },
    "economics": {
        "short": "经济学",
        "long": "",
        "type": "subject"
    },
    "politic": {
        "short": "政治",
        "long": "",
        "type": "subject"
    },
    "geisteswissen": {
        "short": "文史哲",
        "long": "",
        "type": "subject"
    },
    "soziologie": {
        "short": "社会学",
        "long": "",
        "type": "subject"
    },
    "kulturwissen": {
        "short": "文化研究",
        "long": "",
        "type": "subject"
    }
};

moment.locale('zh-cn');


var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        window.open = cordova.InAppBrowser.open;
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        navigator.splashscreen.hide();
        if (firstSelectUrl) {
            myApp.actions(locationBtns);
        } else {
            renderWhenReady();
        }
    }
};


// Conversation flag
var conversationStarted = false;
var lastChatTime = 0;

var nodejsServer = 'http://zdd-push.ojins.com:8080';
var allPositionUrlCN = 'http://zdd-push.ojins.com:8080/allpos';
var allPositionUrlWO = 'http://ojins.com/data/phd/database/uncompressed/all.json';

var allNewsCN = 'http://zdd-push.ojins.com:8080/allnews';
var allNewsWO = 'http://ojins.com/data/phd/database/embassynews.json';
var allPositionUrl = window.localStorage.getItem('allPositionUrl') || allPositionUrlCN;
var allNewsUrl = allPositionUrl == allPositionUrlCN? allNewsCN: allNewsWO;

var firstOpenApp = JSON.parse(window.localStorage.getItem('firstOpenApp') || 'true');
var firstSelectUrl = JSON.parse(window.localStorage.getItem('firstSelectUrl') || 'true');
var firstTransCN = JSON.parse(window.localStorage.getItem('firstTransCN') || 'true');
var showAds = JSON.parse(window.localStorage.getItem('showAds') || 'true');