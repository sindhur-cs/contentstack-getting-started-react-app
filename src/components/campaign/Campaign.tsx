import { useEffect, useState } from "react"
import { fetchCampaignPageData } from "../../api";
import CampaignCard from "./CampaignCard";
import './CampaignCard.css';
import LoadingScreen from "../LoadingScreen";

const Campaign = () => {
    const [sections, setSections] = useState([]);
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(true);
    const tags = ["Campaign", "Banana", "Pineapple", "Cantaloupe", "Strawberry"];

    useEffect(() => {
        const displaySections = async () => {
            try {
                const data = await fetchCampaignPageData();
                setTitle(data.entry.title || "");
                setSections(data.entry.sections || []);
                console.log(data.entry.sections);
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
                    <div key={index}>
                        {
                            section.banana ?
                                <CampaignCard
                                    description={section.banana.description}
                                    image={section.banana.image}
                                    healthBenefits={section.banana.image.custom_metadata.health_benefits}
                                    title="Benefits of Banana"
                                    id="banana"
                                />
                                : section.pineapple ?
                                    <CampaignCard
                                        description={section.pineapple.description}
                                        image={section.pineapple.image}
                                        healthBenefits={section.pineapple.image.custom_metadata.health_benefits}
                                        title="Benefits of Pineapple"
                                        id="pineapple"
                                    />
                                    : section.cantaloupe ?
                                        <CampaignCard
                                            description={section.cantaloupe.description}
                                            image={section.cantaloupe.image}
                                            healthBenefits={section.cantaloupe.image.custom_metadata.health_benefits}
                                            title="Benefits of Cantaloupe"
                                            id="cantaloupe"
                                        />
                                        : section.strawberry ?
                                            <CampaignCard
                                                description={section.strawberry.description}
                                                image={section.strawberry.image}
                                                healthBenefits={section.strawberry.image.custom_metadata.health_benefits}
                                                title="Benefits of Strawberry"
                                                id="strawberry"
                                            />
                                            : ""
                        }
                    </div>
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

export default Campaign