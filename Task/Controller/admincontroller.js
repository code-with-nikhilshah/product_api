const { Op } = require('sequelize');
const path = require('path')
const jwt = require('jsonwebtoken');
const {body , validationResult } = require ('express-validator');
const bcrypt = require('bcryptjs')
const db = require('../model');
const Admin = db.admin;
const Product = db.product;
const Category = db.category;
const jwtsec = "nikhil@123";
const adminMiddleware = require('../middleware/adminmiddleware');

// 1. admin signup

const admin_signup = [
    body('firstname').notEmpty().withMessage('firstname is required'),
    body('lastname').notEmpty().withMessage('lastname is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'),
    body('mobile_num').isLength(10).withMessage('mobile number should be 10 digit'),
    
    // create user
    async(req, res) => {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      if(errors.isEmpty()){
          const hashedpassword = await bcrypt.hash(req.body.password,10);
          const addadmin = await Admin.create({
              firstname : req.body.firstname,
              lastname : req.body.lastname,
              email : req.body.email,
              password : hashedpassword,
              mobile_num : req.body.mobile_num
          })
               res.status(200).json({message:"admin sucessfully signup"})
    
      }
    }
]

//2. admin login
const admin_login = async (req, res) => {
  const { email, mobile_num, password } = req.body;

  try {
    var admin;

    if ( email ) {
      // Retrieve admin information from the database based on email
      admin = await Admin.findOne({
        where: { email }
      });
    } else if (mobile_num) {
      // Retrieve admin information from the database based on mobile number
      admin = await Admin.findOne({
        where: { mobile_num }
      });
    } else {
      return res.status(400).send({ message: "Please provide either email or mobile number" });
    }

    if (!admin) {
      return res.status(400).send({ message: "Admin not found" });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = bcrypt.compareSync(password, admin.password);
    if (!passwordMatch) {
      return res.status(400).send({ message: "Password is incorrect" });
    }
    
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal server error" });
  }
  const jwtPayload = {
    adminId: '1',
    role: 'admin'
  };
  
  const token = jwt.sign(jwtPayload, jwtsec);
  return res.status(200).send({ message: "Admin successfully logged in" ,token : token});
};

//3. admin can add product 
const addproduct = async (req, res) => {
    try {  
      const addproduct = await Product.create({
        product_name : req.body.product_name,
        product_price : req.body.product_price,
        description : req.body.description,
        categoryId:req.body.categoryId
      })
      
      res.json({ data : addproduct });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  //4. add category  only admin
  const addcategory = async (req, res) => {
    try {
      // Create the product using the request body
      const addcategory = await Category.create({
        category_name : req.body.category_name,
        description : req.body.description
      })
      
      res.status(200).json({ data : addcategory });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }



  //5. delete product
const deleteproduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const categoryId = product.categoryId;
    const category = await Category.findByPk(categoryId);

    if (!category) {
      // If the associated category does not exist, delete the product
      await product.destroy();
      return res.json({ message: 'Product deleted successfully' });
    }


    const productsInCategory = await Product.findAll({ where: { categoryId } });

    if (productsInCategory.length == 0) {
      // If there are other products in the category, delete the product
      await product.destroy();
      return res.json({ message: 'Product deleted successfully' });
    } else {
      console.error("Cannot delete product because it is exits in category table");
      return res.status(400).json({ message: 'Cannot delete product because it is exits in category table' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};



//6.admin can delete category

const deletecategory = async (req, res) => {
  try{
  const categoryId = req.params.categoryId;
  const category = await Category.findByPk(categoryId);

  if(!category){
    res.status(404).json({message:"category not found"});
  }

  const productsWithCategory = await Product.findAll({ where: { categoryId } });
  //console.log(productsWithCategory.length);

  if (productsWithCategory.length == 0) {
    await category.destroy();
    //await category.destroy();
      return res.json({ message: 'Category deleted successfully' });
  }
    // } else {
    //   console.log("Cannot delete category because category is exits in the product table");
    //   return res.status(400).json({ message: 'Cannot delete category because category is exits in the product table' });
    // }
    // }
    else {
      console.log("Cannot delete category because category is exits in the product table");
      return res.status(400).json({ message: 'Cannot delete category because category is exits in the product table' });
    }
  }catch(err){
    console.log(err);
  }
}

//7. admin can soft delete product
const softDeleteProduct = async (req, res) => {
  try {
    const productId = req.params.productId;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is missing in the request.' });
    }

    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    // Soft delete the product by updating the deleted timestamp
    //product.deletedAt = new Date();
    //await product.save();
    else{
      await product.destroy();
    return res.status(200).json({ message: 'Product soft deleted successfully.' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Failed to soft delete product.' });
  }
};


//8.admin can soft delete category

const softdeletecategory = async(req,res)=>{
  try {
    const categoryId = req.params.categoryId;

    if (!categoryId) {
      return res.status(400).json({ error: 'categoryId is missing in the request.' });
    }

    const category = await Category.findByPk(categoryId);

    if (!category) {
      return res.status(404).json({ error: 'Category not found.' });
    }
    // Soft delete the product by updating the deleted timestamp
    //product.deletedAt = new Date();
    //await product.save();
    else{
      await category.destroy();
    return res.status(200).json({ message: 'Category soft deleted successfully.' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Failed to soft delete category.' });
  }

}

// 9. admin can add multiple product through bulk create method
const addproductwithbulk =  async (req,res)=>{
  try {
    const { categoryId, products } = req.body;
// check category exits or not
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // create a array for product within categoryid
    const productsWithCategory = products.map((product) => ({
      ...product,
      categoryId,
    }));
    console.log(productsWithCategory);

    // Perform the bulk create operation
    const createdProducts = await Product.bulkCreate(productsWithCategory);

    return res.json(createdProducts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'something wrong' });
  }
}

//10. admin can add multiple category through bulk method.
const addcategorywithbulk = async (req,res)=>{
  try {
    const categories = req.body;

    // if (!categories || !Array.isArray(categories)) {
    //   return res.status(400).json({ error: 'Invalid request,please valid format' });
    // }

    // Create the product using the request body
    const addcategories = await Category.bulkCreate(categories);
    
    res.status(200).json(addcategories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
} 
   

module.exports = {
    admin_signup,
    addproduct,
    admin_login,
    addcategory,
    deleteproduct,
   deletecategory,
   softDeleteProduct,
   softdeletecategory,
   addproductwithbulk,
   addcategorywithbulk,
}