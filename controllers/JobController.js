import axios from 'axios';

const getAllJob = async (req, res) => {
    try {
        let url = `https://dev6.dansmultipro.com/api/recruitment/positions.json`;

        const { location, description, full_time, page = 1 } = req.query;

        const response = await axios.get(url);
        let jobs = response.data;

        if (location) {
            jobs = jobs.filter(job =>
                job.location && job.location.toLowerCase().includes(location.toLowerCase())
            );
        }

        if (description) {
            jobs = jobs.filter(job =>
                (job.title && job.title.toLowerCase().includes(description.toLowerCase())) ||
                (job.description && job.description.toLowerCase().includes(description.toLowerCase()))
            );
        }

        if (full_time) {
            const isFullTime = full_time === 'true';
            jobs = jobs.filter(job => job.type && job.type.toLowerCase() === (isFullTime ? 'full time' : 'part time'));
        }

        const limit = 10;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const paginatedJobs = jobs.slice(startIndex, endIndex);

        res.status(200).json({
            totalJobs: jobs.length,
            page: parseInt(page),
            totalPages: Math.ceil(jobs.length / limit),
            jobs: paginatedJobs
        });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

const getJobById = async (req, res) => {
    try {
        const { id } = req.params;
        let url = `https://dev6.dansmultipro.com/api/recruitment/positions`;

        const response = await axios.get(`${url}/${id}`);

        res.status(200).json(response.data);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

export { getAllJob, getJobById };

