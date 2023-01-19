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