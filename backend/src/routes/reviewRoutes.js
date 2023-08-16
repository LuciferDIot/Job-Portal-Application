import { addNewReview, getAllReview } from '../controllers/reviewControllers.js';
// import { protect } from '../middleware/consumerAuth.js';

const routes = (app) => {
    // app.post('/review', protect, addNewReview);
    // app.get('/review/:providerEmail', protect, getAllReview)
    app.post('/review', addNewReview);
    app.get('/review/:providerEmail', getAllReview)
}

export default routes;