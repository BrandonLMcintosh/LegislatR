# LegislatR
Civic engagement tool to connect voters to the legislation that matters to them most in real-time.


Project Proposal: LegislatR


1. What goal will your website be designed to achieve?
   1. The goal of this website will assist in political outreach. It is becoming increasingly more important, especially in 2021, for younger voters to be more politically active. The impact of young voters was obvious in the 2020 presidential race between Donald Trump and Joseph Biden, but this level of participation can have a substantial impact on other areas of the legislation. There is a significant lack of awareness of the importance of local government and the direct impact local laws have on our day-to-day lives. If we can promote legislative visibility in young voters by bringing them closer to the source, we can change the landscape of our politics forever. 


2. What kind of users will visit your site? In other words, what is the demographic of your users?
   1. I expect that this website will attract those young voters between the ages of 18-35 who already have an interest in participating in American political discourse. This app is not designed to make people interested; It is designed to connect those who are already interested in politics to the legislation that should matter to them most. 


3. What data do you plan on using? You may not have picked your actual API yet, which is fine, just outline what kind of data you will like it to contain.
   1. This application will include judicial information from several different levels of government: National, State, County, and City laws being passed. This app will also gather location/preference data from the users, and use that information to connect them to the legislation that would matter most to them, regardless of political ideology. Phone number information will also be collected in order to implement a notification system via text into the application, as is shown that texting is a highly effective method of reaching younger voters. 
   2. API’s
      1. https://api.data.gov/ - For agency data / related federal acts/regulations by department (single API key for access to all)
      2. https://datausa.io/about/api/ - Census information by region. Helps with state/demographic drill-downs
      3. https://civicdata.usvotefoundation.org/ - Repository for Civic Data
      4. https://developers.google.com/civic-information - Google’s Civic Data API with location drill-down and ability to see who is representing a user’s district
      5. https://www.twilio.com/sms - SMS Texting API for alerts
 
4. In brief, outline your approach to creating your project (knowing that you may not know everything in advance and that these details might change later). Answer questions like the ones below, but feel free to add more information: 
   1. What does your database schema look like?
      1. Users
         1. Username
         2. Location
         3. Phone number
         4. Email address
         5. Hashed password
         6. Saved laws
         7. Representatives
         8. Senators
         9. Mayor
         10. Governor
         11. Council Members
      2. Everything else will be gathered from the API. Haven’t yet decided if the information from the API is going to be stored in my own Database or if I should just fetch the data. It’ll be a lot of data, and I’m not looking to pay for server storage, so I think I might just stick with fetching / parsing the information from the various API’s
   2. What kinds of issues might you run into with your API?
      1. No phone number verification (No way to prevent doxing someone with text messages)
      2. Invalid addresses/area codes (Will need to handle an invalid address return from the APIs)
      3. No email verification setup (No way to verify/validate an email within the scope of this course)
   3. Is there any sensitive information you need to secure?
      1. I think it would be wise to completely secure all personally identifiable information on the site. There’s no need for it to be used by an outside source. All API calls should be authenticated, and no user should be able to access another user’s demographic information. 
   4. What functionality will your app include?
      1. The primary function will primarily be a drill-down formula to help navigate relevant laws/bills, as well as a full-search functionality to look for bills/laws being passed/voted on in other areas of the country. 
   5. What will the user flow look like?
   6. What features make your site more than CRUD? Do you have any stretch goals?
      1. This app is not only a sorting machine for civic information. It will entail elements of text notification and follow/liking of users and civic information.
