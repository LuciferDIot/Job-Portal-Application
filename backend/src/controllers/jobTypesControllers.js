import JobTypeModel from '../models/jobTypeModel.js'

export const addNewJobTypes = async (req, res) => {
    const { jobType } = req.body;

    if (jobType && jobType !== '') {
        let newJobType = new JobTypeModel({
            name: jobType
        });

        const job = await newJobType.save();
        res.status(200).json(job);

    } else {
        res.status(404).json({ error: 'not found the request body' });
    }
}

export const getAllJobTypes = async (req, res) => {
    try {
        const jobs = await JobTypeModel.find();
        if (jobs.length !== 0) res.status(200).json(jobs);
        else res.status(404).json({ error: 'Not Found Any Job Type' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}