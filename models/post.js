import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    product: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model('Post', postSchema);
