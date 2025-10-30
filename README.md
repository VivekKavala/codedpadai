# CodedPadAI

A modern, secure sharing platform for storing, protecting, and sharing code snippets, text notes, and secrets. Built with Next.js 14, TypeScript, and Prisma.

## 🌟 Features

### Core Functionality

- **Create Pads**: Store code snippets, text notes, or any secret content
- **Multiple Visibility Options**:
  - **Public**: Anyone with the link can view
  - **Private**: Only the creator can access
  - **Protected**: Requires a passphrase to view
- **End-to-End Encryption**: AES-256 encryption for sensitive content
- **Secure Sharing**: Generate short, shareable links
- **Explore Community**: Browse public pads shared by others

### Security Features

- **AES-256-GCM Encryption**: Military-grade encryption for sensitive content
- **Password Hashing**: bcrypt for secure passphrase storage
- **XSS Protection**: Input sanitization with DOMPurify
- **Rate Limiting**: API protection against abuse
- **Input Validation**: Comprehensive validation for all user inputs

### Technical Features

- **Next.js 14 App Router**: Modern React framework with server components
- **TypeScript**: Full type safety throughout the application
- **Prisma ORM**: Type-safe database operations
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Beautiful, accessible UI components
- **Responsive Design**: Works on all devices

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd codedpadai
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/codedpadai?schema=public"

   # Encryption (generate a secure 32-character key)
   ENCRYPTION_KEY="your-32-character-encryption-key-here"
   ```

4. **Set up the database**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma db push
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
codedpadai/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── create/            # Create pad page
│   │   ├── explore/           # Explore public pads
│   │   ├── p/[id]/           # View individual pad
│   │   ├── api/               # API routes
│   │   └── page.tsx           # Landing page
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── CreatePadForm.tsx # Pad creation form
│   │   ├── ViewPad.tsx       # Pad viewing component
│   │   ├── ExplorePads.tsx   # Public pads explorer
│   │   └── ...               # Other components
│   ├── lib/                  # Utility functions
│   │   ├── actions.ts        # Server actions
│   │   ├── encryption.ts     # Encryption utilities
│   │   ├── security.ts       # Security helpers
│   │   ├── types.ts          # TypeScript types
│   │   └── prisma.ts         # Database client
│   └── generated/            # Generated Prisma client
├── prisma/
│   └── schema.prisma         # Database schema
└── public/                   # Static assets
```

## 🔧 Development

### Database Schema

The application uses two main models:

**User Model**

- `id`: Unique identifier
- `name`: Optional display name
- `email`: Unique email address
- `password`: Optional hashed password (for future auth)
- `createdAt`/`updatedAt`: Timestamps

**Pad Model**

- `id`: Unique identifier
- `title`: Pad title
- `content`: Encrypted or plain text content
- `visibility`: PUBLIC, PRIVATE, or PROTECTED
- `encrypted`: Boolean flag for encryption status
- `passphrase`: Optional hashed passphrase
- `views`: View counter
- `userId`: Optional foreign key to user
- `createdAt`/`updatedAt`: Timestamps

### API Endpoints

- `GET /api/rate-limit` - Check rate limiting status
- `POST /api/pads` - Create a new pad (via server actions)
- `GET /api/pads/[id]` - Get pad by ID (via server actions)

### Server Actions

- `createPad(data)` - Create a new pad with validation and encryption
- `getPad(id)` - Retrieve a pad by ID
- `getPublicPads(limit)` - Get public pads for explore page

## 🔒 Security

### Encryption

- **AES-256-GCM**: Used for content encryption
- **bcrypt**: Password hashing with salt rounds
- **Secure Key Management**: Environment-based encryption keys

### Input Validation

- **XSS Protection**: DOMPurify sanitization
- **Length Limits**: Title (200 chars), Content (100k chars)
- **Type Validation**: TypeScript + runtime validation

### Rate Limiting

- **In-Memory Limiter**: Simple rate limiting for development
- **Configurable Limits**: 10 requests per minute by default
- **IP-Based Tracking**: Client IP identification

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Set environment variables**:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `ENCRYPTION_KEY`: Your 32-character encryption key
3. **Deploy**: Vercel will automatically build and deploy

### Database Options

- **Supabase**: Free PostgreSQL hosting
- **Neon.tech**: Serverless PostgreSQL
- **Railway**: Simple PostgreSQL hosting
- **Self-hosted**: Any PostgreSQL instance

### Environment Variables

```env
# Required
DATABASE_URL="postgresql://..."
ENCRYPTION_KEY="your-32-character-key"

# Optional
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

## 🛠️ Customization

### Styling

- Modify `src/app/globals.css` for global styles
- Update Tailwind config in `tailwind.config.js`
- Customize shadcn/ui components in `src/components/ui/`

### Features

- Add new visibility types in `prisma/schema.prisma`
- Extend encryption in `src/lib/encryption.ts`
- Add new API routes in `src/app/api/`

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support, email support@codedpadai.com or create an issue in the repository.

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.
