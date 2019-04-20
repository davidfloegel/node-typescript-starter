Feature: Confirm Account
  I want to be able to confirm my account and email address
  As a user
  So I can start use login to my account

  Scenario: I should receive an error if the token is invalid
    When I make a PUT request to "/confirm-account?token=123"
    Then the response status code should be 400
    And the response error should be "The provided token is invalid"

  Scenario: I should receive an error if no user has been registered for the given token
    Given there is the following verification token:
      | token          |
      | idonthaveauser |
    When I make a PUT request to "/confirm-account" with payload:
      | token          |
      | idonthaveauser |
    Then the response status code should be 400
    And the response error should be "There is no user linked to this token"

  Scenario: I should receive an error if my account has already been verified
    Given there is the following user:
      | id                       | email          |
      | 5cb79292c006c907ca43ae79 | john@gmail.com |
    And there is the following verification token:
      | userId                   | token           |
      | 5cb79292c006c907ca43ae79 | alreadyverified |
    When I make a PUT request to "/confirm-account" with payload:
      | token           |
      | alreadyverified |
    Then the response status code should be 400
    And the response error should be "This account has already been verified"

  Scenario: I should receive a success response if my account has been verified
    Given there is the following user:
      | id                       | confirmed |
      | 5cb79292c006c907ca43ae78 | false     |
    And there is the following verification token:
      | userId                   | token           |
      | 5cb79292c006c907ca43ae78 | verifyme        |
    When I make a PUT request to "/confirm-account" with payload:
      | token    |
      | verifyme |
    Then the response status code should be 200
    And the response message should be "Your account has been verified"
