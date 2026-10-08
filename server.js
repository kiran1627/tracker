const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const cron = require('node-cron');
const fetch = require('node-fetch'); // Next.js 14 environment usually has global fetch, but we'll use native fetch

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  })
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
      
      // Initialize node-cron
      console.log('> Initializing node-cron scheduler for 8:00 AM daily emails...');
      
      cron.schedule('0 8 * * *', async () => {
        console.log('> Running scheduled 8:00 AM email task...');
        try {
          const res = await fetch(`http://localhost:${port}/api/cron/reminders`, {
            headers: {
              authorization: `Bearer ${process.env.CRON_SECRET}`
            }
          });
          const data = await res.text();
          console.log('> Email task finished. Response:', data);
        } catch (error) {
          console.error('> Failed to trigger email task:', error);
        }
      });
    });
});
