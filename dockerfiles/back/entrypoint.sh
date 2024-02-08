#!/bin/bash

# Check if a key Lumen project file exists, indicating a project is already set up
if [ ! -f "artisan" ]; then
    echo "Lumen project not found. Creating project..."
    composer create-project --prefer-dist laravel/lumen .

    # Additional setup commands can go here
    # e.g., php artisan key:generate (if applicable in Lumen)
else
    echo "Existing Lumen project found."
fi

# Then proceed to start the PHP server, or any other command you wish to run
exec php -S 0.0.0.0:8000 -t public