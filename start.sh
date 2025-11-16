#!/bin/bash

# Hubbard Inn Demo - Complete System Startup Script
# This script handles dependency installation, database setup, and service startup

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Print colored output
print_info() {
    echo -e "${BLUE}ℹ ${NC}$1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_header() {
    echo -e "\n${CYAN}═══════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}  $1${NC}"
    echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}\n"
}

# Check Node.js version
check_node() {
    print_header "Checking Node.js Version"

    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        print_info "Please install Node.js ≥20.0.0 from https://nodejs.org"
        exit 1
    fi

    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)

    if [ "$NODE_VERSION" -lt 20 ]; then
        print_error "Node.js version is $NODE_VERSION, but ≥20 is required"
        print_info "Please upgrade Node.js from https://nodejs.org"
        exit 1
    fi

    print_success "Node.js $(node -v) detected"
}

# Check pnpm installation
check_pnpm() {
    print_header "Checking pnpm"

    if ! command -v pnpm &> /dev/null; then
        print_error "pnpm is not installed"
        print_info "Installing pnpm globally..."
        npm install -g pnpm
        print_success "pnpm installed successfully"
    else
        print_success "pnpm $(pnpm -v) detected"
    fi
}

# Check environment files
check_env_files() {
    print_header "Checking Environment Files"

    ENV_MISSING=false

    # Check root .env
    if [ ! -f ".env" ]; then
        print_warning "Root .env file not found"
        ENV_MISSING=true
    else
        print_success "Root .env found"
    fi

    # Check API .env
    if [ ! -f "packages/api/.env" ]; then
        print_warning "packages/api/.env not found"
        ENV_MISSING=true
    else
        print_success "packages/api/.env found"
    fi

    # Check web-admin .env
    if [ ! -f "packages/web-admin/.env" ]; then
        print_warning "packages/web-admin/.env not found"
        ENV_MISSING=true
    else
        print_success "packages/web-admin/.env found"
    fi

    # Check web-customer .env
    if [ ! -f "packages/web-customer/.env" ]; then
        print_warning "packages/web-customer/.env not found"
        ENV_MISSING=true
    else
        print_success "packages/web-customer/.env found"
    fi

    # Check web-promoter .env
    if [ ! -f "packages/web-promoter/.env" ]; then
        print_warning "packages/web-promoter/.env not found"
        ENV_MISSING=true
    else
        print_success "packages/web-promoter/.env found"
    fi

    if [ "$ENV_MISSING" = true ]; then
        echo ""
        print_warning "Some .env files are missing!"
        print_info "Please copy .env.example files to .env and configure them:"
        echo ""
        echo "  cp .env.example .env"
        echo "  cp packages/api/.env.example packages/api/.env"
        echo "  cp packages/web-admin/.env.example packages/web-admin/.env"
        echo "  cp packages/web-customer/.env.example packages/web-customer/.env"
        echo "  cp packages/web-promoter/.env.example packages/web-promoter/.env"
        echo ""
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
}

# Install dependencies
install_dependencies() {
    print_header "Installing Dependencies"

    print_info "Running pnpm install..."
    pnpm install

    print_success "Dependencies installed successfully"
}

# Setup database
setup_database() {
    print_header "Setting Up Database"

    # Check if DATABASE_URL is set
    if [ -f "packages/api/.env" ]; then
        if grep -q "DATABASE_URL" packages/api/.env; then
            print_info "Generating database migrations..."
            pnpm db:generate || print_warning "Migration generation skipped (no schema changes)"

            print_info "Running database migrations..."
            pnpm db:migrate

            print_success "Database setup complete"
        else
            print_warning "DATABASE_URL not found in packages/api/.env"
            print_info "Skipping database migration. Set DATABASE_URL and run 'pnpm db:migrate' manually."
        fi
    else
        print_warning "packages/api/.env not found, skipping database setup"
    fi
}

# Start all services
start_services() {
    print_header "Starting All Services"

    print_info "Launching all services in development mode..."
    echo ""
    print_info "Services will be available at:"
    echo "  • Admin Portal:    ${CYAN}http://localhost:3000${NC}"
    echo "  • Customer Portal: ${CYAN}http://localhost:3001${NC}"
    echo "  • Promoter Portal: ${CYAN}http://localhost:3002${NC}"
    echo "  • API Server:      ${CYAN}http://localhost:4000${NC}"
    echo ""
    print_info "Press Ctrl+C to stop all services"
    echo ""

    # Start all services
    pnpm dev:all
}

# Print welcome message
print_welcome() {
    clear
    echo -e "${CYAN}"
    echo "╔═══════════════════════════════════════════════════════════╗"
    echo "║                                                           ║"
    echo "║         🎫  HUBBARD INN DEMO - SYSTEM STARTUP  🎫        ║"
    echo "║                                                           ║"
    echo "╚═══════════════════════════════════════════════════════════╝"
    echo -e "${NC}\n"
}

# Print completion message
print_completion() {
    echo ""
    print_header "Setup Complete!"

    echo -e "${GREEN}All systems ready!${NC}\n"

    print_info "Quick Development Tips:"
    echo "  • Run individual services:"
    echo "    - pnpm dev:admin     (Admin Portal)"
    echo "    - pnpm dev:customer  (Customer Portal)"
    echo "    - pnpm dev:promoter  (Promoter Portal)"
    echo "    - pnpm dev:api       (API Server)"
    echo ""
    echo "  • Database management:"
    echo "    - pnpm db:studio     (Drizzle Studio UI)"
    echo "    - pnpm db:migrate    (Run migrations)"
    echo ""
    echo "  • Build for production:"
    echo "    - pnpm build         (Build all packages)"
    echo ""
}

# Main execution
main() {
    print_welcome

    # Pre-flight checks
    check_node
    check_pnpm
    check_env_files

    # Setup
    install_dependencies
    setup_database

    print_completion

    # Start services
    start_services
}

# Run main function
main
