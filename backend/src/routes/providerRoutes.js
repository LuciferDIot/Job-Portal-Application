import { addNewProvider, authentication, getProviderById, updateProvider, updateActiveStatus, getUserActivity } from '../controllers/providerControllers.js'


const routes = (app) => {
    app.post('/signup/provider', addNewProvider);

    app.post('/login/provider', authentication);
    app.get('/provider/:providerId', getProviderById);
    app.put('/provider/:providerId', updateProvider)

    app.put('/provider/:providerId/:isActive', updateActiveStatus)
    app.get('/provider/isActive/:providerId', getUserActivity)
}


export default routes;