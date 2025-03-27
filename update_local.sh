cd ../../../

echo "CUrrent root directory: $(pwd)"

php artisan js:generate-calculator-module

echo "Done, calculator module updated!"

cd ./public/js/calculator\

npm run build
npm link