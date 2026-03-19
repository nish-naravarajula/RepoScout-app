import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";

export function configurePassport(db) {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await db.collection("users").findOne({ username });

        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return done(null, false, { message: "Incorrect password" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => {
    done(null, user._id.toString());
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await db
        .collection("users")
        .findOne({ _id: new ObjectId(id) });
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
}