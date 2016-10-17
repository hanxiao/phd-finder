function renderWhenReady() {
    $('.popup-detail').on('open', function () {
        $('#detail-content').scrollTop(0);
    });
    window.open = cordova.InAppBrowser.open;
    loadPositions(allPositionUrl);
}

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
        renderWhenReady();
    }
};

app.initialize();

