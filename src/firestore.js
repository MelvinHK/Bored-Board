import { db } from "./firestoreConfig"
import { collection, getDocs, query, where, doc, getDoc, addDoc, limit, startAfter, orderBy, updateDoc, increment } from "firebase/firestore"
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import { generateTripcode } from "./utils"

const forumsRef = collection(db, "forums")
const threadsRef = collection(db, "threads")
const commentsRef = collection(db, "comments")

export const getForums = async () => {
    const forums = await getDocs(forumsRef)
    return forums.docs.map((forum) => ({ ...forum.data(), id: forum.id }))
}

export const getForum = async (forumURL) => {
    const forumRef = doc(db, "forums", forumURL)
    const forum = await getDoc(forumRef)

    if (forum.exists())
        return { ...forum.data(), id: forum.id }

    return null
}

// Get threads from a forum, can specify a starting point for the search which is used for pagination
export const getThreads = async (forumID, lastThreadID = undefined) => {
    const amount = 11

    if (lastThreadID) {
        const threadRef = doc(db, "threads", lastThreadID)
        const lastThread = await getDoc(threadRef)
        var q = query(threadsRef,
            where('forumID', '==', forumID),
            orderBy('createdAt', "desc"),
            startAfter(lastThread),
            limit(amount)
        )
    } else {
        q = query(threadsRef,
            where('forumID', '==', forumID),
            orderBy('createdAt', "desc"),
            limit(amount)
        )
    }

    const threads = await getDocs(q)

    if (!threads.empty)
        return threads.docs.map((thread) => ({
            ...thread.data(),
            id: thread.id,
            date: thread.data().createdAt.toDate().toLocaleDateString(undefined, { dateStyle: 'medium' })
        }))

    return []
}

export const getThread = async (threadID) => {
    const threadRef = doc(db, "threads", threadID)
    const thread = await getDoc(threadRef)

    if (thread.exists())
        return {
            ...thread.data(),
            id: thread.id,
            date: thread.data().createdAt.toDate().toLocaleDateString(undefined, { dateStyle: 'medium' })
        }

    return null
}

export const postThread = async (data) => {
    if (data.author.includes('#')) {
        const split = data.author.split(/#(.*)/s)
        data.author = `${split[0]} !${String(generateTripcode(split[1])).slice(-10)}`
    }
    return await addDoc(threadsRef, data)
}

export const postImage = async (image) => {
    const storage = getStorage()
    const filepath = `/images/${image.name}`
    const storageRef = ref(storage, filepath)
    try {
        await uploadBytes(storageRef, image)
        return getDownloadURL(storageRef)
    } catch (error) {
        switch (error.code) {
            case 'storage/unauthorized':
                window.alert("Invalid file. Must be JPEG/PNG and less than 8MB.")
                return false
            default:
                window.alert("An unknown error occured.")
                return false
        }
    }
}

export const getComments = async (threadID, lastCommentID = undefined) => {
    const amount = 11
    if (lastCommentID) {
        const commentRef = doc(db, "comments", lastCommentID)
        const lastComment = await getDoc(commentRef)
        var q = query(commentsRef,
            where('threadID', '==', threadID),
            where('parentID', '==', null),
            orderBy('createdAt', 'asc'),
            startAfter(lastComment),
            limit(amount))
    } else {
        q = query(commentsRef,
            where('threadID', '==', threadID),
            where('parentID', '==', null),
            orderBy('createdAt', 'asc'),
            limit(amount))
    }

    const comments = await getDocs(q)

    if (!comments.empty)
        return comments.docs.map((comment) => ({
            ...comment.data(),
            id: comment.id,
            date: comment.data().createdAt.toDate().toLocaleDateString(undefined, { dateStyle: 'medium' })
        }))

    return []
}

export const getComment = async (commentID) => {
    const commentRef = doc(db, "comments", commentID)
    const comment = await getDoc(commentRef)

    if (comment.exists())
        return [{
            ...comment.data(),
            id: comment.id,
            date: comment.data().createdAt.toDate().toLocaleDateString(undefined, { dateStyle: 'medium' })
        }]

    return null
}

export const replyAmount = 11
export const getReplies = async (commentID, lastReplyID = undefined) => {
    if (lastReplyID) {
        const replyRef = doc(db, "comments", lastReplyID)
        const lastReply = await getDoc(replyRef)
        var q = query(commentsRef,
            where('parentID', '==', commentID),
            orderBy('createdAt', 'asc'),
            startAfter(lastReply),
            limit(replyAmount)
        )
    } else {
        q = query(commentsRef,
            where('parentID', '==', commentID),
            orderBy('createdAt', 'asc'),
            limit(replyAmount))
    }

    const comments = await getDocs(q)

    if (!comments.empty)
        return comments.docs.map((comment) => ({
            ...comment.data(),
            id: comment.id,
            date: comment.data().createdAt.toDate().toLocaleDateString(undefined, { dateStyle: 'medium' })
        }))

    return []
}

export const postComment = async (data) => {
    if (data.author.includes('#')) {
        const split = data.author.split(/#(.*)/s)
        data.author = `${split[0]} !${String(generateTripcode(split[0], split[1])).slice(-10)}`
    }
    const commentRef = await addDoc(commentsRef, data)
    const threadRef = doc(db, "threads", data.threadID)
    await updateDoc(threadRef, { totalComments: increment(1) })
    const comment = await getDoc(commentRef)
    return {
        ...comment.data(),
        id: comment.id,
        date: comment.data().createdAt.toDate().toLocaleDateString(undefined, { dateStyle: 'medium' })
    }
}

export const incrementReplies = async (parentID, amount) => {
    const commentRef = doc(db, "comments", parentID)
    await updateDoc(commentRef, {
        totalReplies: increment(amount)
    })
}