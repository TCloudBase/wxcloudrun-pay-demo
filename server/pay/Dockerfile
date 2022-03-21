FROM php:7.3-apache

COPY index.php /var/www/html/

RUN mv "$PHP_INI_DIR/php.ini-development" "$PHP_INI_DIR/php.ini"

CMD ["apachectl", "-DFOREGROUND"]
