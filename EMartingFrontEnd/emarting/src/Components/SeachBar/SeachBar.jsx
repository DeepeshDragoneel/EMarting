import React, {useState} from 'react';
import "./SeachBar.scss";

const SeachBar = ({ onChange, changePage }) => {
    const [query, setquery] = useState("");
    return (
        <div>
            <div class="wrap">
                <div class="search">
                    <input
                        onChange={(e) => {
                            setquery(e.target.value);
                            changePage(1);
                        }}
                        type="text"
                        class="searchTerm"
                        placeholder="What are you looking for?"
                    ></input>
                    <button type="submit" class="searchButton" onClick={() => {
                        onChange(query);
                        changePage(1);
                    }}>
                        <i class="fa fa-search"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SeachBar;
