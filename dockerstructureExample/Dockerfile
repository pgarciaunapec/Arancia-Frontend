# ============================================================================
# DOCKERFILE UNIFICADO - Soporta Development y Production
# Versión: 2.0 - DevOps Restructuring
# 
# Build Arguments:
#   - CONFIGURATION: Debug|Release (default: Release)
#   - ENVIRONMENT: Development|Production (default: Production)
# 
# Uso:
#   DEV:  docker build -t auth-api:dev \
#           --build-arg CONFIGURATION=Debug \
#           --build-arg ENVIRONMENT=Development .
#   PROD: docker build -t auth-api:latest .
# ============================================================================

# ============================================================================
# STAGE 1: RESTORE - Prepare dependencies
# ============================================================================
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS restore

WORKDIR /src

# Copy project files for dependency restoration
COPY Authentication.sln ./
COPY Authentication.Api/Authentication.Api.csproj ./Authentication.Api/
COPY Authentication.Application/Authentication.Application.csproj ./Authentication.Application/
COPY Authentication.Domain/Authentication.Domain.csproj ./Authentication.Domain/
COPY Authentication.Infrastructure/Authentication.Infrastructure.csproj ./Authentication.Infrastructure/

# Copy Secret_Dependency BEFORE restore (critical for custom assemblies)
COPY Secret_Dependency ./Secret_Dependency/

# Restore dependencies for all projects
RUN dotnet restore Authentication.Api/Authentication.Api.csproj && \
    dotnet restore Authentication.Application/Authentication.Application.csproj && \
    dotnet restore Authentication.Domain/Authentication.Domain.csproj && \
    dotnet restore Authentication.Infrastructure/Authentication.Infrastructure.csproj

# ============================================================================
# STAGE 2: BUILD - Compile the application
# ============================================================================
FROM restore AS build

WORKDIR /src

# Build arguments for flexibility
ARG CONFIGURATION=Release
ARG ENVIRONMENT=Production

# Copy entire source code
COPY . .

WORKDIR /src/Authentication.Api

# Build with configuration parameter
RUN dotnet build \
    -c ${CONFIGURATION} \
    --no-restore \
    --no-incremental

# Verify and ensure Secret_Dependency DLLs are in correct location
COPY scripts/validate_secret_dependency.sh /scripts/validate_secret_dependency.sh
RUN chmod +x /scripts/validate_secret_dependency.sh && \
        /scripts/validate_secret_dependency.sh && \
        cp /src/Secret_Dependency/GenericRepositoriesImplementation.dll /src/Authentication.Api/bin/${CONFIGURATION}/net7.0/ || true && \
        cp /src/Secret_Dependency/Encrypt.Dependency.dll /src/Authentication.Api/bin/${CONFIGURATION}/net7.0/ || true

# ============================================================================
# STAGE 3: DEVELOPMENT IMAGE - Hot reload with dotnet watch
# ============================================================================
FROM build AS development

WORKDIR /src/Authentication.Api

# Install development tools (git for dotnet watch, curl for health checks)
RUN apt-get update && \
    apt-get install -y curl git && \
    rm -rf /var/lib/apt/lists/*

# Environment variables for development
ENV ASPNETCORE_ENVIRONMENT=Development \
    ASPNETCORE_URLS=http://+:5239 \
    DOTNET_ENVIRONMENT=Development \
    DOTNET_USE_POLLING_FILE_WATCHER=true

EXPOSE 5239

# Hot reload development - directly run dotnet watch without extra script
# Volume mount will overlay source code at runtime
ENTRYPOINT ["dotnet", "watch", "run"]

# ============================================================================
# STAGE 4: PUBLISH - Prepare runtime artifacts
# ============================================================================
FROM build AS publish

ARG CONFIGURATION=Release

WORKDIR /src/Authentication.Api

# Publish creates optimized runtime-only output
RUN dotnet publish \
    -c ${CONFIGURATION} \
    -o /app/publish \
    --no-build

# ============================================================================
# STAGE 5: RUNTIME - Minimal production image
# ============================================================================
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS runtime

# Metadata labels
LABEL maintainer="MedicalPro DevOps Team"
LABEL application="Authentication Service"
LABEL version="2.0.0"
LABEL description="Authentication microservice for MedicalPro platform - Modern Docker standard"

WORKDIR /app

# Copy published application from publish stage
COPY --from=publish /app/publish .

# Security: Create non-root user
RUN useradd -m -u 1001 appuser && chown -R appuser:appuser /app
USER appuser

# Environment variables for production
ENV ASPNETCORE_ENVIRONMENT=Production \
    ASPNETCORE_URLS=http://+:5239 \
    DOTNET_ENVIRONMENT=Production \
    DOTNET_RUNNING_IN_CONTAINER=true

EXPOSE 5239

# Health check with proper error handling
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
    CMD curl -sf http://localhost:5239/health || exit 1

# Application entrypoint
ENTRYPOINT ["dotnet", "Authentication.Api.dll"]
