import { Button, Field, FieldLabel, Icon, SideBarWindow, Textarea } from '@contentstack/venus-components'
import '@contentstack/venus-components/build/main.css'
import { useState } from 'react'
import { setBoundingBoxes } from '../reducer'
import { useDispatch } from 'react-redux'
import '../styles/App.css'
import Spinner from './Spinner'

const Sidebar = ({ url }: { url: string }) => {
    const dispatch = useDispatch();
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [imageDescription, setImageDescription] = useState<string>("");
    const [descLoading, setDescLoading] = useState(false);
    const [tagLoading, setIsTagLoading] = useState(false);

    const handleEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();

            if (tagInput.trim()) {
                setTags([...tags, tagInput.trim()]);
                setTagInput('');
            }
        }
    }

    const handleTagInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTagInput(e.target.value);
    }

    const fetchAIData = async () => {
        try {
            const index = url.split("/").length - 2;
            const imageUid = index >= 0 ? url.split("/")[index] : null;        
            const data = await fetch(`https://dev9-dam-api.csnonprod.com/api/bff/asset_metadata/${imageUid}`, {
                method: "GET",
                headers: {
                    "access_token": process.env.REACT_APP_DAM_ACCESS_TOKEN || "",
                    "organization_uid": process.env.REACT_APP_DAM_ORG_UID || "",
                    "x-cs-api-version": "4",
                    "Content-Type": "application/json"
                },
            });
            const result = await data.json();
            return result;
        }
        catch(error) {
            console.log(error);
            return null;
        }
    }

    const handleBoundingBoxCreation = async () => {
        try {
            // fetch the api
            const aiData = await fetchAIData();
            // get the result
            const result = aiData.image_data.metadata.detections;
            dispatch(setBoundingBoxes(result));
        }
        catch(error) {
            console.log(error);
        }
    }

    const handleAISuggestions = async () => {
        try {
            const result = await fetchAIData();
            setImageDescription(result?.image_data.metadata.alt_text.descriptions[0].text);
        }
        catch(error) {
            console.log(error);
        }
        finally {
            setDescLoading(false);
        }
    }

    const handleAITagSuggestions = async () => {
        try {
            const result = await fetchAIData();
            setTags(result?.image_data.metadata.alt_text.tags.map((tag:{text:string}) => tag.text));
        }
        catch(error) {
            console.log(error);
        }
        finally {
            setIsTagLoading(false);
        }
    }

    const tabsInfo = [
        {
            id: "tags",
            tabIcon: <Icon icon="Information" />,
            tabLabel: "Tags",
            windowTitle: "AI Generated Information",
            data: (
                <div className="sidebar-container">
                    {/* @ts-ignore */}
                    <Field>
                        {/* @ts-ignore */}
                        <FieldLabel htmlFor="description" version="v2">Description</FieldLabel>
                        <Textarea id="description" name="description" version="v2" value={imageDescription}/>
                        <div className="ai-suggestion-container">
                            {descLoading && <Spinner size={20}/>}
                            <div className="ai-suggestion" onClick={() => {
                                setDescLoading(true);
                                handleAISuggestions();
                                setImageDescription("");
                            }}>
                                <Icon version="v2" icon="ContentstackAI" width={20} height={20} style={{ marginTop: 2 }} stroke="#715cdd"/>
                                <p className="ai-suggestion-text">Suggest Description with AI</p>
                            </div>
                        </div>
                    </Field>

                    <div className="divider"></div>

                    {/* @ts-ignore */}
                    <Field>
                        {/* @ts-ignore */}
                        <FieldLabel htmlFor="tags" version="v2">Tags</FieldLabel>
                        {tags.length > 0 && <div className="tags-container">
                            {tags.map((tag, index) => (
                                <div key={index} className="tag-item">
                                    {tag}
                                    <img src="/Close-Noborder.png" width="16px" height="16px" className="tag-close" onClick={() => { setTags(tags.filter(t => tag !== t)) }} />
                                </div>
                            ))}
                        </div>}
                        <Textarea
                            id="tags"
                            name="tags"
                            version="v2"
                            onKeyPress={handleEnter}
                            value={tagInput}
                            onChange={handleTagInputChange}
                            placeholder="Type and press Enter to add tags"
                        />
                        <div className="ai-suggestion-container">
                            <div className="ai-suggestion" onClick={() => {
                                setIsTagLoading(true);
                                handleAITagSuggestions();
                            }}>
                                {tagLoading && <Spinner size={20}/>}
                                <Icon version="v2" icon="ContentstackAI" width={20} height={20} style={{ marginTop: 2 }} stroke="#715cdd" />
                                <p className="ai-suggestion-text">Suggest Tags with AI</p>
                            </div>
                        </div>
                    </Field>
                </div>
            )
        },
        {
            id: "bounding-box",
            tabIcon: <Icon icon="Image" height={20} width={20}/>,
            tabLabel: "Bounding Box",
            windowTitle: "Bounding Box",
            data: (
                <div className="bounding-box-container">
                    <Button onClick={handleBoundingBoxCreation}>Detect</Button>
                    <Button onClick={() => dispatch(setBoundingBoxes(null))}>Clear</Button>
                </div>
            )
        }
    ]

    // @ts-ignore
    return <SideBarWindow tabsInfo={tabsInfo} borderClose={true} borderOpen={true} isResizable={true} version="v2"/>
}

export default Sidebar