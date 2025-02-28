import { gql } from '@apollo/client';

export const QUERY_USER = gql`
query Me {
    me {
        _id
        username
        email
        bookCount
        savedBooks {
            authors
            bookId
            description
            image
            link
            title
        }
    }
}
`;