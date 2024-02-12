import { validate as isValidUUID } from 'uuid';
import {
  createUser as createUserInDb,
  getUsers,
  getUserById as getUserByIdInDb,
  updateUser as updateUserInDb,
  deleteUser as deleteUserInDb,
} from '../db';

export const getAllUsers = (req, res) => {
  try {
    const users = getUsers();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
  } catch (error) {
    console.error(error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Internal server error' }));
  }
};

export const getUserById = (req, res) => {
  try {
    const { method, url } = req;
    const [ basePath, path, userId ] = url.split('/').filter(Boolean);
    const user = getUserByIdInDb(userId);
    if (user) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(user));
    } else if (!isValidUUID(userId)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'UserId is invalid' }));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'User not found' }));
    }
  } catch (error) {
    console.error(error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Internal server error' }));
  }
};

export const createUser = (req, res) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk.toString();
  });
  req.on('end', () => {
    try {
      const userData = JSON.parse(body);
      const { username, age, hobbies } = userData;
      if (!username || !age || !hobbies) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Required fields are missing' }));
        return;
      }
      const newUser = createUserInDb(username, age, hobbies);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newUser));
    } catch (error) {
      console.error(error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Internal server error' }));
    }
  });
};

export const updateUser = (req, res) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk.toString();
  });
  req.on('end', () => {
    try {
      const { method, url } = req;
      const [basePath, path, userId] = url.split('/').filter(Boolean);
      const userData = JSON.parse(body);
      const { username, age, hobbies } = userData;
      const updatedUser = updateUserInDb(userId, { username, age, hobbies });
      if (updatedUser) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(updatedUser));
      } else if (!isValidUUID(userId)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'UserId is invalid' }));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User not found' }));
      }
    } catch (error) {
      console.error(error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Internal server error' }));
    }
  });
};

export const deleteUser = (req, res) => {
  try {
    const { method, url } = req;
    const [basePath, path, userId] = url.split('/').filter(Boolean);
    const deletedUser = deleteUserInDb(userId);
    if (deletedUser) {
      res.writeHead(204);
      res.end();
    } else if (!isValidUUID(userId)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'UserId is invalid' }));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'User not found' }));
    }
  } catch (error) {
    console.error(error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Internal server error' }));
  }
};
