'use client'
import Image from "next/image";
import React from "react";

const LinkThread = () => {
  return (
    <>
      <Image
        src="/assets/heart-gray.svg"
        alt="heart"
        width={24}
        height={24}
        className="cursor-pointer object-contain"
      />
    </>
  );
};

export default LinkThread;
