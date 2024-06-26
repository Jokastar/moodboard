
class TrieNode {
    constructor() {
        this.children = {};
        this.isEndOfWord = false;
    }
}

export default class Trie {
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
        if(prefix == "") return[]; 
        
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





