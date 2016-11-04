/**
 * Created by hxiao on 16/9/1.
 */


function showApology() {
    var modal = myApp.modal({
        title: '当你读到蹩脚的中文时, 请您理解它们是由德文通过机器翻译生成的',
        text: '由于我们每天需要从近百所德国科研机构采集最新的职位信息, 目前没有人力和财力资源对每个职位进行人工翻译. ' +
        '我们能做的是利用算法对机器翻译结果进行修正, 这个过程是日积月累而不是一蹴而就的. 请您保持耐心, 我们的翻译质量会逐步提高.',
        buttons: [
            {
                text: '甭说没用的!'
            },
            {
                text: '我能理解',
                bold: true
            }
        ]
    })
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

function loadPositions(positionUrl) {
    try {
        setupPush();
    } catch (ignore) {
    }


    var container = $('body');
    if (container.children('.progressbar, .progressbar-infinite').length) return; //don't run all this if there is a current progressbar loading
    myApp.showProgressbar(container);

    console.log("start loading positions from %s", positionUrl);

    $.getJSON(positionUrl, function (json) {
        console.log("finish loading %s", positionUrl);

        curPositions = translate2LocalData(json, localeData.id);

        vm = new Vue({
            el: '#all-positions',
            data: {
                curTag: [],
                pushTag: [],
                searchEngine: "google",
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
                messageHistory: ""
            },
            ready: function () {
                this.eIdx = this.populatePosition(20);
                this.updateNews();
                this.loadState();
                this.checkWechat();
                myApp.hideIndicator();
                myApp.sizeNavbars('.view-main');
                try {
                    myApp.hideProgressbar();
                } catch (ex) {
                    console.error("hide splash screen error");
                }
                if (firstOpenApp) {
                    nextTutorial("bars-tutorial");
                } else {
                    showMyAds('banner', false);
                }
            },
            watch: {
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
                    if (val) {
                        console.log('chat state change!');
                        vm.isWaitingChat = true;
                        var question = this.chatState.question[Math.floor(Math.random() * this.chatState.question.length)];
                        addMessage(question, "received", true);
                    }
                }
            },
            methods: {
                clearMessage: function() {
                    myApp.confirm('清空所有聊天记录, 只保留最后一条?',
                        function () {
                            vm.messageHistory = "";
                            var oldState = vm.chatState;
                            vm.chatState = false;
                            vm.isWaitingChat = false;
                            myMessages.clean();
                            conversationStarted = false;
                            vm.saveState();
                            vm.chatState = oldState;
                        },
                        function () {

                        }
                    );
                },
                switch2RandomAsk: function() {
                    var switchtopics = ["其实我想问点别的","我想换个话题","我还有其他问题"];
                    var sent = switchtopics[Math.floor(Math.random() * switchtopics.length)];
                    vm.jumpToFix(sent, 'random_ask');
                },
                jumpToFix: function (x, y) {
                    console.log("jumpToFix: " + x + ", " + y);
                    if ((Date.now() - lastChatTime) > 60000) {
                        conversationStarted = false;
                    }
                    addMessage(x, "sent", false, function() {
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
                        resetFilter();
                    });
                },
                saveState: function () {
                    var favId = {};
                    $.each(this.favPositions, function (idx, x) {
                        favId[x.positionId] = 1;
                    });
                    var state = {
                        _pushTag: this.pushTag,
                        _searchEngine: this.searchEngine,
                        _enablePush: this.enablePush,
                        _favId: favId,
                        _msgHistory: this.messageHistory,
                        _chatState: this.chatState
                    };
                    try {
                        NativeStorage.setItem("curState", state, setSuccess, setError);
                    } catch (ex) {}
                },
                loadState: function () {
                    try {
                        NativeStorage.getItem("curState", function (val) {
                            vm.pushTag = val._pushTag;
                            vm.searchEngine = val._searchEngine;
                            vm.enablePush = val._enablePush;
                            vm.chatState = val._chatState;
                            // load those favid, remap to allpos
                            $.each(vm.allPos, function (idx, x) {
                                if (x.positionId in val._favId) {
                                    vm.allPos[idx].isFav = true;
                                }
                            });
                            $('.messages').html(val._msgHistory);
                            console.log('load success')
                        }, getError);
                    } catch (ex) {}
                },
                populatePosition: function (k) {
                    var i = this.eIdx;
                    var pi = 0;
                    while (pi < k && i < this.allPos.length) {
                        var arr2 = this.curTag;
                        var shouldAdd = true;

                        if (arr2.length > 0) {
                            var arr1 = this.allPos[i].tags;
                            shouldAdd = checkIntersect(arr1, arr2);
                        }

                        if (shouldAdd) {
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
                        //myApp.alert('分享成功!');
                    }, function (reason) {
                        myApp.alert('额...分享失败了');
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
                        //myApp.alert('分享成功!');
                    }, function (reason) {
                        myApp.alert('额...分享失败了');
                    });
                },
                registerPush: function (val) {
                    registerDeviceNotification(window.localStorage.getItem('registrationId'),
                        this.enablePush, this.pushTag);
                }
            },
            computed: {
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
                        translateTagsList.push(tmp);
                    }
                    return translateTagsList;
                },
                totalSize: function () {
                    var i = 0;
                    var pi = 0;
                    while (i < this.allPos.length) {
                        var arr2 = this.curTag;
                        var shouldAdd = true;

                        if (arr2.length > 0) {
                            var arr1 = this.allPos[i].tags;
                            shouldAdd = checkIntersect(arr1, arr2);
                        }

                        if (shouldAdd) {
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

