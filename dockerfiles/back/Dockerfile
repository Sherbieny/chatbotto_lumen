# Start with the official PHP image as your base
FROM php:8-fpm

# Install system dependencies required for PHP extensions and Composer
RUN apt-get update && apt-get install -y \
    curl \
    zip \
    unzip \
    git \
    libonig-dev \
    libxml2-dev \
    && docker-php-ext-install pdo_mysql mbstring xml \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Set the working directory to /app
WORKDIR /app

# Install Composer locally
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set the working directory to the root of your Lumen application
# (This step is technically not needed as the previous command already sets /app as the workdir)

# Expose port 8000 for the PHP server
EXPOSE 8000

COPY ./dockerfiles/back/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

