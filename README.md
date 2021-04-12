# LegislatR

Civic engagement tool to connect voters to the legislation that matters to them most in real-time.

# Project Proposal: LegislatR

- What goal will your website be designed to achieve?

  - The goal of this website will assist in political outreach. It is becoming increasingly more important, especially in 2021, for younger voters to be more politically active. The impact of young voters was obvious in the 2020 presidential race between Donald Trump and Joseph Biden, but this level of participation can have a substantial impact on other areas of the legislation. There is a significant lack of awareness of the importance of local governance and the direct impact local laws have on our day-to-day lives. If we can promote legislative visibility in young voters by bringing them closer to the source, we can change the landscape of our politics for the better. In 2021, Oregon, along with other states, have begun rolling out provisions which will allow children ages 16 and 17 to participate in local school board elections to a limited capacity. It's my belief that young adults are just as effected by local legislation as us adults, and should feel equally as empowerd to be part of that discussion.

- What kind of users will visit your site? In other words, what is the demographic of your users?

  - I expect that this website will attract those young voters between the ages of 16-35 who already have an interest in participating in American political discourse. This app is not designed to make people interested; It is designed to connect those who are already interested in politics to the legislation that should matter to them most.

- What data do you plan on using? You may not have picked your actual API yet, which is fine, just outline what kind of data you will like it to contain.

  - This application will include judicial information from several different levels of government: National, State, County, and City laws being passed. This app will also gather location/preference data from the users, and use that information to connect them to the legislation that would matter most to them, regardless of political ideology. Phone number information will also be collected in order to implement a notification system via text into the application, as is shown that texting is a highly effective method of reaching younger voters.
  - API’s
    - [openstates.org](https://v3.openstates.org/docs) - For state jurisdictions/people/bills
    - [twilio](https://www.twilio.com/sms) - SMS Texting API for alerts

- In brief, outline your approach to creating your project (knowing that you may not know everything in advance and that these details might change later). Answer questions like the ones below, but feel free to add more information:

  - What does your database schema look like?
    - ![schema](https://i.imgur.com/zdm99Nw.png)
    - (NOTE: User-user messaging is not yet implemented and is an intended level of functionality at a later point in this project)
    - All state and federal legislative information will be captured in an as-needed basis from the API and stored in the database.
  - What kinds of issues might you run into with your API?
    - Lack of phone number verification to validate a phone number is real and belongs to the user registering.
  - Is there any sensitive information you need to secure?
    - Phone numbers would be the only essential bit of information to secure on an individual basis. All phone numbers are hashed prior to collection in the database. I have no direct visibility of any phone numbers stored in the database.
  - What functionality will your app include?
    - Bill following
      - Allowing a user to follow a bill, regardless of state, and assist them in tracking that bill throughout the legislative process
    - Bill commenting
      - Allowing a user or group of users to comment on the status / effects of a particular bill to facilitate a more direct political discourse on that piece of legislation
    - Bill tagging / following tags
      - Allowing the user base to generate tags for each bill allowing an open-source categorization of all bills in circulation across all states.
      - Allowing user to follow tags to see what bills come out in relation to each tag sorted by date (newest to oldest)
  - What will the user flow look like?
    - Register > Login > Bills page -->
      -The Bills page contains links to three separate things:
      -What legislation the user is following
      -Legislation in the state the user is registered with
      -Legislation with similar tags to the legislation the user is currently following (sorted by number of tag similarities in bills not already followed by a user)
  - What features make your site more than CRUD? Do you have any stretch goals?
    - This app allows levels of user engagement, which already makes it more than CRUD.

- API Routes as they stand thus far:

  - API URL: https://lgsltr.herokuapp.com/

  - Unauthenticated routes:
    - `/states/list`
    - `/states/<lgsltr state_id>`
    - `/states/<lgsltr state_id>/bills`
    - `/user/login`
    - `/user/logout`
    - `/user/register`
    - `/bills/<lgsltr bill_id>`
  - Authenticated routes:
    - `/user/<lgsltr user_id>/get`
    - `/bills/<lgsltr bill_id>/follow`
