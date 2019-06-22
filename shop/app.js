var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const puppeteer = require('puppeteer');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
	res.send('ok');
});

	(async () => {
	  const browser = await puppeteer.launch({
	  	headless: false,
	  	executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
	  	args: ['--user-data-dir=C:/Users/Boss/AppData/Local/Google/Chrome/User Data/Default']
	  });
	  const page = await browser.newPage();
	  	    page.setViewport({width: 1920, height: 1080});

	  await page.goto('https://shopee.vn/register');
	  //await page.screenshot({path: 'bm.png'});
	  //await	page.type('div.input-box input', "");

	  await page.waitForSelector('#main > div > div.shopee-page-wrapper > div:nth-child(1) > div > div.navbar-wrapper.container-wrapper > div > ul > li:nth-child(3)', {
		  visible: true,
	  });

 		//await page.click(select_input_sell_amount, {clickCount: 2});
 	  await page.click('#main > div > div.shopee-page-wrapper > div:nth-child(1) > div > div.navbar-wrapper.container-wrapper > div > ul > li:nth-child(3)');
		//await page.type(select_input_sell_amount, config.amount_sell);

	  await page.waitForSelector('#modal > div.shopee-modal__container.shopee-modal__transition-appear-done.shopee-modal__transition-enter-done > div.shopee-modal__content > div > div.shopee-authen > div.shopee-authen__container > div > div > div.shopee-authen__form > div > div.shopee-authen__input-button-group > div.shopee-authen__input-text.expand.shopee-authen__input-text--phone > div > div.input-with-status__wrapper.input-with-status__wrapper--error > input', {
	  	  visible: true
	  });

	  await page.type('#modal > div.shopee-modal__container.shopee-modal__transition-appear-done.shopee-modal__transition-enter-done > div.shopee-modal__content > div > div.shopee-authen > div.shopee-authen__container > div > div > div.shopee-authen__form > div > div.shopee-authen__input-button-group > div.shopee-authen__input-text.expand.shopee-authen__input-text--phone > div > div.input-with-status__wrapper.input-with-status__wrapper--error > input', '012345647');
		  //await delay(3000);

	  
	  //await browser.close();
	})();

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
