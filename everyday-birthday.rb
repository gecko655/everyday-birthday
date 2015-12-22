require "selenium-webdriver"
require 'logger'

logger = Logger.new(STDOUT)

hostname = ENV["Hostserver_Hostname"]
twitterID = ENV["TwitterID"]
password = ENV["Password"]
year = ENV["Year"]

logger.info("Initializing")
driver = Selenium::WebDriver.for :remote, :url => "http://"+hostname+":4444/wd/hub", :desired_capabilities => :chrome
driver.manage.timeouts.implicit_wait = 10


logger.info("Accessing to the user page: "+twitterID)
driver.navigate.to "https://twitter.com/"+twitterID

logger.info("Authentication: "+twitterID)
signin_email = driver.find_element(:id => "signin-email")
signin_email.send_keys twitterID
driver.find_element(:id => "signin-password").send_keys(password)
signin_email.submit

editButton = driver.find_element(:class => "UserActions-editButton")
editButton.click

sleep 1
localtime = Time.now.getlocal("+09:00")
logger.info("Set "+twitterID+"'s birthday to "+year+"/"+localtime.month+"/"+localtime.day)
driver.find_element(:class => "BirthdateSelect-button").click
birthday = Selenium::WebDriver::Support::Select.new driver.find_element(:class, "BirthdateSelect-month")
birthday.select_by(:value, localtime.month.to_s)
birthday = Selenium::WebDriver::Support::Select.new driver.find_element(:class, "BirthdateSelect-day")
birthday.select_by(:value, localtime.day.to_s)
birthday = Selenium::WebDriver::Support::Select.new driver.find_element(:class, "BirthdateSelect-year")
birthday.select_by(:value, year.to_s)

driver.find_element(:class, "ProfilePage-saveButton").click
logger.info("Saved")

sleep 3 
driver.quit
