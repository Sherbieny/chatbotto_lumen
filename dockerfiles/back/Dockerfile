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
    libpq-dev \
    vim \
    && docker-php-ext-install pdo_pgsql mbstring xml \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Xdebug
RUN pecl install xdebug \
    && docker-php-ext-enable xdebug \
    && echo "xdebug.mode=debug" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \
    && echo "xdebug.start_with_request=yes" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \
    && echo "xdebug.client_port=9003" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \
    && echo "xdebug.client_host=host.docker.internal" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \
    && echo "xdebug.idekey=VSCODE" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini

# Set the working directory to /app
WORKDIR /app

# Install Composer locally
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Expose port 8000 for the PHP server
EXPOSE 8000

# Copy php.ini file into Docker image
COPY ./dockerfiles/back/php.ini /usr/local/etc/php/php.ini

COPY ./dockerfiles/back/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
CMD ["/entrypoint.sh"]