# save .version content to variable
version=$(cat .version)
date=$(date +"%m-%d-%y %H:%M:%S")

echo "Uploading calculator version $version/$date to GitHub & NPM..."
# add all to git
git add .
# commit with version number
git commit -m "[#] Auto-Generate - $version, compiled at $date."
# push to github
git push origin main
# push to npm
npm publish --access public
echo "Done!"