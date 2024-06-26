"use server"; 

import WordEmbedding from "@/app/schema/mongo/WordEmbeddings";
import { getEmbedding } from "@/app/_actions/images";



export async function getSuggestionsVectorSearch(input){

    try{
      const inputEmbedding = await getEmbedding(input);
      
      const agg = [
        {
            '$vectorSearch': {
                'index': 'word_embedding_index',
                'path': 'embedding',
                'queryVector': inputEmbedding,
                'numCandidates': 100,
                'limit': 8
            }
        },
        {
            '$project': {
                '_id': 0,
                'word': 1,
                'score': { '$meta': 'vectorSearchScore' }
            }
        },
        {
            '$sort': {
                'score': -1 // Sort by score in descending order
            }
        },
        {
            '$group': {
                '_id': '$word', // Group by word field
                'word': { '$first': '$word' },
                'score': { '$first': '$score' }
            }
        },
        {
            '$sort': {
                'score': -1 // Sort by score in descending order again after grouping
            }
        }
    ];
      
      const similarWords = await WordEmbedding.aggregate(agg);
      console.log("similarWords ", similarWords); 
      if(similarWords.length < 1) return []
      return similarWords;

    }catch(e){
      console.log(e);
      return [];
    }  
  }
