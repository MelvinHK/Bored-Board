function NotFound({ error }) {
    if (error === undefined)
        error = "Page does not exist"
    return (
        <div>
            <h1>{error}</h1>
            <p>The requested URL was not found.</p>
        </div>
    )
}

export default NotFound