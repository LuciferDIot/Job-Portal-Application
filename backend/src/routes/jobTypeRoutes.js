import { addNewJobTypes, getAllJobTypes } from '../controllers/jobTypesControllers.js'


const routes = (app) => {
    app.post('/jobTypes', addNewJobTypes);

    app.get('/jobTypes', getAllJobTypes);
}


export default routes;