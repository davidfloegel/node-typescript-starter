Feature: Confirm Account
  I want to be able to confirm my account and email address
  As a user
  So I can start use login to my account

  Scenario: I should see an error if the token is invalid
    When I make a PUT request to "/confirm-account?token=123"
    Then the response status code should be 400
    And the response error should be "The provided token is invalid"

  Scenario: I should see an error if no user has been registered for the given token
    Given there is the following verification token
      | token          |
      | idonthaveauser |
    When I make a PUT request to "/confirm-account?token=idonthaveauser"
    Then the response status code should be 400
    And the response error should be "There is no user linked to this token"

  Scenario: I should see an error if my account has already been verified
    Given there is the following user
      | id                       | firstName | lastName | email          | password | confirmed |
      | 5cb79292c006c907ca43ae79 | John      | Snow     | john@gmail.com | 12345    | true      |
    Given there is the following verification token
      | userId                   | token           |
      | 5cb79292c006c907ca43ae79 | alreadyverified |
    When I make a PUT request to "/confirm-account?token=alreadyverified"
    Then the response status code should be 400
    And the response error should be "This account has already been verified"

  Scenario: I should see a success response if my account has been verified
    Given there is the following user
      | id                       | firstName | lastName | email          | password |
      | 5cb79292c006c907ca43ae78 | John      | Snow     | john@gmail.com | 12345    |
    Given there is the following verification token
      | userId                   | token           |
      | 5cb79292c006c907ca43ae78 | verifyme        |
    When I make a PUT request to "/confirm-account?token=verifyme"
    Then the response status code should be 200
    And the response message should be "Your account has been verified"
