const TwilioUtilities = {
    deleteMedia(twilioClient, mediaUrl, messageId, mediaId) {
        return twilioClient
            .messages(messageId)
            .media(mediaId)
            .remove()
            .then(response => {
                if (!response.ok) {
                    return new Error(`Error deleting media ${mediaUrl}`);
                }
            });
    },

    writeMediaToFile(fs, path, fileName, jpegBuffer) {
        return new Promise((resolve, reject) => {
            fs.writeFile(
                `${path}${fileName}.jpeg`,
                jpegBuffer,
                (error) => {
                    if (error) {
                        reject(error);
                    }
                }
            )
            resolve();
        });
    },

    writeMetaToFile(fs, path, fileName, message) {
        return new Promise((resolve, reject) => {
            fs.writeFile(
                `${path}${fileName}.txt`,
                message,
                (error) => {
                    if (error) {
                        reject(error);
                    }
                }
            )
            resolve();
        })
    },
};

module.exports = TwilioUtilities;
