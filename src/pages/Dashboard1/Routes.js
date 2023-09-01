import React from "react";
import { Routes, Route } from "react-router-dom";
import Stickywall from "./Stickywall";
import Calender from "./Calender";
import Today from "./Today";
import Upcoming from "./Upcoming";
import Personal from "./Personal/Personal";
import Work from "./Work/Work";
export default function Index() {
  return (
    <Routes>
      <Route path="/" element={<Stickywall />} />
      <Route path="/calender" element={<Calender />} />
      <Route path="/today" element={<Today />} />
      <Route path="/upcoming" element={<Upcoming />} />
      <Route path="/personal" element={<Personal />} />
      <Route path="/work" element={<Work />} />
    </Routes>
  );
}
