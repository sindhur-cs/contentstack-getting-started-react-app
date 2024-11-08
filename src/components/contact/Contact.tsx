import { useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { fetchContactPage } from "../../api";
import LoadingScreen from "../LoadingScreen";
import { useDispatch } from "react-redux";

const Contact = () => {
    const dispatch = useDispatch();
    const aboutData = useSelector((state: RootState) => state.main.contactPageData);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchContactPage(dispatch, setLoading);
    }, [dispatch]);

    // memoize contact data 
    const memoizedContactData = useMemo(() => aboutData, [aboutData]);

    return <div style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "15rem",
        gap: "10px"
    }}>
        {loading && <LoadingScreen/>}
        <h1>Contact</h1>
        <div>
            {memoizedContactData.contact}
        </div>
    </div>
}

export default Contact;