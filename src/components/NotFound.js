function NotFound({ error = "Page does not exist" }) {
    return (<>
        <h1 className='mt0'>{error}</h1>
        <p>The requested URL was not found.</p>
    </>)
}

export default NotFound