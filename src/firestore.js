import { db } from "./firestoreConfig";
import { collection, getDocs, query, where, doc, getDoc, addDoc, limit, startAfter, orderBy, updateDoc, increment, deleteDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

const forumsRef = collection(db, "forums");
const threadsRef = collection(db, "threads");
const commentsRef = collection(db, "comments");

export const getForums = async () => {
    const forums = await getDocs(forumsRef);
    return forums.docs.map((forum) => ({ ...forum.data(), id: forum.id }));
};

export const getForum = async (forumURL) => {
    const forumRef = doc(db, "forums", forumURL);
    const forum = await getDoc(forumRef);

    if (forum.exists())
        return { ...forum.data(), id: forum.id };

    return null;
};

// Get threads from a forum, can specify a starting point for the search which is used for pagination
export const getThreadsByForumURL = async (forumID, lastThreadID = undefined) => {
    const amount = 11;

    if (lastThreadID) {
        const threadRef = doc(db, "threads", lastThreadID);
        const lastThread = await getDoc(threadRef);
        var q = query(threadsRef,
            where('forumID', '==', forumID),
            orderBy('createdAt', "desc"),
            startAfter(lastThread),
            limit(amount)
        );
    } else {
        q = query(threadsRef,
            where('forumID', '==', forumID),
            orderBy('createdAt', "desc"),
            limit(amount)
        );
    }

    const threads = await getDocs(q);

    if (!threads.empty)
        return threads.docs.map((thread) => ({
            ...thread.data(),
            id: thread.id,
            date: thread.data().createdAt.toDate().toLocaleDateString(undefined, { dateStyle: 'medium' })
        }));

    return [];
};

export const getThreadsByUserID = async (userID, lastThreadID = undefined) => {
    const amount = 11;

    if (lastThreadID) {
        const threadRef = doc(db, "threads", lastThreadID);
        const lastThread = await getDoc(threadRef);
        var q = query(threadsRef,
            where('authorID', '==', userID),
            orderBy('createdAt', "desc"),
            startAfter(lastThread),
            limit(amount)
        );
    } else {
        q = query(threadsRef,
            where('authorID', '==', userID),
            orderBy('createdAt', "desc"),
            limit(amount)
        );
    }

    const threads = await getDocs(q);

    if (!threads.empty)
        return threads.docs.map((thread) => ({
            ...thread.data(),
            id: thread.id,
            date: thread.data().createdAt.toDate().toLocaleDateString(undefined, { dateStyle: 'medium' })
        }));

    return [];
};

export const getThread = async (threadID) => {
    const threadRef = doc(db, "threads", threadID);
    const thread = await getDoc(threadRef);

    if (thread.exists())
        return {
            ...thread.data(),
            id: thread.id,
            date: thread.data().createdAt.toDate().toLocaleDateString(undefined, { dateStyle: 'medium' })
        };

    return null;
};

export const postThread = async (data) => {
    return await addDoc(threadsRef, data);
};

export const postImage = async (image) => {
    const storage = getStorage();
    const filepath = `/images/${image.name}`;
    const storageRef = ref(storage, filepath);
    try {
        await uploadBytes(storageRef, image);
        return getDownloadURL(storageRef);
    } catch (error) {
        switch (error.code) {
            case 'storage/unauthorized':
                window.alert("Invalid file. Must be JPEG/PNG and less than 8MB.");
                return false;
            default:
                window.alert("An unknown error occured.");
                return false;
        }
    }
};

export const getComments = async (threadID, lastCommentID = undefined) => {
    const amount = 11;
    if (lastCommentID) {
        const commentRef = doc(db, "comments", lastCommentID);
        const lastComment = await getDoc(commentRef);
        var q = query(commentsRef,
            where('threadID', '==', threadID),
            where('parentID', '==', null),
            orderBy('createdAt', 'asc'),
            startAfter(lastComment),
            limit(amount));
    } else {
        q = query(commentsRef,
            where('threadID', '==', threadID),
            where('parentID', '==', null),
            orderBy('createdAt', 'asc'),
            limit(amount));
    }

    const comments = await getDocs(q);

    if (!comments.empty)
        return comments.docs.map((comment) => ({
            ...comment.data(),
            id: comment.id,
            date: comment.data().createdAt.toDate().toLocaleDateString(undefined, { dateStyle: 'medium' })
        }));

    return [];
};

export const getCommentsByUserID = async (userID, lastCommentID = undefined) => {
    const amount = 11;
    if (lastCommentID) {
        const commentRef = doc(db, "comments", lastCommentID);
        const lastComment = await getDoc(commentRef);
        var q = query(commentsRef,
            where('authorID', '==', userID),
            orderBy('createdAt', 'asc'),
            startAfter(lastComment),
            limit(amount));
    } else {
        q = query(commentsRef,
            where('authorID', '==', userID),
            orderBy('createdAt', 'asc'),
            limit(amount));
    }

    const comments = await getDocs(q);

    if (!comments.empty)
        return comments.docs.map((comment) => ({
            ...comment.data(),
            id: comment.id,
            date: comment.data().createdAt.toDate().toLocaleDateString(undefined, { dateStyle: 'medium' })
        }));

    return [];
};


export const getComment = async (commentID) => {
    const commentRef = doc(db, "comments", commentID);
    const comment = await getDoc(commentRef);

    if (comment.exists())
        return [{
            ...comment.data(),
            id: comment.id,
            date: comment.data().createdAt.toDate().toLocaleDateString(undefined, { dateStyle: 'medium' })
        }];

    return null;
};

export const replyAmount = 11;
export const getReplies = async (commentID, lastReplyID = undefined) => {
    if (lastReplyID) {
        const replyRef = doc(db, "comments", lastReplyID);
        const lastReply = await getDoc(replyRef);
        var q = query(commentsRef,
            where('parentID', '==', commentID),
            orderBy('createdAt', 'asc'),
            startAfter(lastReply),
            limit(replyAmount)
        );
    } else {
        q = query(commentsRef,
            where('parentID', '==', commentID),
            orderBy('createdAt', 'asc'),
            limit(replyAmount));
    }

    const comments = await getDocs(q);

    if (!comments.empty)
        return comments.docs.map((comment) => ({
            ...comment.data(),
            id: comment.id,
            date: comment.data().createdAt.toDate().toLocaleDateString(undefined, { dateStyle: 'medium' })
        }));

    return [];
};

export const postComment = async (data) => {
    const commentRef = await addDoc(commentsRef, data);
    const threadRef = doc(db, "threads", data.threadID);
    await updateDoc(threadRef, { totalComments: increment(1) }); // Should be a server-side function effect
    const comment = await getDoc(commentRef);
    return {
        ...comment.data(),
        id: comment.id,
        date: comment.data().createdAt.toDate().toLocaleDateString(undefined, { dateStyle: 'medium' })
    };
};

export const editComment = async (commentID, description) => {
    await updateDoc(doc(db, "comments", commentID), {
        description: description,
        edited: true
    });
};

export const deleteComment = async (comment) => {
    if (comment.imageURL) {
        const storage = getStorage();
        deleteObject(ref(storage, comment.imageURL));
    }

    // If a comment has no replies, delete it from the database,
    if (comment.totalReplies === 0)
        deleteDoc(doc(db, "comments", comment.id));
    else {
        // otherwise just null its fields.
        await updateDoc(doc(db, "comments", comment.id), {
            author: null,
            authorID: null,
            description: "<p>[deleted]</p>",
            imageURL: null,
            edited: null
        });

        if (comment.parentID)
            await incrementReplies(comment.parentID, -1); // These should be a server-side function effect
    }
    await updateDoc(doc(db, "threads", comment.threadID), { totalComments: increment(-1) });
};

export const incrementReplies = async (parentID, amount) => { // Should be a server-side function effect
    const commentRef = doc(db, "comments", parentID);
    await updateDoc(commentRef, {
        totalReplies: increment(amount)
    });
};

export const getUserByID = async (userID) => {
    const user = await getDoc(doc(db, "users", userID));
    if (user.exists())
        return {
            ...user.data(),
            id: user.id,
            date: user.data().createdAt.toDate().toLocaleDateString(undefined, { dateStyle: 'medium' })
        };
    else
        return null;
};