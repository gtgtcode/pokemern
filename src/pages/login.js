import React from "react";
import { useState } from "react";
import Image from "next/image";

export default function Login() {
  return (
    <div>
      <div className="absolute bottom-0 bg-[url('/bg-sunrise.png')] h-3/4 w-full bg-cover"></div>
      <div className="z-10">
        <Image
          src="/pokemern-logo.png"
          alt="logo image"
          width={350}
          height={350}
          className="container mx-auto w-[350px] mt-12"
        />
      </div>
    </div>
  );
}
