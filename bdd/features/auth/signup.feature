Feature: Create Account
  I want to be able to sign up to the system
  As a user
  So I can make authenticated requests

  Scenario: I should see an error if the first name is missing
    When I make a POST request to "/signup" with payload:
      | lastName  | email          | password  |
      | Targaryen | dany@gmail.com | password1 |
    Then the response status code should be 400
    And the response error should be "Form validation failed"
    And the response should contain a "errors" property with the attributes:
      | key       | value                  |
      | firstName | First name is required |

  Scenario: I should see an error if the first name is too short
    When I make a POST request to "/signup" with payload:
      | firstName | lastName  | email          | password  |
      | E         | Targaryen | dany@gmail.com | password1 |
    Then the response status code should be 400
    And the response error should be "Form validation failed"
    And the response should contain a "errors" property with the attributes:
      | key       | value                          |
      | firstName | First name should be minimum 2 |

  Scenario: I should see an error if the last name is too short
    When I make a POST request to "/signup" with payload:
      | firstName | lastName  | email          | password  |
      | Egor      | T         | egor@gmail.com | password1 |
    Then the response status code should be 400
    And the response error should be "Form validation failed"
    And the response should contain a "errors" property with the attributes:
      | key      | value                         |
      | lastName | Last name should be minimum 2 |

  Scenario: I should see an error if the email address is invalid
    When I make a POST request to "/signup" with payload:
      | firstName | lastName  | email   | password  |
      | Egor      | Targaryen | invalid | password1 |
    Then the response status code should be 400
    And the response error should be "Form validation failed"
    And the response should contain a "errors" property with the attributes:
      | key   | value                               |
      | email | Email should be valid email address |

  Scenario: I should see an error if the password is too short
    When I make a POST request to "/signup" with payload:
      | firstName | lastName  | email          | password |
      | Egor      | Targaryen | egor@gmail.com | p        |
    Then the response status code should be 400
    And the response error should be "Form validation failed"
    And the response should contain a "errors" property with the attributes:
      | key      | value                        |
      | password | Password should be minimum 4 |

  Scenario: I should see an error if my email address is already registered
    Given there is the following user:
      | email          |
      | john@gmail.com |
    When I make a POST request to "/signup" with payload:
      | firstName | lastName | email          | password |
      | John      | Stark    | john@gmail.com | newpw    |
    Then the response status code should be 400
    And the response error should be "Email address is already registered"

  Scenario: I should see a success response if my account has been created
    When I make a POST request to "/signup" with payload:
      | firstName | lastName | email          | password |
      | Aria      | Stark    | aria@gmail.com | iamaria  |
    Then the response status code should be 200
    And the response message should be "Your account has been created"
    And the response should contain a "user" property with the attributes:
      | key       | value          |
      | firstName | Aria           |
      | lastName  | Stark          |
      | email     | aria@gmail.com |

