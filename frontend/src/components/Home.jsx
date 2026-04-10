import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import './Home.css'
import bookstore from "../assets/cozy-bookstore.jpg"
import library from "../assets/libraryBox.jpg"
import sevenHusbands from "../assets/sevenHusbands.jpg"
import hungerGames from "../assets/hungerGames.jpg"
import twilight from "../assets/twilight.jpg"

function Home() {
    const [staff_picks, setStaffPicks] = useState([]);
    const [errorMessage, setErrorMessage]= useState(null);

    useEffect(() => {
        (async () => {
            const random_books_response = await fetch('/api/books/random?count=3', {
                headers: {'Content-Type': 'application/json'},
            });
            console.log(random_books_response);
            if (!random_books_response.ok) {
                try {
                    const error_response = await random_books_response.json();
                    console.error(error_response);
                    alert(error_response.error);
                    return;
                } catch(e) {
                    console.error(e);
                    alert('An unknown error occured while retrieving books. Please try again later');
                    return;
                }
            }

            setStaffPicks(await random_books_response.json());
        })();
    }, []);

    return (
        <>
            { errorMessage &&
                <p style={{ color: 'red' }}>{errorMessage}</p>
            }
            <div className = "home1">
                <div style = {{backgroundColor: "#B45253",
                    width: "60%",
                }}>
                    <h2 className = "stafftitle">Staff Picks</h2>
                    <ul className = "staffpicks">
                        { staff_picks.map((b, i) =>
                            <li key={i} class='home-page-staff-pick'>
                                <img src={b.cover} alt={`Cover of ${b.title}`}/>
                                <div>
                                    <p>
                                        <em>{b.title}</em> — {b.description};
                                    </p>
                                    <p><Link to={`/catalog/${b.isbn}`}>Read more</Link></p>
                                </div>
                            </li>
                        )}
                    </ul>
                </div>
                <img src={bookstore} alt="Bookstore" className="bookstore" style = {{width: "40%"}}/>
            </div>

            <h2 style = {{margin: "40px", textAlign: "center"}}>
                A GATEWAY TO A NEW WORLD, STORIES, AND LIMITLESS IMAGINATION
            </h2>

       <img src = {library} alt = "Library" className = "libraryBox" style = {{width: "100%"}}/>

       <div className = "featuredBooks">
        <div className = "book1" >
                <img src={sevenHusbands} alt="sevenHusbands" className="sevenHusbands"/>
                <p className = "books1">Aging and reclusive Hollywood movie icon Evelyn Hugo is finally 
                ready to tell the truth about her glamorous and scandalous life. But when she chooses 
                unknown magazine reporter Monique Grant for the job, no one is more astounded than Monique herself. Why her? Why now?
            </p>
        </div>

        <div className = "book2">
                <img src={hungerGames} alt="hungerGames" className="hungerGames" style = {{height: "490px", marginTop: "70px"}}></img>
                <p className = "books2">In the ruins of a place once known as North America lies the nation of Panem, a shining Capitol 
                surrounded by twelve outlying districts. The Capitol is harsh and cruel and keeps the districts in line by forcing 
                them all to send one boy and one girl between the ages of twelve and eighteen to participate in the annual Hunger 
                Games, a fight to the death on live TV.
                </p>
        </div>
        </div>

        <div className = "book3">
            <img src={twilight} alt="twilight" className="twilight" style = {{height: "500px", marginTop: "70px"}}></img>
             <p className = "books3">Isabella Swan's move to Forks, a small, perpetually rainy town in Washington, could have been 
                the most boring move she ever made. But once she meets the mysterious and alluring Edward Cullen, Isabella's life 
                takes a thrilling and terrifying turn. 
             </p>
        </div>  
    </>
    );
}

 export default Home;

 
 
 
 
