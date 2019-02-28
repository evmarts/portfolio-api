var express = require("express");
var router = express.Router();
var cors = require("cors");
router.use(cors());
const knex = require("../../database");
var Client = require("instagram-private-api").V1;
const {
  getSesh,
  getMedia,
  getLikersOfMedia,
  getUserIdFromUsername,
  getUserById
} = require("../../helpers/helpers.js");

router.get("/", async (req, res) => {
  res.send(
    (await knex.raw(
      `select 
      count(*) as total_accounts,
      sum(follower_count) as total_followers, 
      sum(media_count) as total_medias, 
      sum(comment_count) as total_comments, 
      sum(like_count) as total_likes
      from accounts`
    )).rows[0]
  );
});

// return counts for an Instagram network
router.put("/", async (req, res) => {
  var device = new Client.Device(req.body.user);
  const session = await getSesh(
    {
      username: req.body.user,
      password: req.body.password
    },
    device
  );

  for (acc of req.body.targets.split(",")) {
    console.log("looking at", acc);
    let id = await getUserIdFromUsername(session, acc);
    console.log("got id");
    let user = await getUserById(session, id);
    console.log("got user");
    let media = await getMedia(session, id);
    console.log("got media");

    console.log(media);

    // get number of followers of this account
    let followerCount = user._params.followerCount;

    // get number of media of this account
    let mediaCount = media.length;

    // get number of comments given on this account
    let commentCount = media
      .map(m => m._params.commentCount)
      .reduce((accumulator, currentValue) => accumulator + currentValue);

    // get number of likes given to this accounts
    let likeCount = media
      .map(m => m._params.likeCount)
      .reduce((acc, e) => acc + e);

    // get number of views on posts of this account
    let viewCount = media
      .map(m => {
        if (m._params.viewCount) {
          return m._params.viewCount;
        } else {
          return 0;
        }
      })
      .reduce((acc, e) => acc + e);

    // insert counts into database
    console.log("deleting old row...");
    await knex("accounts")
      .del()
      .where("account_name", acc);
    console.log("inserting...");
    await knex("accounts").insert({
      account_name: acc,
      like_count: likeCount,
      media_count: mediaCount,
      follower_count: followerCount,
      comment_count: commentCount,
      view_count: viewCount
    });
  }
});

module.exports = router;
