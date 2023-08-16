import { Provider } from "../models/providerModel.js";
import {
    checkNullOrUndefined,
    isNumberContain,
    availabilityCorrect,
    emailCorrect,
    findUserByEmail,
} from "../middleware/validation.js";
import jwt from "jsonwebtoken";
// import bcrypt from 'bcryptjs'
// import asyncHandler from 'express-async-handler';

export const addNewProvider = async (req, res) => {
    const {
        availability,
        password,
        firstname,
        lastname,
        email,
        city,
        state,
        street,
        country,
        zip,
        qualification,
        experience,
        rate,
        photo,
    } = req.body;

    const evaluateStrings = [
        password,
        firstname,
        lastname,
        email,
        city,
        country,
        zip,
    ].map(checkNullOrUndefined);
    const hasValidationError = evaluateStrings.every((value) => value === true);

    const evaluateNumberContain = [firstname, lastname].map(isNumberContain);
    const isNumberContainV = evaluateNumberContain.every(
        (value) => value === true
    );

    const isEmailCorrect = emailCorrect(email);

    if (hasValidationError && isEmailCorrect && isNumberContainV) {
        try {
            //Hash password
            // const salt = await bcrypt.genSalt(10);
            // const hashPassword = await bcrypt.hash(password, salt);

            let newProvider = new Provider();

            if (availabilityCorrect(availability)) {
                newProvider.availability = availability;
            }

            // newProvider.password = hashPassword;
            console.log(qualification);
            newProvider.password = password;
            newProvider.firstName = firstname;
            newProvider.lastName = lastname;
            newProvider.email = email;
            newProvider.city = city;
            newProvider.state = state;
            newProvider.street = street;
            newProvider.country = country;
            newProvider.zip = zip;
            newProvider.experience = experience;
            newProvider.photo = photo;
            newProvider.rate = rate;
            newProvider.qualification = qualification;

            const provider = await newProvider.save();
            // const token = await generateToken(provider._id);
            await res.status(200).json({
                firstname: provider.firstName,
                lastname: provider.lastName,
                email: provider.email,
                city: provider.city,
                state: provider.state,
                street: provider.street,
                country: provider.country,
                zip: provider.zip,
                experience: provider.experience,
                qualification: provider.newJobs,
                photo: provider.photo,
                message: "successfully added",
                // token: token // Use the generated token in the response
            });
        } catch (err) {
            console.log(err);
            if (err.message.includes("E11000 duplicate key error")) {
                res.status(409).json({
                    error:
                        "The provided email is already associated with another Provider.",
                });
            } else res.status(500).json({ error: "An unexpected error occurred." });
        }
    } else {
        res.status(422).json({
            password: evaluateStrings[0] ? password : "Error",
            firstname:
                evaluateStrings[1] || evaluateNumberContain[0] ? firstname : "Error",
            lastname:
                evaluateStrings[2] || evaluateNumberContain[1] ? lastname : "Error",
            email: evaluateStrings[3] || isEmailCorrect ? email : "Error",
            city: evaluateStrings[4] ? city : "Error",
            state: state,
            street: street,
            country: evaluateStrings[5] ? country : "Error",
            zip: evaluateStrings[6] ? zip : "Error",
        });
    }
};

export const authentication = async (req, res) => {
    const { email, password } = req.body;
    console.log('authentication response recieved');

    try {
        const providerByEmail = await findUserByEmail(email, Provider);
        if (providerByEmail) {
            // if (await bcrypt.compare(password, providerByEmail.password))
            if (password === providerByEmail.password) {

                providerByEmail.isActive = true
                await providerByEmail.save();

                // Create a new object without the 'password' field
                const providerWithoutPassword = { ...providerByEmail.toObject() };
                delete providerWithoutPassword.password;
                // const token = await generateToken(providerWithoutPassword._id);

                await res.status(200).json({
                    ...providerWithoutPassword,
                    // token: token
                });


                console.log('user login response send')
            } else {
                res.status(401).json({ error: "Incorrect password." });
            }
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Server error" });
    }
};

//Generate JWT
const generateToken = async (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

export const getProviderById = async (req, res) => {
    const provider = await Provider.findOne({
        _id: req.params.providerId,
    }).populate("qualification");

    if (provider) res.status(200).json(provider);
    else res.status(404).json({ message: "User not found" });
};

export const updateProvider = async (req, res) => {
    const {
        availability,
        password,
        firstName,
        lastName,
        email,
        city,
        state,
        street,
        country,
        zip,
        qualification,
        experience,
        photo,
        rate,
        rating,
        review,
    } = req.body;

    const evaluateStrings = [
        password,
        firstName,
        lastName,
        email,
        city,
        country,
        zip,
    ].map(checkNullOrUndefined);
    const hasValidationError = evaluateStrings.every((value) => value === true);

    const evaluateNumberContain = [firstname, lastname].map(isNumberContain);
    const isNumberContainV = evaluateNumberContain.every(
        (value) => value === true
    );

    const isEmailCorrect = emailCorrect(email);

    if (hasValidationError) {
        try {

            const provider = await Provider.findOneAndUpdate(
                { _id: req.params.providerId },
                {
                    availability: availability,
                    password: password,
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    city: city,
                    state: state,
                    street: street,
                    country: country,
                    zip: zip,
                    experience: experience,
                    photo: photo,
                    qualification: qualification,
                    rate: rate,
                    rating: rating,
                    review: review,
                },
                { new: true }
            ); //new: true - updated contact details will show

            console.log(provider);
            if (provider) res.status(200).json(provider);
            else res.status(404).json({ error: "Provider not found" });
            // const token = await generateToken(provider._id);
        } catch (err) {
            console.log(err.message);
            if (err.message.includes("E11000 duplicate key error")) {
                res.status(409).json({
                    error:
                        "The provided email is already associated with another Provider.",
                });
            } else res.status(500).json({ error: "An unexpected error occurred." });
        }
    } else {
        res.status(422).json({
            password: evaluateStrings[0] ? password : "Error",
            firstname:
                evaluateStrings[1] || evaluateNumberContain[0] ? firstname : "Error",
            lastname:
                evaluateStrings[2] || evaluateNumberContain[1] ? lastname : "Error",
            email: evaluateStrings[3] || isEmailCorrect ? email : "Error",
            city: evaluateStrings[4] ? city : "Error",
            state: state,
            street: street,
            country: evaluateStrings[5] ? country : "Error",
            zip: evaluateStrings[6] ? zip : "Error",
        });
    }
};

export const updateActiveStatus = async (req, res) => {
    const providerId = req.params.providerId;
    const isActive = req.query.isActive === 'true';
    console.log(req.query.isActive, providerId);

    try {
        // Find the provider by ID
        const provider = await Provider.findById(providerId);

        if (!provider) {
            return res.status(404).send('Provider not found');
        }
        else {
            provider.isActive = isActive;

            await provider.save();

            res.status(200).send('isActive property updated');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }

}


export const getUserActivity = (req, res) => {
    const providerId = req.params.providerId;

    try {
        const provider = Provider.findOne({ _id: providerId })
        if (provider) {
            res.status(200).json({ isActive: provider.isActive })
        } else {
            res.status(404).json({ message: "provider not found" })
        }
    } catch (error) {
        res.status(404).json({ message: error })
    }
}