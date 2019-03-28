# features/api.feature
Feature: Check the API is running
  In order to use the api
  I want to make sure certain endpoints are available

  Scenario: The ping endpoints returns pong as response
    When I make a GET request to "/ping"
    Then the response status code should be 200
    And the body of the response should be "pong"
