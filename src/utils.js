export function isValidHttpUrl(string) {
    const pattern = new RegExp(
        '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', // fragment locator
        'i'
    )
    return pattern.test(string);
}

export function getBlobURLFromHTML(htmlString) {
    var doc = new DOMParser().parseFromString(htmlString, "text/html")
    var imageElement = doc.getElementsByTagName("img")[0]
    if (imageElement !== undefined)
        return imageElement.src
    return null
}

export function replaceBlobURLWithFirebaseURL(htmlString, firebaseURL) {
    var doc = new DOMParser().parseFromString(htmlString, "text/html")
    doc.getElementsByTagName("img")[0].src = firebaseURL
    return doc.body.innerHTML
}

export async function getFileBlob(url) {
    const blob = await fetch(url).then(res => res.blob())
    return blob
}

export function timeSince(date) {
    var seconds = Math.floor((new Date() - date) / 1000);
    var interval = seconds / 31536000;

    if (interval > 1) 
        return Math.floor(interval) + ` year${Math.floor(interval) === 1 ? '' : 's'} ago`;
    
    interval = seconds / 2592000;
    if (interval > 1) 
        return Math.floor(interval) + ` month${Math.floor(interval) === 1 ? '' : 's'} ago`;
    
    interval = seconds / 86400;
    if (interval > 1) 
        return Math.floor(interval) + ` day${Math.floor(interval) === 1 ? '' : 's'} ago`;
    
    interval = seconds / 3600;
    if (interval > 1) 
        return Math.floor(interval) + ` hour${Math.floor(interval) === 1 ? '' : 's'} ago`;
    
    interval = seconds / 60;
    if (interval > 1) 
        return Math.floor(interval) + ` minute${Math.floor(interval) === 1 ? '' : 's'} ago`;
    
    return Math.floor(seconds) + ` second${Math.floor(interval) === 1 ? '' : 's'} ago`;
}