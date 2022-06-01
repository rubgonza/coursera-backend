const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const authenticate = require("../authenticate");
const cors = require("./cors");
const favorite = require("../models/favourite");

const favouriteRouter = express.Router();

favouriteRouter.use(bodyParser.json());

favouriteRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    favorite
      .find({})
      .populate("user")
      .populate("dishes")
      .then(
        (favorite) => {
          // extract favorite that match the req.user.id
          if (favorite) {
            user_favorite = favorite.filter(
              (fav) => fav.user._id.toString() === req.user.id.toString()
            )[0];
            if (!user_favorite) {
              var err = new Error("You have no favorite!");
              err.status = 404;
              return next(err);
            }
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(user_favorite);
          } else {
            var err = new Error("There are no favorite");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    favorite
      .find({})
      .populate("user")
      .populate("dishes")
      .then((favorite) => {
        var user;
        if (favorite)
          user = favorite.filter(
            (fav) => fav.user._id.toString() === req.user.id.toString()
          )[0];
        if (!user) user = new favorite({ user: req.user.id });
        for (let i of req.body) {
          if (
            user.dishes.find((d_id) => {
              if (d_id._id) {
                return d_id._id.toString() === i._id.toString();
              }
            })
          )
            continue;
          user.dishes.push(i._id);
        }
        user
          .save()
          .then(
            (userFavs) => {
              res.statusCode = 201;
              res.setHeader("Content-Type", "application/json");
              res.json(userFavs);
              console.log("favorite Created");
            },
            (err) => next(err)
          )
          .catch((err) => next(err));
      })
      .catch((err) => next(err));
  })

  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation is not supported on /favorite");
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    favorite
      .find({})
      .populate("user")
      .populate("dishes")
      .then(
        (favorite) => {
          var favToRemove;
          if (favorite) {
            favToRemove = favorite.filter(
              (fav) => fav.user._id.toString() === req.user.id.toString()
            )[0];
          }
          if (favToRemove) {
            favToRemove.remove().then(
              (result) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(result);
              },
              (err) => next(err)
            );
          } else {
            var err = new Error("You do not have any favorite");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

favouriteRouter
  .route("/:dishId")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    favorite
      .find({})
      .populate("user")
      .populate("dishes")
      .then(
        (favorite) => {
          if (favorite) {
            const favs = favorite.filter(
              (fav) => fav.user._id.toString() === req.user.id.toString()
            )[0];
            const dish = favs.dishes.filter(
              (dish) => dish.id === req.params.dishId
            )[0];
            if (dish) {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(dish);
            } else {
              var err = new Error("You do not have dish " + req.params.dishId);
              err.status = 404;
              return next(err);
            }
          } else {
            var err = new Error("You do not have any favorite");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    favorite
      .find({})
      .populate("user")
      .populate("dishes")
      .then((favorite) => {
        var user;
        if (favorite)
          user = favorite.filter(
            (fav) => fav.user._id.toString() === req.user.id.toString()
          )[0];
        if (!user) user = new favorite({ user: req.user.id });
        if (
          !user.dishes.find((d_id) => {
            if (d_id._id)
              return d_id._id.toString() === req.params.dishId.toString();
          })
        )
          user.dishes.push(req.params.dishId);

        user
          .save()
          .then(
            (userFavs) => {
              res.statusCode = 201;
              res.setHeader("Content-Type", "application/json");
              res.json(userFavs);
              console.log("favorite Created");
            },
            (err) => next(err)
          )
          .catch((err) => next(err));
      })
      .catch((err) => next(err));
  })

  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation is not supported on /favorite/:dishId");
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    favorite
      .find({})
      .populate("user")
      .populate("dishes")
      .then(
        (favorite) => {
          var user;
          if (favorite)
            user = favorite.filter(
              (fav) => fav.user._id.toString() === req.user.id.toString()
            )[0];
          if (user) {
            user.dishes = user.dishes.filter(
              (dishid) => dishid._id.toString() !== req.params.dishId
            );
            user.save().then(
              (result) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(result);
              },
              (err) => next(err)
            );
          } else {
            var err = new Error("You do not have any favorite");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

module.exports = favouriteRouter;
