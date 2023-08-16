import { Job } from '../models/jobModel.js';
import { Provider } from '../models/providerModel.js';
import { checkNullOrUndefined, findUserByEmail } from '../middleware/validation.js'


export const findByJobID = async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobID).populate('provider');
        if (job) res.status(200).json(job)
        else res.status(404).json({ message: 'job not found' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Server error' });
    }
}

export const findJobByEmail = async (req, res) => {
    const provider = await findUserByEmail(req.params.providerEmail, Provider);

    if (provider) {
        try {
            const job = await Job.find({ provider: provider._id });
            if (job.length !== 0) {
                res.status(200).json(job)
            }
            else res.status(404).json({ message: 'job not found' });
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: 'Server error' });
        }
    }
    else res.status(404).json({ message: 'Provider not found' });

}

export const getAllJob = async (req, res) => {
    try {
        const jobs = await Job.find().populate('provider');
        if (jobs.length !== 0) res.status(200).json(jobs);
        else res.status(404).json({ error: 'Not Found Any Job' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export const addNewJob = async (req, res) => {
    const { title, description, email: providerEmail, price } = req.body;

    const evaluateStrings = [title, description, providerEmail].map(checkNullOrUndefined);
    const notNullOrUndefined = evaluateStrings.every((value) => value === true)

    if (notNullOrUndefined) {
        const provider = await findUserByEmail(providerEmail, Provider);
        if (provider) {
            const newJob = new Job();
            newJob.title = title;
            newJob.description = description;
            newJob.provider = provider._id;
            newJob.price = price;

            await newJob.save()
                .then(() => {
                    res.status(200).send('Successfully added the job')
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({ error: 'Server error' });
                });
        }
        else res.status(404).json({ message: 'User not found' });
    }
    else {
        res.status(422).json({
            title: evaluateStrings[0] ? title : "Error",
            description: evaluateStrings[1] ? description : "Error",
            providerEmail: evaluateStrings[2] ? providerEmail : "Error",
            price: price === 0 ? price : "Error",
        });
    }

}

export const updateJobById = async (req, res) => {

    const provider = findUserByEmail(req.body.email, Provider);

    if (provider) {
        await Job.findOneAndUpdate(
            { _id: req.params.jobID },
            {
                title: req.body.title,
                description: req.body.description,
                provider: provider._id,
                price: req.body.price,
            },
            { new: true }
        ) //new: true - updated contact details will show
            .then((job) => res.json(job))
            .catch((err) => {
                console.log(err);
                res.status(500).json({ error: 'An unexpected error occurred.' })
            })
    }
    else res.status(404).json({ message: 'Provider not found' });
}

export const deleteJobById = (req, res) => {
    Job.deleteOne({ _id: req.params.jobID })
        .then(() => res.json({ message: 'Successfully deleted job' }))
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: 'An unexpected error occurred.' })
        })
}