Feature: Reset Password
  I want to be able to reset my password
  As a user
  Incase I have forgotten my password and want to log in again

  Scenario: I should receive an error if the token is missing
    When I make a POST request to "/reset-password"
    Then the response status code should be 400
    And the response error should be "Recovery token is invalid or expired"

  Scenario: I should receive an error if the token is invalid
    When I make a POST request to "/reset-password" with payload:
      | token   |
      | invalid |
    Then the response status code should be 400
    And the response error should be "Recovery token is invalid or expired"

  Scenario: I should receive an error if no user exists for the given token
    Given there is the following recovery token:
      | token          |
      | nouserfortoken |
    When I make a POST request to "/reset-password" with payload:
      | token          |
      | nouserfortoken |
    Then the response status code should be 400
    And the response error should be "Recovery token is invalid or expired"

  Scenario: I should receive an error if the new password is missing
    Given there is the following user:
      | id                       | email          |
      | 5cb79292c006c907ca43ae79 | john@gmail.com |
    And there is the following recovery token:
      | userId                   | token   |
      | 5cb79292c006c907ca43ae79 | resetme |
    When I make a POST request to "/reset-password" with payload:
      | token   |
      | resetme |
    Then the response status code should be 400
    And the response error should be "Form validation failed"
    And the response should contain a "errors" property with the attributes:
      | key           | value                       |
      | newPassword.0 | New password can't be blank |

  Scenario: I should receive an error if the new password is too short
    Given there is the following user:
      | id                       | email          |
      | 5cb79292c006c907ca43ae79 | john@gmail.com |
    And there is the following recovery token:
      | userId                   | token   |
      | 5cb79292c006c907ca43ae79 | resetme |
    When I make a POST request to "/reset-password" with payload:
      | token   | newPassword |
      | resetme | a           |
    Then the response status code should be 400
    And the response error should be "Form validation failed"
    And the response should contain a "errors" property with the attributes:
      | key           | value                                               |
      | newPassword.0 | New password is too short (minimum is 4 characters) |

  Scenario: I should receive an error if the password confirmation is missing
    Given there is the following user:
      | id                       | email          |
      | 5cb79292c006c907ca43ae79 | john@gmail.com |
    And there is the following recovery token:
      | userId                   | token   |
      | 5cb79292c006c907ca43ae79 | resetme |
    When I make a POST request to "/reset-password" with payload:
      | token   | newPassword |
      | resetme | newpw       |
    Then the response status code should be 400
    And the response error should be "Form validation failed"
    And the response should contain a "errors" property with the attributes:
      | key               | value                           |
      | confirmPassword.0 | Confirm password can't be blank |

  Scenario: I should receive an error if the new password and confirmation don't match
    Given there is the following user:
      | id                       | email          |
      | 5cb79292c006c907ca43ae79 | john@gmail.com |
    And there is the following recovery token:
      | userId                   | token   |
      | 5cb79292c006c907ca43ae79 | resetme |
    When I make a POST request to "/reset-password" with payload:
      | token   | newPassword | confirmPassword |
      | resetme | newpw       | bladibla        |
    Then the response status code should be 400
    And the response error should be "New password and confirmation don't match"

  Scenario: I should receive a success response if my password has been reset
    Given there is the following user:
      | id                       | email          |
      | 5cb79292c006c907ca43ae79 | john@gmail.com |
    And there is the following recovery token:
      | userId                   | token   |
      | 5cb79292c006c907ca43ae79 | resetme |
    When I make a POST request to "/reset-password" with payload:
      | token   | newPassword | confirmPassword |
      | resetme | iamnew      | iamnew          |
    Then the response status code should be 200
    And the response message should be "Your password has been reset"
