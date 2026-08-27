const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
  },
  priceFormatted: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

serviceSchema.pre('save', function (next) {
  if (this.price !== undefined && (this.priceFormatted === undefined || this.priceFormatted === '')) {
    this.priceFormatted = 'RWF ' + this.price.toLocaleString('en-US');
  }
  next();
});

module.exports = mongoose.model('Service', serviceSchema);
