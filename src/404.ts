export const NotFound = (req, res) => {
  /** Send the 404 state */
  res.writeHead(404, { 'Content-Type': 'text/json' })

  res.end(JSON.stringify({ error: 404 }))
}