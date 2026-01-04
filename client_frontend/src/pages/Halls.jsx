import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HallSection from "../components/HallSection";

const Halls = () => {
  // const [halls, setHalls] = useState([]);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchHalls = async () => {
  //     try {
  //       const res = await axios.get("http://localhost:3000/api/client-halls");
  //       setHalls(res.data.halls || []);
  //     } catch (error) {
  //       console.error("Error fetching halls", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchHalls();
  // }, []);

  // if (loading) {
  //   return <div className="container py-5">Loading halls...</div>;
  // }

  return (
    <div>
      <Navbar />
        <HallSection />
      <Footer />
    </div>
  );
};

export default Halls;
