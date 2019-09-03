const { IMAGES_PATH, TWILIO_SID, TWILIO_AUTH, TWILIO_NUMBER, TWILIO_MYNUMBER } = require('../config');
const fs = require('fs');
const express = require('express');
const fetch = require('node-fetch');
const twilio = require('twilio');

const TwilioUtilities = require('../twilio-utilities');
const client = new twilio(TWILIO_SID, TWILIO_AUTH);
const MessageResponse = require('twilio').twiml.MessagingResponse;
const jsonBodyParser = express.json();
const urlBodyParser = express.urlencoded({ extended: false });
const smsRouter = express.Router();

smsRouter
    .post('/send', jsonBodyParser, (req, res, next) => {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: `Missing 'message' in request body` });
        }

        client.messages.create({
            body: message,
            from: TWILIO_NUMBER,
            to: TWILIO_MYNUMBER,
        })
            .then(result => {
                return res.json({ messsage_sid: result.sid });
            })
            .catch(error => {
                console.log(error.message);
                next();
            });
    })
    .post('/receive', urlBodyParser, (req, res, next) => {
        const twiml = new MessageResponse();
        const { Body, NumMedia } = req.body;
        const timeDate = new Date().toLocaleString();

        // Handle media in the MMS
        try {
            if (NumMedia > 0) {
                let mediaKeys = Object.keys(req.body).filter(key => key.toString().includes('MediaUrl'));
                mediaKeys.forEach(key => {
                    const mediaUrl = req.body[key];
                    const mediaUrlParts = mediaUrl.split('/');
                    const messageId = mediaUrlParts[7];
                    const mediaId = mediaUrlParts[9];

                    fetch(mediaUrl)
                        .then(response => {
                            if (!response.ok) {
                                return new Error(`Error retreiving media ${mediaUrl}`);
                            }
                            return response.buffer()
                        })
                        .then(jpegBuffer => {
                            // What flags an error from response.buffer()?
                            TwilioUtilities.writeMediaToFile(fs, IMAGES_PATH, mediaId, jpegBuffer);
                        })
                        .then(() => {
                            TwilioUtilities.deleteMedia(client, mediaUrl, messageId, mediaId)
                        })
                        .then(() => {
                            TwilioUtilities.writeMetaToFile(fs, IMAGES_PATH, mediaId, mediaUrl)
                        })
                        .catch(error => {
                            console.log(`There was an error in the fetch chain: ${error}`);
                            next(error);
                        });
                });
            }

        } catch (error) {
            console.log(`There was an error in the media try block: ${error}`);
            return res.status(400).json({ error: `${error}` });
        }

        // Respond with a message based on words in the SMS
        // the incoming message is in req.body.Body
        try {
            if (Body.toLowerCase().includes('hello')) {
                twiml.message(`Hello to you too, sailor! ${timeDate}`);
            } else if (Body.toLowerCase().includes('long')) {
                reply = '*'.repeat(157) + '160ABCDEFG';
                twiml.message(reply);
            } else {
                twiml.message(`You can't even say hello?? ${timeDate}`)
            }
        } catch (error) {
            console.log(`There was an error in the return message try block: ${error}`);
            return res.status(400).json({ error: `${error}` });
        }

        res.writeHead(200, { 'Content-Type': 'text/xml' });
        res.end(twiml.toString());
    })


module.exports = smsRouter;
