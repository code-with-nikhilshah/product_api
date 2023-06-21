const { Op } = require('sequelize');
const db = require('../model/index');
const Category = db.category;
const Product = db.product;
//db.sequelize = sequelize;

// 1.public check all category
const checkallcategory = async(req,res)=>{
     let data = await Category.findAll();
     res.status(200).json({data:data})
}

//2.public check product by categoryid
const checkproductbycategoryid = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await Category.findByPk(categoryId);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const products = await Product.findAll({
      where: {
        categoryId: category.id,
      },
      include : {
        model : Category,
      }
    });


    // const categoryies= await Category.findAll({
    //   where : {
    //       categoryId: category.id,
    //   },
    //   include : {
    //     model : Product,
    //   }
    // })

    res.status(200).json({ data:products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 3. pagination in product

const productpagination = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 2;
  const pageSize = parseInt(req.query.pageSize) || 10;
  //const offset = (page - 1) * pageSize;
  const offset = (page - 1) * limit;
  
// page = 2
// limit = 2
// offset(skip) = 1 * 2


  try {
    const products = await Product.findAll({
      //limit: pageSize,
      limit,
      offset,
    });

    // total count of products
    const totalCount = await Product.count();

    // count toatal pages
    const totalPages = Math.ceil(totalCount / pageSize);

    res.json({
      products,
      page,
      pageSize,
      totalPages,
      totalCount,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
// 4.product search
const publicsearch = async (req, res) => {
  const { productName } = req.query;

  try {
    const products = await Product.findAll({
      where: {
        product_name: {
          [Op.like]: `%${productName}%`
        }
      }
    });

    res.status(200).json({ data: products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'server error' });
  }
};


// 5.product sort by name and price
const publicsort = async(req,res)=>{
  const { sort } = req.query;

  try {
    let sortOrder = 'ASC';

    if (sort && sort.toLowerCase() === 'desc') {
      sortOrder = 'DESC';
    }

    const products = await Product.findAll({
      order: [['product_price', sortOrder]],
    });

    res.status(200).json({ data: products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'server error' });
  }
}

// 6.user can set min price and max price and show result
const publicfilter = async(req,res)=>{
  const { minPrice, maxPrice } = req.query;

  try {
    let priceFilter = {};

    if (minPrice && maxPrice) {
      priceFilter = {
        product_price: {
          [Op.between]: [parseFloat(minPrice), parseFloat(maxPrice)],
        },
      };
    } else if (minPrice) {
      priceFilter = {
        product_price: {
          [Op.gte]: parseFloat(minPrice),
        },
      };
    } else if (maxPrice) {
      priceFilter = {
        product_price: {
          [Op.lte]: parseFloat(maxPrice),
        },
      };
    }

    const products = await Product.findAll({
      where: priceFilter,
    });

    res.status(200).json({ data: products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// check all product
const checkallproduct = async (req,res)=>{
  let data = await Product.findAll();
  //let data = await Category.findAll();
     res.status(200).json({data:data})
}

module.exports = {
  checkallcategory,
  checkproductbycategoryid,
  productpagination,
  publicsearch,
  publicsort,
  publicfilter,
  checkallproduct
}