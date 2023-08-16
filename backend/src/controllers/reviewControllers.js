import {
  checkNullOrUndefined,
  findUserByEmail,
} from "../middleware/validation.js";
import { Review } from "../models/reviewModel.js";
import { Provider } from "../models/providerModel.js";
import { Consumer } from "../models/consumerModel.js";

export const addNewReview = async (req, res) => {
  const providerEmail = req.body.providerEmail;
  const consumerEmail = req.body.consumerEmail;
  const title = req.body.title;
  const description = req.body.description;
  const rating = req.body.rating;
  const date = req.body.date;

  const evaluateStrings = [
    title,
    description,
    providerEmail,
    consumerEmail,
  ].map(checkNullOrUndefined);
  const notNullOrUndefined = evaluateStrings.every((value) => value === true);

  if (notNullOrUndefined) {
    const provider = await findUserByEmail(providerEmail, Provider);
    const consumer = await findUserByEmail(consumerEmail, Consumer);

    if (provider && consumer) {
      const review = new Review({
        title: title,
        description: description,
        provider: provider._id,
        consumer: consumer._id,
        rating: rating,
        date: date,
      });

      review
        .save()
        .then(() => {
          res.status(200).send("Successfully added the review");
        })
        .catch((err) =>
          res.status(500).json({ error: "An unexpected error occurred." })
        );
    } else if (!provider)
      res.status(404).json({ message: "Provider not found" });
    else if (!consumer) res.status(404).json({ message: "Consumer not found" });
    else res.status(500).json({ error: "An unexpected error occurred." });
  } else {
    res.status(422).json({
      title: evaluateStrings[0] ? title : "Error",
      description: evaluateStrings[1] ? description : "Error",
      providerEmail: evaluateStrings[2] ? providerEmail : "Error",
      consumerEmail: evaluateStrings[3] ? consumerEmail : "Error",
      // rating: evaluateStrings[4] ? rating : "Error"
    });
  }
};

export const getAllReview = async (req, res) => {
  try {
    const provider = await findUserByEmail(req.params.providerEmail, Provider);

    if (provider) {
      const reviews = await Review.find({ provider: provider._id }).populate(
        "consumer"
      );
      if (reviews) res.status(200).json(reviews);
      else res.status(404).json({ message: "job not found" });
    } else res.status(404).json({ message: "Provider not found" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
};
