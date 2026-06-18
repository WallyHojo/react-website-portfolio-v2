import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import WorkIndex from "./WorkIndex";

const ProjectDetail = lazy(() => import("./ProjectDetail"));

function Work() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route index element={<WorkIndex />} />
        <Route path=":slug" element={<ProjectDetail />} />
      </Routes>
    </Suspense>
  );
}

export default Work;