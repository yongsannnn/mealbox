// Setup start
const express = require("express");
const cors = require("cors")
require("dotenv").config();
const MongoUtil = require("./MongoUtil");
const mongoUrl = process.env.MONGO_URL;
const ObjectId = require("mongodb").ObjectId;
let app = express();
app.use(express.json());
app.use(cors());
// Setup end


async function main() {
    let db = await MongoUtil.connect(mongoUrl, "tgc-11")

    // For "comments" collection
    // Get - Fetch information
    app.get("/comments", async (req, res) => {
        try {
            let comments = await db.collection("comments").find().toArray();
            res.status(200)
            res.send(comments)
        } catch (e) {
            res.status(500)
            res.send({
                "Message": "Unable to get information"
            })
        }
    })

    // Post - Add new document
    app.post("/comments", async (req, res) => {
        let comments = req.body.comments
        let username = req.body.username
        let recipes_id = req.body.recipes_id
        let user_id = req.body.user_id

        try {
            let results = await db.collection("comments").insertOne({
                username: username,
                user_id: user_id,
                comments: comments,
                recipes_id: recipes_id,
            })
            res.status(200)
            res.send(results)
        } catch (e) {
            res.status(500)
            res.send({
                "Message": "Unable to insert comments"
            });
            console.log(e)
        }
    })

    // Delete document
    app.delete("/comments/:id", async (req, res) => {
        try{
            await db.collection("comments").deleteOne({
                _id: ObjectId(req.params.id)
            })
            res.status(200);
            res.send({
                "Message" : "Deleted request"
            })

        } catch (e){
            res.status(500)
            res.send({
                "Message" : "Unable to delete request"
            })
        }
    })

}

main()


// Route begins here
app.listen(3000, () => {
    console.log("server has started")
})