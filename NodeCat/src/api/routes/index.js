// Package Modules
import express from "express";
import axios from "axios";

export const router = express.Router();

const URL = "http://localhost:8002/v2"; // API 서버 주소
axios.defaults.headers.origin = "http://localhost:4000"; // origin 헤더 추가

const request = async (req, api) => {
  try {
    // 세션에 토큰이 없으면
    if (!req.session.jwt) {
      // 토큰 발급 요청
      const tokenResult = await axios.post(`${URL}/token`, {
        clientSecret: process.env.CLIENT_SECRET,
      });
      req.session.jwt = tokenResult.data.token; // 세션에 토큰 저장
    }
    return await axios.get(`${URL}${api}`, {
      headers: { authorization: req.session.jwt },
    }); // API 요청
  } catch (error) {
    // 토큰 만료시 토큰 재발급 받기
    if (error.response.status === 419) {
      delete req.session.jwt;
      return request(req, api);
    } // 419 외의 다른 에러면
    return error.response;
  }
};

router.get("/mypost", async (req, res, next) => {
  try {
    console.log("123123");
    const result = await request(req, "/posts/my");
    res.json(result.data);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/search/:hashtag", async (req, res, next) => {
  try {
    const result = await request(
      req,
      `/posts/hashtag/${encodeURIComponent(req.params.hashtag)}`
    );
    res.json(result.data);
  } catch (error) {
    if (error.code) {
      console.error(error);
      next(error);
    }
  }
});

router.get("/", (req, res) => {
  res.render("main", { key: process.env.CLIENT_SECRET });
});
