
import React from 'react'; 
import CollectionsGrid from '../components/CollectionsGrid';

function MyCollection() {
    return(
        <>
        <h2 className='text-[1.2rem] uppercase my-4 border-b-2 border-b-black'>Your collections</h2>
        <CollectionsGrid/>
        </>
    )
}

export default MyCollection;
