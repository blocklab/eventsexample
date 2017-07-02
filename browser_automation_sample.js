var webdriver = require('selenium-webdriver')
var chrome = require('selenium-webdriver/chrome')
var path = require('chromedriver').path
var By = webdriver.By
var until = webdriver.until
var username = process.argv[2]
var os = require('os')
var robot = require('robotjs')
let macos = () => {
  return os.platform() === 'darwin'
}
var options = new chrome.Options()
if (macos()) {
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

driver.findElement(addToChromeButton).click().then(() => {
  if (macos()) {
    setTimeout(() => {
      var screenSize = robot.getScreenSize()
      robot.moveMouse(screenSize.width * 0.6 , screenSize.height * 0.25)
      robot.setMouseDelay(500)
      robot.mouseClick()
      robot.mouseClick() // once wont work, go figure
    })
  } else {
    setTimeout(() => {
      robot.keyTap("tab");
      robot.keyTap("tab");
      robot.keyTap("enter");
    }, 1000)
  }
})

driver.wait(until.alertIsPresent())
driver.quit()
