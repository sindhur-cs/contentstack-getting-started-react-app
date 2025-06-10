import { useEffect, useState } from "react"
import { fetchVolvoPageData } from "../../api";
import CampaignCard from "./VolvoCard";
import './CampaignCard.css';
import LoadingScreen from "../LoadingScreen";

const Volvo = () => {
    const [sections, setSections] = useState([]);
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(true);
    const tags = ["Car", "Volvo", "Safety", "Hatchback", "Gear"];

    useEffect(() => {
        const displaySections = async () => {
            try {
                const data = await fetchVolvoPageData();
                console.log(data);
                setTitle(data.entry.title || "");
                setSections(data.entry.volvo_images || []);
                console.log(data.entry.volvo_images);
            }
            catch (error) {
                setTitle("");
                setSections([]);
                console.log(error);
            }
            finally {
                setLoading(false);
            }
        }

        displaySections();
    }, []);

    if (loading) {
        return <LoadingScreen />
    }

    return (
        <div className="menu-page">
            {title && <h1 className="campaignTitle">{title}</h1>}
            {
                sections.map((section: any, index: number) => (
                    <CampaignCard
                        key={index}
                        description={section.description}
                        image={section.image}
                        title={section.image_title}
                        id={section._metadata.uid}
                        version={"volvo"}
                    />
                ))

            }
            {
                (sections && title) &&
                <div className="descriptionContainer">
                    <div className="descriptionText">{title}</div>
                    {/* tags */}
                    <div className="tagsContainer">
                        {
                            tags.map((tag: string) => <div key={tag} className="tag">{tag}</div>)
                        }
                    </div>
                </div>
            }
        </div>
    )
}

export default Volvo