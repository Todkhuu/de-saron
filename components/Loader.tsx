"use client";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
export const Loader = () => {
  return (
    <DotLottieReact
      src="/anim.json"
      loop
      autoplay
      style={{ width: 200, height: 200 }}
    ></DotLottieReact>
  );
};
