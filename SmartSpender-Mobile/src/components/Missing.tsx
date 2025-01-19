import React from "react";
import { Link } from "react-router-dom";

const Missing: React.FC = () => {
  return (
    <article style={{ padding: "100px" }}>
      <h1>Oops!</h1>
      <p>Page Not Found</p>
      <div className="flexGrow">
        <Link to="/home">Visit Our Homepage</Link>
      </div>
    </article>
  );
};

export default Missing;
