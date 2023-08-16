import { addNewConsumer, authentication, updateActiveStatus, getUserActivity } from '../controllers/consumerControllers.js'

const routes = (app) => {
    app.post('/signup/consumer', addNewConsumer);

    app.post('/login/consumer', authentication);

    app.put('/consumer/:consumerId/:isActive', updateActiveStatus)
    app.get('/consumer/isActive/:consumerId', getUserActivity)
}

export default routes;