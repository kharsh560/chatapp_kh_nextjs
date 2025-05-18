Chatapp using pure Web Sockets | Mar 2025 - Present

-> Architected full-stack chat app based on Next.Js whose user registration was done using prisma as ORM and session-management was done using NextAuth. 

-> For handling messages and groups, built a robust server which handles both, HTTP as well as Websocket requests where WebSocket was used for real-time features. Most importantly, made the socket connection secure using custom auth where in, first of all, a normal http request is sent to server, which after validation, sends back a short-lived access token using which a WebSocket connection is established. It was needed due to auth problems with “ws” library. 

-> Self implemented each of the logic of ingress, egress, messages, alerts etc using the scoket logics in backend at "ws.on("message" () => {})".

-> Used formidable for file handling.

-> Designed and developed a responsive, sleek and sophisticated UI using Tailwind CSS and Framer Motion for smooth animations.

<img width="1436" alt="Screenshot 2025-05-18 at 12 17 08 PM" src="https://github.com/user-attachments/assets/491a3588-2e24-45dc-9e20-521c4f1df37b" />

<img width="1436" alt="Screenshot 2025-05-18 at 12 17 23 PM" src="https://github.com/user-attachments/assets/19d97a23-b6d1-442e-a8d3-692e1ef90d63" />

<img width="1436" alt="Screenshot 2025-05-18 at 12 17 32 PM" src="https://github.com/user-attachments/assets/31e6f5e8-79f6-43e4-b178-39b6a276adad" />

<img width="1436" alt="Screenshot 2025-05-18 at 12 18 22 PM" src="https://github.com/user-attachments/assets/8a3512dc-abb0-4473-8731-74f73fcc176e" />

