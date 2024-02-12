import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/users';

export default (req, res) => {
    const { method, url } = req;
    const [basePath, path, userId] = url.split('/').filter(Boolean);

    let handled = false;

    switch (method) {
        case 'GET':
            if (basePath === 'api' && path === 'users') {
                if (userId) {
                    getUserById(req, res);
                    handled = true;
                } else {
                    getAllUsers(req, res);
                    handled = true;
                }
            }
            break;
        case 'POST':
            if (basePath === 'api' && path === 'users') {
                createUser(req, res);
                handled = true;
            }
            break;
        case 'PUT':
            if (basePath === 'api' && userId) {
                updateUser(req, res);
                handled = true;
            }
            break;
        case 'DELETE':
            if (basePath === 'api' && userId) {
                deleteUser(req, res);
                handled = true;
            }
            break;
        default:
            break;
    }

    if (!handled) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Endpoint not found' }));
    }
};
