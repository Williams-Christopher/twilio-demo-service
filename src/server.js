const app = require('./app');
const { PORT } = require('./config');

app.listen(PORT, () => {
    if (process.env.NODE_ENV === 'development') {
        console.log(`Server available at http://localhost:${PORT}`);
    }
});
