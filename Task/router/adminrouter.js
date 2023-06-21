// ctete a admin route can access (add product and manage categories)
const adminMiddleware = require('../middleware/adminmiddleware');
const admincontroller = require('../Controller/admincontroller');

const router = require('express').Router();

router.post('/signup',admincontroller.admin_signup);

router.post('/login',admincontroller.admin_login);

router.post('/addproduct',adminMiddleware,admincontroller.addproduct);

router.post('/addcategory',adminMiddleware,admincontroller.addcategory);

router.delete('/deleteproduct/:productId',adminMiddleware,admincontroller.deleteproduct);

router.delete('/deletecategory/:categoryId',adminMiddleware,admincontroller.deletecategory);

router.delete('/softdeleteproduct/:productId',adminMiddleware,admincontroller.softDeleteProduct);

router.delete('/softdeletecategory/:categoryId',adminMiddleware,admincontroller.softdeletecategory);

router.post('/addproduct/bulk',adminMiddleware,admincontroller.addproductwithbulk);

router.post('/addcategory/bulk',adminMiddleware,admincontroller.addcategorywithbulk);

module.exports = router;