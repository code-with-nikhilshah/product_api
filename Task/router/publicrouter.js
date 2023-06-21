const publiccontroller = require('../Controller/publiccontroller');

const router3 = require('express').Router();

router3.get('/allcategory',publiccontroller.checkallcategory);

router3.get('/category/:categoryId',publiccontroller.checkproductbycategoryid);

router3.get('/product/pagination',publiccontroller.productpagination);

router3.get('/product/search',publiccontroller.publicsearch);

router3.get('/product/sort',publiccontroller.publicsort);

router3.get('/product/filter',publiccontroller.publicfilter);

router3.get('/allproduct',publiccontroller.checkallproduct)

module.exports = router3;

