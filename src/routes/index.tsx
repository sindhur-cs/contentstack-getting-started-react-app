import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import Home from "../components/home/Home";
import Menu from "../components/menu/Menu";
import Comp from "../components/Test";
import { fetchInitialData } from "../api";
import { useDispatch } from "react-redux";
import LoadingScreen from "../components/LoadingScreen";
import { NotFound } from "../components/NotFound";
import { onEntryChange } from "../sdk/utils";
import Product from "../components/product/Product";
import Campaign from "../components/campaign/Campaign";
import CampaignProduct from "../components/campaign/CampaignProduct";

const AppRoutes: React.FC = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onEntryChange(() => {
      fetchInitialData(dispatch, setLoading);
    });
  }, [dispatch]);

  return (
    <Router>
      <div className="app">
        {loading ? (
          <LoadingScreen />
        ) : (
          <>
            <Header />
            <div className="body">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/test" element={<Comp />} />
                <Route path={`/:product/:id`} element={<Product/>}/>
                <Route path="/campaign" element={<Campaign />}/>
                <Route path="/campaign/:id" element={<CampaignProduct />}/>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Footer />
          </>
        )}
      </div>
    </Router>
  );
};

export default AppRoutes;
