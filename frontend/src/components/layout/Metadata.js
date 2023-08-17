import React from 'react'
import Helmut from 'react-helmet'

const Metadata = ({title}) => {
  return (
    <Helmut>
        <title>{title}</title>
    </Helmut>
  )
}

export default Metadata