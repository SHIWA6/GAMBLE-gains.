import React from "react";
import avatar from "../assets/avatar.svg";
import ruppee from "../assets/ruppee.svg";
import {Link} from "react-router-dom";


const Appbar=()=> {


    return(
<div className="bg-[#1a2c38] shadow-md shadow-[#14222b] z-50 sticky top-0 left-0 right-0">
    <div className="py-2 px-3 max-w-screen-xl m-auto flex justify-between items-center">

<Link to={"/"}>


<h1 className="text-white flex gap-3 font-pacifico px-8 font-medium text-3xl"> Satta <span> <img className="w-10 h-10  rounded-full  " src={avatar} alt="avatar"></img> </span> </h1>

</Link>

<div className=" flex justify-center text-sm text-white font-medium">
    <div className=" bg-[#0e202c] flex items-center gap-2 px-4 rounded-s">
        <span> Total = </span>
        <span>1000</span>
        
        </div>
        <img className="w-4 h-5" src={ruppee} alt="Rs."></img>
         </div>

         <button className="bg-[#1674e3] py-3 px-4 rounded-e">Wallet</button>

    </div>
    
</div>


    );

    
};

export default Appbar;