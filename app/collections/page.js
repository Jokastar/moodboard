
import React from 'react'; 
import CollectionsGrid from '../components/CollectionsGrid';

function MyCollection() {
    return(
        <>
        <h2 className='text-[1.5rem] text-white uppercase my-4'>Your collections</h2>
        <CollectionsGrid/>
        </>
    )
}

export default MyCollection;
