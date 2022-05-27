// Package Modules
import passport from "passport";

// Custom Modules
import local from "./localStrategy.js";
import kakao from "./kakaoStrategy.js";
import { User } from "../models/user.js";

export default () => {
  // 로그인시 실행 -> req.session 객체에 어떤 데이터를 저장할지
  passport.serializeUser((user, done) => {
    done(null, user.id); // 세션 용량과 데이터 일관성을 고려해 유저 아이디만 저장
  });

  // 매 요청시 실행 call by passport.session 미들웨어
  // user.id -> parameter id
  passport.deserializeUser((id, done) => {
    User.findOne({
      where: { id },
      include: [
        {
          model: User,
          attributes: ["id", "nick"],
          as: "Followers",
        },
        {
          model: User,
          attributes: ["id", "nick"], // 가져올 필드 지정
          as: "Followings",
        },
      ],
    })
      .then((user) => done(null, user)) // req.user에 저장
      .catch((err) => done(err));
  });

  local();
  kakao();
};
