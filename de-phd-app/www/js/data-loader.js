/**
 * Created by hxiao on 16/9/1.
 */

function generateVueComputed(x, result, ref) {
    $.each(x, function (idx, ss) {
        result['_' + ss + '_name'] = function () {
            return fieldTextMap[ss].text
        };
        result['_' + ss + '_value'] = function () {
            return renderValue(ref[ss], fieldTextMap[ss].type)
        }
    });
    return result;
}

function generateVueComputedHomo(ss) {
    result = {};
    result['_name'] = fieldTextMap[ss].text;
    result['_value'] = renderValue(curPositions[ss], fieldTextMap[ss].type);
    return result;
}

function loadFieldTextMapping(fieldMapUrl) {
    myApp.showIndicator();
    console.log("start loading field-text mapping from %s", fieldMapUrl);
    $.getJSON(fieldMapUrl, function (json) {
        console.log("finish loading %s", fieldMapUrl);
        fieldTextMap = json;
        loadPositions(allPositionUrl)
    });
}

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
        new Vue({
            el: '#langswitch-bar',
            data: localeData
        });
        new Vue({
            el: '#langswitch-bar2',
            data: localeData
        });

        curPositions = translate2LocalData(json, localeData.id);

        new Vue({
            el: '#all-positions',
            data: {
                distance: 100,
                positions: []
            },
            ready: function () {
                for (var i = 0; i < 20; i++) {
                    this.positions.push(curPositions[i]);
                }
            },
            methods: {
                renderVal: function (val, typ) {
                    return renderValue(val, typ);
                },
                onInfinite: function () {
                    setTimeout(function () {
                        var temp = [];
                        for (var i = this.positions.length; i <= this.positions.length + 20; i++) {
                            temp.push(curPositions[i]);
                        }
                        this.positions = this.positions.concat(temp);
                        this.$broadcast('$InfiniteLoading:loaded');
                    }.bind(this), 300);
                }
            },
            created: function () {
                myApp.hideIndicator();
                try {
                    navigator.splashscreen.hide();
                } catch (ex) {
                    console.error("hide splash screen error");
                }
            }
        });

        new Vue({
            el: '#fav-positions',
            data: {positions: curPositions},
            methods: {
                renderVal: function (val, typ) {
                    return renderValue(val, typ);
                }
            },
            computed: {
                favPositions: function () {
                    return this.positions.filter(function (x) {
                        return x.isFav
                    })
                }
            },
            created: function () {
                myApp.hideIndicator();
                try {
                    navigator.splashscreen.hide();
                } catch (ex) {
                    console.error("hide splash screen error");
                }
            }
        });
    });
}

function loadStrategyPool(poolUrl) {
    console.log("start loading pool from %s", poolUrl);

    $.getJSON(poolUrl, function (json) {
        console.log("finish loading %s", poolUrl);
        currentPool = json;
        new Vue({
            el: '#current-pool',
            data: currentPool,
            methods: {
                renderVal: function(val, typ) {
                    return renderValue(val, typ);
                },
                getNameOfKey: function(key) {
                    if (key[0]==':') {
                        // is a public key
                        return fieldTextMap[key.substring(1)].text;
                    }
                    return key;
                },
                getTypeOfKey: function(key) {
                    if (key[0]==':') {
                        // is a public key
                        return fieldTextMap[key.substring(1)].type;
                    }
                    return key;
                }
            }
        });
    });
}

function refreshSparklines() {
    setTimeout(function() {
        var allStrategies = $(".sparkline-holder");
        $.each(allStrategies, function(idx, ss) {
            $(ss).sparkline(currentPool.pool[idx].series_week, {type: 'line', height: '30px', width: '50px'});
        });
    }, 500);
}