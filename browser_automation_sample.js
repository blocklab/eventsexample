var webdriver = require('selenium-webdriver')
var chrome = require('selenium-webdriver/chrome')
var path = require('chromedriver').path
var By = webdriver.By
var until = webdriver.until
var username = process.argv[2]
var os = require('os')
var robot = require('robotjs')

var options = new chrome.Options()
if (os.platform() === 'darwin') {
  options.addArguments('user-data-dir=/Users/' + username + '/Library/Appliction Support/Google/Chrome')
} else {
  options.addArguments('user-data-dir=/home/' + username + '/.config/google-chrome')
}

var driver = new webdriver.Builder()
  .withCapabilities(webdriver.Capabilities.chrome())
  .setChromeOptions(options)
  .build()

var metamaskChromeAppstore = 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn'

driver.get(metamaskChromeAppstore)
var addToChromeButton = By.xpath("//*[text()='Add to Chrome']")
driver.wait(until.elementLocated(addToChromeButton, 3000))
driver.findElement(addToChromeButton).click().then(function() {
  setTimeout(function() {
    robot.keyTap("tab");
    robot.keyTap("tab");
    robot.keyTap("enter");
  }, 1000)
})

driver.wait(until.alertIsPresent())
driver.quit()
