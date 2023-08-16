import { Consumer } from "../models/consumerModel.js";
import { checkNullOrUndefined, isNumberContain, emailCorrect, findUserByEmail } from '../middleware/validation.js'

export const addNewConsumer = (req, res) => {

    const password = req.body.password;
    const firstName = req.body.firstname;
    const lastName = req.body.lastname;
    const email = req.body.email;
    const city = req.body.city;
    const state = req.body.state;
    const street = req.body.street;
    const country = req.body.country;
    const zip = req.body.zip;

    const evaluateStrings = [password, firstName, lastName, email, city, country, zip].map(checkNullOrUndefined);
    const notNullOrUndefined = evaluateStrings.every((value) => value === true)

    const evaluateNumberContain = [firstName, lastName].map(isNumberContain);
    const isNumberContainV = evaluateNumberContain.every((value) => value === true);

    const isEmailCorrect = emailCorrect(email);

    if (notNullOrUndefined && isEmailCorrect && isNumberContainV) {
        let newConsumer = new Consumer();
        newConsumer.password = password
        newConsumer.firstName = firstName
        newConsumer.lastName = lastName
        newConsumer.email = email;
        newConsumer.city = city;
        newConsumer.state = state;
        newConsumer.street = street;
        newConsumer.country = country;
        newConsumer.zip = zip;

        newConsumer.save()
            .then(() => res.status(200).send('Successfully added the consumer'))
            .catch((err) => {
                if (err.message.includes('E11000 duplicate key error')) {
                    res.status(409).json({ error: 'The provided email is already associated with another provider.' });
                }
                else res.status(500).json({ error: 'An unexpected error occurred.' });
            })
    }

    else {
        res.status(422).json({
            password: evaluateStrings[0] ? password : "Error",
            firstname: evaluateStrings[1] || evaluateNumberContain[0]
                ? firstName : "Error",
            lastname: evaluateStrings[2] || evaluateNumberContain[1]
                ? lastName : "Error",
            email: evaluateStrings[3] || isEmailCorrect
                ? email : "Error",
            city: evaluateStrings[4] ? city : "Error",
            state: state,
            street: street,
            country: evaluateStrings[5] ? country : "Error",
            zip: evaluateStrings[6] ? zip : "Error"
        });
    }


}


export const authentication = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;


    try {
        const consumerByEmail = await findUserByEmail(email, Consumer)

        if (consumerByEmail) {
            if (consumerByEmail.password === password) {

                consumerByEmail.isActive = true
                await consumerByEmail.save();

                // Create a new object without the 'password' field
                const consumerWithoutPassword = { ...consumerByEmail.toObject() };
                delete consumerWithoutPassword.password;

                res.status(200).json(consumerWithoutPassword);
            } else {
                res.status(401).json({ error: 'Incorrect password.' });
            }
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    }

    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Server error' });
    }
}


export const updateActiveStatus = async (req, res) => {
    const consumerId = req.params.consumerId;
    const isActive = req.query.isActive === 'true';
    console.log(req.query.isActive, consumerId);

    try {
        // Find the provider by ID
        const consumer = await Consumer.findById(consumerId);

        if (!consumer) {
            return res.status(404).send('Consumer not found');
        }
        else {
            consumer.isActive = isActive;

            await consumer.save();

            res.status(200).send('isActive property updated');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }

}


export const getUserActivity = (req, res) => {
    const consumerId = req.params.consumerId;

    try {
        const consumer = Consumer.findOne({ _id: consumerId })
        if (consumer) {
            res.status(200).json({ isActive: consumer.isActive })
        } else {
            res.status(404).json({ message: "consumer not found" })
        }
    } catch (error) {
        res.status(404).json({ message: error })
    }
}