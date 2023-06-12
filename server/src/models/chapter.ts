import mongoose, { Schema, Types } from "mongoose";

// An interface that describes the properties
// that are required to create a new Chapter
interface ChapterAttrs {
  title: string;
  url: string;
  manga: Types.ObjectId;
  pages: string[];
}

// An interface that describes the properties
// that a Chapter Model has
interface ChapterModel extends mongoose.Model<ChapterDocument> {
  build(attrs: ChapterAttrs): ChapterDocument;
}

// An interface that descirbes the properties
// that a Chapter Document has
interface ChapterDocument extends mongoose.Document {
  title: string;
  url: string;
  manga: Types.ObjectId;
  pages: string[];
}

const chapterSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    manga: {
      type: Schema.Types.ObjectId,
      ref: "Manga",
      required: true,
    },
    pages: {
      type: [String],
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
chapterSchema.statics.build = (attrs: ChapterAttrs) => {
  return new Chapter(attrs);
};

const Chapter = mongoose.model<ChapterDocument, ChapterModel>(
  "Chapter",
  chapterSchema
);

export { Chapter };
