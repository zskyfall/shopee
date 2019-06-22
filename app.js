var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');
var request = require('async-request');
const delay = require('delay');
const puppeteer = require('puppeteer');
const sharp = require('sharp');

let rawdataSelector = fs.readFileSync('selector.json');  
let selector = JSON.parse(rawdataSelector); 

let rawdataConfig = fs.readFileSync('config.json');
let config = JSON.parse(rawdataConfig);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async function(req, res) {
 	let response = await createSimThueRequest(config.simthue.api_key, config.simthue.shopee_service_id);
 	if(response.success) {
 		let request_id = response.id;
 		let checkRequest_response = await checkSimThueRequest(config.simthue.api_key, request_id);

 		while(checkRequest_response.success && checkRequest_response.number == "") {
 			await delay(5000);
 			checkRequest_response = await checkSimThueRequest(config.simthue.api_key, request_id);
 		}

 		res.send(checkRequest_response.number);

 	}
 	else {
 		res.send("error");
 	}
});


app.get('/test', async function(req, res) {

		  const browser = await puppeteer.launch({
		  	headless: false,
		  	executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
		  	args: ['--user-data-dir=C:/Users/nguyenhuydev/AppData/Local/Google/Chrome/User Data/Default']
		  });
		  const page = await browser.newPage();
		  	    page.setViewport({width: 1920, height: 1080});

		  await page.goto('https://shopee.vn/buyer/login/signup/?__classic__=1');
		  //await page.screenshot({path: 'bm.png'});
		  //await	page.type('div.input-box input', "");

		  await page.waitForSelector("body > div.signup > div.phone > div > input", {
			  visible: true,
		  });

	 		let phone_number = "0987296455";
		 	
		 	  	 await page.type(selector.register.input_phone_number, phone_number);
		 	  	 await page.click(selector.register.button_next);

		 	  	 let code = "123456";
		 	  	 await page.waitForSelector(selector.register.input_phone_number_verify, {
					  visible: true,
				 });

				 await page.waitForSelector('body > div.signup > form > div.phone > div.needs_placeholder.captcha.input-underline > img');
				 await page.screenshot({path: 'screenshot.jpg'});


		 	  	 await page.type(selector.register.input_phone_number_verify, code);
		 	  	 await page.type(selector.register.input_capcha, "ABCDEF");
		 	  	 //await page.click(selector.register.button_continute);

});

app.get('/crop', function(req, res) {
					 // original image
				let originalImage = 'screenshot.jpg';

				// file name for cropped image
				let outputImage = 'croppedImage.jpg';

				sharp(originalImage).extract({ width: 170, height: 60, left: 870, top: 270 }).toFile(outputImage)
				    .then(function(new_file_info) {
				        console.log("Image cropped and saved");
				    })
				    .catch(function(err) {
				        console.log("An error occured" + err);
				 });
});

	// (async () => {
	//   const browser = await puppeteer.launch({
	//   	headless: false,
	//   	executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
	//   	args: ['--user-data-dir=C:/Users/nguyenhuydev/AppData/Local/Google/Chrome/User Data/Default']
	//   });
	//   const page = await browser.newPage();
	//   	    page.setViewport({width: 1920, height: 1080});

	//   await page.goto('https://shopee.vn/buyer/login/signup/?__classic__=1');
	//   //await page.screenshot({path: 'bm.png'});
	//   //await	page.type('div.input-box input', "");

	//   await page.waitForSelector("body > div.signup > div.phone > div > input", {
	// 	  visible: true,
	//   });

	//   let createRequest_response = await createSimThueRequest(config.simthue.api_key, config.simthue.shopee_service_id);
	//  	if(createRequest_response.success) {
	//  		let request_id = createRequest_response.id;
	 		
	//  		let phone_number = await getSimThuePhoneNumber(config.simthue.api_key, request_id);
	// 	 		//await page.click(select_input_sell_amount, {clickCount: 2});
	// 	 	  	//await page.click(selector);
	// 	 	if(phone_number != null) {
	// 	 	     phone_number = "0" + phone_number.slice(2, phone_number.length).trim();
	// 	 	     console.log("Get SDT thanh cong! SDT: " + phone_number);
	// 	 	  	 await page.type(selector.register.input_phone_number, phone_number);
	// 	 	  	 await page.click(selector.register.button_next);

	// 	 	  	 let sms =  await getSimThueSMS(config.simthue.api_key, request_id);
	// 	 	  	 console.log("GET SMS thanh cong! SMS: " + sms);

	// 	 	  	 let code = getVerifyCodeShopee(sms);
	// 	 	  	 await page.type(selector.register.input_phone_number_verify, code);
	// 	 	}
	// 	 	else {

	// 	 	}
	//  	}
	//  	else {
	//  		console.log("Create Request ERROR!" + createRequest_response);
	//  	}

	// 	  //await delay(3000);

	  
	//   //await browser.close();
	// })();


	// (async () => {
	//   const browser = await puppeteer.launch({
	//   	headless: false,
	//   	executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
	//   	args: ['--user-data-dir=C:/Users/nguyenhuydev/AppData/Local/Google/Chrome/User Data/Default']
	//   });
	//   const page = await browser.newPage();
	//   	    page.setViewport({width: 1920, height: 1080});

	//   await page.goto('https://shopee.vn/buyer/login/signup/?__classic__=1');
	//   //await page.screenshot({path: 'bm.png'});
	//   //await	page.type('div.input-box input', "");

	//   await page.waitForSelector("body > div.signup > div.phone > div > input", {
	// 	  visible: true,
	//   });

	//  		let phone_number = "0987296455";
		 	
	// 	 	  	 await page.type(selector.register.input_phone_number, phone_number);
	// 	 	  	 await page.click(selector.register.button_next);

	// 	 	  	 let code = "123456";
	// 	 	  	 await page.waitForSelector(selector.register.input_phone_number_verify, {
	// 				  visible: true,
	// 			 });
	// 	 	  	 await page.type(selector.register.input_phone_number_verify, code);
	// 	 	  	 await page.type(selector.register.input_capcha, "ABCDEF");
	// 	 	  	 await page.click(selector.register.button_continute);

	// })();

async function createSimThueRequest(api_key, service_id) {
	let url = 'http://api.pvaonline.net/request/create?key=' + api_key + '&service_id=' + service_id;
	let response;
	try{
		response = await request(url, {
						    method: "GET"
						});

	}
	catch(e) {
		console.log(e);
	}

	let body = JSON.parse(response.body);

	return body;
}

async function checkSimThueRequest(api_key, request_id) {
	let url = 'http://api.pvaonline.net/request/check?key='+ api_key +'&id=' + request_id;
	let response;
	try{
		response = await request(url);
	}
	catch(e) {
		console.log(e);
		return;
	}

	let body = JSON.parse(response.body);
	return body;
}

async function getSimThuePhoneNumber(api_key, request_id) {

 	if(request_id != null) {
 		let checkRequest_response = await checkSimThueRequest(api_key, request_id);

 		while(checkRequest_response.success && checkRequest_response.number == "") {
 			await delay(5000);
 			checkRequest_response = await checkSimThueRequest(api_key, request_id);
 		}

 		return checkRequest_response.number;
 	}	

}

async function getSimThueSMS(api_key, request_id) {

		let checkRequest_response = await checkSimThueRequest(config.simthue.api_key, request_id);

		while(checkRequest_response.sms == null || checkRequest_response.sms == "") {
			await delay(5000);
			checkRequest_response = await checkSimThueRequest(config.simthue.api_key, request_id);
		}

		return checkRequest_response.sms;

}

function getVerifyCodeShopee(sms) {

	let start_index = sms.indexOf('Shopee:') + 7;
	let end_index = sms.indexOf('. Ma');

	let code = "" + sms.slice(start_index, end_index);

	return code;
}

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
