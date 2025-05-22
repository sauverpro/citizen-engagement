# CitizenSys - Citizen Complaint Management System

## Overview
CitizenSys is a modern web application built with React that facilitates citizen complaint management. The system provides different interfaces for citizens, agency representatives, and administrators, ensuring efficient complaint handling and resolution.

## System Workflow

### User Roles

1. **Citizens**
   - Can submit new complaints
   - Track their complaint status
   - View complaint history
   - Receive real-time updates on complaint status changes

2. **Agency Representatives**
   - View complaints assigned to their agency
   - Update complaint status
   - Respond to complaints
   - Track agency performance

3. **Administrators**
   - Manage user accounts
   - Create and manage agencies
   - Oversee all complaints
   - Access analytics dashboard
   - Assign complaints to agencies

### Key Features

#### Authentication & Authorization
- Secure login/registration system
- Role-based access control
- JWT token-based authentication
- Persistent sessions

#### Dashboard System
- **Citizen Dashboard**
  - Overview of submitted complaints
  - Quick access to submit new complaints
  - Status tracking
  - Complaint history

- **Agency Dashboard**
  - List of assigned cases
  - Case management interface
  - Response management
  - Performance metrics

- **Admin Dashboard**
  - Analytics overview
  - User management
  - Agency management
  - System-wide complaint monitoring

#### Complaint Management
1. **Submission Process**
   - Citizens fill complaint form
   - System validates and stores complaint
   - Notification sent to administrators

2. **Processing Flow**
   - Admin reviews complaint
   - Assigns to relevant agency
   - Agency processes complaint
   - Updates status (pending → assigned → in_progress → resolved)
   - Citizens receive real-time updates

#### Real-time Features
- WebSocket integration for live updates
- Real-time status changes
- Instant notifications
- Live data updates in dashboards

### Technical Architecture

#### Frontend Stack
- React (Frontend Framework)
- TailwindCSS (Styling)
- React Router (Navigation)
- Context API (State Management)
- WebSocket (Real-time Updates)

#### Key Components
1. **Layout Components**
   - Navbar
   - Sidebar (Responsive)
   - Page containers

2. **Common Components**
   - Table (Sortable, Filterable)
   - Forms
   - Modals
   - Status badges
   - Loading states

3. **Feature Components**
   - Complaint submission form
   - Agency assignment interface
   - User management interface
   - Analytics dashboard

### Directory Structure
```
src/
├── api/          # API integration
├── components/   # Reusable components
│   ├── common/   # Shared components
│   ├── layout/   # Layout components
│   └── feature/  # Feature-specific components
├── contexts/     # React contexts
├── hooks/        # Custom hooks
├── pages/        # Page components
│   ├── admin/    # Admin pages
│   ├── agency/   # Agency pages
│   ├── auth/     # Authentication pages
│   ├── citizen/  # Citizen pages
│   └── public/   # Public pages
└── utils/        # Utility functions
```

### Getting Started

1. **Installation**
   ```bash
   npm install
   ```

2. **Development**
   ```bash
   npm run dev
   ```

3. **Build**
   ```bash
   npm run build
   ```

### Environment Configuration
Create a `.env` file in the root directory:
```env
VITE_API_URL=your_backend_url
VITE_WS_URL=your_websocket_url
```

### Best Practices
1. **Code Organization**
   - Component-based architecture
   - Separation of concerns
   - Reusable components
   - Consistent naming conventions

2. **State Management**
   - Context API for global state
   - Local state for component-specific data
   - Proper data flow

3. **Styling**
   - TailwindCSS utility classes
   - Responsive design
   - Dark mode support
   - Consistent UI components

4. **Performance**
   - Lazy loading
   - Optimized re-renders
   - Efficient data fetching
   - Proper error handling

### Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

### License
MIT License - feel free to use this project for your own purposes.

### Deployment

#### 1. Backend Deployment (Render.com)

1. **Prerequisites**
   - [Render Account](https://render.com/signup)
   - Git repository with your code

2. **Deploy to Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" and select "Web Service"
   - Connect your GitHub repository
   - Configure the service:
     ```
     Name: citizensys-api
     Runtime: Node
     Build Command: npm install
     Start Command: npm start
     ```
   
3. **Environment Variables**
   Set the following in Render Dashboard:
   ```
   NODE_ENV=production
   JWT_SECRET=your_secure_jwt_secret
   PORT=8080
   ```

4. **Database Setup**
   - Render will automatically create a persistent disk at `/opt/render/project/src/data`
   - Your SQLite database will be stored here

5. **Note Your API URL**
   - Your API will be available at `https://citizensys-api.onrender.com` (or similar)
   - You'll need this URL for frontend configuration

#### 2. Frontend Deployment (Vercel)

1. **Prerequisites**
   - [Vercel Account](https://vercel.com/signup)
   - [Vercel CLI](https://vercel.com/cli) (Optional)
   ```bash
   npm install -g vercel
   ```

2. **Environment Setup**
   Add these environment variables in Vercel Dashboard:
   ```
   VITE_API_URL=https://citizensys-api.onrender.com
   VITE_WS_URL=wss://citizensys-api.onrender.com
   ```

3. **Automatic Deployment (Recommended)**
   - Fork/Clone this repository to your GitHub account
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Configure project settings:
     - Framework Preset: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install`
   - Add the environment variables from step 2
   - Click "Deploy"

4. **Manual Deployment (Using CLI)**
   ```bash
   # Login to Vercel
   vercel login

   # Deploy to Vercel
   vercel

   # Deploy to production
   vercel --prod
   ```

5. **Configuration**
   The `vercel.json` file is already configured for:
   - Client-side routing
   - Build settings
   - Framework specifications

6. **Custom Domain (Optional)**
   - Go to your project settings in Vercel Dashboard
   - Navigate to "Domains"
   - Add your custom domain
   - Follow DNS configuration instructions

7. **Continuous Deployment**
   Both Render and Vercel will automatically deploy when you:
   - Push to the main branch
   - Create/update a pull request

8. **Monitoring**
   - Monitor backend on Render Dashboard
   - Monitor frontend on Vercel Dashboard
   - Check deployment logs
   - Set up alerts (optional)
