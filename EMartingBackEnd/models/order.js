const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    orderId: {
        type: String,
        required: true
    },
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
    }
})

module.exports = mongoose.model("Order", OrderSchema);