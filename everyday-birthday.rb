require "selenium-webdriver"

driver = Selenium::WebDriver.for :chrome
driver.manage.timeouts.implicit_wait = 10

driver.navigate.to "https://twitter.com/gecko655"

signin_email = driver.find_element(:id => "signin-email")
signin_email.send_keys "gecko655"
driver.find_element(:id => "signin-password").send_keys("**************") #TODO
signin_email.submit

editButton = driver.find_element(:class => "UserActions-editButton")
editButton.click

sleep 1
driver.find_element(:class => "BirthdateSelect-button").click
day = Date.today
birthday = Selenium::WebDriver::Support::Select.new driver.find_element(:class, "BirthdateSelect-month")
birthday.select_by(:value, day.month.to_s)
birthday = Selenium::WebDriver::Support::Select.new driver.find_element(:class, "BirthdateSelect-day")
birthday.select_by(:value, day.day.to_s)
birthday = Selenium::WebDriver::Support::Select.new driver.find_element(:class, "BirthdateSelect-year")
birthday.select_by(:value, "1991")

driver.find_element(:class, "ProfilePage-saveButton").click

sleep 3 
driver.quit

