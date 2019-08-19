import React, { useState } from 'react'
import Select from 'react-select'

const AuthorEditForm = ({ result, show, editAuthor }) => {
  const [_name, setName] = useState(null)
  const [yearString, setYearString] = useState('')

  if (!show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  const options = result.data.allAuthors.map(a => {
    return {
      value: a.name,
      label: a.name
    }
  })

  const submit = async (e) => {
    e.preventDefault()

    if (yearString === '' || _name.value === null) {
      console.log('error')
    } else {
      const year = parseInt(yearString)
      const name = _name.value
      await editAuthor({
        variables: { name, year }
      })

      setName('')
      setYearString('')
    }
  }
  return (
    <div>
      <h2>
        Edit birth year
      </h2>
      <form onSubmit={submit}>
        <div>
          <Select
            value={_name}
            onChange={_name => setName(_name)}
            options={options}
          />
        </div>
        <div>
          born
          <input
            value={yearString}
            onChange={({ target }) => setYearString(target.value)}
          />
        </div>
        <button type='submit'>edit author</button>
      </form>
    </div>
  )
}

export default AuthorEditForm