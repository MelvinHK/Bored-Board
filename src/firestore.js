import { db } from "./firestoreConfig"
import { collection, getDocs, query, where, doc, getDoc, addDoc, limit, startAfter, orderBy } from "firebase/firestore"

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
    const amount = 10
    var q

    if (lastThreadID !== undefined) {
        const threadRef = doc(db, "threads", lastThreadID)
        const lastThread = await getDoc(threadRef)
        q = query(threadsRef,
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
    return await addDoc(threadsRef, data)
}

export const getComments = async (threadID) => {
    const amount = 10
    var q

    q = query(commentsRef,
        where('threadID', '==', threadID),
        limit(amount))

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
    const commentRef = await addDoc(commentsRef, data)
    const comment = await getDoc(commentRef)
    return {
        ...comment.data(),
        id: comment.id,
        date: comment.data().createdAt.toDate().toLocaleDateString(undefined, { dateStyle: 'medium' })
    }
}