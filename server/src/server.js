import "dotenv/config"
import path from 'path';
import { app } from './app.js'
import connectDB from "./db/db.js"

const __dirname = path.resolve();
// connecting to database

connectDB()

    .then(() => {
        //app to listen at port

        // Serve the static HTML file
        app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'src/views', 'index.html'));
        });

        app.listen(process.env.PORT || 5001)
        console.log(`Server running at port = ${process.env.PORT || 5001}`)
    })

    .catch((error) => {
        console.log(`\nMongoDB Connection failed\n`, error)
    })
