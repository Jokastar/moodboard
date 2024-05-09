
import Link from "next/link";
import { deleteImage} from "../_actions/images";

const ImageCard = ({ image, imageId }) => {
    return (
        <div key={image._id} className="relative border rounded-lg shadow-lg overflow-hidden">
            <img src={image.imageUrl} alt={image.name} className="w-full h-[80vh] object-cover" />
            <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white p-2 text-sm">
                {image.name}
            </div>
            <div className="dropdown dropdown-end absolute right-0 top-0">
                <div tabIndex={0} role="button" className="btn m-1">...</div>
                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                   <li className="bg-red-600 text-white p-2" onClick={()=>deleteImage(image._id)}>delete</li>
                    <li><Link href={`/${imageId}/edit`}>edit</Link></li>
                </ul>
            </div>
        </div>
    );
};

export default ImageCard;
