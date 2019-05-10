Feature: Sign In to Account
  I want to be able to sign in to my account
  As a user
  So I can access private routes

  Scenario: I should receive an error if the email address is missing
    When I make a POST request to "/signin" with payload:
      | password  |
      | password1 |
    Then the response status code should be 400
    And the response error should be "Form validation failed"
    And the response should contain a "errors" property with the attributes:
      | key   | value                     |
      | email | Email is a required field |

  Scenario: I should receive an error if the email address is invalid
    When I make a POST request to "/signup" with payload:
      | email   | password  |
      | invalid | password1 |
    Then the response status code should be 400
    And the response error should be "Form validation failed"
    And the response should contain a "errors" property with the attributes:
      | key   | value                       |
      | email | Email must be a valid email |

  Scenario: I should receive an error if the password is missing
    When I make a POST request to "/signin" with payload:
      | email          |
      | aria@gmail.com |
    Then the response status code should be 400
    And the response error should be "Form validation failed"
    And the response should contain a "errors" property with the attributes:
      | key      | value                        |
      | password | Password is a required field |

  Scenario: I should receive an error if the email address is not registered
    Given there is the following user:
      | email          |
      | john@gmail.com |
    When I make a POST request to "/signin" with payload:
      | email           | password |
      | theon@gmail.com | theonspw |
    Then the response status code should be 401
    And the response error should be "Email address or password incorrect"

  Scenario: I should receive an error if the password for the account is incorrect
    Given there is the following user:
      | email          | password      |
      | john@gmail.com | johnspassword |
    When I make a POST request to "/signin" with payload:
      | email          | password  |
      | john@gmail.com | apassword |
    Then the response status code should be 401
    And the response error should be "Email address or password incorrect"

  Scenario: I should receive an error if the account hasn't been confirmed yet
    Given there is the following user:
      | email          | password      | confirmed |
      | john@gmail.com | johnspassword | false     |
    When I make a POST request to "/signin" with payload:
      | email          | password      |
      | john@gmail.com | johnspassword |
    Then the response status code should be 401
    And the response error should be "Your account hasn't been verified yet"

  Scenario: I should receive a success response if I have been logged in
    Given there is the following user:
      | id                       | firstName | lastName | email          | password   |
      | 5cb79292c006c907ca43ae78 | Aria      | Stark    | aria@gmail.com | mypassword |
    When I make a POST request to "/signin" with payload:
      | email          | password   |
      | aria@gmail.com | mypassword |
    Then the response status code should be 200
    And the response message should be "Login successful"
    And the response should contain a "user" property with the attributes:
      | key       | value                    |
      | _id       | 5cb79292c006c907ca43ae78 |
      | firstName | Aria                     |
      | lastName  | Stark                    |
      | email     | aria@gmail.com           |
    And the response should contain a "token" property
