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
                pushTag: [],
                enablePush: true,
                distance: 100,
                allPos: curPositions,
                positions: [],
                tagMap: translateTags,
                lang: localeData,
                eIdx: 0,
                focusPosition: false,
                searchEngine: "bing"
            },
            ready: function () {
                this.eIdx = this.populatePosition(20);
                myApp.hideIndicator();
                myApp.sizeNavbars('.view-main');
                try {
                    navigator.splashscreen.hide();
                } catch (ex) {
                    console.error("hide splash screen error");
                }
            },
            methods: {
                populatePosition: function (k) {
                    var i = this.eIdx;
                    var pi = 0;
                    while (pi < k && i < this.allPos.length) {
                        var arr2 = this.curTag;
                        var isSuperset = true;

                        if (arr2.length > 0) {
                            var arr1 = this.allPos[i].tags;
                            isSuperset = arr2.every(function (val) {
                                return arr1.indexOf(val) >= 0;
                            });
                        }

                        if (isSuperset) {
                            this.positions.push(this.allPos[i]);
                            pi++;
                        }
                        i++;
                    }
                    myApp.sizeNavbars('.view-main');
                    return i;
                },
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
                        this.eIdx = this.populatePosition(20);
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
                },
                removeMailto: function (val) {
                    return val.replace('mailto:', '');
                },
                shareTo: function (val) {
                    window.plugins.socialsharing.share("找德到-" + val.disTitle + "来自" + val.disInstitute,
                        "找德到-新职位!" + val.disInstitute,
                        "http://home.in.tum.de/~xiaoh/thumbnail/" + val.instituteId + ".png",
                        'http://phd.ojins.com/position.html?id=' + val.positionId);
                },
                registerPush: function (val) {
                    registerDeviceNotification(localStorage.getItem('registrationId'),
                        this.enablePush, this.pushTag);
                }
            },
            computed: {
                hasWechat: function () {
                    return checkWechat();
                },
                focusSearch: function () {
                    var par = encodeURIComponent(this.focusPosition.title + ' ' + this.focusPosition.institute);
                    switch (this.searchEngine) {
                        case "bing":
                            return "https://www.bing.com/search?q=" + par;
                        case "google":
                            return "https://www.google.com/search?q=" + par;
                        case "baidu":
                            return "http://www.baidu.com/s?wd=" + par;
                    }
                    return "";
                },
                focusHtml: function () {
                    var doc = "";
                    if (this.focusPosition) {
                        doc = this.focusPosition.mainContent;
                        doc = $('<p>').html(doc).find('img').remove().end().html();
                    }
                    return doc;
                },
                richHtml: function () {
                    if (this.focusHtml.length > 0) {
                        var doc = $(this.focusHtml);
                        $('a', doc).each(function (idx, x) {
                            $(x).attr('target', '_blank');
                            $(x).addClass('external');
                        });
                        return doc.html();
                    }
                    return "";
                },
                focusLinks: function () {
                    var result = [];
                    if (this.focusHtml.length > 0) {
                        var tmp = new Set();
                        var links = $('a', this.focusHtml);
                        $.each(links, function (idx, x) {
                            if (!tmp.has(x.href) && isValidUrl(x.href)) {
                                tmp.add(x.href);
                                result.push(x.href);
                            }
                        });
                    }
                    return result;
                },
                favPositions: function () {
                    return this.allPos.filter(function (x) {
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
                totalSize: function () {
                    var i = 0;
                    var pi = 0;
                    while (i < this.allPos.length) {
                        var arr2 = this.curTag;
                        var isSuperset = true;

                        if (arr2.length > 0) {
                            var arr1 = this.allPos[i].tags;
                            isSuperset = arr2.every(function (val) {
                                return arr1.indexOf(val) >= 0;
                            });
                        }

                        if (isSuperset) {
                            pi++;
                        }
                        i++;
                    }
                    return pi;
                }
            }
        });
    });
}

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