#!/bin/bash

# ============================================================
# AK Framework - Setup Script
# "Build Smart, Ship Fast" - AI-Orchestration Driven Development
# ============================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Banner
echo ""
echo -e "${CYAN}${BOLD}"
echo "    _    _  __  _____                                            _    "
echo "   / \  | |/ / |  ___| __ __ _ _ __ ___   _____      _____  _ __| | __"
echo "  / _ \ | ' /  | |_ | '__/ _\` | '_ \` _ \ / _ \ \ /\ / / _ \| '__| |/ /"
echo " / ___ \| . \  |  _|| | | (_| | | | | | |  __/\ V  V / (_) | |  |   < "
echo "/_/   \_\_|\_\ |_|  |_|  \__,_|_| |_| |_|\___| \_/\_/ \___/|_|  |_|\_\\"
echo -e "${NC}"
echo -e "${BOLD}  Build Smart, Ship Fast${NC} - AI-Orchestration Driven Development"
echo -e "  Optimized for Claude Opus 4.6 & Sonnet 4.6"
echo ""
echo "============================================================"
echo ""

# ============================================================
# Mode Selection
# ============================================================

MODE="${1:-}"

usage() {
    echo -e "${BOLD}Usage:${NC}"
    echo ""
    echo -e "  ${GREEN}./setup.sh init${NC}     Initialize AK Framework into current project"
    echo -e "  ${GREEN}./setup.sh new${NC}      Create a new project with AK Framework"
    echo -e "  ${GREEN}./setup.sh check${NC}    Check if current project has AK Framework"
    echo -e "  ${GREEN}./setup.sh update${NC}   Update AK Framework files (keeps memory)"
    echo ""
    echo -e "${BOLD}Examples:${NC}"
    echo ""
    echo "  # Add AK Framework to existing project"
    echo "  cd your-project && /path/to/AK-Framework/setup.sh init"
    echo ""
    echo "  # Create new project"
    echo "  ./setup.sh new my-awesome-app"
    echo ""
}

# ============================================================
# Helper Functions
# ============================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

check_prerequisites() {
    echo -e "${BLUE}Checking prerequisites...${NC}"
    echo ""

    local missing=0

    # Check Claude Code
    if command -v claude &> /dev/null; then
        echo -e "  ${GREEN}✓${NC} Claude Code CLI found"
    else
        echo -e "  ${RED}✗${NC} Claude Code CLI not found"
        echo -e "    Install: ${CYAN}npm install -g @anthropic-ai/claude-code${NC}"
        missing=1
    fi

    # Check Node.js
    if command -v node &> /dev/null; then
        local node_version=$(node --version)
        echo -e "  ${GREEN}✓${NC} Node.js ${node_version}"
    else
        echo -e "  ${RED}✗${NC} Node.js not found"
        echo -e "    Install: ${CYAN}https://nodejs.org${NC}"
        missing=1
    fi

    # Check Git
    if command -v git &> /dev/null; then
        echo -e "  ${GREEN}✓${NC} Git found"
    else
        echo -e "  ${RED}✗${NC} Git not found"
        missing=1
    fi

    # Optional checks
    if command -v pnpm &> /dev/null; then
        echo -e "  ${GREEN}✓${NC} pnpm found (recommended)"
    elif command -v npm &> /dev/null; then
        echo -e "  ${YELLOW}~${NC} npm found (pnpm recommended: ${CYAN}npm install -g pnpm${NC})"
    fi

    echo ""

    if [ $missing -eq 1 ]; then
        echo -e "${RED}Missing prerequisites. Please install them first.${NC}"
        exit 1
    fi

    echo -e "${GREEN}All prerequisites met!${NC}"
    echo ""
}

copy_framework_files() {
    local target_dir="$1"

    echo -e "${BLUE}Copying AK Framework files...${NC}"
    echo ""

    # Create .claude directory structure
    mkdir -p "$target_dir/.claude/commands"
    mkdir -p "$target_dir/.claude/agents"
    mkdir -p "$target_dir/.claude/skills"
    mkdir -p "$target_dir/.claude/memory"

    # Copy commands
    if [ -d "$SCRIPT_DIR/.claude/commands" ]; then
        cp -r "$SCRIPT_DIR/.claude/commands/"* "$target_dir/.claude/commands/" 2>/dev/null || true
        local cmd_count=$(ls -1 "$target_dir/.claude/commands/" 2>/dev/null | wc -l | tr -d ' ')
        echo -e "  ${GREEN}✓${NC} Commands: ${cmd_count} files"
    fi

    # Copy agents
    if [ -d "$SCRIPT_DIR/.claude/agents" ]; then
        cp -r "$SCRIPT_DIR/.claude/agents/"* "$target_dir/.claude/agents/" 2>/dev/null || true
        local agent_count=$(ls -1 "$target_dir/.claude/agents/" 2>/dev/null | wc -l | tr -d ' ')
        echo -e "  ${GREEN}✓${NC} Agents: ${agent_count} files"
    fi

    # Copy skills
    if [ -d "$SCRIPT_DIR/.claude/skills" ]; then
        cp -r "$SCRIPT_DIR/.claude/skills/"* "$target_dir/.claude/skills/" 2>/dev/null || true
        local skill_count=$(ls -1d "$target_dir/.claude/skills/"*/ 2>/dev/null | wc -l | tr -d ' ')
        echo -e "  ${GREEN}✓${NC} Skills: ${skill_count} directories"
    fi

    # Copy memory templates (only if not existing)
    for mem_file in active.md summary.md decisions.md architecture.md components.md changelog.md agents-log.md; do
        if [ ! -f "$target_dir/.claude/memory/$mem_file" ]; then
            if [ -f "$SCRIPT_DIR/.claude/memory/$mem_file" ]; then
                cp "$SCRIPT_DIR/.claude/memory/$mem_file" "$target_dir/.claude/memory/$mem_file"
            fi
        fi
    done
    echo -e "  ${GREEN}✓${NC} Memory templates initialized"

    # Copy CLAUDE.md
    if [ -f "$SCRIPT_DIR/CLAUDE.md" ]; then
        cp "$SCRIPT_DIR/CLAUDE.md" "$target_dir/CLAUDE.md"
        echo -e "  ${GREEN}✓${NC} CLAUDE.md"
    fi

    # Copy settings if exists
    if [ -f "$SCRIPT_DIR/.claude/settings.local.json" ]; then
        cp "$SCRIPT_DIR/.claude/settings.local.json" "$target_dir/.claude/settings.local.json"
        echo -e "  ${GREEN}✓${NC} settings.local.json"
    fi

    echo ""
}

setup_gitignore() {
    local target_dir="$1"

    if [ -f "$target_dir/.gitignore" ]; then
        # Check if AK Framework entries already exist
        if ! grep -q ".claude/memory/archive/" "$target_dir/.gitignore" 2>/dev/null; then
            echo "" >> "$target_dir/.gitignore"
            echo "# AK Framework - Memory archive" >> "$target_dir/.gitignore"
            echo ".claude/memory/archive/" >> "$target_dir/.gitignore"
            echo -e "  ${GREEN}✓${NC} Updated existing .gitignore"
        else
            echo -e "  ${YELLOW}~${NC} .gitignore already has AK entries"
        fi
    else
        cp "$SCRIPT_DIR/.gitignore" "$target_dir/.gitignore"
        echo -e "  ${GREEN}✓${NC} Created .gitignore"
    fi
}

# ============================================================
# Commands
# ============================================================

cmd_init() {
    local target_dir="${PWD}"

    echo -e "${BOLD}Initializing AK Framework in: ${CYAN}${target_dir}${NC}"
    echo ""

    check_prerequisites

    # Warn if already initialized
    if [ -d "$target_dir/.claude/agents" ] && [ -f "$target_dir/CLAUDE.md" ]; then
        echo -e "${YELLOW}Warning: AK Framework already detected in this project.${NC}"
        read -p "Overwrite? (keeps memory files) [y/N]: " confirm
        if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
            echo "Aborted."
            exit 0
        fi
    fi

    copy_framework_files "$target_dir"
    setup_gitignore "$target_dir"

    echo -e "${GREEN}${BOLD}AK Framework initialized successfully!${NC}"
    echo ""
    echo -e "${BOLD}Next steps:${NC}"
    echo -e "  1. ${CYAN}claude .${NC}             Open Claude Code"
    echo -e "  2. ${CYAN}/ak-help${NC}             See all commands"
    echo -e "  3. ${CYAN}/ak-vibe <project>${NC}   Start building!"
    echo ""
}

cmd_new() {
    local project_name="${2:-}"

    if [ -z "$project_name" ]; then
        echo -e "${RED}Error: Project name required${NC}"
        echo -e "Usage: ${GREEN}./setup.sh new <project-name>${NC}"
        exit 1
    fi

    if [ -d "$project_name" ]; then
        echo -e "${RED}Error: Directory '$project_name' already exists${NC}"
        exit 1
    fi

    echo -e "${BOLD}Creating new project: ${CYAN}${project_name}${NC}"
    echo ""

    check_prerequisites

    # Create project directory
    mkdir -p "$project_name"
    echo -e "  ${GREEN}✓${NC} Created directory: $project_name"

    # Initialize git
    cd "$project_name"
    git init -q
    echo -e "  ${GREEN}✓${NC} Initialized git repository"

    # Copy framework files
    copy_framework_files "$(pwd)"
    setup_gitignore "$(pwd)"

    cd - > /dev/null

    echo -e "${GREEN}${BOLD}Project '$project_name' created with AK Framework!${NC}"
    echo ""
    echo -e "${BOLD}Next steps:${NC}"
    echo -e "  1. ${CYAN}cd $project_name${NC}"
    echo -e "  2. ${CYAN}claude .${NC}             Open Claude Code"
    echo -e "  3. ${CYAN}/ak-help${NC}             See all commands"
    echo -e "  4. ${CYAN}/ak-vibe <project>${NC}   Start building!"
    echo ""
}

cmd_check() {
    echo -e "${BOLD}Checking AK Framework status...${NC}"
    echo ""

    local status=0

    # Check core files
    if [ -f "CLAUDE.md" ]; then
        echo -e "  ${GREEN}✓${NC} CLAUDE.md"
    else
        echo -e "  ${RED}✗${NC} CLAUDE.md"
        status=1
    fi

    # Check directories
    for dir in commands agents skills memory; do
        if [ -d ".claude/$dir" ]; then
            local count=$(ls -1 ".claude/$dir/" 2>/dev/null | wc -l | tr -d ' ')
            echo -e "  ${GREEN}✓${NC} .claude/$dir/ (${count} items)"
        else
            echo -e "  ${RED}✗${NC} .claude/$dir/"
            status=1
        fi
    done

    # Check specific agents
    echo ""
    echo -e "${BOLD}Agents:${NC}"
    for agent in plan-orchestrator ui-builder api-builder db-architect cache-engineer design-reviewer test-runner devops-engineer; do
        if [ -f ".claude/agents/$agent.md" ]; then
            echo -e "  ${GREEN}✓${NC} $agent"
        else
            echo -e "  ${RED}✗${NC} $agent"
            status=1
        fi
    done

    # Check memory files
    echo ""
    echo -e "${BOLD}Memory:${NC}"
    for mem in active.md summary.md decisions.md architecture.md components.md changelog.md agents-log.md; do
        if [ -f ".claude/memory/$mem" ]; then
            echo -e "  ${GREEN}✓${NC} $mem"
        else
            echo -e "  ${YELLOW}~${NC} $mem (missing - will be created on first run)"
        fi
    done

    echo ""
    if [ $status -eq 0 ]; then
        echo -e "${GREEN}${BOLD}AK Framework is properly installed!${NC}"
    else
        echo -e "${YELLOW}${BOLD}AK Framework is incomplete. Run './setup.sh init' to fix.${NC}"
    fi
}

cmd_update() {
    local target_dir="${PWD}"

    echo -e "${BOLD}Updating AK Framework in: ${CYAN}${target_dir}${NC}"
    echo ""

    if [ ! -f "$target_dir/CLAUDE.md" ] && [ ! -d "$target_dir/.claude" ]; then
        echo -e "${RED}Error: AK Framework not found in current directory.${NC}"
        echo -e "Use ${GREEN}./setup.sh init${NC} to install first."
        exit 1
    fi

    echo -e "${YELLOW}This will update commands, agents, skills, and CLAUDE.md${NC}"
    echo -e "${GREEN}Memory files will be preserved.${NC}"
    echo ""
    read -p "Continue? [y/N]: " confirm
    if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
        echo "Aborted."
        exit 0
    fi

    echo ""

    # Update commands
    if [ -d "$SCRIPT_DIR/.claude/commands" ]; then
        cp -r "$SCRIPT_DIR/.claude/commands/"* "$target_dir/.claude/commands/" 2>/dev/null || true
        echo -e "  ${GREEN}✓${NC} Commands updated"
    fi

    # Update agents
    if [ -d "$SCRIPT_DIR/.claude/agents" ]; then
        cp -r "$SCRIPT_DIR/.claude/agents/"* "$target_dir/.claude/agents/" 2>/dev/null || true
        echo -e "  ${GREEN}✓${NC} Agents updated"
    fi

    # Update skills
    if [ -d "$SCRIPT_DIR/.claude/skills" ]; then
        cp -r "$SCRIPT_DIR/.claude/skills/"* "$target_dir/.claude/skills/" 2>/dev/null || true
        echo -e "  ${GREEN}✓${NC} Skills updated"
    fi

    # Update CLAUDE.md
    if [ -f "$SCRIPT_DIR/CLAUDE.md" ]; then
        cp "$SCRIPT_DIR/CLAUDE.md" "$target_dir/CLAUDE.md"
        echo -e "  ${GREEN}✓${NC} CLAUDE.md updated"
    fi

    echo ""
    echo -e "${GREEN}${BOLD}AK Framework updated! Memory files preserved.${NC}"
    echo ""
}

# ============================================================
# Main
# ============================================================

case "${MODE}" in
    init)
        cmd_init
        ;;
    new)
        cmd_new "$@"
        ;;
    check)
        cmd_check
        ;;
    update)
        cmd_update
        ;;
    *)
        usage
        ;;
esac
