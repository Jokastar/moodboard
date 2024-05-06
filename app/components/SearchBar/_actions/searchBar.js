"use server"; 

import Trie from "@/app/lib/trie";
import Image from "@/app/schema/mongo/Image";
import Tag from "@/app/schema/mongo/Tag";

const SuggestionTrie = new Trie(); 
(async ()=>{
    await initTrie(SuggestionTrie);
})(); 

async function initTrie(trie){
    try {
        const images = await Image.find({}).select('name');
        const tags = await Tag.find({})

        for(let image of images){
         trie.insert(image.name)
        }
     
        for(let tag of tags){
         trie.insert(tag.tag); 
        }
     
     }catch(e){
         console.log(error) 
     }
}
export async function getSuggestions(input){
     const suggestions = SuggestionTrie.wordsWithPrefix(input);
     return suggestions; 
}

