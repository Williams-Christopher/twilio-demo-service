# Twilio-Demo-Service

A demo ExpressJS project using Twilio.

Twilio-Demo-Service sends SMS and receives SMS/MMS messages through the Twilio service. If an incoming SMS/MMS contains a message body, the service responds based on the some simple string.includes() rules. If an MMS is received, the media is retreived from the Twilio S3 storage, saved to the local disk, and deleted from the Twilio S3 storage. A text file containing the original media URL is also written to local disk.


## Set up

* Clone or fork this project and then `npm i` (Dependencies: `cors`, `dotenv`, `express`, `helmet`, `morgan`, `node-fetch` and `twilio`)
* Sign up for a free demo account with [Twilio](https://www.twilio.com/try-twilio)
* Note the account auth token, account sid, and Twilio phone number during account creation or you can find all three on your [Twilio console](https://twilio.com/console)
* Create an .env file with at least the following:
```
    NODE_ENV=development
    PORT=8000
    TWILIO_MYNUMBER=<A SMS/MMS capable phone registered to your demo account>
    TWILIO_NUMBER=<Your FULL Twilio phone number>
    TWILIO_SID=<Your Twilio account SID>
    TWILIO_AUTH=<Your Twilio Auth Token>
```
* If desired, update the path where files saved (defualts to `./images/` in the project root folder)
* Have the Express app exposed to the Internet somehow so you can provde the Twilio service with a POST path for the webhook callback on incoming messages. A free account with [ngrok](https://ngrok.com/) is a good option here.
* Start up the project with `npm start` or `npm run dev`, have fun, and hack away!

## Endpoints
This service exposes three endpoints:
* `GET /test` -> returns status 200 and `Server is running and accessible` if everything is working correctly.
* `POST /api/sms/send` =>
    * Success - returns status 200 and a JSON body with the message SID from Twilio, i.e. `{ message_sid: <message SID from Twilio> }`
    * Failure - returns status 400 and a JSON body with the error message, i.e. `{ error: <error message> }`
* `POST /api/sms/receive` (This is the webhook URL to provide to Twilio for messaging) =>
    * Success - returns a 200 and an XML body containing the outgoing message to Twilio
    * Failure - returns a 400 and JSON body to Twilio that can be viewed in the Twilio debugger. Also writes the error to the local console.

