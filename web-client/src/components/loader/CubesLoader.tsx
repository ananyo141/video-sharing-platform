import React from "react";
import "./CubesLoader.css";

const CubesLoader = () => {
  return (
    <div className="loop cubes">
      <div className="item cubes"></div>
      <div className="item cubes"></div>
      <div className="item cubes"></div>
      <div className="item cubes"></div>
      <div className="item cubes"></div>
      <div className="item cubes"></div>
      <span className="text-2xl font-semibold shadow-md text-purple-800">
        Loading
      </span>
    </div>
  );
};

export default CubesLoader;
