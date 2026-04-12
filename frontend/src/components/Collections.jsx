import Navbar from "./Navbar";
import SearchBarNavigator from "./SearchBarNavigator";
import logo from "../assets/logo.jpg";
import './Collections.css'
import { useState } from 'react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'


export default function Collections() {
    const [collections, setCollections] = useState([]); 
    async function queryData(){
	    const res = await fetch('/api/collections/public');
	    const coll = await res.json();
        setCollections(coll);
    }
	
    useEffect(() => { 
        queryData();
    }, []);

    return <>
        <div className = "about about-banner">
            <h1>All collections</h1>
	        <button><h1><a className="lnk" href="/AddCollection">Add new collection</a></h1></button>
	    </div>

        <div className='collections-page-list-container'>
            <ul>
                { collections.length > 0 &&
                    collections.map((collection, i) =>
                        <li key={i}>
                            <h2>
                                <Link to={`/collection/${collection._id}`}>
                                    {collection.title}
                                </Link>
                            </h2>
                            <p>{collection.description}</p>
                        </li>
                    )
                }
            </ul>
        </div>
    </>;
}


