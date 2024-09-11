import app from '../src/app';
const handler = (req, res) => {
    res.status(200).json({ message: 'Hello from the API!' });
};
export { handler };
export default app;
