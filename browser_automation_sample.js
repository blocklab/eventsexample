var webdriver = require('selenium-webdriver')
var chrome = require('selenium-webdriver/chrome')
var path = require('chromedriver').path
var By = webdriver.By
var until = webdriver.until
var username = process.argv[2]
var os = require('os')

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

driver.get('http://www.google.com/ncr')
driver.findElement(By.name('q')).sendKeys('webdriver')
driver.findElement(By.name('btnG')).click()
driver.wait(until.titleIs('webdriver - Gogle Search'), 4000)
driver.quit()
