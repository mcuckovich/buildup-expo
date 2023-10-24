import React from "react";
import { BuildsProvider } from "../BuildsContext";
import AppRouter from "../AppRouter";

const App = () => {
  return (
    <BuildsProvider>
      <AppRouter />
    </BuildsProvider>
  );
};

export default App;
