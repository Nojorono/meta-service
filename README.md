# 🚀 Meta Service

**Meta Service** adalah NestJS microservice yang menyediakan master data management dari Meta system. Service ini berfungsi sebagai central data provider untuk entitas Customer, Branch, Region, Employee, dan GeoTree.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

## ✨ Features

- **🏗️ Microservice Architecture** dengan RabbitMQ message broker
- **🗄️ Oracle Database Integration** dengan connection pooling
- **⚡ Redis Caching** untuk performance optimization
- **📚 Swagger API Documentation** untuk testing dan dokumentasi
- **🔐 JWT Authentication** ready
- **🌐 RESTful API** dan Message Pattern support
- **📊 Health Checks** dengan monitoring
- **🔄 Auto-reconnection** untuk database dan cache
- **🚦 Rate Limiting** dan error handling
- **📝 Comprehensive Logging** dengan structured format

## 🛠️ Tech Stack

- **Framework**: NestJS v10
- **Language**: TypeScript
- **Database**: Oracle Database
- **Cache**: Redis
- **Message Queue**: RabbitMQ
- **ORM**: TypeORM + Prisma
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **Containerization**: Docker

## 📋 Prerequisites

- Node.js (v18 or higher)
- Yarn package manager
- Oracle Database (11g or higher)
- Redis Server
- RabbitMQ Server
- Oracle Instant Client

## 🚀 Installation

1. **Clone repository:**
```bash
git clone https://github.com/yourusername/meta-service.git
cd meta-service
```

2. **Install dependencies:**
```bash
yarn install
```

3. **Setup Oracle Instant Client:**
```bash
# Download Oracle Instant Client
# Extract to D:\path\your\location\instantclient_23_6
# Add to Windows PATH or set ORACLE_INSTANT_CLIENT_PATH environment variable
```

4. **Configure environment:**
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

## ⚙️ Configuration

Buat file `.env.local` dengan konfigurasi berikut:

```env
# Application
APP_NAME="@service/meta"
APP_ENV="development"

# HTTP Server
HTTP_ENABLE=true
HTTP_HOST="0.0.0.0"
HTTP_PORT=9000

# Database
DATABASE_TYPE="oracle"
DATABASE_HOST="your-oracle-host"
DATABASE_PORT="1521"
DATABASE_USERNAME="your-username"
DATABASE_PASSWORD="your-password"
DATABASE_SID="your-sid"

# Redis
REDIS_HOST="localhost"
REDIS_PORT="6379"
REDIS_PASSWORD="redis-password"

# RabbitMQ
RABBITMQ_URL="amqp://guest:guest@localhost:5672"

# Oracle Instant Client
ORACLE_INSTANT_CLIENT_PATH="path-oracle-instan-client"
```

## 🎯 Usage

### **Development Mode**
```bash
yarn dev
```

### **Production Mode**
```bash
yarn build
yarn start:prod
```

### **Access Points**
- **API**: `http://localhost:9000/api/v1`
- **Swagger UI**: `http://localhost:9000/docs`
- **Health Check**: `http://localhost:9000/health`

## 📖 API Documentation

### **Available Endpoints**

#### 👥 Customer API
- `GET /api/v1/customer` - Get all customers with pagination
- `GET /api/v1/customer/by-date` - Get customers by date
- `GET /api/v1/customer/{id}` - Get customer by ID

#### 🏢 Branch API
- `GET /api/v1/branch` - Get all branches
- `GET /api/v1/branch/by-date` - Get branches by date

#### 🌍 Region API
- `GET /api/v1/region` - Get all regions
- `GET /api/v1/region/by-date` - Get regions by date
- `GET /api/v1/region/{code}` - Get region by code

#### 👤 Employee API
- `GET /api/v1/employee` - Get all employees
- `GET /api/v1/employee/by-date` - Get employees by date
- `GET /api/v1/employee/{employeeNumber}` - Get employee by number

#### 🌐 GeoTree API
- `GET /api/v1/geotree` - Get all geotrees
- `GET /api/v1/geotree/by-date` - Get geotrees by date

### **Interactive Testing**
Gunakan Swagger UI untuk testing interaktif: `http://localhost:9000/docs`

## 🔧 Development

### **Project Structure**
```
src/
├── common/           # Shared utilities dan services
├── config/           # Configuration files
├── modules/          # Feature modules
│   ├── customer/     # Customer module
│   ├── branch/       # Branch module
│   ├── region/       # Region module
│   ├── employee/     # Employee module
│   └── geotree/      # GeoTree module
├── decorators/       # Custom decorators
├── filters/          # Exception filters
├── guards/           # Authentication guards
├── interceptors/     # Request/response interceptors
├── middlewares/      # Custom middlewares
└── main.ts          # Application entry point
```

### **Available Scripts**
```bash
# Development
yarn dev              # Start development server
yarn build            # Build for production
yarn start:prod       # Start production server

# Code Quality
yarn lint             # Run ESLint
yarn format           # Format code with Prettier
yarn type-check       # TypeScript type checking

# Testing
yarn test             # Run unit tests
yarn test:watch       # Run tests in watch mode
yarn test:coverage    # Generate coverage report
yarn test:e2e         # Run e2e tests

# Database
yarn prisma:generate  # Generate Prisma client
yarn prisma:migrate   # Run database migrations
```

## 🧪 Testing

### **Unit Tests**
```bash
yarn test
```

### **E2E Tests**
```bash
yarn test:e2e
```

## 🐳 Deployment

### **Using Docker**
```bash
# Build image
docker build -t meta-service .

# Run container
docker run -p 9000:9000 meta-service
```

### **Using Docker Compose**
```bash
docker-compose up -d
```

### **Environment Variables**
Pastikan semua environment variables sudah diset dengan benar untuk production.

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

Jika Anda mengalami masalah atau memiliki pertanyaan:

1. Check [Issues](https://github.com/yourusername/sofia-meta-service/issues)
2. Create new issue jika belum ada
3. Hubungi tim development

## 🔗 Links

- [NestJS Documentation](https://docs.nestjs.com/)
- [Oracle Database Documentation](https://docs.oracle.com/database/)
- [Redis Documentation](https://redis.io/documentation)
- [RabbitMQ Documentation](https://www.rabbitmq.com/documentation.html)

---

Made with ❤️ by Downstream Team