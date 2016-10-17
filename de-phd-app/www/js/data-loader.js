/**
 * Created by hxiao on 16/9/1.
 */

function translate2LocalData(json, lang) {
    switch (lang) {
        case "zh-cn":
            $.each(json, function (_, x) {
                x.disTitle = x.title_zh;
                x.disInstitute = x.institute_zh;
            });
            break;
        case "en-us":
            $.each(json, function (_, x) {
                x.disTitle = x.title_en;
                x.disInstitute = x.institute_en;
            });
            break;
        case "de":
            $.each(json, function (_, x) {
                x.disTitle = x.title;
                x.disInstitute = x.institute;
            });
            break;
    }
    localeData.id = lang;
    return json;
}

function populatePosition(sidx, k, target, filters) {
    var i = sidx;
    var pi = 0;
    while (pi < k && i < curPositions.length) {
        var arr2 = filters;
        var isSuperset = true;

        if (arr2.length > 0) {
            var arr1 = curPositions[i].tags;
            isSuperset = arr2.every(function(val) { return arr1.indexOf(val) >= 0; });
        }

        if (isSuperset) {
            target.push(curPositions[i]);
            pi++;
        }
        i++;
    }
    myApp.sizeNavbars('.view-main');
    return i;
}

function loadPositions(positionUrl) {
    myApp.showIndicator();
    console.log("start loading positions from %s", positionUrl);

    $.getJSON(positionUrl, function (json) {
        console.log("finish loading %s", positionUrl);

        curPositions = translate2LocalData(json, localeData.id);

        vm = new Vue({
            el: '#all-positions',
            data: {
                curTag: [],
                distance: 100,
                positions: [],
                tagMap: translateTags,
                lang: localeData,
                eIdx: 0,
                focusPosition: false
            },
            ready: function () {
                this.eIdx = populatePosition(0, 20, this.positions, this.curTag);
                myApp.hideIndicator();
                myApp.sizeNavbars('.view-main');
                try {
                    navigator.splashscreen.hide();
                } catch (ex) {
                    console.error("hide splash screen error");
                }
            },
            methods: {
                renderVal: function (val, typ) {
                    return renderValue(val, typ);
                },
                closeAllSwipe: function (p1, p2) {
                    $.each($('.swipeout'), function (idx, x) {
                        myApp.swipeoutClose(x)
                    });
                    p1.isFav = p2;
                },
                onInfinite: function () {
                    setTimeout(function () {
                        this.eIdx = populatePosition(this.eIdx, 20, this.positions, this.curTag);
                        this.$broadcast('$InfiniteLoading:loaded');
                    }.bind(this), 200);
                },
                changeFilter: function () {
                    this.positions = [];
                    this.eIdx = 0;
                    this.$broadcast('$InfiniteLoading:reset');
                },
                resetFilter: function () {
                    this.curTag = [];
                    this.changeFilter();
                },
                transTag: function (val) {
                    return translateTags[val].short;
                }
            },
            computed: {
                focusHtml: function() {
                    var doc = "";
                    if (this.focusPosition) {
                        doc = this.focusPosition.mainContent;
                        doc = $('<p>').html(doc).find('img').remove().end().html();
                    }
                    return doc;
                },
                focusLinks: function() {
                    var tmp = new Set();
                    var result = [];
                    var links = $('a', this.focusHtml);
                    $.each(links, function (idx, x) {
                        if (!tmp.has(x.href)) {
                            tmp.add(x.href);
                            result.push(x.href);
                        }
                    });
                    return result;
                },
                favPositions: function () {
                    return this.positions.filter(function (x) {
                        return x.isFav;
                    });
                },
                tagList: function () {
                    var translateTagsList = [];
                    for (var key in this.tagMap) {
                        var tmp = this.tagMap[key];
                        tmp["key"] = key;
                        translateTagsList.push(tmp);
                    }
                    return translateTagsList;
                },
                totalSize: function() {
                    var i = 0;
                    var pi = 0;
                    while (i < curPositions.length) {
                        var arr2 = this.curTag;
                        var isSuperset = true;

                        if (arr2.length > 0) {
                            var arr1 = curPositions[i].tags;
                            isSuperset = arr2.every(function(val) { return arr1.indexOf(val) >= 0; });
                        }

                        if (isSuperset) {
                            pi ++;
                        }
                        i++;
                    }
                    return pi;
                }
            }
        });
    });
}

function imgError(x) {
    x.onerror=null;
    $(x).parent('.uni-logo').remove();
}

function imgErrorHide(x) {
    x.onerror=null;
    x.src = '';
}