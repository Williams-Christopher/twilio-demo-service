module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    TWILIO_SID: process.env.TWILIO_SID,
    TWILIO_AUTH: process.env.TWILIO_AUTH,
    TWILIO_NUMBER: process.env.TWILIO_NUMBER,
    TIWLIO_MYNUMBER: process.env.TIWLIO_MYNUMBER,
    IMAGES_PATH: './images/', // include trailing slash
}
