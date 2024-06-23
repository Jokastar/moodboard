"use client";
import Link from "next/link";
import { deleteImage } from "../_actions/images";
import { useSession } from "next-auth/react";

const DisplayImage = ({ image }) => {
    const { data: session } = useSession();

    return (
        <div key={image._id} className="flex items-center justify-center h-screen">
            <div className="relative group flex items-center justify-center bg-black">
                <img 
                    src={image.imageUrl} 
                    alt={image.name} 
                    className="object-contain max-h-screen max-w-full"
                />
                <div className="absolute bottom-0 left-0 text-white bg-black bg-opacity-75 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-full">
                    <p className="font-reckless-neue text-[20px] my-1">{image.name}</p>
                    <div className="flex gap-2 flex-wrap">
                        {image.tags.map((tag, index) => (
                            <div key={index} className="px-2 py-1 rounded-[20px] text-white text-center font-favorit-light-c text-[10px] bg border border-white min-w-[40px] my-1">{tag}</div>
                        ))}
                    </div>
                </div>
                {session && (
                    <div className="absolute right-2 top-2">
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="text-white bg-[var(--yellow)] p-2 flex items-center justify-center rounded-full"></div>
                            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow rounded-box w-52 bg-black">
                                <li 
                                    className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-800 hover:cursor-pointer" 
                                    onClick={() => deleteImage(image._id)}
                                >
                                    delete
                                </li>
                                <li className="bg-[#4f4f4f] hover:bg-[#383838] rounded-lg my-2 text-white">
                                    <Link href={`/${image._id}/edit`}>edit</Link>
                                </li>
                                <li className="bg-[#4f4f4f] hover:bg-[#383838] rounded-lg text-white">
                                    <Link href={`/${image._id}/addtocollection`}>add to collection</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DisplayImage;
