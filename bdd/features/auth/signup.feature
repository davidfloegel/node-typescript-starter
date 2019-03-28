Feature: Create Account
  As a user
  I want to be able to sign up to the api
  So I can make authenticated requests

  Scenario: I should see an error if the form data is invalid
    When I make a POST request to "/signup"
      | firstName | lastName | email          | password |
      | E         | S        | invalidmail    | pw       |
    Then the response status code should be 400

  Scenario: I should see an error if my email address is already registered
    Given there is the following user
      | firstName | lastName | email          | password |
      | John      | Snow     | john@gmail.com | 12345    |
    When I make a POST request to "/signup"
      | firstName | lastName | email          | password |
      | John      | Stark    | john@gmail.com | newpw    |
    Then the response status code should be 400

  Scenario: I should see a success response if my account has been created
    When I make a POST request to "/signup"
      | firstName | lastName | email          | password |
      | Aria      | Stark    | aria@gmail.com | iamaria  |
    Then the response status code should be 200
