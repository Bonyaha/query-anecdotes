import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery, useMutation, useQueryClient } from 'react-query'

import { getAnecdotes, createAnecdote, updateAnecdote } from './requests'
import { useContext } from 'react'
import { NotificationContext } from './NotificationContext'

const App = () => {
  const { state, dispatch } = useContext(NotificationContext)
  const queryClient = useQueryClient()

  const newAnecdoteMutation = useMutation(createAnecdote, {
    onSuccess: () => {
      queryClient.invalidateQueries('anecdotes')
      dispatch({ type: 'SET_NOTIFICATION', payload: 'New anecdote created!' })
      setTimeout(() => dispatch({ type: 'CLEAR_NOTIFICATION' }), 5000)
    },
    onError: (error) => {
      dispatch({ type: 'SET_NOTIFICATION', payload: error.message })
      setTimeout(() => dispatch({ type: 'CLEAR_NOTIFICATION' }), 5000)
    },
  })

  const updateAnecdoteMutation = useMutation(updateAnecdote, {
    onSuccess: () => {
      queryClient.invalidateQueries('anecdotes')
      dispatch({ type: 'SET_NOTIFICATION', payload: 'Anecdote voted!' })
      setTimeout(() => dispatch({ type: 'CLEAR_NOTIFICATION' }), 5000)
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
            : state
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
