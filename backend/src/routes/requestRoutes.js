
import {
    addJobRequest,
    getAllJobRequests,
    getAllRequestByProvider,
    getAllRequestByConsumer,
    updateRequest,
    updateActiveStatus,
    deleteJobById
} from '../controllers/requestController.js'
// import { protect } from '../middleware/consumerAuth.js';

const routes = (app) => {
    // app.post('/jobrequests', upload.single('files'), protect, addJobRequest);
    // app.get('/jobrequests', protect, getAllJobRequests);

    app.post('/jobrequests', addJobRequest);
    app.get('/jobrequests', getAllJobRequests);
    app.get('/jobrequests/provider/:providerEmail', getAllRequestByProvider);
    app.get('/jobrequests/consumer/:consumerEmail', getAllRequestByConsumer);
    app.put('/jobrequests', updateRequest)
    app.put('/jobrequests/:jobId/:isAccepted', updateActiveStatus)
    app.delete('/jobrequests/remove/:jobId', deleteJobById)
}

export default routes;
