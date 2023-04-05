import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery, useMutation, useQueryClient } from 'react-query'

import { getAnecdotes, createAnecdote, updateAnecdote } from './requests'

const App = () => {
  const queryClient = useQueryClient()
  const newAnecdoteMutation = useMutation(createAnecdote, {
    onSuccess: () => {
      queryClient.invalidateQueries('anecdotes')
    },
  })

  const updateAnecdoteMutation = useMutation(updateAnecdote, {
    onSuccess: () => {
      queryClient.invalidateQueries('anecdotes')
    },
  })

  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
  }

  const result = useQuery('anecdotes', getAnecdotes, {
    retry: false,
  })
  console.log(result)

  if (result.isLoading) {
    return <div>loading data...</div>
  }

  const anecdotes = result.data
  console.log(anecdotes)

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification
        message={
          result.error
            ? 'anecdote service not available due to server problem'
            : null
        }
      />
      {!result.error && (
        <>
          <AnecdoteForm newAnecdoteMutation={newAnecdoteMutation} />

          {anecdotes.map((anecdote) => (
            <div key={anecdote.id}>
              <div>{anecdote.content}</div>
              <div>
                has {anecdote.votes}
                <button onClick={() => handleVote(anecdote)}>vote</button>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

export default App
