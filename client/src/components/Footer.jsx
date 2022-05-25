import React from "react";
function Footer(){
const Today = new Date();
const currentYear = Today.getFullYear();
    return <footer>
    <p>Copyright ⓒ {currentYear}</p>
    </footer>;
};
export default Footer;