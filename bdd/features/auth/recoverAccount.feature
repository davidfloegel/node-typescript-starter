Feature: Recover Account
  I want to be able to recover my account
  As a user
  Incase I have forgotten my password

  Scenario: I should receive an error if the email address is missing
    When I make a POST request to "/recover-account"
    Then the response status code should be 400
    And the response error should be "Form validation failed"
    And the response should contain a "errors" property with the attributes:
      | key     | value                |
      | email.0 | Email can't be blank |

  Scenario: I should receive an error if the email address is invalid
    When I make a POST request to "/recover-account" with payload:
      | email   |
      | invalid |
    Then the response status code should be 400
    And the response error should be "Form validation failed"
    And the response should contain a "errors" property with the attributes:
      | key     | value                      |
      | email.0 | Email is not a valid email |

  Scenario: I should receive an error if the email address doesn't exist
    When I make a POST request to "/recover-account" with payload:
      | email                   |
      | idontexistyet@gmail.com |
    Then the response status code should be 400
    And the response error should be "Email address is not registered"

  Scenario: I should receive a success response if a recovery token has been generated and sent
    Given there is the following user:
      | email          |
      | john@gmail.com |
    When I make a POST request to "/recover-account" with payload:
      | email          |
      | john@gmail.com |
    Then the response status code should be 200
    And the response message should be "A recovery link has been sent to john@gmail.com"
