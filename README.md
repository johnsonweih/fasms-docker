# Overview

This project is a Dockerized application that includes a Node.js backend, MySQL database, and phpMyAdmin for database management. The Docker images for the application components are hosted on Docker Hub.

## Prerequisites

1. **Docker Desktop**: Ensure Docker Desktop is installed on your machine.
   * [Download Docker Desktop for Windows](https://www.docker.com/products/docker-desktop)
   * [Download Docker Desktop for Mac](https://www.docker.com/products/docker-desktop)
   * [Install Docker Engine on Linux](https://docs.docker.com/engine/install/)
2. **Docker Compose**: This is included with Docker Desktop and Docker Engine installations.

## Getting Started

Follow the instructions below based on your operating system.

### Windows

1. **Install Docker Desktop:**
   * Download the installer from [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop).
   * Run the installer and follow the on-screen instructions.
2. **Open Command Prompt or PowerShell.**
3. **Clone the repository:**
   ```bash
   git clone https://github.com/johnsonweih/fasms-docker.git
   cd your-project
4. **Log in to Docker Hub (optional):**
   ```bash
   docker login
5. **Pull Docker images from Docker Hub:**
   ```bash
   docker-compose pull
6. **Start the application:**
   ```bash
   docker-compose up   
7. **Access the application:**
   * Web application: http://localhost:3000
   * phpMyAdmin: http://localhost:8080

### Mac

1. **Install Docker Desktop:**
   * Download the installer from [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop).
   * Open the .dmg file and drag Docker to your Applications folder.
2. **Open Terminal.**
3. **Clone the repository:**
   ```bash
   git clone https://github.com/johnsonweih/fasms-docker.git
   cd your-project
4. **Log in to Docker Hub (optional):**
   ```bash
   docker login
5. **Pull Docker images from Docker Hub:**
   ```bash
   docker-compose pull
6. **Start the application:**
   ```bash
   docker-compose up   
7. **Access the application:**
   * Web application: http://localhost:3000
   * phpMyAdmin: http://localhost:8080

### Linux

1. **Install Docker Desktop:**
   * Follow the instructions at Install Docker Desktop on Linus [Docker Desktop for Linux](https://docs.docker.com/desktop/install/linux-install/).
   * Open the .dmg file and drag Docker to your Applications folder.
2. **Install Docker Compose:**
   ```bash
   sudo curl -L "https://github.com/docker/compose/releases/download/$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep tag_name | cut -d\" -f4)/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
3. **Open Terminal.**
4. **Clone the repository:**
   ```bash
   git clone https://github.com/johnsonweih/fasms-docker.git
   cd your-project
5. **Log in to Docker Hub (optional):**
   ```bash
   docker login
5. **Pull Docker images from Docker Hub:**
   ```bash
   docker-compose pull
6. **Start the application:**
   ```bash
   docker-compose up   
7. **Access the application:**
   * Web application: http://localhost:3000
   * phpMyAdmin: http://localhost:8080


## Stopping the Application

**To stop the application, run:**
   ```bash
   docker-compose down
   ```

## Note
   * Ensure the three docker containers are running.
   * Verify that Docker images are pulled correctly.
   * All the required database and data will be populated upon built.