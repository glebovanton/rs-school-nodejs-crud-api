import { v4 as uuidv4 } from 'uuid';
import { User } from './types';

let users: User[] = [];

export const getUsers = (): User[] => {
    return users;
};

export const getUserById = (userId: string): User | undefined => {
    return users.find(user => user.id === userId);
};

export const createUser = (username: string, age: number, hobbies: string[]): User => {
    const newUser: User = {
        id: uuidv4(),
        username,
        age,
        hobbies
    };
    users.push(newUser);
    return newUser;
};

export const updateUser = (userId: string, newData: Partial<User>): User | undefined => {
    const index = users.findIndex(user => user.id === userId);
    if (index !== -1) {
        users[index] = { ...users[index], ...newData };
        return users[index];
    }
    return undefined;
};

export const deleteUser = (userId: string): boolean => {
    const initialLength = users.length;
    users = users.filter(user => user.id !== userId);
    return users.length !== initialLength;
};
