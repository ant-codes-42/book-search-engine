import { gql } from "@apollo/client"

export const LOGIN_USER = gql`
mutation Login($email: String, $password: String!) {
    login(email: $email, password: $password) {
        token
        user {
            _id
            username
        }
    }
}
`;

export const CREATE_USER = gql`
mutation CreateUser($input: UserInput!) {
    createUser(input: $input) {
        user {
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
    token
    }
}
`;

export const SAVE_BOOK = gql`
mutation SaveBook($input: BookInput!) {
    saveBook(input: $input) {
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

export const REMOVE_BOOK = gql`
mutation DeleteBook($bookId: String!) {
    deleteBook(bookId: $bookId) {
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