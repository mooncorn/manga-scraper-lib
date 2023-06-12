import mongoose from "mongoose";

// An interface that describes the properties
// that are required to create a new Manga
interface MangaAttrs {
  title: string;
  imgUrl: string;
  url: string;
  source: string;
}

// An interface that describes the properties
// that a Manga Model has
interface MangaModel extends mongoose.Model<MangaDocument> {
  build(attrs: MangaAttrs): MangaDocument;
}

// An interface that descirbes the properties
// that a Manga Document has
interface MangaDocument extends mongoose.Document {
  title: string;
  imgUrl: string;
  url: string;
  source: string;
}

const mangaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    imgUrl: {
      type: String,
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
mangaSchema.statics.build = (attrs: MangaAttrs) => {
  return new Manga(attrs);
};

const Manga = mongoose.model<MangaDocument, MangaModel>("Manga", mangaSchema);

export { Manga };
