import mongoose, { Schema, Types } from "mongoose";

// An interface that describes the properties
// that are required to create a new LibEntry
interface LibEntryAttrs {
  url: string;
  user: Types.ObjectId;
  source: string;
}

// An interface that describes the properties
// that a LibEntry Model has
interface LibEntryModel extends mongoose.Model<LibEntryDocument> {
  build(attrs: LibEntryAttrs): LibEntryDocument;
}

// An interface that descirbes the properties
// that a LibEntry Document has
interface LibEntryDocument extends mongoose.Document {
  userId: string;
  user: Types.ObjectId;
  source: string;
}

const libEntrySchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

// Methods are used to define instance methods

// Statics are used to define object methods
libEntrySchema.statics.build = (attrs: LibEntryAttrs) => {
  return new LibEntry(attrs);
};

const LibEntry = mongoose.model<LibEntryDocument, LibEntryModel>(
  "LibEntry",
  libEntrySchema
);

export { LibEntry };
