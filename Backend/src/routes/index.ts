const Router = require('express')
const router = Router();

router.use('/auth', require('./user'))

router.use('/messages', require('./messages'))

router.use('/groups', require('./groups'))


export default router;
