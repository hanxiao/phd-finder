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