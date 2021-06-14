import React, { useState } from "react";
import "./SelectFinder.css";

const SelectFinder = ({ types, Statement, value, onChange }) => {
    const [open, setopen] = useState(false);
    const [option, setoption] = useState(null)
    return (
        <div className="dropdown">
            <div className="control" onClick={()=>{setopen(open => !open)}}>
                <div className="selected-value">{value? value : Statement}:</div>
                <div className={`arrow ${open? "open": null}`}/>
            </div>
            <div className={`options ${open? "open": null}`}>
                {types.map((type) => {
                    return <div className="option" onClick={() => {
                        onChange((i) => {
                            setoption(type.name);
                            setopen(false);
                            return (
                                {
                                    ...i,
                                    genre: type.name
                                }
                            )
                        }
                        )
                    }}>{type.name}</div>;
                })}
            </div>
        </div>
    );
};

export default SelectFinder;
