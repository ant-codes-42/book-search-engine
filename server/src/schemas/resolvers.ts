import { User } from '../models/index.js';
import { signToken, AuthenticationError } from '../services/auth.js';

interface IUserArgs {
    id?: string;
    username?: string;
}

interface CreateUserArgs {
    input: {
        username: string;
        email: string;
        password: string;
    }
}

interface LoginUserArgs {
    username: string;
    email: string;
    password: string;
}

interface SaveBookArgs {
    input: {
        authors: string[];
        description: string;
        bookId: string;
        image: string;
        link: string;
        title: string;
    }
}

const resolvers = {
    Query: {
        user: async (_parent: unknown, { id, username }: IUserArgs, context: any) => {
            const foundUser = await User.findOne({
                $or: [{ _id: context.user?._id || id }, { username: username }],
            });

            if (!foundUser) {
                throw new Error('Cannot find a user with this id!');
            }

            return foundUser;
        }
    },
    Mutation: {
        createUser: async (_parent: unknown, { input }: CreateUserArgs) => {
            const user = await User.create({ ...input });

            const token = signToken(user.username, user.email, user._id);

            return { token, user };
        },
        login: async (_parent: unknown, { username, email, password }: LoginUserArgs) => {
            const user = await User.findOne({ $or: [{ username }, { email }] });
            if (!user) {
                throw new AuthenticationError("Can't find this user");
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Wrong password!');
            }
            const token = signToken(user.username, user.email, user._id);
            return { token, user };
        },
        saveBook: async (_parent: unknown, { input }: SaveBookArgs, context: any) => {
            try {
                const updateUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: input } },
                    { new: true, runValidators: true }
                );
                return updateUser;
            } catch (err) {
                console.log(err);
                throw new Error('Could not save book');
            }
        },
        deleteBook: async (_parent: unknown, { bookId }: { bookId: string }, context: any) => {
            const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId } } },
                { new: true }
            );

            if (!updatedUser) {
                throw new Error('Could not find user with this id!');
            }

            return updatedUser;
        }
    }
};

export default resolvers;