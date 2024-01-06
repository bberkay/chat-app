<h1 align = "center">Simple Chat App with SvelteKit</h1>
<h3>Table of Contents</h3>
<ul>
  <li><a href="#introduction">Introduction</a></li>
  <li><a href="#features">Features</a></li>
  <li><a href="#installation--setup">Installation & Setup</a></li>
</ul>

<h3>Introduction</h3>
<p>This is a simple chat application with SvelteKit, Bun, and MongoDB. It's designed to demonstrate how these technologies can seamlessly integrate to create a real-time, user-friendly chat experience as easily as possible.</p>
<img src="https://i.ibb.co/G25XkWB/sveltekit-bun-mongodb-preview.png" alt="sveltekit-bun-mongodb-preview" border="0">

<h3>Features</h3>

- Realtime chat
- Realtime search from MongoDB
- Realtime sorting by last message time
- Different selectable users(for testing realtime chat)
- A droid that can send messages to you (for testing realtime chat)
- Light and dark theme
- Responsive design

<h3>Installation & Setup</h3>

1. Clone the repository
```bash
git clone https://github.com/bberkay/sveltekit-bun-mongodb.git
```
2. Navigate to the project directory and install the dependencies
```bash
cd sveltekit-bun-mongodb/app
bun install
cd ../server
bun install
```
3. Create a .env file like <a href ="https://github.com/bberkay/sveltekit-bun-mongodb/blob/main/server/.env.example">this</a> in the server directory and add the following variables
```bash
MONGO_URL=<your_mongodb_url>
```
4. Create a .env file like <a href ="https://github.com/bberkay/sveltekit-bun-mongodb/blob/main/app/.env.example">this</a> in the app directory and add the following variables
```bash
PUBLIC_SERVER_ADDRESS=<http/https:your_server_host:your_server_port>
PUBLIC_WS_ADDRESS=<ws/wss:your_server_host:your_server_port>
```
   
5. Run the server then the client
```bash
cd server
bun run index.ts
cd ../app
bun --bun run dev
```

<hr>
<h5 align="center"><a href="mailto:berkaykayaforbusiness@outlook.com">berkaykayaforbusiness@outlook.com</a></h5> 