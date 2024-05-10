// utils/convertObjectIds.js
export function convertObjectIdsToStrings(data) {
    if (Array.isArray(data)) {
        return data.map(collection => ({
            ...collection.toObject(),
            _id: collection._id.toString(),
            userId: collection.userId.toString(),
            images: collection.images.map(imageId => imageId.toString())
        }));
    } else if (data && typeof data === 'object') {
        return {
            ...data.toObject(),
            _id: data._id.toString(),
            userId: data.userId.toString(),
            images: data.images.map(imageId => imageId.toString())
        };
    } else {
        throw new Error('Invalid data type. Expected an object or an array.');
    }
}
