/**
 * Created by hxiao on 15/11/13.
 */
var admobid = {};
if (/(android)/i.test(navigator.userAgent)) {
    admobid = { // for Android
        banner: 'ca-app-pub-5408889511302651/7552153523',
        interstitial: 'ca-app-pub-5408889511302651/4459086327',
        rewarded: 'ca-app-pub-5408889511302651/2563550724'
    };
} else if (/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
    admobid = { // for iOS
        banner: 'ca-app-pub-5408889511302651/7552153523',
        interstitial: 'ca-app-pub-5408889511302651/4459086327',
        rewarded: 'ca-app-pub-5408889511302651/2563550724'
    };
} else {
    admobid = { // for Windows Phone
        banner: 'ca-app-pub-5408889511302651/7552153523',
        interstitial: 'ca-app-pub-5408889511302651/4459086327',
        rewarded: 'ca-app-pub-5408889511302651/2563550724'
    };
}


function showMyAds(type, force) {
    if (force || showAds) {
        if (!AdMob) {
            alert('admob plugin not ready');
            return;
        }
        switch (type) {
            case "banner":
                AdMob.createBanner({
                    adId: admobid.banner,
                    isTesting: false,
                    overlap: false,
                    offsetTopBar: false,
                    position: AdMob.AD_POSITION.BOTTOM_CENTER,
                    bgColor: '#f7f7f8',
                    autoShow: true
                });
                break;
            case "fullpage":
                AdMob.prepareInterstitial({
                    adId: admobid.interstitial,
                    autoShow: true,
                    isTesting: false
                });
                break;
            case "rewarded":
                AdMob.prepareRewardVideoAd({
                    adId: admobid.rewarded,
                    autoShow: true,
                    isTesting: false
                }, setSuccess, function() {
                    AdMob.prepareInterstitial({
                        adId: admobid.interstitial,
                        autoShow: true,
                        isTesting: false
                    });
                });
                break;
        }
    }
}


//if(( /(ipad|iphone|ipod|android|windows phone)/i.test(navigator.userAgent) )) {
//    document.addEventListener('deviceready', showMyAds, false);
//} else {
//    showMyAds();
//}
