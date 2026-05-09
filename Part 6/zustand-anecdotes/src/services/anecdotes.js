const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  console.log('[service.getAll] called')
  const response = await fetch(baseUrl)

  if (!response.ok) {
    console.log('[service.getAll] failed status:', response.status)
    throw new Error('Failed to fetch anecdotes')
  }

  const data = await response.json()
  console.log('[service.getAll] success count:', data.length)
  return data
}

const createNew = async (content) => {
  console.log('[service.createNew] called with content:', content)
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content,
      votes: 0,
    }),
  })

  if (!response.ok) {
    console.log('[service.createNew] failed status:', response.status)
    throw new Error('Failed to create anecdote')
  }

  const created = await response.json()
  console.log('[service.createNew] success id:', created.id)
  return created
}

const updateVote = async (anecdote) => {
  console.log('[service.updateVote] called with id:', anecdote.id)
  const response = await fetch(`${baseUrl}/${anecdote.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...anecdote,
      votes: anecdote.votes + 1,
    }),
  })

  if (!response.ok) {
    console.log('[service.updateVote] failed status:', response.status)
    throw new Error('Failed to vote anecdote')
  }

  const updated = await response.json()
  console.log('[service.updateVote] success votes:', updated.votes)
  return updated
}

export default { getAll, createNew, updateVote }
