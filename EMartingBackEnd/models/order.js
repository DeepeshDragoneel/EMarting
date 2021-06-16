const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    products: [
        {
            product: {
                type: Schema.Types.ObjectID,
                ref: "ProductModel",
            },
            quantity: {
                type: Number,
            }
        }
    ],
    user: {
        username: {
            type: String,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    city: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    zipCode: {
        type: String,
        required: true,
    },
    phoneNo: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model("Order", OrderSchema);