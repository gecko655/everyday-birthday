require "selenium-webdriver"
require 'logger'

logger = Logger.new(STDOUT)

hostname = "localhost"
twitterID = ENV["TwitterID"]
password = ENV["Password"]
year = ENV["Year"]

logger.info("Initializing")
driver = Selenium::WebDriver.for :remote, :url => "http://"+hostname+":4444/wd/hub", :desired_capabilities => :chrome
begin
  driver.manage.timeouts.implicit_wait = 10

  logger.info("Accessing to the user page: "+twitterID)
  driver.navigate.to "https://twitter.com/"+twitterID

  logger.info("Authentication: "+twitterID)
  signin_email = driver.find_element(:name => "session[username_or_email]")
  signin_email.send_keys twitterID
  driver.find_element(:name => "session[password]").send_keys(password)
  signin_email.submit

  editButton = driver.find_element(:class => "UserActions-editButton")
  editButton.click

  sleep 3
  localtime = Time.now.getlocal("+09:00")
  logger.info("Set "+twitterID+"'s birthday to "+year+"/"+localtime.month.to_s+"/"+localtime.day.to_s)
  driver.find_element(:class => "BirthdateSelect-button").click
  birthday = Selenium::WebDriver::Support::Select.new driver.find_element(:class, "BirthdateSelect-month")
  birthday.select_by(:value, localtime.month.to_s)
  birthday = Selenium::WebDriver::Support::Select.new driver.find_element(:class, "BirthdateSelect-day")
  birthday.select_by(:value, localtime.day.to_s)
  birthday = Selenium::WebDriver::Support::Select.new driver.find_element(:class, "BirthdateSelect-year")
  birthday.select_by(:value, year.to_s)

  sleep 10
  driver.find_element(:class, "ProfilePage-saveButton").click
  sleep 3
  driver.find_element(:id, "confirm_dialog_submit_button").click
  logger.info("Saved")
ensure 
  sleep 3 
  driver.quit
end
