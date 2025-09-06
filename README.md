# Amazon Chime SDK Meeting App - Vercel Edition

This is a Vercel-optimized version of the Amazon Chime SDK Meeting application that uses Vercel's serverless functions and Next.js.

## 🚀 Features

- **Serverless Architecture**: Uses Vercel's serverless functions for AWS API calls
- **Next.js Framework**: Modern React framework with automatic routing
- **AWS Chime SDK**: Full-featured video meetings with audio, video, and screen sharing
- **Real-time Communication**: Voice Focus, Echo Reduction, and chat functionality
- **Responsive Design**: Works on desktop and mobile devices

## 📋 Prerequisites

- Node.js 18+ installed
- AWS account with Chime SDK access
- Vercel account (for deployment)
- Valid AWS credentials

## 🛠️ Local Development Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure AWS credentials**:
   Copy `env.example` to `.env.local` and fill in your AWS credentials:
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local`:
   ```
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=us-east-1
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:3000`

## 🌐 Vercel Deployment

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy to Vercel**:
   ```bash
   vercel
   ```

3. **Configure environment variables in Vercel**:
   - Go to your Vercel dashboard
   - Select your project
   - Go to Settings → Environment Variables
   - Add your AWS credentials:
     - `AWS_ACCESS_KEY_ID`
     - `AWS_SECRET_ACCESS_KEY`
     - `AWS_REGION`

## 🏗️ Architecture

- **Frontend**: Next.js with React components
- **Backend**: Vercel serverless functions (`/pages/api/`)
- **AWS Integration**: Chime SDK for meeting management
- **State Management**: React Context and hooks

## 📁 Project Structure

```
├── pages/
│   ├── api/              # Vercel serverless functions
│   │   ├── join.ts       # Create/join meeting
│   │   ├── attendee.ts   # Get attendee info
│   │   ├── end.ts        # End meeting
│   │   └── logs.ts       # Logging endpoint
│   ├── index.tsx         # Home page
│   ├── devices.tsx       # Device setup
│   └── meeting.tsx       # Meeting room
├── src/                  # React components and utilities
│   ├── components/       # Reusable UI components
│   ├── views/           # Page components
│   ├── utils/           # Helper functions
│   └── providers/       # React context providers
└── vercel.json          # Vercel configuration
```

## 🔧 API Endpoints

- `POST /api/join` - Create or join a meeting
- `GET /api/attendee` - Get attendee information
- `POST /api/end` - End a meeting
- `POST /api/logs` - Receive client logs

## 🔒 Security Notes

- AWS credentials are stored as environment variables
- Never commit `.env.local` to version control
- Use Vercel's environment variable management for production
- Consider using AWS IAM roles for enhanced security

## 🛠️ Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run vercel-dev   # Start Vercel development environment
```

## 📱 Features Included

- ✅ Audio/Video calling
- ✅ Screen sharing
- ✅ Chat messaging
- ✅ Device selection
- ✅ Voice Focus (noise suppression)
- ✅ Echo Reduction
- ✅ Meeting management
- ✅ Responsive design

## 🤝 Contributing

This project follows AWS best practices and maintains compatibility with the original Amazon Chime SDK sample application.

## 📄 License

This project is licensed under the MIT-0 License - see the [LICENSE](LICENSE) file for details.
