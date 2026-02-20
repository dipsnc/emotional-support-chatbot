import React from "react";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-bg text-text font-body flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 w-full py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
