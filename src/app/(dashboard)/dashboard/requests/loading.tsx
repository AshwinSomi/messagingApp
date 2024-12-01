import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const loading: React.FC = () => {
  return (
    <div className="w-full flex flex-col gap-3">
      <Skeleton
        className="mb-4"
        height={60}
        width={500}
        baseColor="#f7f7f7"
        highlightColor="#ffffff"
      />
      <Skeleton
        height={50}
        width={350}
        baseColor="#f7f7f7"
        highlightColor="#ffffff"
      />
      <Skeleton
        height={50}
        width={350}
        baseColor="#f7f7f7"
        highlightColor="#ffffff"
      />
      <Skeleton
        height={50}
        width={350}
        baseColor="#f7f7f7"
        highlightColor="#ffffff"
      />
    </div>
  );
};

export default loading;
