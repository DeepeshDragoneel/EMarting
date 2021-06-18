import React, {useState} from 'react';
import "./SeachBar.scss";

const SeachBar = ({ onChange, changePage }) => {
    const [query, setquery] = useState("");
    return (
        <div>
            <div className="wrap">
                <div className="search">
                    <input
                        onChange={(e) => {
                            setquery(e.target.value);
                            onChange(e.target.value);
                            changePage(1);
                        }}
                        type="text"
                        className="searchTerm"
                        placeholder="What are you looking for?"
                    ></input>
                    <button type="submit" className="searchButton" onClick={() => {
                        onChange(query);
                        changePage(1);
                    }}>
                        <i className="fa fa-search"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SeachBar;
