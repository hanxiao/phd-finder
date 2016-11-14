/**
 * Created by hxiao on 16/9/1.
 */


function showApology() {
    try {
        navigator.notification.confirm(
            '由于我们每天需要从百所德国科研机构采集最新的职位信息,' +
            '没有人力和财力对每个职位进行人工翻译.' +
            '我们能做的是利用算法对机器翻译结果进行修正, ' +
            '这个过程不是一蹴而就的. 请您保持耐心, 我们的翻译质量会逐步提高.', // message
            function (idx) {
                if (idx == 1) {
                    showToast(randSent(["都是我不好,没花钱请人帮你翻译", "都是我的错,拦着你不让你学德语"]));
                }
            },            // callback to invoke with index of button pressed
            '当你读到蹩脚的中文时, 请您理解它们是由德文通过机器翻译生成的',           // title
            ['我看不懂就是你的错!', '我能理解']     // buttonLabels
        );
    } catch (ignored) {
    }
}

function translate2LocalData(json, lang) {
    switch (lang) {
        case "zh-cn":
            $.each(json, function (_, x) {
                x.disTitle = x.title_zh;
                x.disInstitute = x.institute_zh;
            });
            if (firstTransCN) {
                showApology();
                firstTransCN = false;
                window.localStorage.setItem('firstTransCN', false);
            }
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

function waitUntilTimeout() {
    setTimeout(function () {
        if (!curPositions) {
            openRoutingSheet(true, true);
        }
    }, fetchTimeout);
}

function loadPositions(positionUrl) {
    try {
        setupPush();
        showToast("正在加载最新的教职列表, 请稍后...", "10000");
    } catch (ignore) {
    }

    console.log("start loading positions from %s", positionUrl);

    waitUntilTimeout();

    $.getJSON(positionUrl, function (json) {
        console.log("finish loading %s", positionUrl);
        try {
            window.plugins.actionsheet.hide();
        } catch (ignored) {}

        json.forEach(function (x) {
            x['isFav'] = false;
            x['filterShow'] = true;
        });

        var tmp_filter = {};
        Object.keys(translateTags).forEach(function (x) {
            tmp_filter[x] = false;
        });

        curPositions = translate2LocalData(json, localeData.id);

        vm = new Vue({
            el: '#all-positions',
            data: {
                focusTag: false,
                filterTags: tmp_filter,
                pushTag: [],
                searchEngine: "bing",
                lang: localeData,
                enablePush: true,
                allPos: curPositions,
                distance: 100,
                positions: [],
                tagMap: translateTags,
                eIdx: 0,
                focusPosition: false,
                focusNews: false,
                hasWechat: false,
                newsList: [],
                chatState: false,
                isWaitingChat: false,
                messageHistory: "",
                lastShutdownState: false,
                totalSize: curPositions.length,
                appVersion: false
            },
            ready: function () {
                this.updateNews();
                this.loadState();
                this.checkWechat();
                myApp.sizeNavbars('.view-main');
                try {
                    window.plugins.toast.hide();
                    cordova.getAppVersion.getVersionNumber().then(function (version) {
                        vm.appVersion = version;
                    });
                    setTimeout(function () {
                        if (vm.numFilters) {
                            showToast("职位列表已经按照你的选择过滤", 5000);
                            vm.applyFilterToList();
                        }
                    }, 1000);
                } catch (ex) {
                    console.error("hide splash screen error");
                }
                if (firstOpenApp) {
                    nextTutorial("bars-tutorial");
                }
            },
            watch: {
                'filterTags': {
                    handler: function (val, oldVal) {
                        console.log('filter change!');
                        this.updateFilteredPos();
                        this.saveState()
                    },
                    deep: true
                },
                'pushTag': function (val, oldVal) {
                    console.log('push setting changed!');
                    this.saveState()
                },
                'searchEngine': function (val, oldVal) {
                    console.log('search setting changed!');
                    this.saveState()
                },
                'enablePush': function (val, oldVal) {
                    console.log('enablepush setting changed!');
                    this.saveState()
                },
                'favPositions': function (val, oldVal) {
                    console.log('fav change!');
                    this.saveState();
                },
                'chatState': function (val, oldVal) {
                    trackAction('chatStateChanged', oldVal.id);
                    if (val) {
                        console.log('chat state change!');
                        if (vm.lastShutdownState && vm.lastShutdownState == vm.chatState) {
                            // do not send a new message, as html is loaded already
                        } else {
                            vm.isWaitingChat = true;
                            var question = randSent(this.chatState.question);
                            addMessage(question, "received", true);
                        }
                    }
                }
            },
            methods: {
                updateFilteredPos: function () {
                    var pi = 0;
                    if (vm.numFilters == 0) {
                        $.each(vm.allPos, function (idx, pos) {
                            vm.allPos[idx]['filterShow'] = true;
                        });
                        pi = vm.allPos.length;
                    } else {
                        $.each(vm.allPos, function (idx, pos) {
                            var match = 0;
                            pos.tags.forEach(function (x) {
                                match += vm.filterTags[x] ? 1 : 0;
                            });
                            var shouldAdd = match == vm.numFilters;
                            vm.allPos[idx]['filterShow'] = shouldAdd;
                            pi += shouldAdd ? 1 : 0;
                        });
                    }
                    vm.totalSize = pi;
                    return pi;
                },
                addRemoveTag: function (y) {
                    var x = y.key;
                    this.filterTags[x] = !this.filterTags[x];
                    this.focusTag = y;
                },
                copyLinkToCB: function (x) {
                    cordova.plugins.clipboard.copy(x, function () {
                        showToast("已经复制到剪贴板");
                    });
                },
                clearMessage: function () {
                    navigator.notification.confirm(
                        '并重新开始第一次咨询', // message
                        function (idx) {
                            if (idx == 2) {
                                vm.messageHistory = "";
                                vm.chatState = false;
                                vm.isWaitingChat = false;
                                myMessages.clean();
                                conversationStarted = false;
                                vm.chatState = logic['welcome'];
                                showToast("聊天信息已经清空", "short")
                            }
                        },            // callback to invoke with index of button pressed
                        '确定清空所有聊天记录吗?',           // title
                        ['算了', '是']     // buttonLabels
                    );
                },
                switch2RandomAsk: function () {
                    var sent = randSent(["其实我想问点别的", "我想换个话题", "我还有其他问题"]);
                    vm.jumpToFix(sent, 'random_ask');
                },
                jumpToFix: function (x, y) {
                    trackAction('jumpToFix', x);
                    console.log("jumpToFix: " + x + ", " + y);
                    if ((Date.now() - lastChatTime) > 60000) {
                        conversationStarted = false;
                    }
                    addMessage(x, "sent", false, function () {
                        vm.chatState = logic[y];
                    });

                },
                checkWechat: function () {
                    if (typeof Wechat == "undefined") {
                        this.hasWechat = false;
                    } else {
                        Wechat.isInstalled(function (installed) {
                            vm.hasWechat = true;
                        }, function (reason) {
                            vm.hasWechat = false;
                        });
                    }
                },
                updateNews: function () {
                    $.getJSON(allNewsUrl, function (newnews) {
                        console.log("finish loading %s", allNewsUrl);
                        vm.newsList = newnews;
                    });
                },
                updateData: function () {
                    this.saveState();
                    $.getJSON(allPositionUrl, function (newjson) {
                        console.log("finish loading %s", allPositionUrl);
                        vm.allPos = translate2LocalData(newjson, localeData.id);
                        vm.loadState();
                        myApp.pullToRefreshDone();
                        showToast("职位列表已经更新");
                    });
                },
                saveState: function () {
                    var favId = {};
                    $.each(this.favPositions, function (idx, x) {
                        favId[x.positionId] = 1;
                    });
                    var state = {
                        _filterTags: this.filterTags,
                        _pushTag: this.pushTag,
                        _searchEngine: this.searchEngine,
                        _enablePush: this.enablePush,
                        _favId: favId,
                        _msgHistory: this.messageHistory,
                        _chatState: this.chatState
                    };
                    try {
                        NativeStorage.setItem("curState", state, setSuccess, setError);
                    } catch (ex) {
                    }
                },
                loadState: function () {
                    try {
                        NativeStorage.getItem("curState", function (val) {
                            vm.pushTag = val._pushTag || [];
                            vm.searchEngine = val._searchEngine || 'bing';
                            vm.enablePush = val._enablePush || true;
                            var favId = val._favId || {};
                            // load those favid, remap to allpos
                            vm.allPos.forEach(function (x) {
                                x.filterShow = true;
                                x.isFav = x.positionId in favId;
                            });
                            vm.lastShutdownState = val._chatState || false;
                            vm.messageHistory = val._msgHistory || "";
                            vm.chatState = val._chatState || false;
                            vm.filterTags = val._filterTags || tmp_filter;

                            if (vm.messageHistory.length > 0) {
                                $('.messages').html(vm.messageHistory);
                            }

                            vm.eIdx = vm.populatePosition(20);
                            console.log('load success')
                        }, function () {
                            console.log('something wrong when loading the state');
                        });
                    } catch (ex) {
                    }
                },
                populatePosition: function (k) {
                    var i = this.eIdx;
                    var pi = 0;
                    while (pi < k && i < this.allPos.length) {
                        if (this.allPos[i]['filterShow'] || this.allPos[i]['isFav']) {
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
                applyFilterToList: function () {
                    this.positions = [];
                    this.eIdx = 0;
                    this.$broadcast('$InfiniteLoading:reset');
                },
                transTag: function (val) {
                    return translateTags[val].short;
                },
                removeMailto: function (val) {
                    return val.replace('mailto:', '');
                },
                shareTo: function (val) {
                    if (val) {
                        window.plugins.socialsharing.share("「找德到」-" + val.disTitle + "来自" + val.disInstitute,
                            "「找德到」-新职位!" + val.disInstitute,
                            null,
                            'http://phd.ojins.com/position.html?id=' + val.positionId);
                    }
                },
                shareNewsTo: function (val) {
                    if (val) {
                        window.plugins.socialsharing.share("「找德到」-" + val.title,
                            val.mainContent,
                            null,
                            'http://phd.ojins.com/news.html?id=' + val.title);
                    }
                },
                shareNewsWechat: function (val, circle) {
                    var myscene = circle ? Wechat.Scene.TIMELINE : Wechat.Scene.SESSION;
                    Wechat.share({
                        message: {
                            title: "「找德到」新闻-" + val.title,
                            description: val.mainContent,
                            thumb: "www/img/log128.png",
                            mediaTagName: "de-phd",
                            messageExt: "找德到分享",
                            messageAction: "<action>dotalist</action>",
                            media: {
                                type: Wechat.Type.WEBPAGE,
                                webpageUrl: 'http://phd.ojins.com/news.html?id=' + val.title
                            }
                        },
                        scene: myscene   // share to Timeline
                    }, function () {
                        showToast("微信分享成功");
                    }, function (reason) {
                        showToast("额, 分享失败了");
                    });
                },
                shareWechat: function (val, circle) {
                    var myscene = circle ? Wechat.Scene.TIMELINE : Wechat.Scene.SESSION;
                    Wechat.share({
                        message: {
                            title: "我在「找德到」发现的好职位-" + val.disTitle,
                            description: "更多" + val.disInstitute + "职位来自「找德到」! 德国硕博,博后,教授,实习,毕设,奖学金通通能找到!",
                            thumb: "www/img/log128.png",
                            mediaTagName: "de-phd",
                            messageExt: "找德到分享",
                            messageAction: "<action>dotalist</action>",
                            media: {
                                type: Wechat.Type.WEBPAGE,
                                webpageUrl: 'http://phd.ojins.com/position.html?id=' + val.positionId
                            }
                        },
                        scene: myscene   // share to Timeline
                    }, function () {
                        showToast("微信分享成功");
                    }, function (reason) {
                        showToast("额, 分享失败了");
                    });
                },
                registerPush: function (val) {
                    registerDeviceNotification(window.localStorage.getItem('registrationId'),
                        this.enablePush, this.pushTag);
                }
            },
            computed: {
                numFilters: function () {
                    var n = 0;
                    var tmp = Object.keys(this.filterTags);
                    for (var i = 0; i < tmp.length; i++) {
                        if (this.filterTags[tmp[i]]) {
                            n++;
                        }
                    }
                    return n;
                },
                isAndroid: function () {
                    return myApp.device.android;
                },
                isIOS: function () {
                    return myApp.device.ios;
                },
                focusWiki: function () {
                    if (this.focusPosition) {
                        return "https://en.m.wikipedia.org/wiki/" +
                            this.focusPosition.institute.replace(/\(.*\)/, "").trim();
                    }
                    return false;
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
                        tmp["isFiltered"] = false;
                        translateTagsList.push(tmp);
                    }
                    return translateTagsList;
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

