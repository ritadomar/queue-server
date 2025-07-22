const {Schema, model} = require('mongoose');

const entrySchema = new Schema ({
    entry: {type: Schema.Types.ObjectId, ref: "User"},
},
{
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  },
);

module.exports = model('Entry', entrySchema);