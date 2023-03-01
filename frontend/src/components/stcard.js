import React from 'react'
import { Card } from 'react-bootstrap'

const STCard = ({ children }) => {
    return (
        <Card className='shadow-lg border-white'>
            <Card.Body className='p-4'>
                {children}
            </Card.Body>
        </Card>
    )
}

export default STCard