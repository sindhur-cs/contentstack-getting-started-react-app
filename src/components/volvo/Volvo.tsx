import { useEffect, useState } from "react"
import { fetchVolvoPageData } from "../../api";
import './Volvo.css';
import LoadingScreen from "../LoadingScreen";
import VolvoCard from "./VolvoCard";

interface LocaleOption {
    code: string;
    label: string;
}

const localeOptions: LocaleOption[] = [
    { code: "en-us", label: "English" },
    { code: "fr-fr", label: "French" },
    { code: "es-es", label: "Spanish" }
];

const Volvo = () => {
    const [sections, setSections] = useState([]);
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedLocale, setSelectedLocale] = useState<string>("en-us");
    const tags = ["Car", "Volvo", "Safety", "Hatchback", "Gear"];

    useEffect(() => {
        const displaySections = async () => {
            setLoading(true);
            try {
                const data = await fetchVolvoPageData(selectedLocale);
                setTitle(data.entry.title || "");
                setSections(data.entry.volvo_images || []);
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
    }, [selectedLocale]);

    const handleLocaleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLocale(event.target.value);
    };

    if (loading) {
        return <LoadingScreen />
    }

    return (
        <div className="menu-page">
            {title && (
                <div className="campaign-header">
                    <h1 className="campaignTitle">{title}</h1>
                    <div className="locale-dropdown-container">
                        <select 
                            value={selectedLocale} 
                            onChange={handleLocaleChange}
                            className="locale-dropdown"
                        >
                            {localeOptions.map((option) => (
                                <option key={option.code} value={option.code}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}
            
            {
                sections.map((section: any, index: number) => (
                    <VolvoCard
                        key={index}
                        description={section.description}
                        image={section.image}
                        title={section.image_title}
                        id={section._metadata.uid}
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