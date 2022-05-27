// Package Modules
import express from "express";
import passport from "passport";
import bcrypt from "bcrypt";

// Custom Moudules
import { isLoggedIn, isNotLoggedIn } from "./middlewares.js";
import { User } from "../models/user.js";

export const router = express.Router();

router.post("/join", isNotLoggedIn, async (req, res, next) => {
  const { email, nick, password } = req.body;
  try {
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      return res.redirect("/join?error=exist");
    }
    const hash = await bcrypt.hash(password, 12); //bcrypt의 두번째 인수는 암호화 횟수
    await User.create({
      email,
      nick,
      password: hash,
    });
    return res.redirect("/");
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.post("/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local", (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.redirect(`/?loginError=${info.message}`);
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect("/");
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});

router.get("/logout", isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect("/");
});

// 카카오 로그인 전략 수행 => 카카오 로그인 창으로 리다이렉트
router.get("/kakao", passport.authenticate("kakao"));

// 카카오 로그인 창으로부터 성공 여부 결과를 받는 라우트
// 로컬 로그인과는 다르게 passport.authenticate 함수에 콜백 함수 제공 x
// 카카오 로그인은 성공 시 내부적으로 req.login을 호출하기 때문
router.get(
  "/kakao/callback",
  passport.authenticate("kakao", {
    failureRedirect: "/", // 로그인 실패 시 이동할 곳
  }),
  (req, res) => {
    // 로그인 성공 시 이동할 곳 => 현재는 시작 페이지
    res.redirect("/");
  }
);
