import { db } from "./firestoreConfig"
import { collection, getDocs, query, where, doc, getDoc, addDoc, limit, startAfter, orderBy } from "firebase/firestore"

const forumsRef = collection(db, "forums")
const threadsRef = collection(db, "threads")

export const getForums = async () => {
    const forums = await getDocs(forumsRef)
    return forums.docs.map((forum) => ({ ...forum.data(), id: forum.id }))
}

export const getForum = async (forumURL) => {
    const forumRef = doc(db, "forums", forumURL)
    const forum = await getDoc(forumRef)

    if (forum.exists())
        return { ...forum.data(), id: forum.id }

    return false
}

export const getThreads = async (forumID, lastThreadID = undefined) => {
    const amount = 7

    if (lastThreadID !== undefined) {
        const threadRef = doc(db, "threads", lastThreadID)
        const lastThread = await getDoc(threadRef)
        var q = query(threadsRef,
            where('forumID', '==', forumID),
            orderBy('createdAt', "desc"),
            startAfter(lastThread),
            limit(amount)
        )
    } else {
        var q = query(threadsRef,
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
            date: `
                ${thread.data().createdAt.toDate().toLocaleDateString(undefined, { dateStyle: 'medium' })}
                ${thread.data().createdAt.toDate().toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' })}
                `
        }))

    return false
}

export const getThread = async (threadID) => {
    const threadRef = doc(db, "threads", threadID)
    const thread = await getDoc(threadRef)

    if (thread.exists())
        return {
            ...thread.data(),
            id: thread.id,
            date: `
                ${thread.data().createdAt.toDate().toLocaleDateString(undefined, { dateStyle: 'medium' })} 
                ${thread.data().createdAt.toDate().toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' })}
                `
        }

    return false
}

export const postThread = async (data) => {
    return await addDoc(threadsRef, data)
}