function NotFound({ error }) {
    if (error === undefined)
        error = "Page does not exist"
    return (
        <>
            <h1>{error}</h1>
            <p>The requested URL was not found.</p>
        </>
    )
}

export default NotFound