import Image from "../schema/mongo/Image"
import Tags from "../schema/mongo/Tags"
class TrieNode {
    constructor() {
        this.children = {};
        this.isEndOfWord = false;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    insert(word) {
        let currentNode = this.root;
        for (let char of word) {
            if (!currentNode.children[char]) {
                currentNode.children[char] = new TrieNode();
            }
            currentNode = currentNode.children[char];
        }
        currentNode.isEndOfWord = true;
    }

    collectWords(node, prefix, words) {
        if (node.isEndOfWord) {
            words.push(prefix);
        }
        for (let char in node.children) {
            this.collectWords(node.children[char], prefix + char, words);
        }
    }

    wordsWithPrefix(prefix) {
        let currentNode = this.root;
        for (let char of prefix) {
            if (!currentNode.children[char]) {
                return []; // No words with given prefix
            }
            currentNode = currentNode.children[char];
        }
        let results = [];
        this.collectWords(currentNode, prefix, results);
        return results;
    }
}



async function initTrie(){
    const SuggestionTrie = new Trie(); 

try {
   const imagesName = await Image.find({}).select('name');
   const tags = await Tags.find({})

   for(let name of imagesName){
    SugesstionTrie.insert(name.name)
   }

   for(let tag of tags){
    SuggestionTrie.insert(tag.tag); 
   }

   return SuggestionTrie;

}catch(e){
    console.log(error)
}

}

