var webdriver = require('selenium-webdriver')
var chrome = require('selenium-webdriver/chrome')
var path = require('chromedriver').path
var By = webdriver.By
var until = webdriver.until
var macosUsername = process.argv[2]

var options = new chrome.Options()
options.addArguments('user-data-dir=/Users/' + macosUsername + '/Library/Appliction Support/Google/Chrome')
var driver = new webdriver.Builder()
  .withCapabilities(webdriver.Capabilities.chrome())
  .setChromeOptions(options)
  .build()

driver.get('http://www.google.com/ncr')
driver.findElement(By.name('q')).sendKeys('webdriver')
driver.findElement(By.name('btnG')).click()
driver.wait(until.titleIs('webdriver - Gogle Search'), 4000)
driver.quit()
