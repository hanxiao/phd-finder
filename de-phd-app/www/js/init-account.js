/**
 * Created by hxiao on 16/9/16.
 */
var account_setup_opts = {
    'bgcolor': '#738abb',
    'fontcolor': '#fff',
    'closeButton': false
};

var account_slides = [
    {
        id: 'slide0',
        picture: '<div class="row no-gutter">' +
        '<div class="col-50">Interactive Brokers</div>' +
        '<div class="col-50">Robinhood</div>' +
        '</div>' +
        '<div class="row no-gutter" style="margin-top: 20px;">' +
        '<div class="col-50"><img class="broker-icon" src="img/ib.png"></div><div class="col-50">' +
        '<img class="broker-icon" src="img/robinhood.png"></div></div>'+
        '<form> <div class="list-block login-box"> <ul> <li class="item-content"> <div class="item-inner">  <div class="item-input"> <input type="text" name="username" placeholder="Your account ID"> </div> </div> </li> <li class="item-content"> <div class="item-inner">  <div class="item-input"> <input type="password" name="password" placeholder="Your password"> </div> </div> </li> </ul> </div> </form>',
        text: 'Select the broker you are using'
    },
    {
        id: 'slide1',
        picture: '<div class="list-block"> <ul> <!-- Single radio input --> <li> <label class="label-radio item-content"> <!-- Checked by default --> <input type="radio" name="my-radio" value="Books"> <div class="item-inner"> <div class="item-title">I want to create a diversified investment portfolio</div> </div> </label> </li> <!-- Another radio input --> <li> <label class="label-radio item-content"> <input type="radio" name="my-radio" value="Movies"> <div class="item-inner"> <div class="item-title">I want someone to completely manage my investments</div> </div> </label> </li> <li> <label class="label-radio item-content"> <!-- Checked by default --> <input type="radio" name="my-radio" value="Books"> <div class="item-inner"> <div class="item-title">I want to match or beat the performance of the markets</div> </div> </label> </li></ul> </div> ',
        text: 'What are you looking for in a financial advisor?'
    },
    {
        id: 'slide2',
        picture: '<form> <div class="list-block login-box"> <ul> <li class="item-content"> <div class="item-inner">  <div class="item-input"> <input type="text" name="username" placeholder="Age"> </div> </div> </li> </ul> </div> </form>',
        text: 'What is your current age?'
    },
    {
        id: 'slide3',
        picture: '<form> <div class="list-block login-box"> <ul> <li class="item-content"> <div class="item-inner">  <div class="item-input"> <input type="text" name="username" placeholder="$"> </div> </div> </li> </ul> </div> </form>',
        text: 'What is your annual pre-tax income?'
    },
    {
        id: 'slide4',
        picture: '<div class="list-block"> <ul> <!-- Single radio input --> <li> <label class="label-radio item-content"> <!-- Checked by default --> <input type="radio" name="my-radio" value="Books"> <div class="item-inner"> <div class="item-title">Single income, no dependents</div> </div> </label> </li> <!-- Another radio input --> <li> <label class="label-radio item-content"> <input type="radio" name="my-radio" value="Movies"> <div class="item-inner"> <div class="item-title">Single income, at least one dependent</div> </div> </label> </li> <li> <label class="label-radio item-content"> <!-- Checked by default --> <input type="radio" name="my-radio" value="Books"> <div class="item-inner"> <div class="item-title">Dual income, no dependents</div> </div> </label> </li>' +
            '<li> <label class="label-radio item-content"> <!-- Checked by default --> <input type="radio" name="my-radio" value="Books"> <div class="item-inner"> <div class="item-title">Dual income, at least one dependent</div> </div> </label> </li>' +
        '<li> <label class="label-radio item-content"> <!-- Checked by default --> <input type="radio" name="my-radio" value="Books"> <div class="item-inner"> <div class="item-title">Retired or financially independent</div> </div> </label> </li>' +
        '</ul> </div> ',
        text: 'Which of the following best describes your household?'
    },
    {
        id: 'slide5',
        picture: '<form> <div class="list-block login-box"> <ul> <li class="item-content"> <div class="item-inner">  <div class="item-input"> <input type="text" name="username" placeholder="$"> </div> </div> </li> </ul> </div> </form>',
        text: 'What is the total value of your cash and liquid investments?'
    },
    {
        id: 'slide5',
        picture: '<div class="list-block"> <ul> ' +
        '<li> <label class="label-radio item-content"><input type="radio" name="my-radio" value="Books"> <div class="item-inner"> <div class="item-title">Maximizing gains</div> </div> </label> </li>' +
        '<li> <label class="label-radio item-content"><input type="radio" name="my-radio" value="Books"> <div class="item-inner"> <div class="item-title">Minimizing losses</div> </div> </label> </li>' +
        '<li> <label class="label-radio item-content"><input type="radio" name="my-radio" value="Books"> <div class="item-inner"> <div class="item-title">Both equally</div> </div> </label> </li>' +
        '</ul> </div>',
        text: 'When deciding how to invest your money, which do you care about more?'
    },
    {
        id: 'slide6',
        picture: '<div class="list-block"> <ul> ' +
        '<li> <label class="label-radio item-content"><input type="radio" name="my-radio" value="Books"> <div class="item-inner"> <div class="item-title">Sell all of your investments</div> </div> </label> </li>' +
        '<li> <label class="label-radio item-content"><input type="radio" name="my-radio" value="Books"> <div class="item-inner"> <div class="item-title">Sell some</div> </div> </label> </li>' +
        '<li> <label class="label-radio item-content"><input type="radio" name="my-radio" value="Books"> <div class="item-inner"> <div class="item-title">Keep all</div> </div> </label> </li>' +
        '<li> <label class="label-radio item-content"><input type="radio" name="my-radio" value="Books"> <div class="item-inner"> <div class="item-title">Buy more</div> </div> </label> </li>' +
        '</ul> </div>',
        text: 'The global stock market is often volatile. If your entire investment portfolio lost 10% of its value in a month during a market decline, what would you do?'
    },
    {
        id: 'slide6',
        picture: '<div class="contacts-block" style="margin: 50px;"> <p><a href="#" class="button button-round button-big color-white" onclick="account_screen.close()">Start to invest!</a></p></div>',
        text: 'Based on your answers, we will recommend trading algorithms to you.'
    }
];


function showAccountSetup() {
    account_screen = myApp.welcomescreen(account_slides, account_setup_opts);
}