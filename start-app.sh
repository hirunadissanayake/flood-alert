#!/bin/bash

echo "========================================="
echo "Starting Flood Alert Platform"
echo "========================================="
echo ""
echo "This will start both client and server"
echo "Press Ctrl+C to stop both servers"
echo ""
echo "Client: http://localhost:3000"
echo "Server: http://localhost:8080"
echo ""
echo "========================================="
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Stopping servers..."
    kill $CLIENT_PID $SERVER_PID 2>/dev/null
    exit
}

trap cleanup EXIT INT TERM

# Start server
cd server
echo "Starting server..."
npm run dev &
SERVER_PID=$!

# Wait a bit for server to start
sleep 2

# Start client
cd ../client
echo "Starting client..."
npm run dev &
CLIENT_PID=$!

# Wait for both processes
wait
