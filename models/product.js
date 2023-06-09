const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        require: true
    },
    imageUrl: {
        type: String,
        required: false
    },
    categorieId: {
        type: Schema.Types.ObjectId,
        ref: 'Categorie',
        required: false
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    
    isSold: {
        type: Boolean,
        default: false,
        required: false
    }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);