
const {Product} = require('../database/models');
const {User} = require('../database/models');
const {Wishlist} = require('../database/models');
const express = require('express');
const bcrypt = require('bcrypt');
const { verifyToken } = require('../utils/token');

const router = express.Router();

router.post('/', verifyToken, async (req, res) => {
  try {
    const { productId, notes } = req.body;
    const userId = req.userId;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
        data: {},
      });
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
        data: {},
      });
    }

    const existing = await Wishlist.findOne({ where: { userId, productId } });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Product already in wishlist',
        data: {},
      });
    }

    const wishlistItem = await Wishlist.create({
      userId,
      productId,
      notes,
    });

    res.status(201).json({
      success: true,
      message: 'Product added to wishlist',
      data: wishlistItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding product to wishlist',
      data: error.message,
    });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const { notes } = req.body;
    const userId = req.userId;

    const wishlistItem = await Wishlist.findByPk(id);

    if (!wishlistItem) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist item not found',
        data: {},
      });
    }

    if (wishlistItem.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this wishlist item',
        data: {},
      });
    }

    const updatedItem = await wishlistItem.update({ notes });

    res.status(200).json({
      success: true,
      message: 'Wishlist item updated successfully',
      data: updatedItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating wishlist item',
      data: error.message,
    });
  }
});

router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;

    const wishlist = await Wishlist.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          attributes: ['id', 'name', 'price', 'category', 'image'],
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: 'Wishlist retrieved successfully',
      data: wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving wishlist',
      data: error.message,
    });
  }
});

router.get('/:id', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const wishId = req.params.id;

    if (isNaN(wishId)) {
      return res.status(400).json({ success: false, message: 'Wishlist id is not valid', data: {} });
    };

    const wishlist = await Wishlist.findByPk(wishId, {
      where: { userId },
        include: [
            {
                model: Product,
                attributes: ['id', 'name', 'price', 'category', 'image'],
            },
        ],
    });

    if (!wishlist) {
      return res.status(404).json({ success: false, message: 'Wishlist item not found', data: {} });
    }

    res.status(200).json({
      success: true,
      message: 'Wishlist item retrieved successfully',
      data: wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving wishlist',
      data: error.message,
    });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.userId;

    const wishlistItem = await Wishlist.findByPk(id);

    if (!wishlistItem) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist item not found',
        data: {},
      });
    }

    if (wishlistItem.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this wishlist item',
        data: {},
      });
    }

    await wishlistItem.destroy();

    res.status(200).json({
      success: true,
      message: 'Wishlist item deleted successfully',
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting wishlist item',
      data: error.message,
    });
  }
});

module.exports = router;