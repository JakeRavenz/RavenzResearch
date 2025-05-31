import React from "react";
import Home from "./Home";

import Faq from "./Faq";

const landingPage = () => {
  return (
    <div className="w-full min-h-screen p-0 m-0 bg-slate-300 dark:bg-slate-900">
      <div className="relative z-10 max-w-5xl px-4 py-8 mx-auto">
        <Home />
        <Faq />
      </div>
    </div>
  );
};

export default landingPage;
