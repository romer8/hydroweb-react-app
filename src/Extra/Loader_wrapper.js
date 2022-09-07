import { useState,CSSProperties } from "react";
import PuffLoader from "react-spinners/PuffLoader";

const style = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", "zIndex": "9999" };


const Loader_wrapper = ({ loading }) => {
    let [color, setColor] = useState("#87e7eb");

    return(

        <PuffLoader color={ color } loading={loading} cssOverride={style} size= {300}/>
    );
  };
  
  export default Loader_wrapper;