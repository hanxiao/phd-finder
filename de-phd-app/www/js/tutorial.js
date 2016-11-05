/**
 * Created by hxiao on 15/11/26.
 */

function closeTutorial() {
    $(".tutorial-overlay").fadeOut();
    firstOpenApp = false;
    window.localStorage.setItem('firstOpenApp', false);
}

function nextTutorial(param) {
    $('.tutorial-overlay').show();
    $('.tutorial-page').hide();
    $('.tutorial-page.'+param).fadeIn();
}
