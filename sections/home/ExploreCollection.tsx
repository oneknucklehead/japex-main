import Image from "next/image";
import React from "react";

import lightshardleft from "../../assets/lightshardleft.png";
import lightshardright from "../../assets/lightshardright.png";

const ExploreCollection = () => {
  return (
    <div className="absolute -bottom-72 left-0 z-10">
      <Image src={lightshardleft} alt="" priority className="" />
    </div>
  );
};

export default ExploreCollection;
