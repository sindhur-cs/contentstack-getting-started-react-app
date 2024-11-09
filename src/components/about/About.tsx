import { useEffect, useMemo, useState } from "react";
import { fetchAboutPageData } from "../../api";
import { useDispatch } from "react-redux";
import LoadingScreen from "../LoadingScreen";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { onEntryChange } from "../../sdk/utils";

const About = () => {
    const dispatch = useDispatch();
    const aboutData = useSelector((state: RootState) => state.main.aboutPageData);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        onEntryChange(() => {
            fetchAboutPageData(dispatch, setLoading);
        });
    }, [dispatch]);

    const memoizedAboutData = useMemo(() => aboutData, [aboutData]);

    return <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "15rem",
        gap: "10px"
    }}>
        {loading && <LoadingScreen/>}
        <h1>About</h1>
        <p>{memoizedAboutData.about}</p>
    </div>
}

export default About;