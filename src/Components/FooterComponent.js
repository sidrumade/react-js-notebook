import React from "react";
import '../footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faHeart} from "@fortawesome/free-solid-svg-icons";


const FooterComponent =() =>{
    return <p className="footer">Made with <FontAwesomeIcon icon={faHeart}  style={{'color':'#e25555'}}/> in Javascript</p>
}


export default FooterComponent;