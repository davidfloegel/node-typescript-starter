Feature: Create Account
  I want to be able to sign up to the system
  As a user
  So I can make authenticated requests

  Scenario: I should receive an error if the first name is missing
    When I make a POST request to "/signup" with payload:
      | lastName  | email          | password  |
      | Targaryen | dany@gmail.com | password1 |
    Then the response status code should be 400
    And the response error should be "Form validation failed"
    And the response should contain a "errors" property with the attributes:
      | key       | value                          |
      | firstName | First Name is a required field |

  Scenario Outline: I should receive an error if the first name is invalid
    When I make a POST request to "/signup" with payload:
      | firstName | lastName  | email          | password  |
      | <value>   | Targaryen | dany@gmail.com | password1 |
    Then the response status code should be 400
    And the response error should be "Form validation failed"
    And the response should contain a "errors" property with the attributes:
      | key       | value      |
      | firstName | <errorMsg> |

    Examples:
      | value             | errorMsg                                 |
      | a                 | First Name must be at least 2 characters |
      | I am way too long | First Name must be at most 15 characters |

  Scenario: I should receive an error if the last name is missing
    When I make a POST request to "/signup" with payload:
      | firstName | email          | password  |
      | Danny     | dany@gmail.com | password1 |
    Then the response status code should be 400
    And the response error should be "Form validation failed"
    And the response should contain a "errors" property with the attributes:
      | key      | value                          |
      | lastName | Last Name is a required field |

  Scenario Outline: I should receive an error if the last name is invalid
    When I make a POST request to "/signup" with payload:
      | firstName | lastName | email          | password  |
      | Dany      | <value>  | dany@gmail.com | password1 |
    Then the response status code should be 400
    And the response error should be "Form validation failed"
    And the response should contain a "errors" property with the attributes:
      | key      | value      |
      | lastName | <errorMsg> |

    Examples:
      | value             | errorMsg                                |
      | a                 | Last Name must be at least 2 characters |
      | I am way too long | Last Name must be at most 15 characters |

  Scenario: I should receive an error if the email address is missing
    When I make a POST request to "/signup" with payload:
      | firstName | lastName | password  |
      | Aria      | Stark    | password1 |
    Then the response status code should be 400
    And the response error should be "Form validation failed"
    And the response should contain a "errors" property with the attributes:
      | key   | value                     |
      | email | Email is a required field |

  Scenario: I should receive an error if the email address is invalid
    When I make a POST request to "/signup" with payload:
      | firstName | lastName  | email   | password  |
      | Egor      | Targaryen | invalid | password1 |
    Then the response status code should be 400
    And the response error should be "Form validation failed"
    And the response should contain a "errors" property with the attributes:
      | key   | value                       |
      | email | Email must be a valid email |

  Scenario: I should receive an error if the password is missing
    When I make a POST request to "/signup" with payload:
      | firstName | lastName  | email          |
      | Danny     | Stormborn | dany@gmail.com |
    Then the response status code should be 400
    And the response error should be "Form validation failed"
    And the response should contain a "errors" property with the attributes:
      | key      | value                        |
      | password | Password is a required field |

  Scenario Outline: I should receive an error if the password is invalid
    When I make a POST request to "/signup" with payload:
      | firstName | lastName  | email          | password |
      | Dany      | Stormborn | dany@gmail.com | <value>  |
    Then the response status code should be 400
    And the response error should be "Form validation failed"
    And the response should contain a "errors" property with the attributes:
      | key      | value      |
      | password | <errorMsg> |

    Examples:
      | value | errorMsg                               |
      | abc   | Password must be at least 4 characters |

  Scenario: I should receive an error if my email address is already registered
    Given there is the following user:
      | email          |
      | john@gmail.com |
    When I make a POST request to "/signup" with payload:
      | firstName | lastName | email          | password |
      | John      | Stark    | john@gmail.com | newpw    |
    Then the response status code should be 400
    And the response error should be "Email address is already registered"

  Scenario: I should receive a success response if my account has been created
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
