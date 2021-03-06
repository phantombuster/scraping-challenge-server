"phantombuster command: nodejs"
"phantombuster package: 5"
"phantombuster flags: save-folder" // Save all files at the end of the script

const Buster = require("phantombuster")
const buster = new Buster()
const puppeteer = require("puppeteer")

// Simple scraping function, getting all the infos using jQuery and returning them
const scrape = () => {
	const data = $("div.person > div.panel-body").map(function(){
		return {
			name: $(this).find(".name").text().trim(),
			birth_year: $(this).find(".birth_year").text().trim(),
			death_year: $(this).find(".death_year").text().trim(),
			gender: $(this).find(".gender").text().trim(),
			marital_status: $(this).find(".marital_status").text().trim(),
			spouse: $(this).find(".spouse").text().trim(),
			pclass: $(this).find(".pclass").text().trim(),
			ticket_num: $(this).find(".ticket_num").text().trim(),
			ticket_fare: $(this).find(".ticket_fare").text().trim(),
			residence: $(this).find(".residence").text().trim(),
			job: $(this).find(".job").text().trim(),
			companions_count: $(this).find(".companions_count").text().trim(),
			cabin: $(this).find(".cabin").text().trim(),
			first_embarked_place: $(this).find(".first_embarked_place").text().trim(),
			destination: $(this).find(".destination").text().trim(),
			died_in_titanic: $(this).find(".died_in_titanic").text().trim(),
			body_recovered: $(this).find(".body_recovered").text().trim(),
			rescue_boat_num: $(this).find(".rescue_boat_num").text().trim()
		}
	})
	return $.makeArray(data)
}

// Simple function to get the base64 source of the captcha image (use solveCaptchaImage for non base64 image)
const getImageSrc = () => document.querySelector("img.captcha-img").src

;(async () => {
	// Init browser environment
	const browser = await puppeteer.launch({
		// This is needed to run Puppeteer in a Phantombuster container
		args: ["--no-sandbox"]
	})
	const page = await browser.newPage()
	// Set the userAgent to be able to access the page (otherwise the useragent is random)
	await page.setUserAgent("Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36")
	// Open the webpage
	await page.goto("http://scraping-challenges.phantombuster.com/captcha")
	// Wait for the form to be visible
	await page.waitForSelector("img.captcha-img")
	// First get the source of the image to solve the captcha
	const captchaBase64 = await page.evaluate(getImageSrc)
	// Get the text of the captcha using buster.solveCaptcha
	const captchaText = await buster.solveCaptchaBase64(captchaBase64)
	// Fill the form and submit
	await page.type("#captcha", captchaText)
	await page.click("form button")
	await page.waitForSelector(".person > .panel-body")
	if ((page.url()) === "http://scraping-challenges.phantombuster.com/captcha/form") {
		// In case the captcha solver fails (succeed in 95% of situations)
		await page.screenshot({ path: "error.jpg" })
		console.log(`Failed to solve captcha: ${captchaText}`)
		process.exit(1)
	}
	// Inject jQuery to manipulate the page easily
	await page.addScriptTag({ path: "../injectables/jquery-3.0.0.min.js" })
	const result = await page.evaluate(scrape)
	await buster.setResultObject(result)
	await page.screenshot({ path: "screenshot.jpg" })
	process.exit()
})()
.catch((err) => {
	console.log(`Something went wrong: ${err}`)
	process.exit(1)
})
