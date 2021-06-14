import React from 'react';
import "./SeachBar.scss";

const SeachBar = ({ onChange, changePage }) => {
    return (
        <div>
            <div class="wrap">
                <div class="search">
                    <input
                        onChange={(e) => {
                            onChange(e.target.value);
                            changePage(1);
                        }}
                        type="text"
                        class="searchTerm"
                        placeholder="What are you looking for?"
                    ></input>
                    <button type="submit" class="searchButton">
                        <i class="fa fa-search"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SeachBar;
