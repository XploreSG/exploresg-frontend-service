<!-- env -->
# ============================================
# ExploreSG Booking Service - Environment Variables
# ============================================
# Development Environment Configuration

# ============================================
# Application Configuration
# ============================================
SPRING_PROFILES_ACTIVE=dev
SERVER_PORT=8080

# ============================================
# Database Configuration
# ============================================
SPRING_DATASOURCE_URL=jdbc:postgresql://booking-db:5432/exploresg-booking-service-db
SPRING_DATASOURCE_USERNAME=exploresguser
SPRING_DATASOURCE_PASSWORD=exploresgpass
SPRING_DATASOURCE_DRIVER_CLASS_NAME=org.postgresql.Driver

# ============================================
# JPA/Hibernate Configuration
# ============================================
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_JPA_SHOW_SQL=true
SPRING_JPA_PROPERTIES_HIBERNATE_FORMAT_SQL=true

# ============================================
# Database Initialization
# ============================================
SPRING_JPA_DEFER_DATASOURCE_INITIALIZATION=true
SPRING_SQL_INIT_MODE=always

# ============================================
# PostgreSQL Configuration (for Docker Compose)
# ============================================
POSTGRES_DB=exploresg-booking-service-db
POSTGRES_USER=exploresguser
POSTGRES_PASSWORD=exploresgpass

# ============================================
# JWT Configuration
# ============================================
JWT_SECRET_KEY=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
JWT_EXPIRATION=86400000
JWT_REFRESH_EXPIRATION=604800000

# ============================================
# Logging Configuration
# ============================================
LOGGING_LEVEL_ROOT=INFO
LOGGING_LEVEL_COM_EXPLORESG=DEBUG
LOGGING_LEVEL_SPRING_SECURITY=DEBUG
LOGGING_LEVEL_SPRING_WEB=DEBUG

# Logging file configuration
LOG_PATH=logs
LOGGING_FILE_NAME=logs/exploresg-booking-service.log

# ============================================
# Actuator & Monitoring
# ============================================
MANAGEMENT_ENDPOINTS_WEB_EXPOSURE_INCLUDE=*
MANAGEMENT_ENDPOINT_HEALTH_SHOW_DETAILS=always

# ============================================
# Swagger/OpenAPI Configuration
# ============================================
SPRINGDOC_SWAGGER_UI_ENABLED=true

# ============================================
# CORS Configuration
# ============================================
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8082,http://localhost:8080
CORS_ALLOWED_METHODS=GET,POST,PUT,DELETE,OPTIONS
CORS_ALLOWED_HEADERS=Authorization,Content-Type
CORS_ALLOW_CREDENTIALS=true

<!-- Docker Compose -->
services:
  booking-db:
    image: postgres:15
    container_name: dev-exploresg-booking-db
    environment:
      POSTGRES_DB: exploresg-booking-service-db
      POSTGRES_USER: exploresguser
      POSTGRES_PASSWORD: exploresgpass
    ports:
      - "5434:5432" # External port 5434 maps to internal port 5432
    volumes:
      - xpl-booking-pgdata:/var/lib/postgresql/data
    networks:
      - default # The DB only needs to talk to its own service
    restart: unless-stopped
    healthcheck:
      test:
        [
          "CMD-SHELL",
          "pg_isready -U exploresguser -d exploresg-booking-service-db",
        ]
      interval: 5s
      timeout: 5s
      retries: 5

  backend-booking-dev:
    build:
      context: .
    image: exploresg-booking-backend:dev
    container_name: dev-exploresg-booking-service
    depends_on:
      booking-db:
        condition: service_healthy
    env_file:
      - .env
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://booking-db:5432/exploresg-booking-service-db
      SPRING_DATASOURCE_USERNAME: exploresguser
      SPRING_DATASOURCE_PASSWORD: exploresgpass
      SERVER_PORT: 8080
    ports:
      - "8082:8080" # External port 8082 maps to internal port 8080
    networks:
      - default
      - exploresg-network # Connect the app to the shared network
    restart: on-failure

volumes:
  xpl-booking-pgdata:

# Define the shared network as external, connecting to the one we created
networks:
  exploresg-network:
    name: exploresg-net
    external: true

<!-- Dockerfile -->
# =============================================================================
# Multi-Stage Dockerfile for ExploreSG Booking Service
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
      application="exploresg-booking-service" \
      version="0.0.1-SNAPSHOT" \
      description="Booking microservice for ExploreSG platform" \
      org.opencontainers.image.source="https://github.com/XploreSG/exploresg-booking-service"

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

# Expose application port (container internal port)
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


<!-- Application.properties -->

# ============================================
# ExploreSG Booking Service - Main Configuration
# ============================================
# All sensitive values are externalized via environment variables
# See .env.example for all available configuration options

spring.application.name=exploresg-booking-service

# ============================================
# Server Configuration
# ============================================
server.port=${SERVER_PORT:8082}

# ============================================
# Database Configuration
# ============================================
spring.datasource.url=${SPRING_DATASOURCE_URL:jdbc:postgresql://localhost:5434/exploresg-booking-service-db}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME:exploresguser}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD:exploresgpass}
spring.datasource.driver-class-name=${SPRING_DATASOURCE_DRIVER_CLASS_NAME:org.postgresql.Driver}

# ============================================
# JPA/Hibernate Configuration
# ============================================
spring.jpa.hibernate.ddl-auto=${SPRING_JPA_HIBERNATE_DDL_AUTO:update}
spring.jpa.show-sql=${SPRING_JPA_SHOW_SQL:false}
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.properties.hibernate.format_sql=${SPRING_JPA_PROPERTIES_HIBERNATE_FORMAT_SQL:true}

# ============================================
# Database Initialization
# ============================================
spring.jpa.defer-datasource-initialization=${SPRING_JPA_DEFER_DATASOURCE_INITIALIZATION:true}
spring.sql.init.mode=${SPRING_SQL_INIT_MODE:always}

# ============================================
# JWT Configuration
# ============================================
application.security.jwt.secret-key=${JWT_SECRET_KEY}
application.security.jwt.expiration=${JWT_EXPIRATION:86400000}
application.security.jwt.refresh-token.expiration=${JWT_REFRESH_EXPIRATION:604800000}

# ============================================
# Logging Configuration
# ============================================
logging.level.root=${LOGGING_LEVEL_ROOT:INFO}
logging.level.com.exploresg=${LOGGING_LEVEL_COM_EXPLORESG:DEBUG}
logging.level.org.springframework.security=${LOGGING_LEVEL_SPRING_SECURITY:DEBUG}
logging.level.org.springframework.web=${LOGGING_LEVEL_SPRING_WEB:INFO}

# Logging file configuration (optional for local development)
logging.file.path=${LOG_PATH:logs}
logging.file.name=${LOGGING_FILE_NAME:logs/exploresg-booking-service.log}
logging.logback.rollingpolicy.max-file-size=10MB
logging.logback.rollingpolicy.max-history=30
logging.logback.rollingpolicy.total-size-cap=1GB

# ============================================
# Swagger/OpenAPI Configuration
# ============================================
springdoc.swagger-ui.path=/swagger-ui.html
springdoc.api-docs.path=/v3/api-docs
springdoc.swagger-ui.enabled=${SPRINGDOC_SWAGGER_UI_ENABLED:true}
springdoc.swagger-ui.operationsSorter=alpha
springdoc.swagger-ui.tagsSorter=alpha
springdoc.swagger-ui.tryItOutEnabled=true

# ============================================
# Actuator & Monitoring
# ============================================
management.endpoints.web.exposure.include=${MANAGEMENT_ENDPOINTS_WEB_EXPOSURE_INCLUDE:health,info,metrics,prometheus}
management.endpoint.health.show-details=${MANAGEMENT_ENDPOINT_HEALTH_SHOW_DETAILS:when-authorized}
management.prometheus.metrics.export.enabled=true

# Kubernetes Health Probes
management.endpoint.health.probes.enabled=true
management.health.livenessstate.enabled=true
management.health.readinessstate.enabled=true
management.endpoint.health.show-components=always
management.endpoint.health.group.liveness.include=livenessState
management.endpoint.health.group.readiness.include=readinessState,db

# ============================================
# CORS Configuration
# ============================================
cors.allowed-origins=${CORS_ALLOWED_ORIGINS:http://localhost:3000,http://localhost:8082}
cors.allowed-methods=${CORS_ALLOWED_METHODS:GET,POST,PUT,DELETE,OPTIONS}
cors.allowed-headers=${CORS_ALLOWED_HEADERS:Authorization,Content-Type}
cors.allow-credentials=${CORS_ALLOW_CREDENTIALS:true}
