"use client";
import React, { useState, useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import store from "@/store";
import { fetchInitialData } from "@/api";
import LoadingScreen from "./LoadingScreen";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { onEntryChange } from "@/sdk/utils";
import "@/app/globals.css";
import "@/styles/App.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <AppContent>{children}</AppContent>
        </Provider>
      </body>
    </html>
  );
}

function AppContent({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onEntryChange(() => {
      fetchInitialData(dispatch, setLoading);
    });
  }, [dispatch]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="app">
      <Header />
      <div className="body">
        <main>{children}</main>
      </div>
      <Footer />
    </div>
  );
}
