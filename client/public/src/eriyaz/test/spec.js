// spec.js
describe('angularjs homepage', function() {
  var loginLink = element(by.css('#header [href="#login"]'));
  var logoutLink = element.all(by.css('#header a')).last();
  var userItem = element(by.css('[label=User]'));
  var logoutItem = element(by.css('[label=logout]'));

  var loginSubmit = element(by.buttonText("Submit"));


  beforeEach(function() {
    browser.get('http://localhost:3000/eriyaz');
  });

  it('should have a history', function() {
    loginLink.click();
    expect(browser.getCurrentUrl()).toContain('#/login');

    loginSubmit.click();
    expect(browser.getCurrentUrl()).toContain('#/home');

    userItem.click();
    browser.sleep(500);
    logoutItem.click();
    browser.sleep(500);
    expect(browser.getCurrentUrl()).toContain('#/logout');

  });
});