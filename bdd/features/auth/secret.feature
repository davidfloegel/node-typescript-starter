Feature: Secret Route
  Demo Scenario for Secret Route

  Scenario: I should receive an error if I am not logged in
    When I make a GET request to "/secret"
    Then the response status code should be 401

  Scenario: I should receive a response if I am logged in
    Given I am logged in
    And I attach a valid authorization token to the request
    When I make a GET request to "/secret"
    Then the response status code should be 200
