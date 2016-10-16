var myApp = new Framework7({
    modalTitle: '找德到',
    onAjaxStart: function (xhr) {
        myApp.showIndicator();
    },
    onAjaxComplete: function (xhr) {
        myApp.hideIndicator();
    },
    tapHold: true, //enable tap hold events
    modalButtonOk: '好',
    modalButtonCancel: '取消',
    // If it is webapp, we can enable hash navigation:
    pushState: true,
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

myApp.addView('#profile-view', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

var allPositionUrl = 'http://ojins.com/data/phd/database/uncompressed/all.json';
var fieldTextMapUrl = 'data/field-text-en.json';
var strategyPoolUrl = 'data/dummy/strategies.json';

var curPositions;
var chartSeq = 0;
var trendChart;
var pieChart;
var trendChartOptions = {
    high: 2,
    low: -2,
    showArea: true,
    showLine: true,
    showPoint: true,
    fullWidth: true,
    stretch: true,
    chartPadding: {
        right: 10,
        left: -20
    },
    axisX: {
        showGrid: true
    },
    axisY: {
        offset: 60,
        labelInterpolationFnc: function (value) {
            return value + '%'
        },
        scaleMinSpace: 30
    },
    lineSmooth: Chartist.Interpolation.cardinal({
        fillHoles: true
    })
};

var pieChartOptions = {
    donut: true,
    showLabel: true,
    labelInterpolationFnc: function (l, p) {
        return l + ': ' + Math.round(curPositions.positions.series[p]) + '%';
    }
};

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

var recoSwiper = myApp.swiper('.reco-swiper', {
    pagination:'.reco-swiper .swiper-pagination',
    spaceBetween: 20
});

var account_screen;