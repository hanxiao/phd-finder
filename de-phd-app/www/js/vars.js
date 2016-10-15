var myApp = new Framework7({
    modalTitle: 'Quantiness',
    onAjaxStart: function (xhr) {
        myApp.showIndicator();
    },
    onAjaxComplete: function (xhr) {
        myApp.hideIndicator();
    }
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

var allPositionUrl = 'http://ojins.com/data/phd/uncompressed/all.json';
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
var fieldTextMap;
var currentPool;
moment.locale('zh-cn');

var recoSwiper = myApp.swiper('.reco-swiper', {
    pagination:'.reco-swiper .swiper-pagination',
    spaceBetween: 20
});

var account_screen;