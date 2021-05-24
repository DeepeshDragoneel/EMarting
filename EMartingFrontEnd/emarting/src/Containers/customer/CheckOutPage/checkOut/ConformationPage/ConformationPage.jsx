import React from 'react';
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { successIcon } from "../../../../../assets/successIcon.svg";
import "./ConformationPage.scss";

const ConformationPage = () => {
    return (
      <>
        <div></div>
        <CheckCircleIcon
          style={{
            fontSize: 100,
            color: "#33B97C",
          }}
        ></CheckCircleIcon>
        <h2
          style={{
            color: "#33B97C",
          }}
        >
          Payment Successful
        </h2>
      </>
    );
}

export default ConformationPage;
