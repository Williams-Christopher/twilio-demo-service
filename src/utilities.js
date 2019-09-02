const fs = require('fs');

const Utilities = {
    directoryExists(directory) {
        let stats;
        try {
            stats = fs.statSync(directory);
        } catch {
            return false;
        }

        return stats.isDirectory();
    },

    makeDirectory(directory) {
        try {
            fs.mkdirSync(directory)
        } catch (error) {
            throw error;
        }
    },
}

module.exports = Utilities;
