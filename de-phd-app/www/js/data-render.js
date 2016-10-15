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
            var tmpDate =  new Date(x);
            return moment(tmpDate).fromNow();
        default:
            return x;
    }
}



