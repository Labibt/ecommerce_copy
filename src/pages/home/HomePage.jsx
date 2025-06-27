import { useContext } from "react";
import Category from "../../components/category/Category";
import HeroSection from "/home/user/ecommycopy/src/components/heroSection/HeroSection.jsx";
import HomePageProductCard from "../../components/homePageProductCard/HomePageProductCard";
import Layout from "../../components/layout/Layout";
import Testimonial from "../../components/testimonial/Testimonial";
import Track from "../../components/track/Track";
import myContext from "../../context/myContext";
import Loader from "../../components/loader/Loader";
import { Toaster } from "react-hot-toast";


export default function HomePage() {
  const context = useContext(myContext);
  const name = context;
  return (
    <Layout>
        <HeroSection/>
        <Category/>
        <HomePageProductCard/>
        <Track/>
        <Testimonial/>
        <Loader/>
    </Layout>
  );
}
