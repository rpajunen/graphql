import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { gql } from 'apollo-boost'
import { useQuery, useMutation } from '@apollo/react-hooks'
import AuthorEditForm from './components/AuthorEditForm';

const ALL_AUTHORS = gql`
{
  allAuthors {
    name,
    id,
    born,
    bookCount
  }
}
`

const ALL_BOOKS = gql`
{
  allBooks {
    title,
    author,
    published
  }
}
`

const NEW_BOOK = gql`
mutation addBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
  addBook(
    title: $title,
    author: $author,
    published: $published,
    genres: $genres
  ) {
    title,
    author
  }
}
`

const EDIT_AUTHOR = gql`
mutation editAuthor($name: String!, $year: Int!) {
  editAuthor(
    name: $name, 
    setBornTo: $year
    ) {
    name
    born
  }
}
`

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const handleError = (error) => {
    setErrorMessage(error.graphQLErrors[0].message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }
  const [page, setPage] = useState('authors')
  const authors = useQuery(ALL_AUTHORS)
  const books = useQuery(ALL_BOOKS)
  const [addBook] = useMutation(NEW_BOOK, {
    onError: handleError,
    refetchQueries: [{ query: ALL_AUTHORS }, {query: ALL_BOOKS}]
  })

  const [editAuthor] = useMutation(EDIT_AUTHOR)



  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>

      <div>
        {errorMessage &&
          <div style={{ color: 'red' }}>
            {errorMessage}
          </div>
        }
      </div>

      <Authors
        result={authors}
        show={page === 'authors'}
      />

      <AuthorEditForm
        show={page === 'authors'}
        result={authors}
        editAuthor={editAuthor}
      />

      <Books
        show={page === 'books'}
        result={books}
      />

      <NewBook
        show={page === 'add'}
        addBook={addBook}
      />

    </div>
  )
}

export default App