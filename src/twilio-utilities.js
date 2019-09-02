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
        return fs.writeFile(
            `${path}${fileName}.jpeg`,
            jpegBuffer,
            (error) => {
                if (error) {
                    throw error;
                }
            }
        );
    },

    writeMetaToFile(fs, path, fileName, message) {
        return fs.writeFile(
            `${path}${fileName}.txt`,
            message,
            (error) => {
                if (error) {
                    throw error;
                }
            }
        );
    },
};

module.exports = TwilioUtilities;
