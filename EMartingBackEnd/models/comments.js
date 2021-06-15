const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const CommentSchema = new Schema(
    {
        rating: {
            type: Number,
            required: true,
        },
        heading: {
            type: String,
            required: true,
        },
        desc: {
            type: String,
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectID,
            ref: "User",
            default: null,
        },
        googleUserId: {
            type: Schema.Types.ObjectID,
            ref: "UserGoogle",
            default: null,
        },
        productId: {
            type: Schema.Types.ObjectID,
            ref: "ProductModel",
            required: true,
        },
    },
    { timestamps: { createdAt: "createdAt" } }
);

module.exports = mongoose.model("Comment", CommentSchema);