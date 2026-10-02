import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: false
    },

    price: {
        type: Number,
        required: true,
        min: 0
    },

    category: {
        type: String,
        required: true,
        trim: true
    },

    stock: {
        type: Number,
        required: true,
        min: 0
    },

    isAvailable: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Product = mongoose.model("Product", productSchema);

export default Product;
