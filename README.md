# CCM Analytics & Contact API

Backend service powering the **CCM platform**.  
This API handles analytics event ingestion, attribution tracking, and contact form submissions with spam filtering and workflow automation.

<br>

# System Role

| Layer            | Responsibility                                  |
| ---------------- | ----------------------------------------------- |
| **Frontend**     | Next.js applications (`ccm-site`, `ccm-portal`) |
| **Backend**      | Node.js / Express API (this repository)         |
| **Database**     | MongoDB / MongoDB Atlas                         |
| **Integrations** | Gemini AI, Asana API                            |

<br>

# Core Features

| Area                   | Capabilities                                                                                                                            |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **Analytics**          | Anonymous visit tracking<br>UTM attribution capture<br>Button click event logging<br>Session deduplication<br>MongoDB analytics storage |
| **Contact Automation** | Contact form ingestion<br>AI-assisted spam filtering<br>MongoDB blacklist validation<br>Automated task creation in Asana                |
| **Event Tracking**     | Visit attribution capture<br>UI interaction tracking<br>Event ingestion API                                                             |

<br>

# API Routes

| Method | Route                     | Purpose                                                                                |
| ------ | ------------------------- | -------------------------------------------------------------------------------------- |
| GET    | `/health`                 | Health check endpoint for monitoring service uptime                                    |
| POST   | `/contact`                | Handles portfolio contact form submissions with spam filtering and workflow automation |
| POST   | `/tracking/website-visit` | Logs initial page visit and generates an anonymous session ID                          |
| POST   | `/tracking/button-click`  | Records UI interaction events tied to a visit session                                  |

<br>

# Tech Stack

| Category           | Technologies           |
| ------------------ | ---------------------- |
| **Runtime**        | Node.js                |
| **Framework**      | Express                |
| **Language**       | TypeScript             |
| **Database**       | MongoDB, MongoDB Atlas |
| **AI Integration** | Google Gemini          |
| **Automation**     | Asana API              |

<br>

# CCM Platform Repositories

| Repository     | Purpose                        |
| -------------- | ------------------------------ |
| **ccm-site**   | Next.js portfolio frontend     |
| **ccm-portal** | Next.js portal dashboard       |
| **ccm-api**    | Analytics + automation backend |

| Repo         | Link                                        |
| ------------ | ------------------------------------------- |
| CCM Frontend | https://github.com/coreycollinsm/ccm-site   |
| CCM Portal   | https://github.com/coreycollinsm/ccm-portal |

<br>

# AI Usage Note

AI tools are occasionally used for research, debugging assistance, and code cleanup tasks.

All implementation decisions, architecture, and final code are written and reviewed manually before being added to the repository.

Yes — the emojis are intentional 🙂
