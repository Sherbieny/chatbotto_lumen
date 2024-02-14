# Chatbotto Lumen Application
A Japanese Chatbot application built with Nextjs and Laravel Lumen

## Installation
1. Clone the repository
2. add `XDEBUG_CLIENT_HOST` to your os environment variables
    
    a. For Linux or WSL2, add the following to your .bashrc or .zshrc `vim ~/.bashrc` or `vim ~/.zshrc`
    ```bash
    export XDEBUG_CLIENT_HOST=$(ip addr show docker0 | grep -Po 'inet \K[\d.]+')
    ```
    b. For Windows, Mac with Docker Desktop, manually add `host.docker.internal` to the docker-compose.yml file in the args: section of the back service
    ```yaml
    args:
      XDEBUG_CLIENT_HOST: host.docker.internal
    ```
    
3. Run the following commands in project root to build and start the docker containers
```bash
docker-compose up -d --build
```
4. SSH into the back container (php-fpm/Debian) and run the following commands to install the dependencies
   
    a. Install composer dependencies
    ```bash
    composer install
    ```
    b. Migration
    ```bash
    php artisan migrate
    ```
    c. Import qa table data (optional)
    ```bash
    php artisan import:qa-data
    ```
    d. Index the qa table data (optional)
    ```bash
    php artisan index:qa-data
    ```




