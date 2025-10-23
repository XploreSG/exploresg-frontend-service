<!-- ENV -->
# ========================================
# ExploreSG Payment Service - Local Development
# ========================================
# This file is for LOCAL DEVELOPMENT ONLY
# DO NOT commit this file to version control!
# ========================================

# Application Configuration
SPRING_PROFILES_ACTIVE=dev
SERVER_PORT=8080

# Database Configuration
# For Docker Compose: use service name 'payment-db' and internal port 5432
# For local development (outside Docker): use 'localhost:5435'
SPRING_DATASOURCE_URL=jdbc:postgresql://payment-db:5432/exploresg-payment-service-db
SPRING_DATASOURCE_USERNAME=exploresguser
SPRING_DATASOURCE_PASSWORD=exploresgpass
SPRING_DATASOURCE_DRIVER_CLASS_NAME=org.postgresql.Driver
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_JPA_SHOW_SQL=true

# PostgreSQL Configuration (for Docker Compose)
POSTGRES_DB=exploresg-payment-service-db
POSTGRES_USER=exploresguser
POSTGRES_PASSWORD=exploresgpass
POSTGRES_PORT=5435

# Security - JWT Configuration
JWT_SECRET_KEY=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
JWT_EXPIRATION=86400000

# Logging Configuration
LOGGING_LEVEL_ROOT=INFO
LOGGING_LEVEL_COM_EXPLORESG=DEBUG

# Actuator & Monitoring
MANAGEMENT_ENDPOINTS_WEB_EXPOSURE_INCLUDE=health,info,metrics,prometheus
MANAGEMENT_ENDPOINT_HEALTH_SHOW_DETAILS=when-authorized

# Database Pool Configuration
SPRING_DATASOURCE_HIKARI_MAXIMUM_POOL_SIZE=10
SPRING_DATASOURCE_HIKARI_MINIMUM_IDLE=5

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8083
CORS_ALLOWED_METHODS=GET,POST,PUT,DELETE,OPTIONS
CORS_ALLOWED_HEADERS=*
CORS_ALLOW_CREDENTIALS=true

<!-- Applicatoin.properties -->
# ============================================
# ExploreSG Payment Service - Main Configuration
# ============================================

spring.application.name=exploresg-payment-service

# ============================================
# Server Configuration
# ============================================
server.port=${SERVER_PORT:8083}

# ============================================
# Database Configuration
# ============================================
spring.datasource.url=${SPRING_DATASOURCE_URL}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}
spring.datasource.driver-class-name=${SPRING_DATASOURCE_DRIVER_CLASS_NAME:org.postgresql.Driver}

# ============================================
# RabbitMQ Configuration
# ============================================
spring.rabbitmq.host=${RABBITMQ_HOST:localhost}
spring.rabbitmq.port=${RABBITMQ_PORT:5672}
spring.rabbitmq.username=${RABBITMQ_USERNAME:guest}
spring.rabbitmq.password=${RABBITMQ_PASSWORD:guest}
spring.rabbitmq.virtual-host=${RABBITMQ_VIRTUAL_HOST:/}

# Publisher confirms for reliability
spring.rabbitmq.publisher-confirm-type=correlated
spring.rabbitmq.publisher-returns=true

# JPA Configuration
spring.jpa.hibernate.ddl-auto=${SPRING_JPA_HIBERNATE_DDL_AUTO:update}
spring.jpa.show-sql=${SPRING_JPA_SHOW_SQL:false}
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.properties.hibernate.format_sql=true

# ============================================
# Custom JWT Configuration
# ============================================
application.security.jwt.secret-key=${JWT_SECRET_KEY}
application.security.jwt.expiration=${JWT_EXPIRATION:86400000}

# ============================================
# Logging Configuration
# ============================================
logging.level.root=${LOGGING_LEVEL_ROOT:INFO}
logging.level.com.exploresg=${LOGGING_LEVEL_COM_EXPLORESG:INFO}
logging.level.org.springframework.security=${LOGGING_LEVEL_SPRING_SECURITY:INFO}
logging.pattern.console=%d{yyyy-MM-dd HH:mm:ss} [%X{correlationId:-NO_CORRELATION_ID}] - %msg%n

# Logging file configuration (optional for local development)
logging.file.path=${LOG_PATH:logs}
logging.file.name=${LOG_PATH:logs}/exploresg-payment-service.log
logging.logback.rollingpolicy.max-file-size=10MB
logging.logback.rollingpolicy.max-history=30
logging.logback.rollingpolicy.total-size-cap=1GB

# ============================================
# Actuator & Monitoring
# ============================================
management.endpoints.web.exposure.include=${MANAGEMENT_ENDPOINTS_WEB_EXPOSURE_INCLUDE:health,info}
management.endpoint.health.show-details=${MANAGEMENT_ENDPOINT_HEALTH_SHOW_DETAILS:when-authorized}
management.endpoint.health.probes.enabled=true
management.health.livenessstate.enabled=true
management.health.readinessstate.enabled=true
management.prometheus.metrics.export.enabled=true

# ============================================
# CORS Configuration
# ============================================
# Note: These are custom properties read by SecurityConfig
cors.allowed-origins=${CORS_ALLOWED_ORIGINS:http://localhost:3000,http://localhost:8083}
cors.allowed-methods=${CORS_ALLOWED_METHODS:GET,POST,PUT,DELETE,OPTIONS}
cors.allowed-headers=${CORS_ALLOWED_HEADERS:Authorization,Content-Type}
cors.allow-credentials=${CORS_ALLOW_CREDENTIALS:true}

# ============================================
# Database Initialization
# ============================================
# Tell Spring to run the data.sql script AFTER Hibernate has created the tables
spring.jpa.defer-datasource-initialization=${SPRING_JPA_DEFER_DATASOURCE_INITIALIZATION:true}

# Always run data.sql on startup (use 'never' in production)
spring.sql.init.mode=${SPRING_SQL_INIT_MODE:always}

# ============================================
# Swagger/OpenAPI Configuration
# ============================================
springdoc.swagger-ui.path=/swagger-ui.html
springdoc.api-docs.path=/v3/api-docs
springdoc.swagger-ui.enabled=true
springdoc.swagger-ui.operationsSorter=alpha
springdoc.swagger-ui.tagsSorter=alpha
springdoc.swagger-ui.tryItOutEnabled=true



<!-- Docker Compose  -->
services:
  payment-db:
    image: postgres:15
    container_name: dev-exploresg-payment-service-db
    environment:
      POSTGRES_DB: exploresg-payment-service-service-db
      POSTGRES_USER: exploresguser
      POSTGRES_PASSWORD: exploresgpass
    ports:
      - "5435:5432" # Use a different host port (5435)
    volumes:
      - xpl-payment-pgdata:/var/lib/postgresql/data
    networks:
      - default # The DB only needs to talk to its own service
    restart: unless-stopped
    healthcheck:
      test:
        [
          "CMD-SHELL",
          "pg_isready -U exploresguser -d exploresg-payment-service-db",
        ]
      interval: 5s
      timeout: 5s
      retries: 5

  backend-payment-dev:
    build:
      context: .
    image: exploresg-payment-backend:dev
    container_name: dev-exploresg-payment-service
    depends_on:
      payment-db:
        condition: service_healthy
    env_file:
      - .env
    environment:
      # Override database URL for Docker network
      SPRING_DATASOURCE_URL: jdbc:postgresql://payment-db:5432/exploresg-payment-service-db
      SPRING_DATASOURCE_USERNAME: ${SPRING_DATASOURCE_USERNAME:-exploresguser}
      SPRING_DATASOURCE_PASSWORD: ${SPRING_DATASOURCE_PASSWORD:-exploresgpass}
      SPRING_PROFILES_ACTIVE: ${SPRING_PROFILES_ACTIVE:-dev}
      JWT_SECRET_KEY: ${JWT_SECRET_KEY}
    ports:
      - "8083:8080" # Map host port 8083 to container port 8080
    networks:
      - default
      - exploresg-network # Connect the app to the shared network
    restart: on-failure
    healthcheck:
      test:
        ["CMD", "curl", "-f", "http://localhost:8080/actuator/health/liveness"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

volumes:
  xpl-payment-pgdata:

# Define the shared network as external, connecting to the one we created
networks:
  exploresg-network:
    name: exploresg-net
    external: true


<!-- Dockerfile -->
# =============================================================================
# Multi-Stage Dockerfile for ExploreSG Payment Service
# Security Hardened for Production Kubernetes/EKS Deployment
# =============================================================================

# ---- Build Stage ----
FROM maven:3.9.9-eclipse-temurin-17-alpine AS builder

# Security: Run as non-root user during build
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

WORKDIR /app

# Security: Set ownership to non-root user
RUN chown -R appuser:appgroup /app

# Switch to non-root user for build
USER appuser

# Copy dependency definitions first (better layer caching)
COPY --chown=appuser:appgroup pom.xml .

# Download dependencies (cached layer if pom.xml doesn't change)
RUN mvn dependency:go-offline -B

# Copy source code
COPY --chown=appuser:appgroup src ./src

# Build the application
# -DskipTests: Tests should run in CI/CD, not during image build
# -Dmaven.javadoc.skip=true: Skip javadoc generation for faster builds
# -B: Batch mode (non-interactive)
RUN mvn clean package -DskipTests -Dmaven.javadoc.skip=true -B

# ---- Runtime Stage ----
FROM eclipse-temurin:17-jre-alpine

# Metadata labels for image tracking
LABEL maintainer="ExploreSG Platform Team" \
      application="exploresg-payment-service" \
      version="0.0.1-SNAPSHOT" \
      description="Payment microservice for ExploreSG platform" \
      org.opencontainers.image.source="https://github.com/XploreSG/exploresg-payment-service"

# Security: Install only essential security updates
RUN apk upgrade --no-cache && \
    apk add --no-cache \
    # Required for health checks
    curl \
    # Security: Remove apk cache
    && rm -rf /var/cache/apk/*

# Security: Create non-root user with specific UID/GID
# Using high UID to avoid conflicts with host systems
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Create application directory
WORKDIR /app

# Security: Create logs directory with proper permissions
RUN mkdir -p /app/logs /tmp/heapdumps && \
    chown -R appuser:appgroup /app /tmp/heapdumps && \
    chmod 755 /app /tmp/heapdumps

# Copy JAR from builder stage with proper ownership
COPY --from=builder --chown=appuser:appgroup /app/target/*.jar app.jar

# Security: Switch to non-root user
USER appuser

# Expose application port
EXPOSE 8080

# Health check for container orchestration
# This allows Kubernetes to determine if container is healthy
HEALTHCHECK --interval=30s \
            --timeout=5s \
            --start-period=60s \
            --retries=3 \
            CMD curl -f http://localhost:8080/actuator/health || exit 1

# Environment variables with secure defaults
ENV JAVA_OPTS="-XX:+UseContainerSupport \
               -XX:MaxRAMPercentage=75.0 \
               -XX:InitialRAMPercentage=50.0 \
               -XX:+UseG1GC \
               -XX:MaxGCPauseMillis=200 \
               -XX:+HeapDumpOnOutOfMemoryError \
               -XX:HeapDumpPath=/tmp/heapdumps/heapdump.hprof \
               -XX:+ExitOnOutOfMemoryError \
               -XX:+UseStringDeduplication \
               -Djava.security.egd=file:/dev/./urandom \
               -Dfile.encoding=UTF-8 \
               -Dsun.net.inetaddr.ttl=60 \
               -Duser.timezone=UTC"

# Application entrypoint
# Using exec form with shell wrapper for environment variable expansion
ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar app.jar"]