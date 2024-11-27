import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema, model } = mongoose;
const { genSalt, hash } = bcrypt;

const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    quizzes: [{ type: Schema.Types.ObjectId, ref: "Quiz" }],
    scores: [
      {
        quizId: { type: Schema.Types.ObjectId, ref: "Quiz" },
        score: { type: Number },
        timeFinished: { type: Number },
      },
    ],
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);
});

const User = model("User", UserSchema);

export default User;
