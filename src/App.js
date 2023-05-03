import { useQuery, useMutation, useQueryClient } from 'react-query'

import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { createAnecdote, getAnecdotes, updateAnecdote } from './request'
import { useContext } from 'react'
import { NotificationContext } from './NotificationContext'

const App = () => {
  const queryClient = useQueryClient()
  const [state, dispatch] = useContext(NotificationContext)

  const newAnecdoteMutation = useMutation(createAnecdote, {
    onSuccess: (newAnecdote) => {
      console.log('newAnecdote', newAnecdote)
      const anecdotes = queryClient.getQueryData('anecdotes')

      queryClient.setQueryData('anecdotes', anecdotes.concat(newAnecdote))
      dispatch({ type: 'SET_NOTIFICATION', payload: 'New anecdote created!' })
    },
    onError: (error) => {
      dispatch({ type: 'SET_NOTIFICATION', payload: error.message })
    },
  })
  const updateAnecdoteMutation = useMutation(updateAnecdote, {
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData('anecdotes')
      const updatedAnecdotes = anecdotes.map((a) =>
        a.id === newAnecdote.id ? newAnecdote : a
      )
      console.log(updatedAnecdotes)
      queryClient.setQueryData('anecdotes', updatedAnecdotes)
      dispatch({ type: 'SET_NOTIFICATION', payload: 'Anecdote voted!' })
    },
  })
  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
  }

  const result = useQuery('anecdotes', getAnecdotes, {
    retry: false,
  })

  if (result.isLoading) {
    return <div>loading data...</div>
  }
  if (result.isError) {
    return <span>Error: {result.error.message}</span>
  }
  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app2</h3>

      <Notification message={state} />
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
    </div>
  )
}

export default App
