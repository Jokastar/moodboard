"use client"
import Link from "next/link";
import {deleteImage} from "../_actions/images";
import { useSession } from "next-auth/react";

const DisplayImage = ({ image, imageId }) => {
    const {data:session} = useSession(); 
    return (
        <div key={image._id} className="relative border rounded-lg shadow-lg overflow-hidden">
            <img src={image.imageUrl} alt={image.name} className="w-full h-[80vh] object-cover" />
            <div className="absolute bottom-[80px] left-[20px] text-white text-[2rem] uppercase">
                {image.name}
            </div>
           { session && <div className="dropdown dropdown-end absolute right-[20px] top-[20px]">
                <div tabIndex={0} role="button" className="text-white bg-[#CC04B8] p-3 flex items-center justify-center  rounded-[50%]"></div>
                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow  rounded-box w-52 bg-black">
                   <li className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-800 hover:cursor-pointer" onClick={()=>deleteImage(image._id)}>delete</li>
                    <li className="bg-[#4f4f4f] hover:bg-[#383838] rounded-lg my-2 text-white"><Link href={`/${imageId}/edit`}>edit</Link></li>
                    <li className="bg-[#4f4f4f] hover:bg-[#383838] rounded-lg  text-white"><Link href={`/${imageId}/addtocollection`}>add to collection</Link></li>
                </ul>
            </div>}
        </div>
    );
};

export default DisplayImage;
