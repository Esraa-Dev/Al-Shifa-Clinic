import Hero from "../components/features/home/Hero";
import SpecialityMenu from "../components/features/home/SpecialityMenu";
import TopDoctors from "../components/features/home/TopDoctors";
import Banner from "../components/features/home/Banner";

const HomePage = () => {
    return (
        <div className="bg-white">
            <Hero />
            <SpecialityMenu/>
            <TopDoctors />
            <Banner />
        </div>
    )
}

export default HomePage